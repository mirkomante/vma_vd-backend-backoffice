import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'

import { E2E_LOCK, NEXT_DIR } from './paths'

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

export function acquireE2eLock(): void {
  mkdirSync(NEXT_DIR, { recursive: true })
  if (existsSync(E2E_LOCK)) {
    try {
      const data = JSON.parse(readFileSync(E2E_LOCK, 'utf8')) as {
        pid?: number
        startedAt?: string
        runId?: string
      }
      const pid = Number(data.pid)
      if (pid && isPidAlive(pid)) {
        console.error(
          `giro e2e già in corso (PID ${pid}, avviato alle ${data.startedAt ?? '—'}, giro ${data.runId ?? '—'})`,
        )
        process.exit(1)
      }
    } catch {
      /* lock corrotto */
    }
  }
  writeFileSync(
    E2E_LOCK,
    JSON.stringify({
      pid: process.pid,
      startedAt: new Date().toISOString(),
    }),
    'utf8',
  )
}

export function releaseE2eLock(): void {
  try {
    unlinkSync(E2E_LOCK)
  } catch {
    /* già rimosso */
  }
}

export function updateLockRunId(runId: string): void {
  const payload = {
    pid: process.pid,
    startedAt: new Date().toISOString(),
    runId,
  }
  writeFileSync(E2E_LOCK, JSON.stringify(payload), 'utf8')
}
