import type { CollectionSlug } from 'payload'

import type { PayloadFixture } from '../../fixtures'
import { menuPayload } from '../menu-payload-run'
import type { CatalogScreenConfig } from './config'

export async function createCatalogItems(
  config: CatalogScreenConfig,
  payload: PayloadFixture,
  specs: Array<{ name: string; descriptionEn?: string }>,
): Promise<void> {
  const res = await menuPayload('create-catalog-items', config.collection, JSON.stringify(specs))
  if (!res.ok) {
    throw new Error(`create-catalog-items: ${String(res.reason ?? 'fallito')}`)
  }
  const ids = (res.ids as Array<number | string> | undefined) ?? []
  for (const id of ids) {
    payload.registerCreated(config.collection as CollectionSlug, id)
  }
}
