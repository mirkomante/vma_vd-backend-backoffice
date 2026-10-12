/**
 * Svuota le collection popolate dall'import 6.8 su vma_vd_dev (solo sviluppo).
 * Non tocca paesi/regioni/allergeni del seed 6.1 né menu fissi di verify-6_2.
 *
 * Uso: pnpm payload run scripts/wipe-menu-import-dev.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

import { isDevDatabaseTarget, parseDatabaseTarget } from './import-menu-vtn-backend/databaseUrl'

const SLUGS = [
  DISHES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  DISH_CATEGORIES_SLUG,
  WINE_TYPES_SLUG,
  SPIRIT_TYPES_SLUG,
  DRINK_TYPES_SLUG,
] as const

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
    for (const slug of SLUGS) {
      let deleted = 0
      for (;;) {
        const batch = await payload.find({
          collection: slug,
          depth: 0,
          limit: 50,
          overrideAccess: true,
        })
        if (batch.docs.length === 0) {
          break
        }
        for (const doc of batch.docs) {
          await payload.delete({ collection: slug, id: doc.id, depth: 0, overrideAccess: true })
          deleted += 1
        }
      }
      console.log(`${slug}: eliminati ${deleted}`)
    }
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
