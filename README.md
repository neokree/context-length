# context-length

A Claude Code mod that lets Claude read its own context window usage.

It registers one tool, `mcp__context-length__context`. The tool returns tokens used, window size, percent used and tokens left for the current session. The figures come from `$.session.usage()`, the same data as the status line, so there is no transcript parsing. They count the input tokens of the last response, and stay stale right after `/compact` until the next response.

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
