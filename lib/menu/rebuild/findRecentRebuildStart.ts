import type { Payload } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'

import { REBUILD_STARTED_DETAIL_PREFIX } from './constants'
import { isWithinRebuildDebounceWindow, parseRebuildStartedBuildId } from './rebuildDebounce'

export type RecentRebuildStart = {
  detail: string
  createdAt: Date
  buildId: string
}

export async function findRecentRebuildStart(
  payload: Payload,
  now: Date,
  windowMs: number,
): Promise<RecentRebuildStart | null> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { eventType: { equals: 'systemAction' } },
        { detail: { contains: REBUILD_STARTED_DETAIL_PREFIX } },
      ],
    },
  })

  const row = found.docs[0] as { detail?: string | null; createdAt?: string } | undefined
  if (!row?.detail || !row.detail.startsWith(REBUILD_STARTED_DETAIL_PREFIX)) {
    return null
  }

  const createdAt = row.createdAt ? new Date(row.createdAt) : null
  if (!createdAt || Number.isNaN(createdAt.getTime())) {
    return null
  }

  if (!isWithinRebuildDebounceWindow(createdAt, now, windowMs)) {
    return null
  }

  const buildId = parseRebuildStartedBuildId(row.detail)
  if (!buildId) {
    return null
  }

  return {
    detail: row.detail,
    createdAt,
    buildId,
  }
}