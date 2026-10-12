import { createHash } from 'node:crypto'
import type { CollectionSlug, Payload } from 'payload'

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

/** Collection popolate dall'import 6.8 (contenuto + tassonomie create dallo snapshot). */
export const IMPORT_MENU_COLLECTIONS: CollectionSlug[] = [
  DISH_CATEGORIES_SLUG,
  WINE_TYPES_SLUG,
  SPIRIT_TYPES_SLUG,
  DRINK_TYPES_SLUG,
  MENU_SERVICES_SLUG,
  DISHES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
]

export type ImportFingerprint = {
  slug: CollectionSlug
  totalDocs: number
  sha256: string
}

export async function fingerprintImportCollections(payload: Payload): Promise<ImportFingerprint[]> {
  const out: ImportFingerprint[] = []
  for (const slug of IMPORT_MENU_COLLECTIONS) {
    const localized =
      slug === DISHES_SLUG ||
      slug === DRINKS_SLUG ||
      slug === MENU_SERVICES_SLUG ||
      slug === DISH_CATEGORIES_SLUG ||
      slug === WINE_TYPES_SLUG ||
      slug === SPIRIT_TYPES_SLUG ||
      slug === DRINK_TYPES_SLUG

    const result = localized
      ? await payload.find({
          collection: slug,
          depth: 2,
          limit: 500,
          overrideAccess: true,
          sort: 'id',
          locale: 'it',
          fallbackLocale: false,
        })
      : await payload.find({
          collection: slug,
          depth: 2,
          limit: 500,
          overrideAccess: true,
          sort: 'id',
        })
    const canonical = JSON.stringify(result.docs)
    out.push({
      slug,
      totalDocs: result.totalDocs,
      sha256: createHash('sha256').update(canonical).digest('hex'),
    })
  }
  return out
}

export function combinedImportFingerprintHash(rows: ImportFingerprint[]): string {
  return createHash('sha256')
    .update(rows.map((r) => `${r.slug}:${r.sha256}`).join('\n'))
    .digest('hex')
}

export function printImportFingerprints(rows: ImportFingerprint[], label: string): void {
  console.log(`=== ${label} ===`)
  for (const row of rows) {
    console.log(`${row.slug}: totalDocs=${row.totalDocs} sha256=${row.sha256}`)
  }
  console.log(`COMBINED_SHA256=${combinedImportFingerprintHash(rows)}`)
  console.log('')
}
