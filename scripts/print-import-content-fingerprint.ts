/**
 * Stampa COMBINED_CONTENT_SHA256 (impronta contenuto import 6.8).
 *   pnpm payload run scripts/print-import-content-fingerprint.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  combinedImportContentFingerprintHash,
  fingerprintImportContentCollections,
  printImportContentFingerprints,
} from './lib/import-menu-content-fingerprint'

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  try {
    const rows = await fingerprintImportContentCollections(payload)
    printImportContentFingerprints(rows, 'Import contenuto')
    console.log(`VERIFY_CONTENT|${combinedImportContentFingerprintHash(rows)}`)
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
