import type { Endpoint, PayloadRequest } from 'payload'

import { logSystemAction } from '@/lib/activityLog/logSystemAction'
import { asUserAccessFields } from '@/lib/auth/userAccess'
import { canAccessSection } from '@/lib/auth/canAccessSection'

import { runMenuRebuildCloudBuildTrigger } from './cloudBuildClient'
import {
  MENU_REBUILD_DEBOUNCE_MS,
  MENU_REBUILD_ENDPOINT_PATH,
  MENU_REBUILD_TRIGGER_NAME_ENV,
  REBUILD_STARTED_DETAIL_PREFIX,
} from './constants'
import { findRecentRebuildStart } from './findRecentRebuildStart'

type JsonStatus =
  | 'unauthorized'
  | 'forbidden'
  | 'unavailable'
  | 'already-started'
  | 'error'
  | 'started'

type MenuRebuildHandlerDeps = {
  getNow: () => Date
  runTrigger: (triggerResourceName: string) => Promise<{ buildId: string }>
}

const defaultHandlerDeps: MenuRebuildHandlerDeps = {
  getNow: () => new Date(),
  runTrigger: runMenuRebuildCloudBuildTrigger,
}

let handlerDeps: MenuRebuildHandlerDeps = defaultHandlerDeps

export function setMenuRebuildHandlerDepsForTests(
  overrides: Partial<MenuRebuildHandlerDeps> | null,
): void {
  if (!overrides) {
    handlerDeps = defaultHandlerDeps
    return
  }
  handlerDeps = { ...defaultHandlerDeps, ...overrides }
}

function jsonResponse(status: JsonStatus, httpStatus: number, extra?: { buildId?: string }): Response {
  return new Response(
    JSON.stringify({
      status,
      ...(extra?.buildId !== undefined ? { buildId: extra.buildId } : {}),
    }),
    {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

export async function handleMenuRebuildPost(req: PayloadRequest): Promise<Response> {
  const userFields = asUserAccessFields(req.user)
  if (!userFields) {
    return jsonResponse('unauthorized', 401)
  }

  if (!canAccessSection(userFields, 'menu')) {
    return jsonResponse('forbidden', 403)
  }

  const triggerName = process.env[MENU_REBUILD_TRIGGER_NAME_ENV]?.trim()
  if (!triggerName) {
    req.payload.logger.error(
      `${MENU_REBUILD_TRIGGER_NAME_ENV} non configurato: endpoint rebuild rifiutato con 503.`,
    )
    return jsonResponse('unavailable', 503)
  }

  const now = handlerDeps.getNow()
  const recent = await findRecentRebuildStart(req.payload, now, MENU_REBUILD_DEBOUNCE_MS)
  if (recent) {
    return jsonResponse('already-started', 200)
  }

  let buildId: string
  try {
    const outcome = await handlerDeps.runTrigger(triggerName)
    buildId = outcome.buildId
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Avvio rebuild menù: chiamata Cloud Build fallita' })
    return jsonResponse('error', 502)
  }

  await logSystemAction(req, {
    detail: `${REBUILD_STARTED_DETAIL_PREFIX} ${buildId}`,
  })

  return jsonResponse('started', 202, { buildId })
}

async function handler(req: PayloadRequest): Promise<Response> {
  return handleMenuRebuildPost(req)
}

export function createMenuRebuildEndpoint(): Endpoint {
  return {
    method: 'post',
    path: MENU_REBUILD_ENDPOINT_PATH,
    handler,
  }
}