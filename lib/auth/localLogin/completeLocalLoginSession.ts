import type { CollectionBeforeLoginHook, PayloadRequest, TypedUser } from 'payload'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'

import type { User } from '@/payload-types'

const USERS_SLUG = 'users' as const

export async function completeLocalLoginSession(args: {
  req: PayloadRequest
  user: User
  strategy: string
  successRedirect: string
}): Promise<Response> {
  const { req, user, strategy, successRedirect } = args
  const collectionConfig = req.payload.collections[USERS_SLUG].config
  const payloadConfig = req.payload.config

  let activeUser = { ...user, collection: USERS_SLUG } as User & TypedUser

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
    _strategy: strategy,
  }) as TypedUser

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: activeUser.email || '',
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
    await hook({
      collection: collectionConfig,
      context: req.context || {},
      req,
      token: jwtToken,
      user: activeUser,
    })
  }, Promise.resolve())

  const cookie = generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payloadConfig.cookiePrefix,
    token: jwtToken,
  })

  return new Response(null, {
    headers: {
      'Set-Cookie': cookie,
      Location: successRedirect,
    },
    status: 302,
  })
}
