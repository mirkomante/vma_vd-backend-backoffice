import { DISHES_SLUG } from '@/lib/menu/constants'
import type { Payload } from 'payload'

import { managerUser } from '../menu-list/payload-actions'

export async function countDishes(payload: Payload): Promise<number> {
  const res = await payload.find({
    collection: DISHES_SLUG,
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })
  return res.totalDocs
}

export async function createDishAsManager(
  payload: Payload,
  managerEmail: string,
  name: string,
  categoryId: number,
): Promise<number | string> {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.create({
    collection: DISHES_SLUG,
    data: {
      name,
      description: 'verify-ui',
      price: 9,
      category: categoryId,
    },
    overrideAccess: false,
    user,
  })
  return doc.id
}

export async function deleteDishByName(payload: Payload, name: string): Promise<void> {
  const found = await payload.find({
    collection: DISHES_SLUG,
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const id = found.docs[0]?.id
  if (id != null) {
    await payload.delete({ collection: DISHES_SLUG, id, overrideAccess: true, depth: 0 })
  }
}
