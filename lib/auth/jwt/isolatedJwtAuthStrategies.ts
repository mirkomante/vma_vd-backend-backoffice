import { jwtVerify } from 'jose'
import type { PluginTypes } from 'payload-oauth2'
import type { AuthStrategy, TypedUser } from 'payload'
import { extractJWT } from 'payload'

import { GOOGLE_ADMIN_STRATEGY, GOOGLE_APP_STRATEGY } from '@/lib/auth/googleOAuth/constants'
import {
  LOCAL_JWT_STRATEGY_ADMIN,
  LOCAL_JWT_STRATEGY_APP,
} from '@/lib/auth/localLogin/constants'

import { jwtSessionStrategyMatches, readSessionStrategyClaim } from './sessionStrategyClaim'

const USERS_SLUG = 'users' as const

async function decodeJwtPayload(
  token: string,
  secret: string,
): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ['HS256'],
    })
    if (payload && typeof payload === 'object') {
      return payload as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

async function loadUserById(
  payload: PayloadRequest['payload'],
  id: string | number,
): Promise<(TypedUser & { collection: string }) | null> {
  const collectionConfig = payload.collections[USERS_SLUG]?.config
  if (!collectionConfig) {
    return null
  }

  const user = await payload.findByID({
    id,
    collection: USERS_SLUG,
    depth: collectionConfig.auth && typeof collectionConfig.auth === 'object' ? collectionConfig.auth.depth : 0,
    disableErrors: true,
  })

  if (!user) {
    return null
  }

  if (
    typeof collectionConfig.auth === 'object' &&
    collectionConfig.auth.verify &&
    !(user as { _verified?: boolean })._verified
  ) {
    return null
  }

  return { ...user, collection: USERS_SLUG } as TypedUser & { collection: string }
}

function getJwtUserId(jwtPayload: Record<string, unknown>): string | number | undefined {
  const userID = jwtPayload.id
  return typeof userID === 'string' || typeof userID === 'number' ? userID : undefined
}

/**
 * Stessa logica di payload-oauth2, ma rifiuta token emessi da un'altra istanza/flusso
 * (claim `strategy` nel JWT).
 */
export function createIsolatedOAuthJwtAuthStrategy(
  pluginOptions: PluginTypes,
  options: { acceptJwtWithoutStrategyClaim?: boolean },
): AuthStrategy {
  const expectedStrategy = pluginOptions.strategyName
  const acceptMissing = options.acceptJwtWithoutStrategyClaim ?? false
  const useEmailAsIdentity = pluginOptions.useEmailAsIdentity ?? false
  const subFieldName = pluginOptions.subField?.name || pluginOptions.subFieldName || 'sub'

  return {
    name: expectedStrategy,
    authenticate: async ({ headers, payload }) => {
      try {
        const token = extractJWT({ headers, payload })
        if (!token) {
          return { user: null }
        }

        const jwtPayload = await decodeJwtPayload(token, payload.secret)
        if (!jwtPayload) {
          return { user: null }
        }

        if (!jwtSessionStrategyMatches(jwtPayload, expectedStrategy, acceptMissing)) {
          return { user: null }
        }

        const userCollection =
          (typeof jwtPayload.collection === 'string' && jwtPayload.collection) ||
          pluginOptions.authCollection ||
          USERS_SLUG

        if (userCollection !== USERS_SLUG) {
          return { user: null }
        }

        let user: TypedUser | null = null

        if (useEmailAsIdentity) {
          const email = jwtPayload.email
          if (typeof email !== 'string' || email.length === 0) {
            return { user: null }
          }
          const usersQuery = await payload.find({
            collection: USERS_SLUG,
            limit: 1,
            where: { email: { equals: email } },
          })
          user = (usersQuery.docs[0] as TypedUser | undefined) ?? null
        } else {
          const providerSubject = jwtPayload[subFieldName]
          if (typeof providerSubject !== 'string' || providerSubject.length === 0) {
            return { user: null }
          }
          const usersQuery = await payload.find({
            collection: USERS_SLUG,
            limit: 1,
            where: { [subFieldName]: { equals: providerSubject } },
          })
          user = (usersQuery.docs[0] as TypedUser | undefined) ?? null
        }

        if (!user) {
          return { user: null }
        }

        user.collection = USERS_SLUG
        user._strategy = readSessionStrategyClaim(jwtPayload) ?? expectedStrategy
        return { user }
      } catch (error) {
        payload.logger.error(error)
        return { user: null }
      }
    },
  }
}

export function createIsolatedLocalJwtAuthStrategy(strategyName: string): AuthStrategy {
  return {
    name: strategyName,
    authenticate: async ({ headers, payload }) => {
      try {
        const token = extractJWT({ headers, payload })
        if (!token) {
          return { user: null }
        }

        const jwtPayload = await decodeJwtPayload(token, payload.secret)
        if (!jwtPayload) {
          return { user: null }
        }

        if (!jwtSessionStrategyMatches(jwtPayload, strategyName, false)) {
          return { user: null }
        }

        const userID = getJwtUserId(jwtPayload)
        if (userID === undefined) {
          return { user: null }
        }

        const user = await loadUserById(payload, userID)
        if (!user) {
          return { user: null }
        }

        user._strategy = strategyName
        return { user }
      } catch {
        return { user: null }
      }
    },
  }
}

export const ISOLATED_AUTH_STRATEGY_NAMES = [
  GOOGLE_ADMIN_STRATEGY,
  GOOGLE_APP_STRATEGY,
  LOCAL_JWT_STRATEGY_ADMIN,
  LOCAL_JWT_STRATEGY_APP,
] as const
