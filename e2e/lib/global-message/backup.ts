import type { Payload } from 'payload'

import { readMenuGeneralTexts, writeMenuGeneralTexts } from './payload-helpers'

export async function withMenuGeneralBackup(
  payloadWorker: Payload,
  managerEmail: string,
  run: () => Promise<void>,
): Promise<void> {
  const before = await readMenuGeneralTexts(payloadWorker, managerEmail)
  try {
    await run()
  } finally {
    await writeMenuGeneralTexts(payloadWorker, managerEmail, before)
  }
}
