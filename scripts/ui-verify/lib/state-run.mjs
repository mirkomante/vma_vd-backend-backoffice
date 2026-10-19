import { appendFileSync } from 'node:fs'

import { logHandlerStep, progressLogFile } from './progress.mjs'
import { runWithStateTimeout } from './timeouts.mjs'

const STALL_MS = 45_000
const STALL_POLL_MS = 5_000

/**
 * Esegue un gestore di stato/controllo con timeout per stato e rilevamento stallo sui passi.
 * @param {string} stateLabel
 * @param {() => Promise<void>} fn
 */
export async function runBoundedState(stateLabel, fn) {
  /** @type {((err: Error) => void) | null} */
  let rejectStall = null
  const stallPromise = new Promise((_, reject) => {
    rejectStall = reject
  })

  const poll = setInterval(() => {
    const snap = logHandlerStep.stallSnapshot?.()
    if (!snap?.step) return
    if (Date.now() - snap.startMs < STALL_MS) return
    const stack = snap.stack ?? '(stack assente)'
    const line = `${new Date().toLocaleTimeString('it-IT', { hour12: false })} | STALLO | ${stateLabel} | passo: ${snap.step} | ${stack}\n`
    const path = progressLogFile()
    if (path) appendFileSync(path, line, 'utf8')
    process.stderr.write(`[ui:verify] stallo >${STALL_MS / 1000}s su passo «${snap.step}» (stato ${stateLabel})\n`)
    const err = new Error(`stallo: ${snap.step}`)
    err.code = 'UI_VERIFY_STALL'
    rejectStall?.(err)
  }, STALL_POLL_MS)

  try {
    return await Promise.race([runWithStateTimeout(fn, stateLabel), stallPromise])
  } finally {
    clearInterval(poll)
    logHandlerStep.clearStep?.()
  }
}

/**
 * Passo significativo dentro un gestore (log + stack per stallo).
 * @template T
 * @param {string} stepLabel
 * @param {() => Promise<T>} fn
 */
export async function runHandlerStep(stepLabel, fn) {
  logHandlerStep(stepLabel)
  return fn()
}

export function isControlTimeoutError(e) {
  return (
    e?.code === 'UI_VERIFY_TIMEOUT' ||
    e?.code === 'UI_VERIFY_STALL' ||
    String(e?.message ?? '').startsWith('tempo:') ||
    String(e?.message ?? '').startsWith('stallo:')
  )
}

/**
 * Controllo singolo con timeout 60s (UI_VERIFY_STATE_TIMEOUT_MS): NON PROVATO «tempo» senza abortire il giro.
 * @template T
 * @param {string} controlId
 * @param {() => Promise<T>} fn
 * @returns {Promise<{ timedOut: false, result: T } | { timedOut: true, motivo: string, passo: string | null }>}
 */
export async function runTimedControl(controlId, fn) {
  try {
    const result = await runBoundedState(controlId, fn)
    return { timedOut: false, result }
  } catch (e) {
    if (!isControlTimeoutError(e)) throw e
    const snap = logHandlerStep.stallSnapshot?.()
    return {
      timedOut: true,
      motivo: `tempo: ${controlId}`,
      passo: snap?.step ?? null,
    }
  }
}
