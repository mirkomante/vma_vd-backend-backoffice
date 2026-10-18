/** Rimuove fixed-menus/categories/special-days prima di wipe-menu-import-dev se il wipe fallisce per FK. */
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'

async function clearSlug(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<number> {
  let n = 0
  for (;;) {
    const batch = await payload.find({ collection: slug, limit: 50, depth: 0, overrideAccess: true })
    if (batch.docs.length === 0) {
      break
    }
    for (const doc of batch.docs) {
      await payload.delete({ collection: slug, id: doc.id, overrideAccess: true, depth: 0 })
      n += 1
    }
  }
  return n
}

try {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  for (const slug of [FIXED_MENUS_SLUG, FIXED_MENU_CATEGORIES_SLUG, SPECIAL_DAYS_SLUG]) {
    console.log(`${slug}: eliminati ${await clearSlug(payload, slug)}`)
  }
  await payload.destroy()
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
