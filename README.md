# context-length

A Claude Code mod that lets Claude read its own context window usage.

It does two things:

- On every prompt and every tool call, it attaches a hidden line such as `[context 312k/1000k]` that Claude reads and you never see. Slash-command prompts, subagent tool calls and the tool below are skipped.
- It registers one tool, `mcp__context-length__context`, that returns tokens used, window size, percent used, tokens left and how long the reading took (about 1 ms).

The figures come from `$.session.usage()`, the same data as the status line, so there is no transcript parsing. They count the input tokens of the last response, and stay stale right after `/compact` until the next response.

The mod only reports the number. Any limit, such as when to hand work off to another session, belongs to the project that installs it (for example a rule in its `MEMORY.md`).

## Install

At the prompt of a terminal session:

```
/plugin install context-length --marketplace neokree/context-length
```

From a shell:

```
claude plugin install context-length --marketplace neokree/context-length
```

Requires a Claude Code version with mods (v2.1.287 or later).

## Use

Ask Claude how much context is left, or have it call `mcp__context-length__context` before a large task.
