import type { Register } from 'claude-code'

const TOOL = 'mcp__context-length__context'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'context',
      description:
        "Returns the current session's context window usage: tokens used, window size, percent used and tokens left. Call it when asked how much context is left, or before starting a large task.",
      isDeferred: false,
    })
    return next(e)
  })

  on('tool.call', { tool: TOOL }, async $ => {
    const { context } = await $.session.usage()
    const { tokens, window, percent } = context
    if (tokens === undefined) {
      return { result: `No API response yet. Context window: ${window} tokens.` }
    }
    const left = window - tokens
    return {
      result: `Context: ${tokens} of ${window} tokens used (${percent ?? Math.round((tokens / window) * 100)}%), ${left} left. Counts input tokens of the last response; stale right after /compact until the next response.`,
    }
  })
}
