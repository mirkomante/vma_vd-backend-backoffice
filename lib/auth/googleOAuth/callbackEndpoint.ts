import type { PluginTypes } from 'payload-oauth2'
import type { CollectionBeforeLoginHook, Endpoint, PayloadRequest, TypedUser } from 'payload'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'

import type { User } from '@/payload-types'

import type { UserAccessFields } from '@/lib/auth/roles'

import { logAuthAccessDenied } from '@/lib/activityLog/logAuthAccessDenied'

import { getOAuthLoginArea } from './areas'
import { OAuthLoginRejectedError } from './errors'
import { extractOAuthCallbackCode } from './extractOAuthCode'
import { assertUserAllowedForOAuthLogin } from './userLoginChecks'

const USERS_SLUG = 'users' as const

function createCallbackHandler(pluginOptions: PluginTypes) {
  return async (req: PayloadRequest) => {
    try {
      const subFieldName = pluginOptions.subField?.name || pluginOptions.subFieldName || 'sub'
      const collectionConfig = req.payload.collections[USERS_SLUG].config
      const payloadConfig = req.payload.config
      const useEmailAsIdentity = pluginOptions.useEmailAsIdentity ?? false
      const excludeEmailFromJwtToken =
        !useEmailAsIdentity || pluginOptions.excludeEmailFromJwtToken || false
      const onUserNotFoundBehavior = pluginOptions.onUserNotFoundBehavior || 'create'
      const code = await extractOAuthCallbackCode(req)

      let token: string
      if (pluginOptions.getToken) {
        token = await pluginOptions.getToken(code, req)
      } else {
        throw new OAuthLoginRejectedError()
      }

      const userInfo = await pluginOptions.getUserInfo(token, req)

      let existingUser
      if (useEmailAsIdentity) {
        if (typeof userInfo.email !== 'string' || userInfo.email.length === 0) {
          throw new OAuthLoginRejectedError()
        }
        existingUser = await req.payload.find({
          req,
          collection: USERS_SLUG,
          where: { email: { equals: userInfo.email } },
          showHiddenFields: true,
          limit: 1,
        })
      } else {
        const providerSubject = userInfo[subFieldName]
        if (typeof providerSubject !== 'string' || providerSubject.length === 0) {
          throw new OAuthLoginRejectedError()
        }
        existingUser = await req.payload.find({
          req,
          collection: USERS_SLUG,
          where: { [subFieldName]: { equals: providerSubject } },
          showHiddenFields: true,
          limit: 1,
        })
      }

      const user = existingUser.docs[0] as User | undefined
      if (!user) {
        if (onUserNotFoundBehavior === 'error') {
          throw new OAuthLoginRejectedError()
        }
        throw new OAuthLoginRejectedError()
      }

      const oauthArea = getOAuthLoginArea(req)
      if (oauthArea) {
        try {
          assertUserAllowedForOAuthLogin(user as UserAccessFields, oauthArea)
        } catch {
          await logAuthAccessDenied({
            req,
            userId: user.id,
            area: oauthArea,
            method: 'sso',
          })
          throw new OAuthLoginRejectedError()
        }
      }

      const updateData: Record<string, unknown> = { ...userInfo }
      delete updateData.collection

      const updated = (await req.payload.update({
        req,
        collection: USERS_SLUG,
        id: user.id,
        data: updateData,
        showHiddenFields: true,
      })) as User

      let activeUser = { ...updated, collection: USERS_SLUG } as User & TypedUser

      const beforeLoginHooks = (collectionConfig.hooks?.beforeLogin ??
        []) as CollectionBeforeLoginHook<User>[]

      await beforeLoginHooks.reduce(async (priorHook, hook) => {
        await priorHook
        const hookResult = await hook({
          collection: collectionConfig,
          context: req.context || {},
          req,
          user: activeUser,
        })
        if (hookResult) {
          activeUser = { ...hookResult, collection: USERS_SLUG }
        }
      }, Promise.resolve())

      const sessionUser = Object.assign(activeUser, {
        _strategy: pluginOptions.strategyName,
      }) as TypedUser

      const fieldsToSign = getFieldsToSign({
        collectionConfig,
        email: excludeEmailFromJwtToken ? '' : activeUser.email || '',
        sid: undefined,
        user: sessionUser,
      })

      const tokenExpiration =
        typeof collectionConfig.auth === 'object' && collectionConfig.auth?.tokenExpiration
          ? collectionConfig.auth.tokenExpiration
          : 7200

      const { token: jwtToken } = await jwtSign({
        fieldsToSign,
        secret: req.payload.secret,
        tokenExpiration,
      })

      req.user = sessionUser

      const afterLoginHooks = collectionConfig.hooks?.afterLogin ?? []

      await afterLoginHooks.reduce(async (priorHook, hook) => {
        await priorHook
        const hookResult = await hook({
          collection: collectionConfig,
          context: req.context || {},
          req,
          token: jwtToken,
          user: activeUser,
        })
        if (hookResult) {
          activeUser = { ...hookResult, collection: USERS_SLUG }
        }
      }, Promise.resolve())

      const cookie = generatePayloadCookie({
        collectionAuthConfig: collectionConfig.auth,
        cookiePrefix: payloadConfig.cookiePrefix,
        token: jwtToken,
      })

      return new Response(null, {
        headers: {
          'Set-Cookie': cookie,
          Location: await pluginOptions.successRedirect(req, jwtToken),
        },
        status: 302,
      })
    } catch {
      return new Response(null, {
        headers: {
          Location: await pluginOptions.failureRedirect(req),
        },
        status: 302,
      })
    }
  }
}

export function createGoogleOAuthCallbackEndpoints(
  pluginOptions: PluginTypes,
): Endpoint[] {
  const path = pluginOptions.callbackPath || '/oauth/callback'
  const handler = createCallbackHandler(pluginOptions)

  return [
    { method: 'get', path, handler },
    { method: 'post', path, handler },
  ]
}
