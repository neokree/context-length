import type { EngineInterface, Register } from 'claude-code'

const TOOL = 'mcp__context-length__context'

const k = (n: number) => `${Math.round(n / 1000)}k`

async function line($: EngineInterface) {
  try {
    const { context } = await $.session.usage()
    if (context.tokens === undefined) return undefined
    return `[context ${k(context.tokens)}/${k(context.window)}]`
  } catch {
    return undefined
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'context',
      description:
        "Returns the current session's context window usage: tokens used, window size, percent used, tokens left and how long the reading took.",
      isDeferred: false,
    })
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.command) return next(e)
    const l = await line($)
    return next(l ? { ...e, context: [...(e.context ?? []), l] } : e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === TOOL || e.agentId) return next(e)
    const ran = await next(e)
    if (ran.deny !== undefined) return ran
    const l = await line($)
    return l ? { ...ran, context: [...(ran.context ?? []), l] } : ran
  })

  on('tool.call', { tool: TOOL }, async $ => {
    const t0 = await $.clock.now()
    const { context } = await $.session.usage()
    const ms = (await $.clock.now()) - t0
    const { tokens, window, percent } = context
    if (tokens === undefined) {
      return { result: `No API response yet. Context window: ${window} tokens. Read in ${ms}ms.` }
    }
    return {
      result: `Context: ${tokens} of ${window} tokens used (${percent ?? Math.round((tokens / window) * 100)}%), ${window - tokens} left. Read in ${ms}ms. Counts input tokens of the last response; stale right after /compact until the next response.`,
    }
  })
}
