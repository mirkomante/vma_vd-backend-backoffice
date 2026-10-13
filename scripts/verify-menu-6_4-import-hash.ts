/**
 * Roundtrip impronta contenuto import 6.8: prima wipe, wipe, import --apply, dopo (stesso hash).
 *
 *   pnpm payload run scripts/verify-menu-6_4-import-hash.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { setAvailabilityStorageForTests } from '@/lib/menu/availability/gcsAvailabilityWriter'
import { createMemoryAvailabilityStorage } from '@/lib/menu/availability/testMemoryStorage'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'
import { runImportContentRoundtrip } from './lib/run-import-content-roundtrip'
import { defaultSnapshotPath, record, snapshotExists } from './verify-menu-6_4-lib'

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()
  if (!snapshotExists()) {
    record('import contenuto roundtrip', `non provato (snapshot assente: ${defaultSnapshotPath()})`)
    process.exit(0)
  }

  const memory = createMemoryAvailabilityStorage()
  setAvailabilityStorageForTests(memory)
  process.env.MENU_AVAILABILITY_GCS_BUCKET = 'verify-local-bucket'

  const payload = await getPayload({ config })
  try {
    const { beforeCombined, afterCombined, writeCount } = await runImportContentRoundtrip(
      payload,
      memory,
    )
    record('import contenuto prima wipe', beforeCombined)
    record('import contenuto dopo reimport', afterCombined)
    record('import bulk scritture file', `${writeCount} (atteso 1)`)

    if (beforeCombined !== afterCombined) {
      throw new Error(`Impronta contenuto diversa: prima=${beforeCombined} dopo=${afterCombined}`)
    }
    if (writeCount !== 1) {
      throw new Error(`Scritture file import attese 1, ricevute ${writeCount}`)
    }
  } finally {
    setAvailabilityStorageForTests(null)
    delete process.env.MENU_AVAILABILITY_GCS_BUCKET
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`verify-menu-6_4-import-hash: ${message}`)
  process.exit(1)
}
