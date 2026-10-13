import type { Payload } from 'payload'

import { logSystemAction } from '@/lib/activityLog/logSystemAction'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'

import {
  listServiceStartBoundariesBetween,
  maxBoundaryAtOrBefore,
  type ServiceHoursRow,
} from './serviceBoundaries'
import { formatBoundaryDetailSuffix, loadSchedulerBoundaryState } from './schedulerState'
import { resetAllDishesSoldOut } from './resetDishesSoldOut'
import { syncMenuAvailabilityFile } from './syncMenuAvailabilityFile'

export function serviceRowsFromGlobal(global: unknown): ServiceHoursRow[] {
  const services = (global as { services?: ServiceHoursRow[] | null }).services
  if (!Array.isArray(services)) {
    return []
  }
  return services.filter(
    (row): row is ServiceHoursRow =>
      row !== null &&
      typeof row === 'object' &&
      (row.name === 'lunch' || row.name === 'dinner') &&
      typeof row.startTime === 'string' &&
      typeof row.endTime === 'string',
  )
}

export type SchedulerTickResult = {
  resetPerformed: boolean
  baselineRecorded: boolean
  realigned: boolean
}

export async function runSchedulerAvailabilityTick(
  payload: Payload,
  now: Date,
): Promise<SchedulerTickResult> {
  const settings = await payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  const services = serviceRowsFromGlobal(settings)

  const syncResult = await syncMenuAvailabilityFile(payload, { logRealignOnDiff: true })
  const realigned = syncResult.written

  const state = await loadSchedulerBoundaryState(payload)

  if (state.kind === 'none') {
    const lastPassed = maxBoundaryAtOrBefore(now, services)
    if (!lastPassed) {
      return { resetPerformed: false, baselineRecorded: false, realigned }
    }
    await logSystemAction(payload, {
      detail: `availability-reset: baseline; ${formatBoundaryDetailSuffix(
        lastPassed.instant,
        lastPassed.service,
        lastPassed.romeDate,
      )}`,
    })
    return { resetPerformed: false, baselineRecorded: true, realigned }
  }

  const boundaries = listServiceStartBoundariesBetween(
    state.boundaryInstant,
    now,
    services,
  )

  if (boundaries.length === 0) {
    return { resetPerformed: false, baselineRecorded: false, realigned }
  }

  const lastBoundary = boundaries[boundaries.length - 1]
  const cleared = await resetAllDishesSoldOut(payload)
  await logSystemAction(payload, {
    detail: `availability-reset: ok; ${formatBoundaryDetailSuffix(
      lastBoundary.instant,
      lastBoundary.service,
      lastBoundary.romeDate,
    )}; cleared=${cleared}`,
  })

  return { resetPerformed: true, baselineRecorded: false, realigned }
}
