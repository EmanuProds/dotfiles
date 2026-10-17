# OpenCode — portable workspace skeleton

This directory holds the OpenCode pieces that `fedoraPI.sh` deploys to a fresh
Fedora machine: the sanitized config, the custom commands, the memory plugin
and its tests. Everything here is machine-independent — no absolute paths, no
personal model, no local tooling assumptions.

On the target machine `fedoraPI.sh` copies:

| Directory | Installed at | What it is |
| --- | --- | --- |
| `config/opencode.json` | `~/.config/opencode/opencode.json` | official profile (skills, lsp, context7) |
| `config/AGENTS.md` | `~/.config/opencode/AGENTS.md` | slim global rules |
| `config/env.example` | `~/.config/opencode/env.example` | API key placeholders |
| `config/package.json` | `~/.config/opencode/package.json` | plugin dependencies |
| `commands/` | `~/.config/opencode/commands/` | `/checkpoint`, `/graphify`, `/lembrar`, `/recordar` |
| `plugins/memory-store.ts` | `~/.config/opencode/plugins/` | durable memory + checkpoints in SQLite |
| `tests/` | `~/.config/opencode/tests/` | Node test suites for the plugin |

The skill library lives one level up, at `skills/` in this repo, and is
installed at `~/.agents/skills` — the path the `skills` block of
`opencode.json` points to.

## The plugin

**`memory-store.ts`** — durable memory and session checkpoints stored in
SQLite at `~/.opencode/memory.db`, exposed through the `memory_store`,
`memory_recall`, `memory_forget` and `memory_checkpoint_*` tools. On a fresh
machine the database is created empty; to carry history over from another
install, copy `memory.db` (plus `-wal`/`-shm` when present) to `~/.opencode/`.

Implementation notes worth keeping: the plugin uses a plain FTS5 table with an
explicit `DELETE FROM memories_fts WHERE rowid = ?`. Do not "optimize" it back
to a contentless FTS5 table (`content=''`) — on SQLite 3.53 that silently
ignores the delete command and leaves orphan index rows that make `recall`
return deleted memories.

## Secrets

`config/env.example` carries placeholders only. Copy it to
`~/.config/opencode/.env` on the target machine and fill in the real keys. A
real `.env` never enters this repository — `fedorapi`'s oracle fails the run
if one leaks.

## License

MIT — Emanuel Pereira