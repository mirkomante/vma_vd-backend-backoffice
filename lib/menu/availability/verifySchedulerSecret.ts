import { timingSafeEqual } from 'node:crypto'

import {
  SCHEDULER_AVAILABILITY_SECRET_HEADER,
  SCHEDULER_SECRET_AVAILABILITY_ENV,
} from './constants'

function readHeaderSecret(req: { headers: Headers }): string | null {
  const value = req.headers.get(SCHEDULER_AVAILABILITY_SECRET_HEADER)
  if (!value) {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function secretsEqual(expected: string, provided: string): boolean {
  const expectedBuf = Buffer.from(expected, 'utf8')
  const providedBuf = Buffer.from(provided, 'utf8')
  if (expectedBuf.length !== providedBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf)
    return false
  }
  return timingSafeEqual(expectedBuf, providedBuf)
}

export type SchedulerSecretCheck =
  | { ok: true }
  | { ok: false; reason: 'missing-config' | 'missing-header' | 'invalid' }

export function checkSchedulerAvailabilitySecret(req: { headers: Headers }): SchedulerSecretCheck {
  const configured = process.env[SCHEDULER_SECRET_AVAILABILITY_ENV]?.trim()
  if (!configured) {
    return { ok: false, reason: 'missing-config' }
  }

  const provided = readHeaderSecret(req)
  if (!provided) {
    return { ok: false, reason: 'missing-header' }
  }

  if (!secretsEqual(configured, provided)) {
    return { ok: false, reason: 'invalid' }
  }

  return { ok: true }
}
