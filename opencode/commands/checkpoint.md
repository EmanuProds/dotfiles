---
description: Salva, lista ou restaura um checkpoint de sessão
---

Work with session checkpoints. Received argument: `$ARGUMENTS`

**No argument** or `list`:

```
memory.checkpoint_list({ limit: 20 })
```

Present name, date, and summary of each, newest first. If a checkpoint has no summary, write `(no summary)` — never invent one.

**With `restore <name>`**:

```
memory.checkpoint_restore({ name: "<name>" })
```

The name is the exact key **without extension and without date suffix** — the date lives in its own column. If the user passes `something-20260924.json`, strip `.json` and try without the date suffix too before concluding it does not exist. If still not found, show the list for them to pick.

After restoring, summarize the payload in three lines: where the work stopped, what was already done, what the next step is.

**With any other text** (it is a name to save under):

Derive a short `kebab-case` name from the text and store:

```
memory.checkpoint_save({
  name: "<name>",
  summary: "<one line stating what this checkpoint records>",
  payload: {
    objetivo: "<what is being done>",
    situacao: "<what is already done>",
    proximo_passo: "<the single next concrete action>",
    arquivos: [<relevant files being edited>]
  }
})
```

`proximo_passo` is not optional: a checkpoint without it cannot resume anything.

The payload is a free object. Include what helps resuming — objective, decisions, files, blockers — but never transcribe the whole conversation.

Confirm the saved name in one line.
