import './lib/tsx-loader'

import { readFileSync } from 'node:fs'

import { releaseE2eLock } from './lib/lock'
import { payloadRun } from './lib/payload-cli'
import { E2E_RUN_META } from './lib/paths'

function killPid(pid: number): void {
  try {
    process.kill(pid, 'SIGTERM')
  } catch {
    /* già terminato */
  }
}

export default async function globalTeardown(): Promise<void> {
  process.env.PAYLOAD_DISABLE_PUSH = '1'
  try {
    await payloadRun(['scripts/cleanup-verify-ui-menu-fixtures.ts'])
    try {
      const meta = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as {
        userEmail?: string
        setupServerPid?: number | null
      }
      if (meta.setupServerPid) {
        killPid(meta.setupServerPid)
      }
      if (meta.userEmail) {
        await payloadRun(['scripts/ui-verify/provision-user.ts', '--', 'delete', meta.userEmail])
      }
    } catch {
      /* meta assente */
    }
  } finally {
    releaseE2eLock()
  }
}
