import { type ChildProcess, spawn } from 'node:child_process'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { chromium } from '@playwright/test'

import { loginAppOnBase } from './login-dev'
import { E2E_RUN_META, REPO_ROOT } from './paths'
import { waitForUrl } from './wait-url'

/** Next.js consente un solo `next dev` per directory: una istanza attiva, porte distinte per stato. */
export const SIM_PORTS = {
  caricamento: 3200,
  erroreCaricamento: 3201,
  erroreAzione: 3202,
  consoleDev: 3203,
} as const

const START_TIMEOUT_MS = 180_000

type SimMeta = {
  simServerPid?: number | null
  simServerPort?: number | null
}

let activeChild: ChildProcess | null = null
let activeState: string | null = null

function startDev(port: number, extraEnv: Record<string, string>): ChildProcess {
  try {
    unlinkSync(join(REPO_ROOT, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  return spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: REPO_ROOT,
    env: { ...process.env, ...extraEnv, NODE_ENV: 'development', PAYLOAD_DISABLE_PUSH: '1' },
    stdio: 'ignore',
  })
}

function envForState(statoId: string): Record<string, string> {
  if (statoId === 'caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '3000' }
  if (statoId === 'errore-caricamento') return { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
  if (statoId === 'errore-azione') return { APP_MENU_DEV_SIMULATE_SAVE_ERROR: '1' }
  return {}
}

function portForState(statoId: string): number {
  if (statoId === 'caricamento') return SIM_PORTS.caricamento
  if (statoId === 'errore-caricamento') return SIM_PORTS.erroreCaricamento
  if (statoId === 'errore-azione') return SIM_PORTS.erroreAzione
  return SIM_PORTS.consoleDev
}

function mergeSimMeta(patch: SimMeta): void {
  const raw = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as Record<string, unknown>
  writeFileSync(E2E_RUN_META, JSON.stringify({ ...raw, ...patch }), 'utf8')
}

function killActive(): void {
  if (activeChild?.pid) {
    try {
      process.kill(activeChild.pid, 'SIGTERM')
    } catch {
      /* già terminato */
    }
  }
  activeChild = null
  activeState = null
}

async function warmupDevServer(base: string): Promise<void> {
  const meta = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as {
    probePassword?: string
    userEmail?: string
  }
  if (!meta.probePassword || !meta.userEmail) return

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await loginAppOnBase(page, base)
  for (const path of ['/app/menu/services', '/app/menu/fixed', '/app/menu/fixed/categories']) {
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  }
  await browser.close()
}

/** Avvia (o riusa) il server dev per lo stato simulato; kill del precedente se necessario. */
export async function ensureSimServerForState(statoId: string, options: { warm?: boolean } = {}): Promise<string> {
  const port = portForState(statoId)
  const base = `http://localhost:${port}`
  if (activeState === statoId && activeChild?.pid != null) {
    return base
  }
  killActive()
  activeChild = startDev(port, envForState(statoId))
  activeState = statoId
  await waitForUrl(base, START_TIMEOUT_MS)
  mergeSimMeta({ simServerPid: activeChild.pid ?? null, simServerPort: port })
  if (options.warm !== false) {
    await warmupDevServer(base)
  }
  return base
}

export function simBaseUrlForState(statoId: string): string {
  return `http://localhost:${portForState(statoId)}`
}

/** Primo stato simulato avviato in global-setup (compilazione fuori dai test). */
export async function startSimDevServers(): Promise<void> {
  await ensureSimServerForState('caricamento')
}

export function stopSimDevServers(): void {
  killActive()
  mergeSimMeta({ simServerPid: null, simServerPort: null })
}

export async function ensureConsoleDevServer(): Promise<string> {
  return ensureSimServerForState('console', { warm: true })
}
