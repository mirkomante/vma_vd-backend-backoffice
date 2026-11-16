import type { Payload, PayloadRequest } from 'payload'
import type { User } from '@/payload-types'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { REBUILD_STARTED_DETAIL_PREFIX } from '@/lib/menu/rebuild/constants'

export const VERIFY_6_5_EMAIL_PREFIX = 'verify-6_5-'

export type VerifyRecord = { ok: boolean; label: string; detail: string }

const results: VerifyRecord[] = []

export function record(label: string, detail: string, ok = true): void {
  results.push({ ok, label, detail })
  console.log(`${ok ? 'OK' : 'FALLITO'}: ${label} — ${detail}`)
}

export function getVerifyRecords(): VerifyRecord[] {
  return results
}

export function makePayloadRequest(payload: Payload, user?: User | null): PayloadRequest {
  return {
    payload,
    user: user
      ? (Object.assign({ ...user, collection: 'users' as const }) as PayloadRequest['user'])
      : undefined,
    headers: new Headers(),
  } as PayloadRequest
}

export async function countRebuildStartedRows(
  payload: Payload,
  detailNeedle?: string,
): Promise<number> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 200,
    overrideAccess: true,
    where: {
      and: [
        { eventType: { equals: 'systemAction' } },
        { detail: { contains: REBUILD_STARTED_DETAIL_PREFIX } },
        ...(detailNeedle ? [{ detail: { contains: detailNeedle } }] : []),
      ],
    },
  })
  return found.totalDocs
}

export async function deleteVerifyRebuildStartedRows(payload: Payload): Promise<void> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 200,
    overrideAccess: true,
    where: {
      and: [
        { eventType: { equals: 'systemAction' } },
        { detail: { contains: REBUILD_STARTED_DETAIL_PREFIX } },
      ],
    },
  })
  for (const row of found.docs) {
    const detail = (row as { detail?: string }).detail ?? ''
    if (detail.includes('fake-build-') || detail.includes(VERIFY_6_5_EMAIL_PREFIX)) {
      await payload.delete({
        collection: ACTIVITY_LOG_SLUG,
        id: row.id,
        depth: 0,
        overrideAccess: true,
      })
    }
  }
}