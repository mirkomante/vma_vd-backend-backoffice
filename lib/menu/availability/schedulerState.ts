import type { Payload } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'

export type SchedulerBoundaryState =
  | { kind: 'none' }
  | {
      kind: 'known'
      /** Ultimo confine registrato (baseline o ok). */
      boundaryIso: string
      boundaryInstant: Date
    }

export function parseBoundaryFromDetail(detail: string | null | undefined): Date | null {
  if (!detail) {
    return null
  }
  const match = /boundary=([^;\s]+)/.exec(detail)
  if (!match) {
    return null
  }
  const instant = new Date(match[1])
  if (Number.isNaN(instant.getTime())) {
    return null
  }
  return instant
}

export function formatBoundaryDetailSuffix(instant: Date, service: string, romeDate: string): string {
  return `boundary=${instant.toISOString()}; service=${service}; date=${romeDate}`
}

export async function loadSchedulerBoundaryState(payload: Payload): Promise<SchedulerBoundaryState> {
  const result = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 50,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      detail: { contains: 'availability-reset:' },
    },
  })

  for (const row of result.docs) {
    const detail = (row as { detail?: string | null }).detail
    if (!detail?.includes('availability-reset:')) {
      continue
    }
    const instant = parseBoundaryFromDetail(detail)
    if (!instant) {
      continue
    }
    return { kind: 'known', boundaryIso: instant.toISOString(), boundaryInstant: instant }
  }

  return { kind: 'none' }
}
