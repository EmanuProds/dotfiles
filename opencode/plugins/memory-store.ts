import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Plugin } from "@opencode/plugin";

import { rerankCandidates } from "../lib/jev-client.ts";

const DB_PATH = join(homedir(), ".opencode", "memory.db");
const NAMESPACE = "memory";

type MemoryRow = {
  id: number;
  key: string;
  value: string;
  namespace: string;
  tags: string;
  confidence: number;
  source: string;
  content_hash: string;
  created_at: number;
  updated_at: number;
};

type CheckpointRow = {
  id: number;
  name: string;
  summary: string;
  payload: string;
  working_dir: string | null;
  created_at: number;
};

let db: Database | null = null;
let ftsEnabled = false;

/**
 * Identity of the FTS index, persisted in memory_meta under 'fts_shape'.
 *
 * Bump FTS_SHAPE whenever the indexed columns or tokenizer change — that is
 * the ONLY trigger for a reindex. A row-count comparison cannot express that:
 * it cannot tell "the index is stale" from "the index has a different shape
 * than the query code expects", and the second case is the dangerous one
 * because the query silently returns nothing.
 */
const FTS_SHAPE = "key,value|unicode61";

/**
 * FTS5 version marker from the SQLite build actually running. A different
 * tokeniser implementation can change how the same text is split, so an
 * index built by another build is not trustworthy either.
 *
 * Takes the handle explicitly: the module-level `db` is only assigned at the
 * end of initialize(), after this is needed, so reading it here would always
 * yield null and silently pin the shape to "unknown".
 */
function ftsVersion(candidate: Database): string {
  try {
    const row = candidate.query("SELECT sqlite_version() AS v").get() as
      | { v: string }
      | undefined;
    return row?.v ?? "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * FTS5 is an optional SQLite compile-time feature, so probe before creating the
 * index instead of letting CREATE VIRTUAL TABLE throw at startup.
 */
function isFts5Available(candidate: Database): boolean {
  try {
    candidate.run("SAVEPOINT fts5_probe");
    candidate.run("CREATE VIRTUAL TABLE _fts5_probe USING fts5(x)");
    candidate.run("DROP TABLE _fts5_probe");
    candidate.run("RELEASE fts5_probe");
    return true;
  } catch {
    try {
      candidate.run("ROLLBACK TO fts5_probe");
      candidate.run("RELEASE fts5_probe");
    } catch {
      // probe cleanup is best-effort only
    }
    return false;
  }
}

function initialize(): Database {
  if (db) return db;

  mkdirSync(join(homedir(), ".opencode"), { recursive: true });
  const database = new Database(DB_PATH, { create: true });

  database.run("PRAGMA journal_mode = WAL");
  database.run("PRAGMA foreign_keys = ON");

  database.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      key          TEXT    NOT NULL,
      value        TEXT    NOT NULL,
      namespace    TEXT    NOT NULL DEFAULT 'global',
      tags         TEXT    NOT NULL DEFAULT '[]',
      confidence   REAL    NOT NULL DEFAULT 1.0
                          CHECK (confidence >= 0.0 AND confidence <= 1.0),
      source       TEXT    NOT NULL DEFAULT 'agent',
      content_hash TEXT    NOT NULL,
      created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at   INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  database.run(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_memories_key_ns ON memories(namespace, key)",
  );
  database.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_updated ON memories(updated_at DESC)",
  );

  database.run(`
    CREATE TABLE IF NOT EXISTS checkpoints (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL UNIQUE,
      summary     TEXT    NOT NULL DEFAULT '',
      payload     TEXT    NOT NULL,
      working_dir TEXT,
      created_at  INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  database.run(
    "CREATE INDEX IF NOT EXISTS idx_checkpoints_created ON checkpoints(created_at DESC)",
  );

  database.run(`
    CREATE TABLE IF NOT EXISTS memory_conflicts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      namespace      TEXT    NOT NULL,
      key            TEXT    NOT NULL,
      existing_value TEXT    NOT NULL,
      proposed_value TEXT    NOT NULL,
      resolution     TEXT    NOT NULL,
      resolved_at    INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS memory_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  ftsEnabled = isFts5Available(database);
  if (ftsEnabled) {
    // Plain (non-contentless) FTS5 with manual sync. A contentless table
    // (content='') silently ignores the 'delete' command on this SQLite build,
    // which would leave orphan rows in the index forever; contentless_delete=1
    // rejects it outright. Plain FTS5 makes removal explicit and verifiable.
    database.run(`
      CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
        key, value
      )
    `);

    // WHY A SHAPE VERSION AND NOT A ROW-COUNT CHECK.
    //
    // The original code dropped memories_fts on every process start and
    // recreated it empty. The memories table is IF NOT EXISTS, so it survived:
    // recall() with no query listed everything while recall({query}) returned
    // nothing. The index was born empty and only grew from later writes, which
    // made the defect self-concealing — the fact you had just stored was always
    // findable, and only older entries went missing after a restart.
    //
    // The first fix compared row counts and called 'rebuild'. That was wrong
    // twice over, and both failures are silent:
    //   - VALUES('rebuild') goes through the same internal path as 'delete' on
    //     a contentless table, and on SQLite 3.53 it is accepted, reported as
    //     success, and reindexes nothing. Verified: 1 row before, 1 row after,
    //     against a 73-row table.
    //   - a count comparison cannot tell "the index is stale" from "the index
    //     is a different shape than the query code expects".
    //
    // So the trigger is the SHAPE of the index (which columns are tokenized),
    // stored in memory_meta. A shape change reindexes; an unchanged shape does
    // not, no matter how many rows were written since. The rebuild itself is
    // DELETE + INSERT..SELECT, not 'rebuild' — it touches no internal FTS5
    // command, so there is nothing left to be silently ignored.
    const shapeAtual = `${FTS_SHAPE}:${ftsVersion(database)}`;

    const gravada = database
      .query("SELECT value FROM memory_meta WHERE key = 'fts_shape'")
      .get() as { value: string } | undefined;

    if (gravada?.value !== shapeAtual) {
      // DELETE first: rowid is not AUTOINCREMENT here, so a stale row can
      // collide with a real memory id and the INSERT would fail on constraint.
      database.run("DELETE FROM memories_fts");
      database.run(
        "INSERT INTO memories_fts(rowid, key, value) SELECT id, key, value FROM memories",
      );
      database
        .query(
          "INSERT OR REPLACE INTO memory_meta(key, value) VALUES ('fts_shape', ?)",
        )
        .run(shapeAtual);
    }
  }

  db = database;
  return database;
}

/**
 * Pure: turn a user query into a safe FTS5 MATCH expression.
 *
 * The old code pasted the raw string into `"${input}"*`. That is FTS5 syntax,
 * not text, so every character the documented key format uses became an
 * operator: `opencode:agents:contextscout:model` does not search for a memory
 * called that, it searches for something else entirely, and the caller gets
 * zero results with no error. The key format is `domain:subject:detail`, so
 * this was the common case, not an edge case.
 *
 * The query is split on whitespace into terms, each wrapped in double quotes
 * with internal quotes doubled, then joined by AND. A quoted term is a literal
 * phrase in FTS5, so colons, hyphens and dots inside a term are searched for as
 * text rather than parsed. The trailing `*` is kept on the LAST term only:
 * prefix-matching every term would make "contextscout model" also match
 * documents containing both words in either order.
 */
export function buildMatchQuery(input: string): string {
  const terms = input
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => `"${t.replace(/"/g, '""')}"`);

  if (terms.length === 0) return "";

  // Only the final term is prefix-matched. Joining all-but-last with " AND "
  // and then always appending " AND <last>*" emitted a leading " AND " for a
  // single-term query, which FTS5 rejects as a malformed expression.
  const ultimos = terms.slice(0, -1);
  const prefix = ultimos.length > 0 ? `${ultimos.join(" AND ")} AND ` : "";
  return `${prefix}${terms[terms.length - 1]}*`;
}

async function hashValue(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function rowToFact(row: MemoryRow) {
  return {
    key: row.key,
    value: row.value,
    namespace: row.namespace,
    tags: JSON.parse(row.tags) as string[],
    confidence: row.confidence,
    source: row.source,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default Plugin.define({
  id: "memory-store",
  async setup(ctx) {
    const database = initialize();

    const registration = await ctx.tool.transform((editor) => {
      editor.namespace({
        name: NAMESPACE,
        description:
          "Persistent memory and session checkpoints backed by SQLite",
      });

      // ---------------------------------------------------------------- store
      editor.add({
        name: "store",
        description:
          "Store a durable fact. Refuses to overwrite a divergent existing value unless overwrite=true is passed, so recorded decisions are never silently clobbered.",
        input: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description:
                "Stable identifier, e.g. 'pons-platform:auth:strategy'",
            },
            value: { type: "string", description: "The fact itself" },
            namespace: {
              type: "string",
              description: "Grouping scope. Default 'global'.",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Optional labels",
            },
            confidence: { type: "number", description: "0.0 to 1.0" },
            overwrite: {
              type: "boolean",
              description:
                "Required to replace an existing fact whose value differs.",
            },
          },
          required: ["key", "value"],
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input, context) => {
          const args = input as {
            key: string;
            value: string;
            namespace?: string;
            tags?: string[];
            confidence?: number;
            overwrite?: boolean;
          };

          const namespace = args.namespace ?? "global";
          const hash = await hashValue(args.value);

          const existing = database
            .query("SELECT * FROM memories WHERE namespace = ? AND key = ?")
            .get(namespace, args.key) as MemoryRow | null;

          if (existing) {
            if (existing.content_hash === hash) {
              return {
                content: `unchanged: ${namespace}/${args.key} already holds this exact value.`,
              };
            }
            if (args.overwrite !== true) {
              return {
                content: [
                  `conflict: ${namespace}/${args.key} already exists with a different value.`,
                  "",
                  `existing: ${existing.value}`,
                  `proposed: ${args.value}`,
                  "",
                  "Re-issue with overwrite=true to replace it deliberately, or choose a different key.",
                ].join("\n"),
              };
            }
          }

          if (existing) {
            database
              .query(
                `UPDATE memories
                    SET value = ?, tags = ?, confidence = ?, content_hash = ?, updated_at = unixepoch()
                  WHERE namespace = ? AND key = ?`,
              )
              .run(
                args.value,
                JSON.stringify(args.tags ?? []),
                args.confidence ?? existing.confidence,
                hash,
                namespace,
                args.key,
              );

            database
              .query(
                `INSERT INTO memory_conflicts (namespace, key, existing_value, proposed_value, resolution)
                 VALUES (?, ?, ?, ?, 'replaced')`,
              )
              .run(namespace, args.key, existing.value, args.value);

            if (ftsEnabled) {
              database
                .query("DELETE FROM memories_fts WHERE rowid = ?")
                .run(existing.id);
              database
                .query(
                  "INSERT INTO memories_fts(rowid, key, value) VALUES (?, ?, ?)",
                )
                .run(existing.id, args.key, args.value);
            }

            return {
              content: `replaced: ${namespace}/${args.key} (previous value archived in memory_conflicts).`,
            };
          }

          database
            .query(
              `INSERT INTO memories (key, value, namespace, tags, confidence, source, content_hash)
               VALUES (?, ?, ?, ?, ?, 'agent', ?)`,
            )
            .run(
              args.key,
              args.value,
              namespace,
              JSON.stringify(args.tags ?? []),
              args.confidence ?? 1.0,
              hash,
            );

          if (ftsEnabled) {
            const inserted = database
              .query(
                "SELECT id, key, value FROM memories WHERE namespace = ? AND key = ?",
              )
              .get(namespace, args.key) as MemoryRow;
            database
              .query(
                "INSERT INTO memories_fts(rowid, key, value) VALUES (?, ?, ?)",
              )
              .run(inserted.id, inserted.key, inserted.value);
          }

          return { content: `stored: ${namespace}/${args.key}` };
        },
      });

      // ---------------------------------------------------------------- recall
      editor.add({
        name: "recall",
        description:
          "Retrieve durable facts by text query, namespace, or both.",
        input: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Free-text search across key and value",
            },
            namespace: {
              type: "string",
              description: "Restrict to one namespace",
            },
            limit: { type: "integer", description: "Max results, default 20" },
          },
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input) => {
          const args = input as {
            query?: string;
            namespace?: string;
            limit?: number;
          };
          const limit = Math.min(Math.max(args.limit ?? 20, 1), 200);

          // Over-fetch only when the Jev reranker is armed, and only for the
          // free-text paths. Ranking a set that was already truncated to
          // `limit` cannot reorder anything — it would only decide which of
          // the survivors to show, which is the opposite of the point. The
          // reranker trims back down to `limit` afterwards.
          //
          // Armed via env var, NOT ctx.options. Plugin options only reach a
          // local plugin through the `plugins` array in opencode.json, and that
          // array is deliberately empty here — adding an entry risks loading
          // memory-store twice. Bun auto-loads .env, so this needs no config
          // change and stays consistent with how OPENCODE_ZEN_API_KEY arrives.
          const rerankArmed = process.env.MEMORY_RERANK_JEV === "1";
          const fetchLimit = rerankArmed ? Math.min(limit * 3, 60) : limit;

          let rows: MemoryRow[];

          if (args.query && ftsEnabled) {
            const match = buildMatchQuery(args.query);
            // An all-whitespace query yields no terms; falling through to the
            // namespace path is friendlier than running MATCH '' and erroring.
            if (match) {
              const sql =
                "SELECT m.* FROM memories_fts f JOIN memories m ON m.id = f.rowid WHERE memories_fts MATCH ? " +
                (args.namespace ? "AND m.namespace = ? " : "") +
                "ORDER BY m.updated_at DESC LIMIT ?";
              rows = (
                args.namespace
                  ? database.query(sql).all(match, args.namespace, fetchLimit)
                  : database.query(sql).all(match, fetchLimit)
              ) as MemoryRow[];
            } else {
              rows = [] as MemoryRow[];
            }
          } else if (args.query) {
            const like = `%${args.query}%`;
            const sql =
              "SELECT * FROM memories WHERE (key LIKE ? OR value LIKE ?) " +
              (args.namespace ? "AND namespace = ? " : "") +
              "ORDER BY updated_at DESC LIMIT ?";
            rows = (
              args.namespace
                ? database
                    .query(sql)
                    .all(like, like, args.namespace, fetchLimit)
                : database.query(sql).all(like, like, fetchLimit)
            ) as MemoryRow[];
          } else if (args.namespace) {
            rows = database
              .query(
                "SELECT * FROM memories WHERE namespace = ? ORDER BY updated_at DESC LIMIT ?",
              )
              .all(args.namespace, limit) as MemoryRow[];
          } else {
            rows = database
              .query("SELECT * FROM memories ORDER BY updated_at DESC LIMIT ?")
              .all(limit) as MemoryRow[];
          }

          if (rows.length === 0) return { content: "No matching memories." };

          // Rerank is OPT-IN and OPT-OUT, and it can only reorder. When it is
          // unreachable or unsure it returns the pool untouched, so the worst
          // case is the FTS5 ordering the caller had before — never a lost or
          // truncated result. That property is what makes it safe to sit in
          // front of a tool the model calls at the start of every task.
          if (rerankArmed && args.query) {
            rows = await rerankCandidates(
              args.query,
              rows.map((r) => ({ ...r, key: r.key, value: r.value })),
              { limit },
            );
          }

          const lines = rows.map((row) => {
            const fact = rowToFact(row);
            return `- [${fact.namespace}] ${fact.key}\n  ${fact.value}\n  tags: ${fact.tags.join(", ") || "-"} | confidence: ${fact.confidence} | updated: ${fact.updated_at}`;
          });

          return {
            content: `${rows.length} memor${rows.length === 1 ? "y" : "ies"}:\n\n${lines.join("\n")}`,
          };
        },
      });

      // ---------------------------------------------------------------- forget
      editor.add({
        name: "forget",
        description: "Delete a stored fact by key and namespace.",
        input: {
          type: "object",
          properties: {
            key: { type: "string" },
            namespace: { type: "string" },
          },
          required: ["key"],
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input) => {
          const args = input as { key: string; namespace?: string };
          const namespace = args.namespace ?? "global";

          const existing = database
            .query("SELECT * FROM memories WHERE namespace = ? AND key = ?")
            .get(namespace, args.key) as MemoryRow | null;

          if (!existing)
            return { content: `not found: ${namespace}/${args.key}` };

          if (ftsEnabled) {
            database
              .query("DELETE FROM memories_fts WHERE rowid = ?")
              .run(existing.id);
          }

          database
            .query("DELETE FROM memories WHERE namespace = ? AND key = ?")
            .run(namespace, args.key);
          return { content: `deleted: ${namespace}/${args.key}` };
        },
      });

      // ------------------------------------------------------- checkpoint_save
      editor.add({
        name: "checkpoint_save",
        description:
          "Persist a session checkpoint. The payload is stored verbatim as JSON so nothing is lost even if the table gains new columns later.",
        input: {
          type: "object",
          properties: {
            name: { type: "string", description: "Unique checkpoint name" },
            summary: { type: "string", description: "One-line description" },
            payload: { type: "object", description: "Full checkpoint state" },
          },
          required: ["name", "payload"],
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input) => {
          const args = input as {
            name: string;
            summary?: string;
            payload: Record<string, unknown>;
          };
          const serialized = JSON.stringify(args.payload);

          database
            .query(
              `INSERT INTO checkpoints (name, summary, payload, working_dir)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(name) DO UPDATE SET
                 summary = excluded.summary,
                 payload = excluded.payload,
                 working_dir = excluded.working_dir,
                 created_at = unixepoch()`,
            )
            .run(
              args.name,
              args.summary ?? "",
              serialized,
              ctx.location.directory,
            );

          return { content: `checkpoint saved: ${args.name}` };
        },
      });

      // ------------------------------------------------------- checkpoint_list
      editor.add({
        name: "checkpoint_list",
        description: "List stored checkpoints, newest first.",
        input: {
          type: "object",
          properties: { limit: { type: "integer" } },
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input) => {
          const args = input as { limit?: number };
          const limit = Math.min(Math.max(args.limit ?? 20, 1), 200);
          const rows = database
            .query("SELECT * FROM checkpoints ORDER BY created_at DESC LIMIT ?")
            .all(limit) as CheckpointRow[];

          if (rows.length === 0) return { content: "No checkpoints stored." };

          const lines = rows.map(
            (row) =>
              `- ${row.name} (${new Date(row.created_at * 1000).toISOString().slice(0, 19)}Z) ${row.summary || "(no summary)"}`,
          );
          return {
            content: `${rows.length} checkpoint${rows.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}`,
          };
        },
      });

      // ----------------------------------------------------- checkpoint_restore
      editor.add({
        name: "checkpoint_restore",
        description:
          "Retrieve the full payload of a stored checkpoint by name.",
        input: {
          type: "object",
          properties: { name: { type: "string" } },
          required: ["name"],
          additionalProperties: false,
        },
        options: { namespace: NAMESPACE, codemode: true },
        execute: async (input) => {
          const args = input as { name: string };
          const row = database
            .query("SELECT * FROM checkpoints WHERE name = ?")
            .get(args.name) as CheckpointRow | null;

          if (!row) return { content: `checkpoint not found: ${args.name}` };

          return {
            content: `checkpoint: ${row.name}\nsummary: ${row.summary || "-"}\ncreated: ${new Date(row.created_at * 1000).toISOString()}\nworking_dir: ${row.working_dir ?? "-"}\n\npayload:\n${row.payload}`,
          };
        },
      });
    });

    return () => {
      registration.dispose();
      db?.close();
      db = null;
    };
  },
});
