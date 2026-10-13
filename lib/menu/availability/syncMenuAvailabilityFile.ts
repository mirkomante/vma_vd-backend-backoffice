import type { Payload, PayloadRequest } from 'payload'

import { logSystemAction } from '@/lib/activityLog/logSystemAction'

import { buildAvailabilityDocument } from './buildAvailabilityDocument'
import { canonicalAvailabilityJson, parseAvailabilityJsonFromGcs } from './canonicalJson'
import { resolveAvailabilityStorage, serializeAvailabilityDocument } from './gcsAvailabilityWriter'
import { loadMenuAvailabilityState } from './loadMenuAvailabilityState'
import { assertValidAvailabilityDocument } from './validateAvailabilityDocument'

export type SyncMenuAvailabilityOptions = {
  req?: PayloadRequest
  /** Se true e il contenuto differisce da GCS, registra `availability-realigned`. */
  logRealignOnDiff?: boolean
}

export type SyncMenuAvailabilityResult = {
  skippedNoBucket: boolean
  skippedIdentical: boolean
  written: boolean
}

/**
 * Genera il file dallo stato CMS (con `req` negli hook per vedere la transazione aperta)
 * e lo scrive su GCS se il contenuto (senza `updatedAt`) differisce dall'oggetto remoto.
 *
 * Se la transazione DB viene annullata dopo l'hook, il file può restare avanti di una modifica
 * finché il job Scheduler (riconciliazione entro ~5 min) non riallinea.
 */
export async function syncMenuAvailabilityFile(
  payload: Payload,
  options: SyncMenuAvailabilityOptions = {},
): Promise<SyncMenuAvailabilityResult> {
  const storage = resolveAvailabilityStorage()
  if (!storage) {
    payload.logger.warn(
      'MENU_AVAILABILITY_GCS_BUCKET non impostato: scrittura di disponibilita.json saltata.',
    )
    return { skippedNoBucket: true, skippedIdentical: false, written: false }
  }

  const state = await loadMenuAvailabilityState(payload, options.req)
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
        return { skippedNoBucket: false, skippedIdentical: true, written: false }
      }
      hadRemoteDiff = true
    } else {
      hadRemoteDiff = true
    }
  }

  try {
    const json = serializeAvailabilityDocument(document)
    await storage.writeObject(json, 'application/json')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'errore sconosciuto'
    await logSystemAction(payload, {
      detail: `availability-write-failed: ${message.slice(0, 200)}`,
    })
    payload.logger.error({ err: error, msg: 'Scrittura disponibilita.json fallita' })
    return { skippedNoBucket: false, skippedIdentical: false, written: false }
  }

  if (options.logRealignOnDiff && hadRemoteDiff) {
    await logSystemAction(payload, { detail: 'availability-realigned: ok' })
  }

  return { skippedNoBucket: false, skippedIdentical: false, written: true }
}
