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

import {
  IMPORT_MENU_COLLECTIONS,
  type ImportFingerprint,
} from './import-menu-fingerprint'

const LOCALIZED_IMPORT_SLUGS = new Set<CollectionSlug>([
  DISHES_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  DISH_CATEGORIES_SLUG,
  WINE_TYPES_SLUG,
  SPIRIT_TYPES_SLUG,
  DRINK_TYPES_SLUG,
])

const STRIP_TOP_LEVEL = new Set(['id', 'createdAt', 'updatedAt'])

/** Campi relationship nell'import 6.8 → chiave naturale `name` (locale IT già nella query). */
const RELATIONSHIP_FIELDS = new Set([
  'category',
  'country',
  'region',
  'appellation',
  'classification',
  'type',
  'allergens',
])

function naturalNameFromRelation(value: unknown): string | null {
  if (value == null) {
    return null
  }
  if (typeof value === 'object' && value !== null && 'name' in value) {
    const name = (value as { name?: unknown }).name
    if (typeof name === 'string') {
      return name
    }
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return String(value)
  }
  return null
}

function canonicalizeValue(key: string, value: unknown): unknown {
  if (value == null) {
    return value
  }

  if (RELATIONSHIP_FIELDS.has(key)) {
    if (Array.isArray(value)) {
      const names = value
        .map((item) => naturalNameFromRelation(item))
        .filter((n): n is string => n != null)
      return [...names].sort((a, b) => a.localeCompare(b, 'it'))
    }
    return naturalNameFromRelation(value)
  }

  if (Array.isArray(value)) {
    const mapped = value.map((item) => canonicalizeNode(item))
    if (mapped.every((item) => typeof item === 'string')) {
      return [...(mapped as string[])].sort((a, b) => a.localeCompare(b, 'it'))
    }
    return mapped
      .map((item) => JSON.stringify(item))
      .sort()
      .map((s) => JSON.parse(s) as unknown)
  }

  if (typeof value === 'object') {
    return canonicalizeNode(value as Record<string, unknown>)
  }

  return value
}

function canonicalizeNode(doc: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const keys = Object.keys(doc)
    .filter((k) => !STRIP_TOP_LEVEL.has(k) && !k.startsWith('_'))
    .sort()

  for (const key of keys) {
    out[key] = canonicalizeValue(key, doc[key])
  }
  return out
}

function stableDocSortKey(doc: Record<string, unknown>): string {
  const name = doc.name
  if (typeof name === 'string') {
    return name
  }
  return JSON.stringify(doc)
}

async function findImportDocs(payload: Payload, slug: CollectionSlug): Promise<Record<string, unknown>[]> {
  const localized = LOCALIZED_IMPORT_SLUGS.has(slug)

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

  const canonical = result.docs.map((doc) =>
    canonicalizeNode(doc as unknown as Record<string, unknown>),
  )
  canonical.sort((a, b) => stableDocSortKey(a).localeCompare(stableDocSortKey(b), 'it'))
  return canonical
}

export async function fingerprintImportContentCollections(
  payload: Payload,
): Promise<ImportFingerprint[]> {
  const out: ImportFingerprint[] = []
  for (const slug of IMPORT_MENU_COLLECTIONS) {
    const docs = await findImportDocs(payload, slug)
    const canonical = JSON.stringify(docs)
    out.push({
      slug,
      totalDocs: docs.length,
      sha256: createHash('sha256').update(canonical).digest('hex'),
    })
  }
  return out
}

export function combinedImportContentFingerprintHash(rows: ImportFingerprint[]): string {
  return createHash('sha256')
    .update(rows.map((r) => `${r.slug}:${r.sha256}`).join('\n'))
    .digest('hex')
}

export function printImportContentFingerprints(rows: ImportFingerprint[], label: string): void {
  console.log(`=== ${label} (contenuto) ===`)
  for (const row of rows) {
    console.log(`${row.slug}: totalDocs=${row.totalDocs} sha256=${row.sha256}`)
  }
  console.log(`COMBINED_CONTENT_SHA256=${combinedImportContentFingerprintHash(rows)}`)
  console.log('')
}
