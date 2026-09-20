import type { PayloadRequest, TypedUser } from 'payload'

import {
  GOOGLE_ADMIN_STRATEGY,
  GOOGLE_APP_STRATEGY,
} from '@/lib/auth/googleOAuth/constants'
import { getOAuthLoginArea } from '@/lib/auth/googleOAuth/areas'
import {
  LOCAL_JWT_STRATEGY_ADMIN,
  LOCAL_JWT_STRATEGY_APP,
} from '@/lib/auth/localLogin/constants'

import type { ActivityLogArea, ActivityLogMethod } from './constants'

/** Alias storico: login locale Admin (2.7). Preferire `LOCAL_JWT_STRATEGY_ADMIN`. */
export const LOCAL_JWT_STRATEGY = LOCAL_JWT_STRATEGY_ADMIN

export type ResolvedAuthContext = {
  area?: ActivityLogArea
  method?: ActivityLogMethod
}

function readAuthStrategy(user: TypedUser | null | undefined): string | undefined {
  if (!user || typeof user !== 'object') {
    return undefined
  }
  const strategy = (user as TypedUser & { _strategy?: unknown })._strategy
  return typeof strategy === 'string' ? strategy : undefined
}

export function resolveAuthContext(
  req: PayloadRequest,
  user?: TypedUser | null,
): ResolvedAuthContext {
  const strategy = readAuthStrategy(user) ?? readAuthStrategy(req.user)
  if (typeof strategy === 'string') {
    if (strategy === LOCAL_JWT_STRATEGY_ADMIN) {
      return { area: 'admin', method: 'local' }
    }
    if (strategy === LOCAL_JWT_STRATEGY_APP) {
      return { area: 'app', method: 'local' }
    }
    if (strategy === GOOGLE_ADMIN_STRATEGY) {
      return { area: 'admin', method: 'sso' }
    }
    if (strategy === GOOGLE_APP_STRATEGY) {
      return { area: 'app', method: 'sso' }
    }
  }

  const areaFromOAuth = getOAuthLoginArea(req)
  if (areaFromOAuth) {
    return { area: areaFromOAuth, method: 'sso' }
  }

  return {}
}
