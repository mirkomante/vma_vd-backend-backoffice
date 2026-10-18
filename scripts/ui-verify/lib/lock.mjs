import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function lockPath(root) {
  return join(root, '.next/ui-verify.lock')
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

/**
 * @param {string} root
 * @returns {() => void} release
 */
export function acquireUiVerifyLock(root) {
  mkdirSync(join(root, '.next'), { recursive: true })
  const path = lockPath(root)
  if (existsSync(path)) {
    try {
      const data = JSON.parse(readFileSync(path, 'utf8'))
      const pid = Number(data.pid)
      if (pid && isPidAlive(pid)) {
        const started = data.startedAt ?? '(ora sconosciuta)'
        console.error(
          `giro già in corso (PID ${pid}, avviato alle ${started}): attendi o ferma quel processo`,
        )
        process.exit(1)
      }
    } catch {
      /* lock corrotto: si sovrascrive */
    }
  }
  const payload = { pid: process.pid, startedAt: new Date().toISOString() }
  writeFileSync(path, JSON.stringify(payload), 'utf8')
  return () => releaseUiVerifyLock(root)
}

export function releaseUiVerifyLock(root) {
  try {
    unlinkSync(lockPath(root))
  } catch {
    /* già rimosso */
  }
}
