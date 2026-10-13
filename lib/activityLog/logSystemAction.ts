import type { Payload, PayloadRequest } from 'payload'

import { ACTIVITY_LOG_SLUG } from './constants'

export type SystemActionLogInput = {
  detail: string
  collection?: string
  documentId?: string
}

/**
 * Unico punto di scrittura per voci `systemAction` (ADR-115).
 * Gli errori di logging non devono bloccare il flusso chiamante.
 */
export async function logSystemAction(
  payloadOrReq: Payload | PayloadRequest,
  input: SystemActionLogInput,
): Promise<void> {
  const payload = 'payload' in payloadOrReq ? payloadOrReq.payload : payloadOrReq
  const req = 'payload' in payloadOrReq ? payloadOrReq : undefined

  try {
    await payload.create({
      collection: ACTIVITY_LOG_SLUG,
      data: {
        eventType: 'systemAction',
        detail: input.detail,
        ...(input.collection ? { collection: input.collection } : {}),
        ...(input.documentId ? { documentId: input.documentId } : {}),
      },
      depth: 0,
      overrideAccess: true,
      req,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Scrittura systemAction su activityLog fallita' })
  }
}
