import { type ChildProcess, spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import { chromium } from '@playwright/test'

import { loginAppOnBase } from './login-dev'
import { E2E_RUN_META, REPO_ROOT } from './paths'
import { devRootForPort } from './sim-worktree'
import { waitForUrl } from './wait-url'

const execAsync = promisify(exec)

export const SIM_PORTS = {
  caricamento: 3200,
  erroreCaricamento: 3201,
  erroreAzione: 3202,
  consoleDev: 3203,
} as const

const START_TIMEOUT_MS = 180_000
const NEXT_BIN = join(REPO_ROOT, 'node_modules/next/dist/bin/next')

type SimMeta = { simServerPids?: number[] }

const children: ChildProcess[] = []
let starting: Promise<void> | null = null

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
  try {
    const raw = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as Record<string, unknown>
    writeFileSync(E2E_RUN_META, JSON.stringify({ ...raw, ...patch }), 'utf8')
  } catch {
    /* setup incompleto */
  }
}

async function freeSimPorts(): Promise<void> {
  for (const port of Object.values(SIM_PORTS)) {
    try {
      await execAsync(`lsof -ti :${port} | xargs kill -TERM 2>/dev/null || true`, { shell: '/bin/bash' })
    } catch {
      /* nessun listener */
    }
  }
  await new Promise((r) => setTimeout(r, 500))
}

function startDev(cwd: string, port: number, extraEnv: Record<string, string>): ChildProcess {
  return spawn(process.execPath, [NEXT_BIN, 'dev', '--port', String(port), '--webpack'], {
    cwd,
    env: { ...process.env, ...extraEnv, NODE_ENV: 'development', PAYLOAD_DISABLE_PUSH: '1' },
    stdio: 'ignore',
  })
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
    await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  }
  await browser.close()
}

async function startOne(port: number, extraEnv: Record<string, string>, warm: boolean): Promise<void> {
  const cwd = await devRootForPort(port)
  const child = startDev(cwd, port, extraEnv)
  children.push(child)
  const base = `http://localhost:${port}`
  await waitForUrl(`${base}/app/login`, START_TIMEOUT_MS)
  if (warm) await warmupDevServer(base)
}

async function startSimDevServersInner(): Promise<void> {
  if (children.length > 0) return
  await freeSimPorts()

  const specs = [
    { port: SIM_PORTS.caricamento, env: envForState('caricamento'), warm: true },
    { port: SIM_PORTS.erroreCaricamento, env: envForState('errore-caricamento'), warm: false },
    { port: SIM_PORTS.erroreAzione, env: envForState('errore-azione'), warm: false },
    { port: SIM_PORTS.consoleDev, env: {}, warm: true },
  ]

  for (const { port, env, warm } of specs) {
    await startOne(port, env, warm)
  }

  mergeSimMeta({ simServerPids: children.map((c) => c.pid).filter((p): p is number => p != null) })
}

export async function startSimDevServers(): Promise<void> {
  if (children.length > 0) return
  if (!starting) {
    starting = startSimDevServersInner().finally(() => {
      starting = null
    })
  }
  await starting
}

export function simBaseUrlForState(statoId: string): string {
  return `http://localhost:${portForState(statoId)}`
}

export function consoleDevBaseUrl(): string {
  return `http://localhost:${SIM_PORTS.consoleDev}`
}

export function stopSimDevServers(): void {
  for (const child of children) {
    if (child.pid) {
      try {
        process.kill(child.pid, 'SIGTERM')
      } catch {
        /* già terminato */
      }
    }
  }
  children.length = 0
  mergeSimMeta({ simServerPids: [] })
}

export async function ensureConsoleDevServer(): Promise<string> {
  await startSimDevServers()
  return consoleDevBaseUrl()
}
