/**
 * Fingerprint contenuto import 6.8 (fase 6.8).
 *
 * Per ogni collection elencata sotto: `find` con `depth: 2`, `sort: 'id'`,
 * `JSON.stringify(docs)` → SHA-256. Include **tutto** il documento restituito da Payload
 * (campi importati, `id`, `createdAt`, `updatedAt`, relazioni popolate a depth 2, ecc.),
 * non un sottoinsieme scelto a mano.
 *
 * Uso:
 *   pnpm payload run scripts/verify-menu-6_8-import-idempotency.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  fingerprintImportCollections,
  printImportFingerprints,
} from './lib/import-menu-fingerprint'

export type { ImportFingerprint } from './lib/import-menu-fingerprint'
export { fingerprintImportCollections } from './lib/import-menu-fingerprint'

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  try {
    const rows = await fingerprintImportCollections(payload)
    printImportFingerprints(rows, 'Fingerprint import 6.8')
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
