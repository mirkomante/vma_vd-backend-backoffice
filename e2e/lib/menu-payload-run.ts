import { readFileSync } from 'node:fs'

import { payloadRun, parsePayloadStdout } from './payload-cli'
import { E2E_RUN_META } from './paths'

function managerEmail(): string {
  const raw = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as { userEmail?: string }
  if (!raw.userEmail) throw new Error('userEmail mancante in e2e-run.json')
  return raw.userEmail
}

export async function menuPayload(action: string, ...args: string[]): Promise<Record<string, unknown>> {
  const email = managerEmail()
  const stdout = await payloadRun(['e2e/scripts/menu-fixtures.ts', '--', action, email, ...args])
  return parsePayloadStdout(stdout)
}

export async function menuDeleteVerifyPrefix(): Promise<void> {
  await menuPayload('delete-prefix', 'verify-ui-')
}
