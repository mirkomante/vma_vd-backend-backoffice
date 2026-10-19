/** Tempi massimi VC-tempi — override con UI_VERIFY_STATE_TIMEOUT_MS / UI_VERIFY_FLOW_TIMEOUT_MS. */

export function stateTimeoutMs() {
  const raw = process.env.UI_VERIFY_STATE_TIMEOUT_MS
  if (raw != null && raw !== '') {
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) throw new Error(`UI_VERIFY_STATE_TIMEOUT_MS non valido: ${raw}`)
    return n
  }
  return 60_000
}

export function flowTimeoutMs() {
  const raw = process.env.UI_VERIFY_FLOW_TIMEOUT_MS
  if (raw != null && raw !== '') {
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) throw new Error(`UI_VERIFY_FLOW_TIMEOUT_MS non valido: ${raw}`)
    return n
  }
  return 90_000
}

/** Budget per singola schermata (default 15 min). */
export function screenBudgetMs() {
  const raw = process.env.UI_VERIFY_BUDGET_MS
  if (raw != null && raw !== '') {
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) throw new Error(`UI_VERIFY_BUDGET_MS non valido: ${raw}`)
    return n
  }
  return 15 * 60 * 1000
}

export function guardExtraMs() {
  return 2 * 60 * 1000
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * @param {() => Promise<void>} fn
 * @param {string} label nome stato o passo (in caso di timeout)
 */
export async function runWithStateTimeout(fn, label) {
  const ms = stateTimeoutMs()
  return runWithTimeout(fn, ms, label, 'tempo')
}

/**
 * @param {() => Promise<void>} fn
 * @param {string} controlId
 */
export async function runWithFlowTimeout(fn, controlId) {
  const ms = flowTimeoutMs()
  return runWithTimeout(fn, ms, controlId, 'tempo')
}

async function runWithTimeout(fn, ms, label, reason) {
  return Promise.race([
    fn(),
    sleep(ms).then(() => {
      const err = new Error(`${reason}: ${label}`)
      err.code = 'UI_VERIFY_TIMEOUT'
      throw err
    }),
  ])
}
