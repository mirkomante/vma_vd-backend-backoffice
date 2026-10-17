import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')

function parseStdout(stdout) {
  const line = stdout.trim().split('\n').find((l) => l.startsWith('{'))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line)
}

export function menuPayloadRun(action, extraArgs = []) {
  const r = spawnSync(
    'pnpm',
    ['payload', 'run', 'scripts/ui-verify/menu-payload.ts', '--', action, ...extraArgs],
    { cwd: ROOT, encoding: 'utf8', env: { ...process.env } },
  )
  if (r.status !== 0) {
    throw new Error(`menu payload ${action}: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  return parseStdout(r.stdout)
}

export function menuDeleteVerifyPrefix() {
  return menuPayloadRun('delete-prefix', ['verify-ui-'])
}

export function menuCountSoldOut(managerEmail) {
  return menuPayloadRun('count-sold-out', [managerEmail])
}

export function menuCreateDishes(managerEmail, specs) {
  return menuPayloadRun('create-dishes', [managerEmail, JSON.stringify(specs)])
}
