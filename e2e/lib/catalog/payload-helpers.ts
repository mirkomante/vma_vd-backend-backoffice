import { COUNTRIES_SLUG, WINES_SLUG, WINE_TYPES_SLUG } from '@/lib/menu/constants'
import type { Payload } from 'payload'

import { managerUser } from '../menu-list/payload-actions'

export async function countWines(payload: Payload): Promise<number> {
  const res = await payload.find({
    collection: WINES_SLUG,
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })
  return res.totalDocs
}

async function wineTaxonomyIds(payload: Payload): Promise<{ typeId: number | string; countryId: number | string }> {
  const [types, countries] = await Promise.all([
    payload.find({ collection: WINE_TYPES_SLUG, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: COUNTRIES_SLUG, limit: 1, depth: 0, overrideAccess: true }),
  ])
  const typeId = types.docs[0]?.id
  const countryId = countries.docs[0]?.id
  if (typeId == null || countryId == null) {
    throw new Error('tipologia o paese vino mancanti nel database di sviluppo')
  }
  return { typeId, countryId }
}

export async function createWineAsManager(
  payload: Payload,
  managerEmail: string,
  name: string,
): Promise<number | string> {
  const user = await managerUser(payload, managerEmail)
  const { typeId, countryId } = await wineTaxonomyIds(payload)
  const doc = await payload.create({
    collection: WINES_SLUG,
    data: {
      name,
      description: 'verify-ui',
      price: 10,
      type: typeId as number,
      country: countryId as number,
      year: '2020',
      volume: '75 cl',
      abv: '13%',
    },
    overrideAccess: false,
    user,
  })
  return doc.id
}

export async function deleteWineByName(payload: Payload, name: string): Promise<void> {
  const found = await payload.find({
    collection: WINES_SLUG,
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const id = found.docs[0]?.id
  if (id != null) {
    await payload.delete({ collection: WINES_SLUG, id, overrideAccess: true, depth: 0 })
  }
}
