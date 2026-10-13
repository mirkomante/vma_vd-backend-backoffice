import { appendFile } from 'node:fs/promises'

import type { Payload } from 'payload'

const MENU_AVAILABILITY_SYNC_DEBUG_FILE_ENV = 'MENU_AVAILABILITY_SYNC_DEBUG_FILE'

export type AvailabilitySyncOutcome =
  | 'written'
  | 'identical'
  | 'no-bucket'
  | 'write-failed'

/** Registro tecnico Cloud Logging (ADR-115 §7): niente contenuto messaggi né segreti. */
export function logAvailabilitySyncTechnical(
  payload: Payload,
  origin: string,
  outcome: AvailabilitySyncOutcome,
  globalMessagePresent: boolean,
): void {
  payload.logger.info({
    msg: 'menu-availability-sync',
    origin,
    outcome,
    globalMessagePresent,
  })

  if (process.env.NODE_ENV === 'production') {
    return
  }
  const debugPath = process.env[MENU_AVAILABILITY_SYNC_DEBUG_FILE_ENV]?.trim()
  if (!debugPath) {
    return
  }
  void appendFile(
    debugPath,
    `${JSON.stringify({ msg: 'menu-availability-sync', origin, outcome, globalMessagePresent })}\n`,
    'utf8',
  ).catch(() => {
    /* best effort — solo prove locali */
  })
}

export function formatAvailabilitySyncOrigin(origin: AvailabilitySyncOrigin): string {
  if (origin.kind === 'global') {
    return `global:${origin.slug}`
  }
  if (origin.kind === 'collection') {
    return `collection:${origin.slug}`
  }
  if (origin.kind === 'job') {
    return 'job:availability-scheduler'
  }
  return 'manual'
}

export type AvailabilitySyncOrigin =
  | { kind: 'global'; slug: string }
  | { kind: 'collection'; slug: string }
  | { kind: 'job' }
  | { kind: 'manual' }
