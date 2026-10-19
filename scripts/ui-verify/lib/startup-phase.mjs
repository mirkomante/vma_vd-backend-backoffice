const DEFAULT_MS = 60_000

function phaseTimeoutMs() {
  const raw = process.env.UI_VERIFY_STARTUP_PHASE_MS
  if (raw == null || raw === '') return DEFAULT_MS
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) throw new Error(`UI_VERIFY_STARTUP_PHASE_MS non valido: ${raw}`)
  return n
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * @param {string} label
 * @param {() => Promise<void>} fn
 * @param {(label: string, stato: string) => void} onLog
 */
export async function runStartupPhase(label, fn, onLog) {
  const ms = phaseTimeoutMs()
  onLog(label, 'inizio')
  try {
    await Promise.race([
      fn(),
      sleep(ms).then(() => {
        const err = new Error(
          `avvio bloccato: fase «${label}» supera ${Math.round(ms / 1000)}s senza completarsi (lock, build, server, porta, daemon Payload o provision-user)`,
        )
        err.code = 'UI_VERIFY_STARTUP_TIMEOUT'
        throw err
      }),
    ])
    onLog(label, 'completata')
  } catch (e) {
    if (e.code === 'UI_VERIFY_STARTUP_TIMEOUT') throw e
    throw e
  }
}
