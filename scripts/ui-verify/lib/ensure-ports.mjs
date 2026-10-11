import { execSync } from 'node:child_process'
import net from 'node:net'

import { DEV_PORT, PROD_PORT } from './ports.mjs'

export const SIM_PORT = 3200

export const VERIFY_PORTS = [DEV_PORT, PROD_PORT, SIM_PORT]

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function isPortFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer()
    s.once('error', () => resolve(false))
    s.once('listening', () => s.close(() => resolve(true)))
    s.listen(port, '127.0.0.1')
  })
}

function listenPids(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (!out) return []
    return [...new Set(out.split('\n').map((s) => s.trim()).filter(Boolean))]
  } catch {
    return []
  }
}

function terminateListeners(port) {
  const pids = listenPids(port)
  for (const pid of pids) {
    try {
      process.kill(Number(pid), 'SIGTERM')
    } catch {
      /* già terminato */
    }
  }
  if (pids.length) {
    setTimeout(() => {
      for (const pid of pids) {
        try {
          process.kill(Number(pid), 'SIGKILL')
        } catch {
          /* ignore */
        }
      }
    }, 1500)
  }
  return pids.length
}

export async function waitForPortFree(port, ms = 45000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    if (await isPortFree(port)) return
    await sleep(250)
  }
  throw new Error(`Porta ${port} ancora occupata dopo ${ms}ms`)
}

/** Libera le porte ui:verify (3000, 3100, 3200) senza comandi shell manuali. */
export async function ensurePortsFree(ports = VERIFY_PORTS) {
  const freed = []
  for (const port of ports) {
    if (await isPortFree(port)) continue
    const n = terminateListeners(port)
    if (n) freed.push(`${port}(${n} pid)`)
    await waitForPortFree(port)
  }
  return freed
}
