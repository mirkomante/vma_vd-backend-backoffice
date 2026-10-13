import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type { CollectionSlug, Payload } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import {
  SCHEDULER_AVAILABILITY_SECRET_HEADER,
  SCHEDULER_FORBIDDEN_RESPONSE_BODY,
  SCHEDULER_OK_RESPONSE_BODY,
  SCHEDULER_SECRET_AVAILABILITY_ENV,
  SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY,
} from '@/lib/menu/availability/constants'
import { dishAvailabilityStatus } from '@/lib/menu/availability/mapItemStatus'
import type { MemoryAvailabilityStorage } from '@/lib/menu/availability/testMemoryStorage'
import { checkSchedulerAvailabilitySecret } from '@/lib/menu/availability/verifySchedulerSecret'
import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_CONTENT_SLUGS,
  MENU_GENERAL_SLUG,
  MENU_SERVICES_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

export const VERIFY_RESULTS: { check: string; outcome: string }[] = []

export function record(check: string, outcome: string): void {
  VERIFY_RESULTS.push({ check, outcome })
  console.log(`VERIFY_6_4|${check}|${outcome}`)
}

export function appPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export async function assertDevServerReachable(): Promise<void> {
  const url = `${appPublicUrl()}/`
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'manual' })
    if (res.status >= 200 && res.status < 500) {
      record('dev server raggiungibile', `sì (GET / → ${res.status})`)
      return
    }
    throw new Error(`status ${res.status}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(
      '\n*** ERRORE: server di sviluppo non raggiungibile. Avviare `pnpm dev` oppure impostare VERIFY_MENU_6_4_SKIP_DEV=1 (solo debug, NON per commit). ***\n',
    )
    record('dev server raggiungibile', `no (${message})`)
    throw new Error(`Dev server non raggiungibile su ${url}`)
  }
}

export async function countCollection(payload: Payload, slug: CollectionSlug): Promise<number> {
  const result = await payload.find({ collection: slug, depth: 0, limit: 1, overrideAccess: true })
  return result.totalDocs
}

export const TRACKED_COLLECTIONS: CollectionSlug[] = [
  ...MENU_CONTENT_SLUGS,
  DISH_CATEGORIES_SLUG,
  ACTIVITY_LOG_SLUG,
]

export async function snapshotCounts(
  payload: Payload,
): Promise<Record<string, number | string>> {
  const out: Record<string, number | string> = {}
  for (const slug of TRACKED_COLLECTIONS) {
    out[slug] = await countCollection(payload, slug)
  }
  const globalDoc = await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  out[`global:${MENU_GENERAL_SLUG}`] = createHash('sha256')
    .update(JSON.stringify(globalDoc))
    .digest('hex')
    .slice(0, 16)
  return out
}

export function dishStatusInRawJson(raw: string | null, dishId: number | string): string | null {
  if (!raw) {
    return null
  }
  const doc = JSON.parse(raw) as {
    dishes?: Record<string, { status?: string } | string>
  }
  const entry = doc.dishes?.[String(dishId)]
  if (entry == null) {
    return null
  }
  if (typeof entry === 'string') {
    return entry
  }
  return entry.status ?? null
}

export function assertDishStatusMatchesDb(
  raw: string | null,
  dishId: number | string,
  doc: { disabled?: boolean | null; soldOut?: boolean | null },
): void {
  const inFile = dishStatusInRawJson(raw, dishId)
  const expected = dishAvailabilityStatus(doc)
  if (inFile !== expected) {
    throw new Error(`File=${inFile} DB→${expected} per piatto ${dishId}`)
  }
}

export function extractPayloadTokenFromSetCookie(res: Response): string {
  const rawCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie')].filter((c): c is string => Boolean(c))

  for (const chunk of rawCookies) {
    const match = /(?:^|,\s*)payload-token=([^;]+)/.exec(chunk)
    if (match?.[1]) {
      return decodeURIComponent(match[1])
    }
  }
  throw new Error('Risposta login: cookie payload-token assente')
}

export async function postScheduler(
  secret: string | null,
  headerName = SCHEDULER_AVAILABILITY_SECRET_HEADER,
): Promise<{ status: number; body: string }> {
  const headers: Record<string, string> = {}
  if (secret !== null) {
    headers[headerName] = secret
  }
  const res = await fetch(`${appPublicUrl()}/api/menu/availability-scheduler`, {
    method: 'POST',
    headers,
  })
  return { status: res.status, body: await res.text() }
}

export function forbiddenInProcess(reason: 'missing-config' | 'missing-header' | 'invalid'): void {
  const prev = process.env[SCHEDULER_SECRET_AVAILABILITY_ENV]
  if (reason === 'missing-config') {
    delete process.env[SCHEDULER_SECRET_AVAILABILITY_ENV]
  } else {
    process.env[SCHEDULER_SECRET_AVAILABILITY_ENV] = 'verify-6_4-secret-with-exact-length-48chars!!'
  }
  try {
    const headers = new Headers()
    if (reason === 'missing-header') {
      // empty
    } else if (reason === 'invalid') {
      headers.set(SCHEDULER_AVAILABILITY_SECRET_HEADER, 'wrong')
    } else {
      headers.set(
        SCHEDULER_AVAILABILITY_SECRET_HEADER,
        'verify-6_4-secret-with-exact-length-48chars!!',
      )
    }
    const auth = checkSchedulerAvailabilitySecret({ headers })
    if (auth.ok) {
      throw new Error(`Atteso rifiuto per ${reason}`)
    }
    record(
      `endpoint auth in-process (${reason})`,
      `rifiuto (${auth.reason}) corpo atteso ${SCHEDULER_FORBIDDEN_RESPONSE_BODY}`,
    )
  } finally {
    if (prev === undefined) {
      delete process.env[SCHEDULER_SECRET_AVAILABILITY_ENV]
    } else {
      process.env[SCHEDULER_SECRET_AVAILABILITY_ENV] = prev
    }
  }
}

export function wrapStorageFailingOnWrite(
  inner: MemoryAvailabilityStorage,
): MemoryAvailabilityStorage {
  return {
    readCurrentObject: () => inner.readCurrentObject(),
    async writeObject(): Promise<void> {
      throw new Error('verify-6_4 simulated GCS write failure')
    },
    getWriteCount: () => inner.getWriteCount(),
    getRawContent: () => inner.getRawContent(),
    reset: () => inner.reset(),
    resetWriteCount: () => inner.resetWriteCount(),
  }
}

export const importBulkContext = { [SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY]: true }

export function defaultSnapshotPath(): string {
  return process.env.MENU_6_4_SNAPSHOT_PATH ?? join(homedir(), 'vtn-export-2026-10-12')
}

export function snapshotExists(): boolean {
  return existsSync(defaultSnapshotPath())
}

/** Impronta contenuto (senza id/date; relazioni per nome) — aggiornare da verify dopo roundtrip su snapshot 6.8. */
export const EXPECTED_IMPORT_CONTENT_HASH =
  '16601c1c331986ee40398f3c3451c00785c12254de99834d86290593215d3c60'

export function formatSetCookieForLog(res: Response): string {
  const raw =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie')].filter((c): c is string => Boolean(c))
  return raw
    .map((chunk) => chunk.replace(/payload-token=[^;]+/gi, 'payload-token=<redacted>'))
    .join(' | ')
}

export const SCHEDULER_OK = SCHEDULER_OK_RESPONSE_BODY
export const SCHEDULER_FORBIDDEN = SCHEDULER_FORBIDDEN_RESPONSE_BODY
