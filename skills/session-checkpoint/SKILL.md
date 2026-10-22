---
name: session-checkpoint"
description: Save and restore OpenCode session state including context, todos, and working files. Use for checkpointing long-running tasks, switching contexts, or recovering from interruptions.
---

# Session Checkpoint

A checkpoint captures where a session is, so a later session can pick the work up without the conversation.

It is stored through the `memory-store` plugin in SQLite at `~/.opencode/memory.db`, not as a file. See the `memory` skill for the tool signatures; this skill covers _what belongs in a checkpoint_ and _when to take one_.

## What a checkpoint is for

Capturing:

- the objective, in one sentence
- what is already done
- the single next action
- files in play, and uncommitted changes worth naming
- decisions made, and blockers still open

Not for capturing:

- the conversation transcript
- tool output or file contents
- anything already durably stored as a memory

The rule is that a checkpoint should be readable in ten seconds by someone with no context. If it needs the transcript to make sense, it is too big.

## Always carry `proximo_passo`

This is the field that makes a checkpoint resumable. Without it you have recorded state but given no way to continue.

```ts
memory_checkpoint_save({
  name: "session-anchor-filtro-20260928",
  summary: "Filtro de scaffolding aplicado; falta validar em sessão nova",
  payload: {
    objetivo: "Preservar os pedidos literais do usuário após a compactação",
    situacao:
      "Plugin instalado, 115 testes verdes, injeção verificada em runtime",
    proximo_passo: "Compactar uma sessão e confirmar que o bloco não duplica",
    bloqueios: [],
    arquivos: [
      "~/.config/opencode/plugins/session-anchor.ts",
      "~/.config/opencode/tests/guards.test.ts",
    ],
  },
});
```

`payload` is a free-form object. Use the keys above as a default shape, not a schema — add what the work needs.

## Restoring

```ts
memory_checkpoint_list({ limit: 20 }); // newest first
memory_checkpoint_restore({ name: "..." }); // full payload, or not-found message
```

Restore is read-only: it does not change the session, it tells you where you were. Summarise it in three lines — where the work stopped, what is already done, what happens next — and then continue from `proximo_passo`.

**Names are plain keys.** No `.json`, no date suffix; the date is a column. The old JSON store wrote `name-20260924.json` and SQLite stores `name-20260924`. Passing the old filename gets `checkpoint not found` for a checkpoint that exists. Strip the extension before restoring, and drop the date suffix as a second attempt.

## When to take one

- before switching task, feature, or agent
- after a milestone, before a long run
- before anything risky: a refactor, a migration, a bulk edit
- at a natural stop — end of a session, before a break

Not for every small step. A checkpoint per tool call is noise, and a checkpoint that is always stale is worse than none.

## Naming

`<subject>-<what-this-one-captures>`, lowercase kebab-case, no timestamp inside the name:

```
session-anchor-filtro
opencode-plugins-tier2-research
auth-refresh-rotation
```

The timestamp is added by the store. Putting it in the name by hand creates near-duplicate keys that are impossible to tell apart in a list.

## Compaction is a separate mechanism

Checkpoints and compaction are different things and the plugin does not conflate them.

Compaction is the host replacing the message history with a model-written summary. Our `session-anchor` plugin complements it by re-injecting the user's literal turns into `event.system`, which compaction does not touch. The host's own `<conversation-checkpoint>` arrives as a `role: "user"` message and is filtered out of the anchor's ledger for that reason.

So: a compaction does not create a checkpoint, and losing the conversation does not lose a checkpoint. Both survive independently, and you do not need to re-save after compacting.

## Git worktrees, when they fit better

A worktree is the better tool when the thing you need preserved is _uncommitted code_, not conversation state:

```bash
git worktree add ../proj-checkpoint feature/auth
# work in the worktree
cd -   # back
git worktree remove ../proj-checkpoint
```

Reach for a checkpoint when the loss would be _decisions_; reach for a worktree when the loss would be _edits_.
