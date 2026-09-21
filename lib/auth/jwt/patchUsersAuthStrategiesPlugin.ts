import type { Plugin } from 'payload'

import {
  buildGoogleOAuthAdminPluginOptions,
  buildGoogleOAuthAppPluginOptions,
} from '@/lib/auth/googleOAuth/pluginOptions'
import {
  LOCAL_JWT_STRATEGY_ADMIN,
  LOCAL_JWT_STRATEGY_APP,
} from '@/lib/auth/localLogin/constants'

import {
  createIsolatedLocalJwtAuthStrategy,
  createIsolatedOAuthJwtAuthStrategy,
  ISOLATED_AUTH_STRATEGY_NAMES,
} from './isolatedJwtAuthStrategies'

const USERS_SLUG = 'users' as const

/**
 * Sostituisce le strategie JWT duplicate di payload-oauth2 (stesso token accettato
 * da entrambe le istanze; vince sempre la prima, google-admin) con varianti che
 * rispettano il claim `strategy` nel cookie.
 */
export function patchUsersAuthStrategiesPlugin(): Plugin {
  return (incomingConfig) => {
    const config = { ...incomingConfig }
    const usersCollection = config.collections?.find((collection) => collection.slug === USERS_SLUG)
    if (!usersCollection || usersCollection.auth === false || usersCollection.auth === undefined) {
      return config
    }

    const authConfig =
      typeof usersCollection.auth === 'object' ? usersCollection.auth : { disableLocalStrategy: true }

    const isolatedNames = new Set<string>(ISOLATED_AUTH_STRATEGY_NAMES)
    const remainingStrategies = (authConfig.strategies ?? []).filter(
      (strategy) => !isolatedNames.has(strategy.name),
    )

    const isolatedStrategies = [
      createIsolatedOAuthJwtAuthStrategy(buildGoogleOAuthAdminPluginOptions(), {
        acceptJwtWithoutStrategyClaim: true,
      }),
      createIsolatedOAuthJwtAuthStrategy(buildGoogleOAuthAppPluginOptions(), {
        acceptJwtWithoutStrategyClaim: false,
      }),
      createIsolatedLocalJwtAuthStrategy(LOCAL_JWT_STRATEGY_ADMIN),
      createIsolatedLocalJwtAuthStrategy(LOCAL_JWT_STRATEGY_APP),
    ]

    const modifiedUsers = {
      ...usersCollection,
      auth: {
        ...authConfig,
        strategies: [...isolatedStrategies, ...remainingStrategies],
      },
    }

    config.collections = [
      ...(config.collections?.filter((collection) => collection.slug !== USERS_SLUG) ?? []),
      modifiedUsers,
    ]

    return config
  }
}
