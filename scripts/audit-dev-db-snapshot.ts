/**
 * Snapshot conteggi dev + record verify-* (uso diagnostico F-EN, non in package.json).
 *   pnpm payload run scripts/audit-dev-db-snapshot.ts
 */
import config from '@payload-config'
import { type CollectionSlug, getPayload } from 'payload'

import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  REGIONS_SLUG,
  SPECIAL_DAYS_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'
import {
  combinedImportContentFingerprintHash,
  fingerprintImportContentCollections,
} from './lib/import-menu-content-fingerprint'

const TRACKED: CollectionSlug[] = [
  DISHES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  FIXED_MENUS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  SPECIAL_DAYS_SLUG,
  DISH_CATEGORIES_SLUG,
  ALLERGENS_SLUG,
  COUNTRIES_SLUG,
  REGIONS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  WINE_TYPES_SLUG,
  DRINK_TYPES_SLUG,
]

const VERIFY_COLLECTIONS: CollectionSlug[] = [
  DISHES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  FIXED_MENUS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  SPECIAL_DAYS_SLUG,
  DISH_CATEGORIES_SLUG,
  'users',
]

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  try {
    console.log('--- CONTEGGI (totalDocs) ---')
    for (const slug of TRACKED) {
      const r = await payload.find({ collection: slug, depth: 0, limit: 1, overrideAccess: true })
      console.log(`${slug}\t${r.totalDocs}`)
    }
    const rows = await fingerprintImportContentCollections(payload)
    console.log(`COMBINED_SHA256\t${combinedImportContentFingerprintHash(rows)}`)

    console.log('\n--- RECORD verify- / verify-ui- ---')
    for (const slug of VERIFY_COLLECTIONS) {
      const found = await payload.find({
        collection: slug,
        depth: 0,
        limit: 200,
        overrideAccess: true,
        where: { name: { contains: 'verify-' } },
      })
      for (const doc of found.docs) {
        const name = (doc as { name?: string }).name ?? '—'
        console.log(`${slug}\t${doc.id}\t${name}`)
      }
      const foundUi = await payload.find({
        collection: slug,
        depth: 0,
        limit: 200,
        overrideAccess: true,
        where: { name: { contains: 'verify-ui-' } },
      })
      for (const doc of foundUi.docs) {
        const name = (doc as { name?: string }).name ?? '—'
        if (!name.includes('verify-')) {
          continue
        }
        console.log(`${slug}\t${doc.id}\t${name}`)
      }
    }
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
