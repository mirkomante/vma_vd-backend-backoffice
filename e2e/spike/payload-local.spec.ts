import config from '@payload-config'
import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'

const SPIKE_NAME = 'verify-ui-spike'

test('Local API Payload: crea, rilegge con depth, cancella piatto', async () => {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })

  const cat = await payload.find({
    collection: 'dish-categories',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const categoryId = cat.docs[0]?.id
  expect(categoryId, 'serve almeno una categoria piatti').toBeTruthy()

  const created = await payload.create({
    collection: 'dishes',
    data: {
      name: SPIKE_NAME,
      description: 'e2e spike T0',
      price: 1,
      category: categoryId as number,
    },
    overrideAccess: true,
    depth: 0,
  })

  try {
    const read = await payload.findByID({
      collection: 'dishes',
      id: created.id,
      depth: 1,
      overrideAccess: true,
    })
    expect(read.name).toBe(SPIKE_NAME)
    expect(read.category).toBeTruthy()
  } finally {
    await payload.delete({
      collection: 'dishes',
      id: created.id,
      overrideAccess: true,
      depth: 0,
    })
  }

  const gone = await payload.find({
    collection: 'dishes',
    where: { name: { equals: SPIKE_NAME } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  expect(gone.docs).toHaveLength(0)
})
