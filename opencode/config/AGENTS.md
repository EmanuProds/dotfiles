# AGENTS.md Global

## Language Conventions (mandatory)

- **Conversation with the user**: ALWAYS pt-BR (questions, answers, explanations, reports).
- **Code** (variables, functions, classes, types, files, configs): ALWAYS English — e.g. `calculatePayroll`, `userRepository`, `config.yaml`.
- **Code comments**: pt-BR — explain _why_, not _what_.
- **UI shown to human clients**: pt-BR (labels, messages, tooltips, validations).
- **Internal technical docs** (ADRs, dev READMEs, docs/): English preferred; pt-BR accepted for BR-only teams.
- **Commits / PRs / issues**: English, conventional commits (`feat(ui):`, `fix(ci):`, `refactor(core):`).
- **Generated `.md` files**: always English — except files under project `/docs` and plan/migration docs, which MAY be pt-BR. Skills, agents, subagents, and opencode internal files MUST be English.

> Rule of thumb: machine-read artifact → English; BR human-read artifact → pt-BR.


## Security

- Never expose or commit secrets, tokens, or keys. Reference `{env:VAR}` instead of writing API keys in code.
- NEVER run `sudo` (denied by permissions). If root is strictly required, use `pkexec` so the user approves elevation through the GUI prompt.
- Unknown or destructive shell commands require approval.


## Research & Validation (mandatory)

- Validate on the internet first (`websearch` / `webfetch` / Context7) — never rely on memory for libraries, APIs, versions, or best practices.
- NEVER use bash/scripts for local discovery (grep/find/rg pipelines, shell loops). Use the built-in `grep`/`glob` tools.
- Shell commands are for _execution_ only (build, test, git, install, service management) — never for read-only discovery or validation.


## Persistent Memory

Durable facts and session checkpoints live in SQLite at `~/.opencode/memory.db`, exposed by the local plugin `~/.config/opencode/plugins/memory-store.ts`.

| Tool                        | Purpose                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `memory_store`              | Save a fact. Refuses to overwrite a divergent value without `overwrite: true`; reports `conflict` and shows both values otherwise. |
| `memory_recall`             | Retrieve facts by text, namespace, or both.                                                                                        |
| `memory_forget`             | Delete a fact. Requires approval.                                                                                                  |
| `memory_checkpoint_save`    | Persist a session checkpoint.                                                                                                      |
| `memory_checkpoint_list`    | List checkpoints, newest first.                                                                                                    |
| `memory_checkpoint_restore` | Retrieve a full checkpoint payload.                                                                                                |

Use `memory_recall` at the start of a task to recover prior decisions instead of re-asking. `memory_forget` is the only tool that asks for approval — it destroys data.

SQLite gotcha that cost us a bug: a contentless FTS5 table (`content=''`) silently ignores the `'delete'` command on SQLite 3.53, leaving orphan index rows that make `recall` return deleted memories. The plugin uses a plain FTS5 table with explicit `DELETE FROM memories_fts WHERE rowid = ?` instead. Do not "optimize" it back to a contentless table.
