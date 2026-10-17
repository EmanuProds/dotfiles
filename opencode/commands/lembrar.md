---
description: Salva um fato durável na memória persistente (SQLite)
---

Use the `memory.store` tool to record a fact that must survive this session.

Received argument: `$ARGUMENTS`

**If `$ARGUMENTS` is empty**, ask the user for the fact before storing anything. Never invent content.

**Derive the key** from what was said, as `domain:subject:detail`, lowercase, `:`-separated. Example: `opencode:plugins:session-anchor`. Never use a file path as a key.

Call:

```
memory.store({
  key: "<derived key>",
  value: "<the fact, complete and self-contained>",
  namespace: "global",
  tags: [<2-4 lowercase tags>],
  confidence: 0.9
})
```

**If `store` returns `conflict`**, do NOT retry with `overwrite: true` on your own. The response carries both the existing and the proposed value. Show both to the user and ask which one holds. Use `overwrite: true` only after they answer.

After storing, confirm in one line what was saved and the key used. Do not repeat the whole value.

**Never store** file paths, terminal output, or dialogue transcripts as if they were the fact. The value is the conclusion, not the artifact.
