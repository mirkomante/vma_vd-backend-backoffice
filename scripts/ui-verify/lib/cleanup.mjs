import { execSync } from 'node:child_process'

import { DEV_PORT, PROD_PORT } from './ports.mjs'
import { SIM_PORT } from './ensure-ports.mjs'

/** @type {import('@playwright/test').Browser[]} */
const openBrowsers = []

export function trackBrowser(browser) {
  if (browser && !openBrowsers.includes(browser)) openBrowsers.push(browser)
}

export async function closeAllBrowsers() {
  const copy = [...openBrowsers]
  openBrowsers.length = 0
  for (const b of copy) {
    try {
      await b.close()
    } catch {
      /* ignore */
    }
  }
}

/**
 * @param {import('node:child_process').ChildProcess | null} devChild
 * @param {import('node:child_process').ChildProcess | null} prodChild
 */
export function stopServers(devChild, prodChild) {
  for (const child of [devChild, prodChild]) {
    if (!child) continue
    try {
      child.kill('SIGTERM')
    } catch {
      /* ignore */
    }
  }
}

function listenPids(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (!out) return []
    return [...new Set(out.split('\n').map((s) => Number(s.trim())).filter((n) => n > 0))]
  } catch {
    return []
  }
}

/** Restituisce righe di log sui processi ancora in ascolto sulle porte ui:verify. */
export function auditResidualProcesses() {
  const lines = []
  for (const port of [DEV_PORT, PROD_PORT, SIM_PORT]) {
    const pids = listenPids(port)
    if (pids.length) lines.push(`porta ${port}: PID ${pids.join(', ')}`)
  }
  return lines
}
