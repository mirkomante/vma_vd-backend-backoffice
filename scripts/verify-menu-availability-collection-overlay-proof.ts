/**
 * Prova 4 — collection REST con overlay OFF sul server dev (DISABLE=1).
 *   MENU_AVAILABILITY_DISABLE_STATE_OVERLAY=1 + writer IN_MEMORY sul pnpm dev
 *   pnpm verify:menu-availability-collection-overlay-proof
 */
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

import config from '@payload-config'
import { getPayload } from 'payload'

import { dishAvailabilityStatus } from '@/lib/menu/availability/mapItemStatus'
import { DISH_CATEGORIES_SLUG, DISHES_SLUG } from '@/lib/menu/constants'

import {
  countAvailabilityWriteTraceLines,
  dishStatusInRawJson,
  readAvailabilityMirrorJson,
  restPatchDish,
  signRestJwtAdmin,
} from './verify-menu-6_4-lib'

const RUN = Date.now().toString(36)
const MIRROR = '/tmp/vma-final-dev-availability.json'
const TRACE = '/tmp/vma-final-dev-writes.log'
const SYNC = '/tmp/vma-final-dev-sync.jsonl'
const BASE = (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')

function logLine(proof: string, outcome: string): void {
  console.log(`FINAL_PROOF|${proof}|${outcome}`)
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  const manager = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: `final-mgr-off-${RUN}@example.test`,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  const token = await signRestJwtAdmin(payload, manager as never)

  const cat = await payload.create({
    collection: DISH_CATEGORIES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: { name: `FinalOff Cat ${RUN}` },
  })
  const dish = await payload.create({
    collection: DISHES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: {
      name: `FinalOff Dish ${RUN}`,
      price: 8,
      category: cat.id,
      soldOut: false,
      disabled: false,
    },
  })

  if (existsSync(TRACE)) {
    unlinkSync(TRACE)
  }
  const trace0 = countAvailabilityWriteTraceLines(TRACE)
  const sync0 = existsSync(SYNC) ? readFileSync(SYNC, 'utf8').split('\n').filter(Boolean).length : 0

  await restPatchDish(BASE, token, dish.id, { soldOut: true }, 'it')
  const docSold = await payload.findByID({ collection: DISHES_SLUG, id: dish.id, depth: 0, overrideAccess: true })
  const mirror = readAvailabilityMirrorJson(MIRROR)
  const inFile = dishStatusInRawJson(mirror, dish.id)
  const expected = dishAvailabilityStatus(docSold as never)
  const reflects = inFile === expected
  logLine(
    '4 dev collection overlay OFF soldOut',
    `riflette=${reflects} file=${inFile} atteso=${expected} scritture=${countAvailabilityWriteTraceLines(TRACE) - trace0}`,
  )

  const trace1 = countAvailabilityWriteTraceLines(TRACE)
  await restPatchDish(BASE, token, dish.id, { disabled: true }, 'it')
  const docDis = await payload.findByID({ collection: DISHES_SLUG, id: dish.id, depth: 0, overrideAccess: true })
  const mirror2 = readAvailabilityMirrorJson(MIRROR)
  const inFile2 = dishStatusInRawJson(mirror2, dish.id)
  const expected2 = dishAvailabilityStatus(docDis as never)
  const reflects2 = inFile2 === expected2
  logLine(
    '4 dev collection overlay OFF disabled',
    `riflette=${reflects2} file=${inFile2} atteso=${expected2} scritture=${countAvailabilityWriteTraceLines(TRACE) - trace1}`,
  )

  await payload.delete({ collection: DISHES_SLUG, id: dish.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: DISH_CATEGORIES_SLUG, id: cat.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: 'users', id: manager.id, overrideAccess: true, depth: 0 })
  await payload.destroy()

  if (!reflects || !reflects2) {
    process.exitCode = 0
    logLine('4 conclusione', 'difetto collection NON dimostrato (file allineato al DB)')
  } else {
    logLine('4 conclusione', 'collection OK anche senza overlay in questa prova')
  }
}

try {
  await main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
