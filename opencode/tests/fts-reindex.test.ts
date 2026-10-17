/**
 * Unit test for buildMatchQuery, the only pure export of memory-store.ts.
 * Runs under Node (NOT Bun):
 *
 *   node --import ./tests/register.mjs ./tests/fts-reindex.test.ts
 *
 * WHY THIS SHAPE
 *
 * The previous version of this file was a Bun-only integration test: it
 * opened a real database via `bun:sqlite` and replayed the plugin's startup
 * sequence to prove a restart preserves the FTS index. That test cannot run
 * on this machine (no standalone Bun binary), and under Node it dies by
 * design — `tests/bun-sqlite-stub.mjs` throws on any `new Database()` because
 * unit tests must never touch the real database.
 *
 * So this file tests what is actually testable under Node: the FTS5 MATCH
 * expression builder. The regression it guards is documented in
 * memory-store.ts above buildMatchQuery: an unquoted colon-separated key
 * (`domain:subject:detail`) is parsed by FTS5 as operators and matches
 * nothing, silently. Every recall() call flows through this function, so
 * a quoting regression breaks all text search with zero errors.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildMatchQuery } from "../plugins/memory-store.ts";

describe("buildMatchQuery", () => {
  it("quotes a single term and prefix-matches it", () => {
    assert.equal(buildMatchQuery("nemotron"), '"nemotron"*');
  });

  it("keeps colons literal inside quotes (the key-format regression)", () => {
    assert.equal(
      buildMatchQuery("opencode:rewrite:fase1-20261004"),
      '"opencode:rewrite:fase1-20261004"*',
    );
  });

  it("joins multiple terms with AND and prefix-matches only the last", () => {
    assert.equal(
      buildMatchQuery("contextscout model"),
      '"contextscout" AND "model"*',
    );
  });

  it("returns empty string for empty or blank input", () => {
    assert.equal(buildMatchQuery(""), "");
    assert.equal(buildMatchQuery("   "), "");
  });

  it("collapses repeated whitespace", () => {
    assert.equal(buildMatchQuery("  a   b  "), '"a" AND "b"*');
  });

  it("doubles internal quotes so they stay literal", () => {
    assert.equal(buildMatchQuery('say "hi"'), '"say" AND """hi"""*');
  });

  it("keeps hyphens and dots literal inside quotes", () => {
    assert.equal(buildMatchQuery("laguna-s-2.1"), '"laguna-s-2.1"*');
  });
});
