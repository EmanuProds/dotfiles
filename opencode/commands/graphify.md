---
description: Constrói e consulta o grafo de conhecimento do repositório
---

Follow the graphify skill to handle $ARGUMENTS:

- If `graphify-out/graph.json` already exists and $ARGUMENTS is a natural-language question about the codebase: run `graphify query "$ARGUMENTS"` (or `path`/`explain` when requested) and answer from the graph, citing `source_file`/`source_location`.
- If $ARGUMENTS carries an explicit subcommand (`update <path>`, `cluster-only <path>`, `path`, `explain`, `query "..."`): pass it to the `graphify` CLI preserving arguments.
- If it is a build (path) or no graph exists: run `graphify extract <path>` (default: current directory; `graphify <path>` works as shortcut). Code corpora extract locally via AST with no LLM; docs/papers use the configured provider. Never ask for an LLM key.
- In code-heavy projects, prefer the graphify skill: querying the graph before scanning files saves powerful-model tokens.

At the end of a build, present: God Nodes, Surprising Connections, Suggested Questions.
