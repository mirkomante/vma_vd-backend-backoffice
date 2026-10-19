import '../lib/tsx-loader'

import { config as loadEnv } from 'dotenv'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import config from '@payload-config'
import { test as base } from '@playwright/test'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'
import { E2E_RUN_META, REPO_ROOT } from '../lib/paths'

loadEnv({ path: join(REPO_ROOT, '.env') })
import { MISURA_TOCCO_SCRIPT, type TouchMeasureResult } from './touch'

export type E2eRunMeta = {
  runId: string
  userEmail: string
}

function loadRunMeta(): E2eRunMeta {
  const raw = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as E2eRunMeta
  if (!raw.runId) throw new Error('runId mancante in e2e-run.json')
  return raw
}

type CreatedRecord = { collection: CollectionSlug; id: number | string }

export type PayloadFixture = {
  crea: (
    collection: CollectionSlug,
    data: Record<string, unknown>,
  ) => Promise<{ id: number | string }>
  runId: string
  defaultDishCategoryId: number
}

export type ConsoleBag = {
  errors: string[]
  warnings: string[]
  failed: string[]
}

export const test = base.extend<
  {
    payload: PayloadFixture
    consoleWatcher: ConsoleBag
    touch: {
      measure: () => Promise<TouchMeasureResult>
    }
  },
  { payloadWorker: Payload }
>({
  payloadWorker: [
    async ({}, use) => {
      process.env.PAYLOAD_DISABLE_PUSH = '1'
      assertDevDatabaseFromEnv()
      const payload = await getPayload({ config })
      await use(payload)
      await payload.destroy()
    },
    { scope: 'worker' },
  ],

  payload: async ({ payloadWorker }, use) => {
    const meta = loadRunMeta()
    const registry: CreatedRecord[] = []

    const cat = await payloadWorker.find({
      collection: 'dish-categories',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const categoryId = cat.docs[0]?.id
    if (categoryId == null) {
      throw new Error('nessuna categoria piatti per i test e2e')
    }

    const crea = async (collection: CollectionSlug, data: Record<string, unknown>) => {
      const doc = await payloadWorker.create({
        collection,
        data: data as never,
        overrideAccess: true,
        depth: 0,
      })
      registry.push({ collection, id: doc.id })
      return { id: doc.id }
    }

    await use({
      crea,
      runId: meta.runId,
      defaultDishCategoryId: Number(categoryId),
    })

    for (const row of registry.reverse()) {
      try {
        await payloadWorker.delete({
          collection: row.collection,
          id: row.id,
          overrideAccess: true,
          depth: 0,
        })
      } catch {
        /* global-teardown ripulisce */
      }
    }
  },

  consoleWatcher: async ({ page }, use) => {
    const bag: ConsoleBag = { errors: [], warnings: [], failed: [] }
    page.on('console', (msg) => {
      if (msg.type() === 'error') bag.errors.push(msg.text())
      if (msg.type() === 'warning') bag.warnings.push(msg.text())
    })
    page.on('pageerror', (e) => bag.errors.push(String(e)))
    page.on('response', (res) => {
      if (res.status() >= 400 && !res.url().includes('favicon')) {
        bag.failed.push(`${res.status()} ${res.url()}`)
      }
    })
    await use(bag)
  },

  touch: async ({ page }, use) => {
    await use({
      measure: async () => page.evaluate(MISURA_TOCCO_SCRIPT) as Promise<TouchMeasureResult>,
    })
  },
})

export { expect } from '@playwright/test'
