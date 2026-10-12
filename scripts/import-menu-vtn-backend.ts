/**
 * Import dati elementari menù da snapshot JSON del vecchio backend (fase 6.8).
 *
 * **Non rilanciare l'import su un database già rivisto a mano nell'App**: l'idempotenza
 * è solo in creazione per chiave naturale; record solo nel DB o rinominati restano fuori
 * dallo snapshot e non vengono aggiornati.
 *
 * Uso:
 *   pnpm import:menu -- <cartella-snapshot>           # report a secco
 *   pnpm import:menu -- <cartella-snapshot> --apply   # scrittura (solo DB dev, vedi sotto)
 *
 * Flag:
 *   --apply                  scrive nel database (dopo report senza errori)
 *   --allow-non-dev-database consente destinazione diversa da 127.0.0.1:5432/vma_vd_dev
 *
 * La cartella snapshot va **fuori dal repository** (vedi docs/operativo/export-menu-vtn-backend.md).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { isDevDatabaseTarget, parseDatabaseTarget } from './import-menu-vtn-backend/databaseUrl'
import {
  buildImportReport,
  fingerprintImportedCollections,
  printReport,
  runApply,
} from './import-menu-vtn-backend/engine'
import { buildLookupCache } from './import-menu-vtn-backend/lookups'
import { loadSnapshot } from './import-menu-vtn-backend/snapshot'

function parseCli(argv: string[]): {
  snapshotDir: string
  apply: boolean
  allowNonDevDatabase: boolean
} {
  const args = argv.filter((a) => a !== '--')
  let snapshotDir = ''
  let apply = false
  let allowNonDevDatabase = false
  for (const arg of args) {
    if (arg === '--apply') {
      apply = true
      continue
    }
    if (arg === '--allow-non-dev-database') {
      allowNonDevDatabase = true
      continue
    }
    if (!arg.startsWith('-') && !snapshotDir) {
      snapshotDir = arg
    }
  }
  if (!snapshotDir) {
    throw new Error(
      'Cartella snapshot mancante. Uso: pnpm import:menu -- <cartella-snapshot> [--apply] [--allow-non-dev-database]',
    )
  }
  return { snapshotDir, apply, allowNonDevDatabase }
}

function assertDatabaseAllowed(allowNonDevDatabase: boolean): void {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    throw new Error('DATABASE_URL mancante o vuota.')
  }
  const target = parseDatabaseTarget(databaseUrl)
  console.log(`Destinazione database: ${target.display}`)
  if (!isDevDatabaseTarget(target) && !allowNonDevDatabase) {
    throw new Error(
      'Scrittura consentita solo su 127.0.0.1:5432/vma_vd_dev. ' +
        'Per altre destinazioni (es. produzione via proxy) usare --allow-non-dev-database.',
    )
  }
}

async function main(): Promise<void> {
  const { snapshotDir, apply, allowNonDevDatabase } = parseCli(process.argv.slice(2))
  const snapshot = loadSnapshot(snapshotDir)

  const payload = await getPayload({ config })
  try {
    const cache = await buildLookupCache(payload)
    const report = await buildImportReport(payload, snapshot, cache)
    printReport(report, apply)

    if (report.errors.length > 0) {
      console.error(`--apply rifiutato: ${report.errors.length} errori nel report.`)
      process.exit(1)
    }

    if (!apply) {
      payload.logger.info('Report a secco completato senza errori. Nessuna scrittura.')
      return
    }

    assertDatabaseAllowed(allowNonDevDatabase)
    const before = await fingerprintImportedCollections(payload)
    const stats = await runApply(payload, snapshot, cache)
    const after = await fingerprintImportedCollections(payload)

    for (const [slug, fingerprint] of Object.entries(after)) {
      if (before[slug] !== fingerprint && stats[slug]?.created === 0) {
        throw new Error(
          `Idempotenza violata su ${slug}: fingerprint cambiata senza creazioni (possibile update involontario).`,
        )
      }
    }

    console.log('--- Scrittura completata ---')
    for (const [slug, { created }] of Object.entries(stats)) {
      console.log(`  ${slug}: creati ${created}`)
    }
    console.log('  Tassonomie importate: dish-categories, wine-types, spirit-types, drink-types (vedi log sopra)')
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Import menù non riuscito: ${message}`)
  process.exit(1)
}
