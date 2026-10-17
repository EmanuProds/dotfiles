---
description: Recupera fatos da memória persistente por texto, chave ou namespace
---

Use `memory.recall` to search stored facts.

Received query: `$ARGUMENTS`

**If `$ARGUMENTS` is empty**, call `memory.recall({ limit: 20 })` to list the most recent facts.

With an argument, call:

```
memory.recall({ query: "<text>", limit: 20 })
```

The search matches with and without accents in both directions and by stem: "validação" finds "validacao". It matches key and value at the same time, so a key fragment works.

It also accepts a namespace filter, when the user asks for something specific:

```
memory.recall({ query: "<text>", namespace: "<ns>", limit: 20 })
```

**On zero hits**, do not conclude memory is empty. Say there was no match for that search and offer a broader one — the fact may exist under different spelling or wording.

Present results as a short list: key, one line of content, tags. If any is obviously obsolete (points to a file or config that no longer exists), flag it instead of presenting it as current fact.
