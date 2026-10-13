/**
 * Matrice REST (Global + piatto) con trace/mirror/debug sync su server dev.
 *
 * Server dev (es.):
 *   MENU_AVAILABILITY_IN_MEMORY=1 \
 *   MENU_AVAILABILITY_WRITE_TRACE_FILE=/tmp/vma-verify-menu-6_4-availability-writes.log \
 *   MENU_AVAILABILITY_MIRROR_FILE=/tmp/vma-verify-menu-6_4-availability.json \
 *   MENU_AVAILABILITY_SYNC_DEBUG_FILE=/tmp/vma-verify-menu-6_4-availability-sync.jsonl \
 *   MENU_AVAILABILITY_DEBUG_HOOK_READ=1 \
 *   [MENU_AVAILABILITY_DISABLE_STATE_OVERLAY=1] \
 *   pnpm dev
 *
 *   pnpm repro:menu-availability-rest-cause -- --base-url http://localhost:3000
 */
import { unlinkSync } from 'node:fs'
import { existsSync, readFileSync } from 'node:fs'

import config from '@payload-config'
import { getPayload } from 'payload'

import { DISH_CATEGORIES_SLUG, DISHES_SLUG, MENU_GENERAL_SLUG } from '@/lib/menu/constants'
import { dishAvailabilityStatus } from '@/lib/menu/availability/mapItemStatus'

import {
  availabilityMirrorContainsGlobalMessageIt,
  countAvailabilityWriteTraceLines,
  dishStatusInRawJson,
  readAvailabilityMirrorJson,
  restPatchDish,
  restPostMenuGeneral,
  signRestJwtAdmin,
  verifyMenu64AvailabilityMirrorPath,
  verifyMenu64AvailabilityTracePath,
} from './verify-menu-6_4-lib'

const SYNC_DEBUG_PATH =
  process.env.VERIFY_MENU_6_4_SYNC_DEBUG?.trim() ||
  '/tmp/vma-verify-menu-6_4-availability-sync.jsonl'

type SyncDebugLine = {
  msg: string
  origin: string
  outcome: string
  globalMessagePresent: boolean
}

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  if (idx === -1 || idx === process.argv.length - 1) {
    return undefined
  }
  return process.argv[idx + 1]
}

function readSyncDebugLines(): SyncDebugLine[] {
  if (!existsSync(SYNC_DEBUG_PATH)) {
    return []
  }
  return readFileSync(SYNC_DEBUG_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SyncDebugLine)
}

function lastSyncForOrigin(origin: string): SyncDebugLine | null {
  const lines = readSyncDebugLines().filter((l) => l.origin === origin)
  return lines.length > 0 ? lines[lines.length - 1]! : null
}

function clearLocalProbeFiles(): void {
  for (const path of [
    verifyMenu64AvailabilityTracePath(),
    verifyMenu64AvailabilityMirrorPath(),
    SYNC_DEBUG_PATH,
  ]) {
    if (existsSync(path)) {
      unlinkSync(path)
    }
  }
}

async function main(): Promise<void> {
  const baseUrl = (parseArg('--base-url') ?? process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  )
  const runId = Date.now().toString(36)
  const overlayLabel =
    '(leggere overlay sul processo server: MENU_AVAILABILITY_DISABLE_STATE_OVERLAY=1 → OFF)'

  clearLocalProbeFiles()

  const payload = await getPayload({ config })
  const adminEmail = `repro-cause-admin-${runId}@example.test`
  const adminUser = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: adminEmail,
      adminRole: 'admin',
      appRole: 'none',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  const managerEmail = `repro-cause-mgr-${runId}@example.test`
  const managerUser = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: managerEmail,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })

  const adminToken = await signRestJwtAdmin(payload, adminUser as never)
  const managerToken = await signRestJwtAdmin(payload, managerUser as never)

  const cat = await payload.create({
    collection: DISH_CATEGORIES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: { name: `ReproCause Cat ${runId}` },
  })
  const dish = await payload.create({
    collection: DISHES_SLUG,
    locale: 'it',
    depth: 0,
    overrideAccess: true,
    data: {
      name: `ReproCause Dish ${runId}`,
      price: 12,
      category: cat.id,
      soldOut: false,
      disabled: false,
    },
  })

  const tracePath = verifyMenu64AvailabilityTracePath()
  const mirrorPath = verifyMenu64AvailabilityMirrorPath()
  const msgIt = `ReproCause global ${runId}`

  const traceBeforeGlobal = countAvailabilityWriteTraceLines(tracePath)
  const globalRes = await restPostMenuGeneral(baseUrl, adminToken, { globalMessage: msgIt }, 'it')
  const globalWrites = countAvailabilityWriteTraceLines(tracePath) - traceBeforeGlobal
  const globalSync = lastSyncForOrigin(`global:${MENU_GENERAL_SLUG}`)

  const traceBeforeSoldOut = countAvailabilityWriteTraceLines(tracePath)
  const soldOutRes = await restPatchDish(baseUrl, managerToken, dish.id, { soldOut: true }, 'it')
  const soldOutWrites = countAvailabilityWriteTraceLines(tracePath) - traceBeforeSoldOut
  const soldOutSync = lastSyncForOrigin(`collection:${DISHES_SLUG}`)
  const dishAfterSoldOut = await payload.findByID({
    collection: DISHES_SLUG,
    id: dish.id,
    depth: 0,
    overrideAccess: true,
  })
  const mirrorAfterSoldOut = readAvailabilityMirrorJson(mirrorPath)
  const statusAfterSoldOut = dishStatusInRawJson(mirrorAfterSoldOut, dish.id)

  const traceBeforeDisabled = countAvailabilityWriteTraceLines(tracePath)
  const disabledRes = await restPatchDish(baseUrl, managerToken, dish.id, { disabled: true }, 'it')
  const disabledWrites = countAvailabilityWriteTraceLines(tracePath) - traceBeforeDisabled
  const disabledSync = lastSyncForOrigin(`collection:${DISHES_SLUG}`)
  const dishAfterDisabled = await payload.findByID({
    collection: DISHES_SLUG,
    id: dish.id,
    depth: 0,
    overrideAccess: true,
  })
  const mirrorAfterDisabled = readAvailabilityMirrorJson(mirrorPath)
  const statusAfterDisabled = dishStatusInRawJson(mirrorAfterDisabled, dish.id)

  const report = {
    baseUrl,
    overlayLabel,
    global: {
      httpStatus: globalRes.status,
      traceWrites: globalWrites,
      inMirror: availabilityMirrorContainsGlobalMessageIt(mirrorAfterDisabled, msgIt),
      technicalLog: globalSync,
    },
    dishSoldOut: {
      httpStatus: soldOutRes.status,
      traceWrites: soldOutWrites,
      statusInMirror: statusAfterSoldOut,
      expectedStatus: dishAvailabilityStatus(dishAfterSoldOut as never),
      technicalLog: soldOutSync,
    },
    dishDisabled: {
      httpStatus: disabledRes.status,
      traceWrites: disabledWrites,
      statusInMirror: statusAfterDisabled,
      expectedStatus: dishAvailabilityStatus(dishAfterDisabled as never),
      technicalLog: disabledSync,
    },
    syncDebugPath: SYNC_DEBUG_PATH,
  }

  console.log(JSON.stringify(report, null, 2))

  await payload.delete({ collection: DISHES_SLUG, id: dish.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: DISH_CATEGORIES_SLUG, id: cat.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: 'users', id: adminUser.id, overrideAccess: true, depth: 0 })
  await payload.delete({ collection: 'users', id: managerUser.id, overrideAccess: true, depth: 0 })
  await payload.destroy()
}

try {
  await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`repro-menu-availability-rest-cause fallito: ${message}`)
  process.exit(1)
}
