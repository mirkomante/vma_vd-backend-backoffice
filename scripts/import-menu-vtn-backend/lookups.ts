import type { Payload } from 'payload'

import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DRINK_TYPES_SLUG,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  WINE_TYPES_SLUG,
} from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'

import { ALLERGEN_SNAPSHOT_TO_SEED, CLASSIFICATION_NORMALIZE } from './constants'

export type LookupCache = {
  countryByNameIt: Map<string, number>
  regionByNameIt: Map<string, { id: number; countryId: number }>
  appellationByName: Map<string, { id: number; regionId: number }>
  classificationByKey: Map<string, number>
  allergenBySeedNameIt: Map<string, number>
  taxonomyLocalizedByNameIt: Map<string, Map<string, number>>
}

function taxonomyMapKey(collection: string): string {
  return collection
}

export async function buildLookupCache(payload: Payload): Promise<LookupCache> {
  const countryByNameIt = new Map<string, number>()
  const countries = await payload.find({
    collection: COUNTRIES_SLUG,
    locale: 'it',
    depth: 0,
    limit: 200,
    overrideAccess: true,
    fallbackLocale: false,
  })
  for (const doc of countries.docs) {
    if (typeof doc.name === 'string') {
      countryByNameIt.set(doc.name, doc.id as number)
    }
  }

  const regionByNameIt = new Map<string, { id: number; countryId: number }>()
  const regions = await payload.find({
    collection: REGIONS_SLUG,
    locale: 'it',
    depth: 0,
    limit: 200,
    overrideAccess: true,
    fallbackLocale: false,
  })
  for (const doc of regions.docs) {
    if (typeof doc.name === 'string') {
      const countryId = relationshipId(doc.country)
      if (countryId != null) {
        regionByNameIt.set(doc.name, { id: doc.id as number, countryId: countryId as number })
      }
    }
  }

  const appellationByName = new Map<string, { id: number; regionId: number }>()
  const appellations = await payload.find({
    collection: APPELLATIONS_SLUG,
    depth: 0,
    limit: 50,
    overrideAccess: true,
  })
  for (const doc of appellations.docs) {
    const regionId = relationshipId(doc.region)
    if (typeof doc.name === 'string' && regionId != null) {
      appellationByName.set(doc.name, { id: doc.id as number, regionId: regionId as number })
    }
  }

  const classificationByKey = new Map<string, number>()
  const classifications = await payload.find({
    collection: CLASSIFICATIONS_SLUG,
    depth: 0,
    limit: 50,
    overrideAccess: true,
  })
  for (const doc of classifications.docs) {
    const countryId = relationshipId(doc.country)
    if (typeof doc.name === 'string' && countryId != null) {
      classificationByKey.set(`${doc.name}\0${countryId}`, doc.id as number)
    }
  }

  const allergenBySeedNameIt = new Map<string, number>()
  const allergens = await payload.find({
    collection: ALLERGENS_SLUG,
    locale: 'it',
    depth: 0,
    limit: 50,
    overrideAccess: true,
    fallbackLocale: false,
  })
  for (const doc of allergens.docs) {
    if (typeof doc.name === 'string') {
      allergenBySeedNameIt.set(doc.name, doc.id as number)
    }
  }

  const taxonomyLocalizedByNameIt = new Map<string, Map<string, number>>()
  const localizedTaxonomies = [
    DISH_CATEGORIES_SLUG,
    WINE_TYPES_SLUG,
    SPIRIT_TYPES_SLUG,
    DRINK_TYPES_SLUG,
  ] as const
  for (const slug of localizedTaxonomies) {
    const map = new Map<string, number>()
    const result = await payload.find({
      collection: slug,
      locale: 'it',
      depth: 0,
      limit: 200,
      overrideAccess: true,
      fallbackLocale: false,
    })
    for (const doc of result.docs) {
      if (typeof doc.name === 'string') {
        map.set(doc.name, doc.id as number)
      }
    }
    taxonomyLocalizedByNameIt.set(taxonomyMapKey(slug), map)
  }

  return {
    countryByNameIt,
    regionByNameIt,
    appellationByName,
    classificationByKey,
    allergenBySeedNameIt,
    taxonomyLocalizedByNameIt,
  }
}

export function resolveAllergenSeedName(snapshotName: string): string {
  return ALLERGEN_SNAPSHOT_TO_SEED[snapshotName] ?? snapshotName
}

export function normalizeClassificationName(raw: string): string {
  return CLASSIFICATION_NORMALIZE[raw] ?? raw
}

export function taxonomyId(
  cache: LookupCache,
  collection: string,
  nameIt: string,
): number | undefined {
  return cache.taxonomyLocalizedByNameIt.get(taxonomyMapKey(collection))?.get(nameIt)
}
