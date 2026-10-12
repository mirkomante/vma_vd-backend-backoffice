/**
 * Seed idempotente tassonomie menù (fase 6.1). Chiave naturale per nome (IT dove localizzato).
 * `enabled` solo in creazione; riesecuzione non lo modifica. Allergeni: `en` solo se manca.
 *
 * Uso: pnpm seed:menu-taxonomies
 */
import config from '@payload-config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  REGIONS_SLUG,
} from '@/lib/menu/constants'

import {
  ALLERGENS_SEED,
  APPELLATIONS_SEED,
  CLASSIFICATIONS_SEED,
  COUNTRIES_SEED,
  REGIONS_SEED,
} from './menu-taxonomies/seed-data'

type CountryId = number
type RegionId = number

async function findCountryIdByNameIt(payload: Payload, nameIt: string): Promise<CountryId> {
  const result = await payload.find({
    collection: COUNTRIES_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: nameIt } },
  })
  const doc = result.docs[0]
  if (!doc) {
    throw new Error(`Paese non trovato dopo seed: ${nameIt}`)
  }
  return doc.id as CountryId
}

async function findRegionIdByNameIt(payload: Payload, nameIt: string): Promise<RegionId> {
  const result = await payload.find({
    collection: REGIONS_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: nameIt } },
  })
  const doc = result.docs[0]
  if (!doc) {
    throw new Error(`Regione non trovata dopo seed: ${nameIt}`)
  }
  return doc.id as RegionId
}

async function seedCountries(payload: Payload): Promise<{ created: number }> {
  let created = 0
  for (const row of COUNTRIES_SEED) {
    const existing = await payload.find({
      collection: COUNTRIES_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: row.nameIt } },
    })
    if (existing.docs[0]) {
      continue
    }
    await payload.create({
      collection: COUNTRIES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      data: { name: row.nameIt, enabled: row.enabled },
    })
    created += 1
  }
  return { created }
}

async function seedRegions(payload: Payload): Promise<{ created: number }> {
  let created = 0
  for (const row of REGIONS_SEED) {
    const existing = await payload.find({
      collection: REGIONS_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: row.nameIt } },
    })
    if (existing.docs[0]) {
      continue
    }
    const countryId = await findCountryIdByNameIt(payload, row.countryNameIt)
    await payload.create({
      collection: REGIONS_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      data: { name: row.nameIt, country: countryId, enabled: row.enabled },
    })
    created += 1
  }
  return { created }
}

async function seedAppellations(payload: Payload): Promise<{ created: number }> {
  let created = 0
  for (const row of APPELLATIONS_SEED) {
    const existing = await payload.find({
      collection: APPELLATIONS_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: row.name } },
    })
    if (existing.docs[0]) {
      continue
    }
    const regionId = await findRegionIdByNameIt(payload, row.regionNameIt)
    await payload.create({
      collection: APPELLATIONS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { name: row.name, region: regionId },
    })
    created += 1
  }
  return { created }
}

async function seedClassifications(payload: Payload): Promise<{ created: number }> {
  let created = 0
  for (const row of CLASSIFICATIONS_SEED) {
    const existing = await payload.find({
      collection: CLASSIFICATIONS_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: row.name } },
    })
    if (existing.docs[0]) {
      continue
    }
    const countryId = await findCountryIdByNameIt(payload, row.countryNameIt)
    await payload.create({
      collection: CLASSIFICATIONS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { name: row.name, country: countryId },
    })
    created += 1
  }
  return { created }
}

async function seedAllergens(payload: Payload): Promise<{ created: number; enPatched: number }> {
  let created = 0
  let enPatched = 0
  for (const row of ALLERGENS_SEED) {
    const existing = await payload.find({
      collection: ALLERGENS_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: row.nameIt } },
    })
    let id: number
    if (existing.docs[0]) {
      id = existing.docs[0].id
    } else {
      const doc = await payload.create({
        collection: ALLERGENS_SLUG,
        locale: 'it',
        depth: 0,
        overrideAccess: true,
        data: { name: row.nameIt },
      })
      id = doc.id
      created += 1
    }

    const enDoc = await payload.findByID({
      collection: ALLERGENS_SLUG,
      id,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    const enName = typeof enDoc.name === 'string' ? enDoc.name.trim() : ''
    if (!enName) {
      await payload.update({
        collection: ALLERGENS_SLUG,
        id,
        locale: 'en',
        depth: 0,
        overrideAccess: true,
        data: { name: row.nameEn },
      })
      enPatched += 1
    }
  }
  return { created, enPatched }
}

async function logCounts(payload: Payload): Promise<void> {
  const slugs = [
    COUNTRIES_SLUG,
    REGIONS_SLUG,
    APPELLATIONS_SLUG,
    CLASSIFICATIONS_SLUG,
    ALLERGENS_SLUG,
  ] as const
  for (const slug of slugs) {
    const { totalDocs } = await payload.find({
      collection: slug,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    })
    payload.logger.info(`Seed menu-taxonomies: ${slug} → ${totalDocs} record`)
  }
}

export async function runMenuTaxonomiesSeed(payload: Payload): Promise<void> {
  const countries = await seedCountries(payload)
  const regions = await seedRegions(payload)
  const appellations = await seedAppellations(payload)
  const classifications = await seedClassifications(payload)
  const allergens = await seedAllergens(payload)

  payload.logger.info(
    `Seed menu-taxonomies: creati paesi=${countries.created}, regioni=${regions.created}, ` +
      `denominazioni=${appellations.created}, classificazioni=${classifications.created}, ` +
      `allergeni=${allergens.created} (en aggiornati=${allergens.enPatched})`,
  )
  await logCounts(payload)
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  await runMenuTaxonomiesSeed(payload)
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Seed menu-taxonomies non riuscito: ${message}`)
  process.exit(1)
}
