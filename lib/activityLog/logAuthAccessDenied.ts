import type { PayloadRequest } from 'payload'

import type { ActivityLogArea, ActivityLogMethod } from './constants'
import { logActivity } from './logActivity'

export async function logAuthAccessDenied(args: {
  req: PayloadRequest
  userId: number
  area?: ActivityLogArea
  method?: ActivityLogMethod
}): Promise<void> {
  const { req, userId, area, method } = args

  await logActivity(req, {
    user: userId,
    eventType: 'accessDenied',
    area,
    method,
  })
}
