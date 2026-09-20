import type { PayloadRequest } from 'payload'

import {
  ACTIVITY_LOG_SLUG,
  type ActivityLogArea,
  type ActivityLogEventType,
  type ActivityLogMethod,
} from './constants'

export type ActivityLogWriteData = {
  user: number
  eventType: ActivityLogEventType
  area?: ActivityLogArea
  method?: ActivityLogMethod
  collection?: string
  documentId?: string
}

/**
 * Unico punto di scrittura su `activityLog`. Gli hook e gli endpoint auth
 * passano da qui; errori di logging non devono bloccare il flusso di login.
 */
export async function logActivity(
  req: PayloadRequest,
  data: ActivityLogWriteData,
): Promise<void> {
  try {
    await req.payload.create({
      collection: ACTIVITY_LOG_SLUG,
      data,
      overrideAccess: true,
      req,
    })
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: 'Scrittura activityLog fallita',
    })
  }
}
