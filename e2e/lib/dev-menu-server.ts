import { type ChildProcess, spawn } from 'node:child_process'
import { unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { freePorts } from './kill-ports'
import { REPO_ROOT } from './paths'
import { waitForUrl } from './wait-url'

export const SIM_PORT = 3200

const DEV_READY_MS = 240_000

function startDev(port: number, extraEnv: Record<string, string>): ChildProcess {
  try {
    unlinkSync(join(REPO_ROOT, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  const child = spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: REPO_ROOT,
    env: { ...process.env, ...extraEnv, NODE_ENV: 'development' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stderr?.on('data', (chunk) => {
    const t = String(chunk)
    if (t.includes('Error') || t.includes('Ready')) {
      process.stderr.write(`[e2e-dev:${port}] ${t.slice(0, 160)}\n`)
    }
  })
  child.stdout?.on('data', () => {
    /* evita backpressure su pipe */
  })
  return child
}

export async function startMenuDevServer(
  env: Record<string, string> = {},
): Promise<{ baseUrl: string; stop: () => Promise<void> }> {
  await freePorts([SIM_PORT])
  const child = startDev(SIM_PORT, env)
  const baseUrl = `http://localhost:${SIM_PORT}`
  await waitForUrl(`${baseUrl}/app/login`, DEV_READY_MS)
  return {
    baseUrl,
    stop: async () => {
      child.kill('SIGTERM')
      await new Promise((r) => setTimeout(r, 800))
      await freePorts([SIM_PORT])
    },
  }
}

export async function withMenuDevServer<T>(
  env: Record<string, string>,
  fn: (baseUrl: string) => Promise<T>,
): Promise<T> {
  const server = await startMenuDevServer(env)
  try {
    return await fn(server.baseUrl)
  } finally {
    await server.stop()
  }
}

export function simEnvForState(statoId: string): Record<string, string> | null {
  if (statoId === 'caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' }
  if (statoId === 'errore-caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
  if (statoId === 'errore-azione') return { APP_MENU_DEV_SIMULATE_SAVE_ERROR: '1' }
  return null
}
