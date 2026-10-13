import type { Payload } from 'payload'

import { DISHES_SLUG } from '@/lib/menu/constants'

import { SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY } from './constants'
import { syncMenuAvailabilityFile } from './syncMenuAvailabilityFile'

const suppressContext = { [SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY]: true }

export async function resetAllDishesSoldOut(payload: Payload): Promise<number> {
  let cleared = 0
  let page = 1
  let hasNext = true

  while (hasNext) {
    const found = await payload.find({
      collection: DISHES_SLUG,
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
      where: { soldOut: { equals: true } },
    })

    for (const doc of found.docs) {
      await payload.update({
        id: doc.id,
        collection: DISHES_SLUG,
        context: suppressContext,
        data: { soldOut: false },
        depth: 0,
        overrideAccess: true,
      })
      cleared += 1
    }

    hasNext = found.hasNextPage
    page += 1
  }

  await syncMenuAvailabilityFile(payload)
  return cleared
}
