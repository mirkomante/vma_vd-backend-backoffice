/**
 * Prove finali pre-commit — eseguire con dev e standalone già avviati.
 *
 * Dev (:3000):
 *   MENU_AVAILABILITY_IN_MEMORY=1 \
 *   MENU_AVAILABILITY_WRITE_TRACE_FILE=/tmp/vma-final-dev-writes.log \
 *   MENU_AVAILABILITY_MIRROR_FILE=/tmp/vma-final-dev-availability.json \
 *   MENU_AVAILABILITY_SYNC_DEBUG_FILE=/tmp/vma-final-dev-sync.jsonl \
 *   pnpm dev
 *
 * Standalone (:3002) — build produzione (NODE_ENV=production: niente IN_MEMORY/mirror/trace;
 *   scrittura solo su GCS se MENU_AVAILABILITY_GCS_BUCKET è configurato nel .env del processo):
 *   cp .env .next/standalone/.env
 *   PORT=3002 node .next/standalone/server.js
 *
 *   pnpm verify:menu-availability-final-proofs
 */
import { existsSync, readFileSync, unlinkSync } from 'node:fs'

import config from '@payload-config'
import { getPayload } from 'payload'

import { MENU_AVAILABILITY_FORBIDDEN_IN_PRODUCTION_ENV_KEYS } from '@/lib/menu/availability/devOnlyEnvGuard'
import { getMenuAvailabilityBucketName } from '@/lib/menu/availability/gcsAvailabilityWriter'
import { MENU_AVAILABILITY_OBJECT_PATH } from '@/lib/menu/availability/constants'
import { dishAvailabilityStatus } from '@/lib/menu/availability/mapItemStatus'
import { DISH_CATEGORIES_SLUG, DISHES_SLUG } from '@/lib/menu/constants'

import {
  countAvailabilityWriteTraceLines,
  dishStatusInRawJson,
  readAvailabilityMirrorJson,
  restPatchDish,
  restPostMenuGeneral,
  signRestJwtAdmin,
} from './verify-menu-6_4-lib'

const RUN = Date.now().toString(36)

const DEV_MIRROR = '/tmp/vma-final-dev-availability.json'
const DEV_TRACE = '/tmp/vma-final-dev-writes.log'
const DEV_SYNC = '/tmp/vma-final-dev-sync.jsonl'
const STANDALONE_MIRROR = '/tmp/vma-final-standalone-availability.json'
const STANDALONE_TRACE = '/tmp/vma-final-standalone-writes.log'
const STANDALONE_SYNC = '/tmp/vma-final-standalone-sync.jsonl'

type SyncLine = {
  origin: string
  outcome: string
  globalMessagePresent: boolean
}

function parseArg(name: string): string | undefined {
  const i = process.argv.indexOf(name)
  if (i === -1 || i === process.argv.length - 1) {
    return undefined
  }
  return process.argv[i + 1]
}

function logLine(proof: string, outcome: string): void {
  console.log(`FINAL_PROOF|${proof}|${outcome}`)
}

function parseGlobal(raw: string | null): { globalMessage?: { it?: string; en?: string } } | null {
  if (!raw) {
    return null
  }
  return JSON.parse(raw) as { globalMessage?: { it?: string; en?: string } }
}

function syncLinesFrom(path: string, after: number): SyncLine[] {
  if (!existsSync(path)) {
    return []
  }
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .slice(after)
    .map((l) => JSON.parse(l) as SyncLine)
}

function syncLineCount(path: string): number {
  if (!existsSync(path)) {
    return 0
  }
  return readFileSync(path, 'utf8').split('\n').filter(Boolean).length
}

async function readGcsAvailability(): Promise<string | null> {
  const bucket = getMenuAvailabilityBucketName()
  if (!bucket) {
    return null
  }
  const { Storage } = await import('@google-cloud/storage')
  const storage = new Storage()
  const file = storage.bucket(bucket).file(MENU_AVAILABILITY_OBJECT_PATH)
  const [exists] = await file.exists()
  if (!exists) {
    return null
  }
  const [buf] = await file.download()
  return buf.toString('utf8')
}

async function readAvail(mirrorPath: string, preferGcs: boolean): Promise<string | null> {
  if (preferGcs) {
    const gcs = await readGcsAvailability()
    if (gcs) {
      return gcs
    }
  }
  return readAvailabilityMirrorJson(mirrorPath)
}

async function proveGlobalLocales(
  tag: string,
  baseUrl: string,
  mirrorPath: string,
  preferGcs: boolean,
  token: string,
): Promise<void> {
  const it0 = `FinalProof IT base ${RUN}`
  const en1 = `FinalProof EN new ${RUN}`
  const it2 = `FinalProof IT changed ${RUN}`

  await restPostMenuGeneral(baseUrl, token, { globalMessage: it0 }, 'it')
  logLine(`${tag} step0 IT seed`, `file=${JSON.stringify(parseGlobal(await readAvail(mirrorPath, preferGcs))?.globalMessage ?? null)}`)

  await restPostMenuGeneral(baseUrl, token, { globalMessage: en1 }, 'en')
  const afterEn = parseGlobal(await readAvail(mirrorPath, preferGcs))
  logLine(
    `${tag} step1 ?locale=en`,
    afterEn?.globalMessage?.it === it0 && afterEn?.globalMessage?.en === en1
      ? `OK ${JSON.stringify(afterEn.globalMessage)}`
      : `FAIL ${JSON.stringify(afterEn?.globalMessage)}`,
  )

  await restPostMenuGeneral(baseUrl, token, { globalMessage: it2 }, 'it')
  const afterIt = parseGlobal(await readAvail(mirrorPath, preferGcs))
  logLine(
    `${tag} step2 ?locale=it`,
    afterIt?.globalMessage?.it === it2 && afterIt?.globalMessage?.en === en1
      ? `OK ${JSON.stringify(afterIt.globalMessage)}`
      : `FAIL ${JSON.stringify(afterIt?.globalMessage)}`,
  )
}

async function proveGlobalEmpty(
  tag: string,
  baseUrl: string,
  mirrorPath: string,
  preferGcs: boolean,
  token: string,
): Promise<void> {
  await restPostMenuGeneral(baseUrl, token, { globalMessage: '' }, 'en')
  await restPostMenuGeneral(baseUrl, token, { globalMessage: '' }, 'it')
  const empty = parseGlobal(await readAvail(mirrorPath, preferGcs))
  logLine(
    `${tag} empty IT+EN`,
    empty?.globalMessage === undefined ? `OK (no globalMessage)` : `FAIL ${JSON.stringify(empty)}`,
  )

  await restPostMenuGeneral(baseUrl, token, { globalMessage: '   ' }, 'it')
  const spaces = parseGlobal(await readAvail(mirrorPath, preferGcs))
  logLine(
    `${tag} spaces IT`,
    spaces?.globalMessage === undefined ? `OK (no globalMessage)` : `FAIL ${JSON.stringify(spaces)}`,
  )
}

async function proveCollectionRest(
  tag: string,
  baseUrl: string,
  mirrorPath: string,
  tracePath: string,
  syncPath: string,
  preferGcs: boolean,
  managerToken: string,
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<{ soldOutOk: boolean; disabledOk: boolean }> {
  const cat = await payload.create({
    collection: DISH_CATEGORIES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: { name: `FinalProof Cat ${RUN}` },
  })
  const dish = await payload.create({
    collection: DISHES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: {
      name: `FinalProof Dish ${RUN}`,
      price: 9,
      category: cat.id,
      soldOut: false,
      disabled: false,
    },
  })

  const sync0 = syncLineCount(syncPath)
  const trace0 = countAvailabilityWriteTraceLines(tracePath)

  await restPatchDish(baseUrl, managerToken, dish.id, { soldOut: true }, 'it')
  const soldLog = syncLinesFrom(syncPath, sync0).filter((l) => l.origin === `collection:${DISHES_SLUG}`).pop()
  const dishSold = await payload.findByID({ collection: DISHES_SLUG, id: dish.id, depth: 0, overrideAccess: true })
  const mirrorSold = await readAvail(mirrorPath, preferGcs)
  const stSold = dishStatusInRawJson(mirrorSold, dish.id)
  const expSold = dishAvailabilityStatus(dishSold as never)
  const soldOutOk = stSold === expSold
  logLine(
    `${tag} soldOut`,
    `scritture=${countAvailabilityWriteTraceLines(tracePath) - trace0} file=${stSold} atteso=${expSold} sync=${JSON.stringify(soldLog)}`,
  )

  const sync1 = syncLineCount(syncPath)
  const trace1 = countAvailabilityWriteTraceLines(tracePath)
  await restPatchDish(baseUrl, managerToken, dish.id, { disabled: true }, 'it')
  const disLog = syncLinesFrom(syncPath, sync1).filter((l) => l.origin === `collection:${DISHES_SLUG}`).pop()
  const dishDis = await payload.findByID({ collection: DISHES_SLUG, id: dish.id, depth: 0, overrideAccess: true })
  const mirrorDis = await readAvail(mirrorPath, preferGcs)
  const stDis = dishStatusInRawJson(mirrorDis, dish.id)
  const expDis = dishAvailabilityStatus(dishDis as never)
  const disabledOk = stDis === expDis
  logLine(
    `${tag} disabled`,
    `scritture=${countAvailabilityWriteTraceLines(tracePath) - trace1} file=${stDis} atteso=${expDis} sync=${JSON.stringify(disLog)}`,
  )

  await payload.delete({ collection: DISHES_SLUG, id: dish.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: DISH_CATEGORIES_SLUG, id: cat.id, overrideAccess: true, depth: 0 })
  return { soldOutOk, disabledOk }
}

async function main(): Promise<void> {
  const devUrl = (parseArg('--dev-url') ?? 'http://localhost:3000').replace(/\/$/, '')
  const standaloneUrl = (parseArg('--standalone-url') ?? 'http://localhost:3002').replace(/\/$/, '')

  logLine('prod env vietate', [...MENU_AVAILABILITY_FORBIDDEN_IN_PRODUCTION_ENV_KEYS].join(', '))

  for (const p of [DEV_MIRROR, DEV_TRACE, DEV_SYNC, STANDALONE_MIRROR, STANDALONE_TRACE, STANDALONE_SYNC]) {
    if (existsSync(p)) {
      unlinkSync(p)
    }
  }

  const payload = await getPayload({ config })
  const admin = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: `final-admin-${RUN}@example.test`,
      adminRole: 'admin',
      appRole: 'none',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  const manager = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: `final-mgr-${RUN}@example.test`,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  const adminToken = await signRestJwtAdmin(payload, admin as never)
  const managerToken = await signRestJwtAdmin(payload, manager as never)

  await proveGlobalLocales('1 dev lingua', devUrl, DEV_MIRROR, false, adminToken)
  await proveGlobalEmpty('2 dev svuota', devUrl, DEV_MIRROR, false, adminToken)

  const gcs = Boolean(getMenuAvailabilityBucketName())
  await proveGlobalLocales('1 standalone lingua', standaloneUrl, STANDALONE_MIRROR, gcs, adminToken)
  await proveGlobalEmpty('2 standalone svuota', standaloneUrl, STANDALONE_MIRROR, gcs, adminToken)

  await proveCollectionRest(
    '3 dev collection',
    devUrl,
    DEV_MIRROR,
    DEV_TRACE,
    DEV_SYNC,
    false,
    managerToken,
    payload,
  )
  await proveCollectionRest(
    '3 standalone collection',
    standaloneUrl,
    STANDALONE_MIRROR,
    STANDALONE_TRACE,
    STANDALONE_SYNC,
    gcs,
    managerToken,
    payload,
  )

  await payload.delete({ collection: 'users', id: admin.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: 'users', id: manager.id, overrideAccess: true, depth: 0 })
  await payload.destroy()
}

try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
