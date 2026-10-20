import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/** Produzione locale e2e. */
export const E2E_PROD_PORT = 3100

/** Ex-server dev paralleli (sim, rimossi in T1e). */
export const E2E_LEGACY_DEV_PORTS = [3200, 3201, 3202, 3203] as const

export const E2E_PORTS = [E2E_PROD_PORT, ...E2E_LEGACY_DEV_PORTS] as const

export async function freePorts(ports: readonly number[]): Promise<void> {
  for (const port of ports) {
    try {
      await execAsync(`lsof -ti :${port} | xargs kill -TERM 2>/dev/null || true`, { shell: '/bin/bash' })
    } catch {
      /* nessun listener */
    }
  }
  await new Promise((r) => setTimeout(r, 600))
}

/** Prima del giro: libera 3100 e le porte dev legacy (Playwright avvia il server dopo il global-setup). */
export async function freeE2ePortsBeforeRun(): Promise<void> {
  await freePorts(E2E_PORTS)
}

/** A fine giro: stesse porte. */
export async function freeE2ePortsAfterRun(): Promise<void> {
  await freePorts(E2E_PORTS)
}

export function killPidTree(pid: number): void {
  try {
    process.kill(pid, 'SIGTERM')
  } catch {
    /* già terminato */
  }
}
