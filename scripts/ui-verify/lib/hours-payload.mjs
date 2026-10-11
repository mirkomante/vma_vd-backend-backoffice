import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')

function parseStdout(stdout) {
  const lines = stdout.trim().split('\n')
  const line = [...lines].reverse().find((l) => l.startsWith('{') || l.startsWith('['))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line)
}

export function hoursPayloadRun(action, extraArgs = [], extraEnv = {}) {
  const r = spawnSync(
    'pnpm',
    ['payload', 'run', 'scripts/ui-verify/system-settings-hours.ts', '--', action, ...extraArgs],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, ...extraEnv },
    },
  )
  if (r.status !== 0) {
    throw new Error(`hours payload ${action}: ${r.stderr || r.stdout}`.slice(0, 400))
  }
  return parseStdout(r.stdout)
}

/** Salva snapshot su file temporaneo; restituisce il path. */
export function hoursSnapshotToTemp() {
  const dir = mkdtempSync(join(tmpdir(), 'ui-verify-hours-'))
  const path = join(dir, 'snapshot.json')
  hoursPayloadRun('snapshot', [], { UI_VERIFY_HOURS_SNAPSHOT: path })
  return path
}

export function hoursRestoreFrom(path) {
  hoursPayloadRun('restore', [], { UI_VERIFY_HOURS_SNAPSHOT: path })
}

export function hoursVerifySnapshot(path) {
  return hoursPayloadRun('verify-snapshot', [], { UI_VERIFY_HOURS_SNAPSHOT: path })
}

export function withHoursBackup(fn) {
  const path = hoursSnapshotToTemp()
  try {
    return fn(path)
  } finally {
    hoursRestoreFrom(path)
  }
}
