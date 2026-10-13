import type { Endpoint, PayloadRequest } from 'payload'

import {
  SCHEDULER_FORBIDDEN_RESPONSE_BODY,
  SCHEDULER_OK_RESPONSE_BODY,
} from './constants'
import { runSchedulerAvailabilityTick } from './runSchedulerTick'
import { checkSchedulerAvailabilitySecret } from './verifySchedulerSecret'

function forbiddenResponse(): Response {
  return new Response(SCHEDULER_FORBIDDEN_RESPONSE_BODY, {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}

function okResponse(): Response {
  return new Response(SCHEDULER_OK_RESPONSE_BODY, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function handler(req: PayloadRequest): Promise<Response> {
  const auth = checkSchedulerAvailabilitySecret(req)
  if (!auth.ok) {
    if (auth.reason === 'missing-config') {
      req.payload.logger.error(
        'SCHEDULER_SECRET_AVAILABILITY non configurato: endpoint disponibilità rifiutato.',
      )
    }
    return forbiddenResponse()
  }

  await runSchedulerAvailabilityTick(req.payload, new Date())
  return okResponse()
}

export function createMenuAvailabilitySchedulerEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/menu/availability-scheduler',
    handler,
  }
}
