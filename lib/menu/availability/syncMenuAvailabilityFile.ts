import type { Payload, PayloadRequest } from 'payload'

import { logSystemAction } from '@/lib/activityLog/logSystemAction'

import {
  formatAvailabilitySyncOrigin,
  logAvailabilitySyncTechnical,
  type AvailabilitySyncOrigin,
} from './availabilitySyncTechnicalLog'
import { buildAvailabilityDocument } from './buildAvailabilityDocument'
import { canonicalAvailabilityJson, parseAvailabilityJsonFromGcs } from './canonicalJson'
import { resolveAvailabilityStorage, serializeAvailabilityDocument } from './gcsAvailabilityWriter'
import { loadMenuAvailabilityState } from './loadMenuAvailabilityState'
import type { MenuAvailabilityStateOverlay } from './stateOverlay'
import { assertValidAvailabilityDocument } from './validateAvailabilityDocument'

export type SyncMenuAvailabilityOptions = {
  req?: PayloadRequest
  /** Se true e il contenuto differisce da GCS, registra `availability-realigned`. */
  logRealignOnDiff?: boolean
  stateOverlay?: MenuAvailabilityStateOverlay
  origin?: AvailabilitySyncOrigin
}

export type SyncMenuAvailabilityResult = {
  skippedNoBucket: boolean
  skippedIdentical: boolean
  written: boolean
}

function globalMessagePresent(state: {
  globalMessageIt: string
  globalMessageEn: string
}): boolean {
  return Boolean(state.globalMessageIt.trim() || state.globalMessageEn.trim())
}

async function logWriteFailed(payload: Payload, error: unknown, originLabel: string): Promise<void> {
  const message = error instanceof Error ? error.message : 'errore sconosciuto'
  const short = message.slice(0, 200)
  await logSystemAction(payload, {
    detail: `availability-write-failed: ${short}`,
  })
  logAvailabilitySyncTechnical(payload, originLabel, 'write-failed', false)
  payload.logger.error({ err: error, msg: 'Scrittura disponibilita.json fallita' })
}

/**
 * Genera il file dallo stato CMS e lo scrive su GCS se il contenuto (senza `updatedAt`) differisce dall'oggetto remoto.
 */
export async function syncMenuAvailabilityFile(
  payload: Payload,
  options: SyncMenuAvailabilityOptions = {},
): Promise<SyncMenuAvailabilityResult> {
  const originLabel = options.origin ? formatAvailabilitySyncOrigin(options.origin) : 'manual'

  try {
    const storage = resolveAvailabilityStorage()
    if (!storage) {
      payload.logger.warn(
        'MENU_AVAILABILITY_GCS_BUCKET non impostato: scrittura di disponibilita.json saltata.',
      )
      logAvailabilitySyncTechnical(payload, originLabel, 'no-bucket', false)
      return { skippedNoBucket: true, skippedIdentical: false, written: false }
    }

    const state = await loadMenuAvailabilityState(payload, options.req, options.stateOverlay)
    const gmPresent = globalMessagePresent(state)
    const generatedAt = new Date()
    const document = buildAvailabilityDocument(state, generatedAt)
    assertValidAvailabilityDocument(document)
    const remoteText = await storage.readCurrentObject()
    const desiredCanonical = canonicalAvailabilityJson(document)

    let hadRemoteDiff = false
    if (remoteText) {
      const remoteDoc = parseAvailabilityJsonFromGcs(remoteText)
      if (remoteDoc) {
        const remoteCanonical = canonicalAvailabilityJson(remoteDoc)
        if (remoteCanonical === desiredCanonical) {
          logAvailabilitySyncTechnical(payload, originLabel, 'identical', gmPresent)
          return { skippedNoBucket: false, skippedIdentical: true, written: false }
        }
        hadRemoteDiff = true
      } else {
        hadRemoteDiff = true
      }
    }

    const json = serializeAvailabilityDocument(document)
    await storage.writeObject(json, 'application/json')

    if (options.logRealignOnDiff && hadRemoteDiff) {
      await logSystemAction(payload, { detail: 'availability-realigned: ok' })
    }

    logAvailabilitySyncTechnical(payload, originLabel, 'written', gmPresent)
    return { skippedNoBucket: false, skippedIdentical: false, written: true }
  } catch (error) {
    await logWriteFailed(payload, error, originLabel)
    return { skippedNoBucket: false, skippedIdentical: false, written: false }
  }
}
