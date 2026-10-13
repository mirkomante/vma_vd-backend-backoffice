import type { Payload } from 'payload'

import { SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY } from '@/lib/menu/availability/constants'
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

export const WIPE_MENU_IMPORT_SLUGS = [
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

const suppressContext = { [SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY]: true }

export async function wipeMenuImportCollections(payload: Payload): Promise<void> {
  for (const slug of WIPE_MENU_IMPORT_SLUGS) {
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
        await payload.delete({
          collection: slug,
          id: doc.id,
          depth: 0,
          overrideAccess: true,
          context: suppressContext,
        })
        deleted += 1
      }
    }
    console.log(`${slug}: eliminati ${deleted}`)
  }
}
