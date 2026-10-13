/**
 * Svuota le collection popolate dall'import 6.8 su vma_vd_dev (solo sviluppo).
 *
 * Uso: pnpm payload run scripts/wipe-menu-import-dev.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { isDevDatabaseTarget, parseDatabaseTarget } from './import-menu-vtn-backend/databaseUrl'
import { wipeMenuImportCollections } from './lib/wipe-menu-import-collections'

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error('DATABASE_URL mancante')
  }
  const target = parseDatabaseTarget(url)
  if (!isDevDatabaseTarget(target)) {
    throw new Error(`Rifiutato: destinazione ${target.display} non è vma_vd_dev locale`)
  }

  const payload = await getPayload({ config })
  try {
    await wipeMenuImportCollections(payload)
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`wipe-menu-import-dev: ${message}`)
  process.exit(1)
}
