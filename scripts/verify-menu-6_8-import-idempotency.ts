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
import { createHash } from 'node:crypto'
import { getPayload } from 'payload'
import type { CollectionSlug } from 'payload'

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
const IMPORT_COLLECTIONS: CollectionSlug[] = [
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

export async function fingerprintImportCollections(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<ImportFingerprint[]> {
  const out: ImportFingerprint[] = []
  for (const slug of IMPORT_COLLECTIONS) {
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

function printFingerprints(rows: ImportFingerprint[], label: string): void {
  console.log(`=== ${label} ===`)
  for (const row of rows) {
    console.log(`${row.slug}: totalDocs=${row.totalDocs} sha256=${row.sha256}`)
  }
  const combined = createHash('sha256')
    .update(rows.map((r) => `${r.slug}:${r.sha256}`).join('\n'))
    .digest('hex')
  console.log(`COMBINED_SHA256=${combined}`)
  console.log('')
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  try {
    const rows = await fingerprintImportCollections(payload)
    printFingerprints(rows, 'Fingerprint import 6.8')
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
