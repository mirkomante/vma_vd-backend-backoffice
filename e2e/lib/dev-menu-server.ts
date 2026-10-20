import { type ChildProcess, spawn } from 'node:child_process'
import { unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './paths'
import { waitForUrl } from './wait-url'

export const SIM_PORT = 3200

function startDev(port: number, extraEnv: Record<string, string>): ChildProcess {
  try {
    unlinkSync(join(REPO_ROOT, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  return spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: REPO_ROOT,
    env: { ...process.env, ...extraEnv, PAYLOAD_DISABLE_PUSH: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

export async function withMenuDevServer<T>(
  env: Record<string, string>,
  fn: (baseUrl: string) => Promise<T>,
): Promise<T> {
  const child = startDev(SIM_PORT, env)
  const baseUrl = `http://localhost:${SIM_PORT}`
  try {
    await waitForUrl(baseUrl, 120_000)
    return await fn(baseUrl)
  } finally {
    child.kill('SIGTERM')
    await new Promise((r) => setTimeout(r, 800))
  }
}

export function simEnvForState(statoId: string): Record<string, string> | null {
  if (statoId === 'caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' }
  if (statoId === 'errore-caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
  if (statoId === 'errore-azione') return { APP_MENU_DEV_SIMULATE_SAVE_ERROR: '1' }
  return null
}
