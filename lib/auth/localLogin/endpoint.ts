import type {
  CollectionBeforeLoginHook,
  Endpoint,
  PayloadRequest,
  TypedUser,
} from 'payload'
import { addDataAndFileToRequest, generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'

import type { User } from '@/payload-types'

import { logAuthAccessDenied } from '@/lib/activityLog/logAuthAccessDenied'
import { verifyLocalPassword } from '@/lib/auth/localCredentials/hash'
import { loginFailureRedirectPath } from '@/lib/auth/loginMessages'

import {
  AdminLocalLoginRejectedError,
  assertUserAllowedForAdminLocalLogin,
} from './adminLoginChecks'

const USERS_SLUG = 'users' as const
const LOCAL_JWT_STRATEGY = 'local-jwt'
const SUCCESS_REDIRECT = '/admin'
const FAILURE_LOGIN_PATH = '/admin/login/local'

/** JSON (fetch) o `application/x-www-form-urlencoded` (form HTML nativo). */
async function parseLoginRequestBody(req: PayloadRequest): Promise<void> {
  await addDataAndFileToRequest(req)
  if (readEmailAndPassword(req)) {
    return
  }

  const contentType = (req.headers.get('Content-Type') || '').split(';', 1)[0]?.trim()
  if (contentType !== 'application/x-www-form-urlencoded') {
    return
  }

  try {
    const text = typeof req.text === 'function' ? await req.text() : ''
    if (!text) {
      return
    }
    const params = new URLSearchParams(text)
    const email = params.get('email')
    const password = params.get('password')
    if (typeof email === 'string' && typeof password === 'string') {
      req.data = { email, password }
    }
  } catch {
    // body già consumato
  }
}

function readEmailAndPassword(req: PayloadRequest): { email: string; password: string } | null {
  const body = req.data
  if (!body || typeof body !== 'object') {
    return null
  }

  const emailRaw = 'email' in body ? body.email : undefined
  const passwordRaw = 'password' in body ? body.password : undefined

  if (typeof emailRaw !== 'string' || typeof passwordRaw !== 'string') {
    return null
  }

  const email = emailRaw.trim().toLowerCase()
  const password = passwordRaw

  if (!email || !password) {
    return null
  }

  return { email, password }
}

function failureResponse(): Response {
  return new Response(null, {
    headers: {
      Location: loginFailureRedirectPath(FAILURE_LOGIN_PATH),
    },
    status: 302,
  })
}

async function completeLocalLoginSession(args: {
  req: PayloadRequest
  user: User
}): Promise<Response> {
  const { req, user } = args
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
    _strategy: LOCAL_JWT_STRATEGY,
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
      Location: SUCCESS_REDIRECT,
    },
    status: 302,
  })
}

async function adminLocalLoginHandler(req: PayloadRequest): Promise<Response> {
  try {
    await parseLoginRequestBody(req)

    const credentials = readEmailAndPassword(req)
    if (!credentials) {
      return failureResponse()
    }

    const { email, password } = credentials

    const found = await req.payload.find({
      collection: USERS_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      req,
      showHiddenFields: true,
      where: { email: { equals: email } },
    })

    const user = found.docs[0] as User | undefined
    if (!user) {
      return failureResponse()
    }

    try {
      assertUserAllowedForAdminLocalLogin(user)
    } catch {
      await logAuthAccessDenied({
        req,
        userId: user.id,
        area: 'admin',
        method: 'local',
      })
      return failureResponse()
    }

    const passwordValid = await verifyLocalPassword(password, user)
    if (!passwordValid) {
      await logAuthAccessDenied({
        req,
        userId: user.id,
        area: 'admin',
        method: 'local',
      })
      return failureResponse()
    }

    return await completeLocalLoginSession({ req, user })
  } catch (error) {
    if (error instanceof AdminLocalLoginRejectedError) {
      return failureResponse()
    }
    return failureResponse()
  }
}

export function createAdminLocalLoginEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/login/local',
    handler: adminLocalLoginHandler,
  }
}
