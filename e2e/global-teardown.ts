import './lib/tsx-loader'

import { readFileSync } from 'node:fs'

import { deleteAllVerifyUiPrefix } from './lib/cleanup-fixtures'
import { releaseE2eLock } from './lib/lock'
import { E2E_RUN_META } from './lib/paths'
import { deleteTestUser, withPayloadForSetup } from './lib/provision-test-user'
import { freeE2ePortsAfterRun, killPidTree } from './lib/kill-ports'

export default async function globalTeardown(): Promise<void> {
  process.env.PAYLOAD_DISABLE_PUSH = '1'
  try {
    try {
      await withPayloadForSetup((payload) => deleteAllVerifyUiPrefix(payload))
    } catch {
      /* ripiego sotto */
    }
    try {
      const meta = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as {
        userEmail?: string
        setupServerPid?: number | null
      }
      if (meta.setupServerPid) {
        killPidTree(meta.setupServerPid)
      }
      if (meta.userEmail) {
        await withPayloadForSetup((payload) => deleteTestUser(payload, meta.userEmail!))
      }
    } catch {
      /* meta assente */
    }
  } finally {
    await freeE2ePortsAfterRun()
    releaseE2eLock()
  }
}
