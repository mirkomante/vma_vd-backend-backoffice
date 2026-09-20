import type { Endpoint, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { logAuthAccessDenied } from '@/lib/activityLog/logAuthAccessDenied'
import { verifyLocalPassword } from '@/lib/auth/localCredentials/hash'
import { loginFailureRedirectPath } from '@/lib/auth/loginMessages'

import { AppLocalLoginRejectedError, assertUserAllowedForAppLocalLogin } from './appLoginChecks'
import { completeLocalLoginSession } from './completeLocalLoginSession'
import { LOCAL_JWT_STRATEGY_APP } from './constants'
import { parseLoginRequestBody, readEmailAndPassword } from './parseLoginBody'

const USERS_SLUG = 'users' as const
const SUCCESS_REDIRECT = '/app'
const FAILURE_LOGIN_PATH = '/app/login'

function failureResponse(): Response {
  return new Response(null, {
    headers: {
      Location: loginFailureRedirectPath(FAILURE_LOGIN_PATH),
    },
    status: 302,
  })
}

async function appLocalLoginHandler(req: PayloadRequest): Promise<Response> {
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
      assertUserAllowedForAppLocalLogin(user)
    } catch {
      await logAuthAccessDenied({
        req,
        userId: user.id,
        area: 'app',
        method: 'local',
      })
      return failureResponse()
    }

    const passwordValid = await verifyLocalPassword(password, user)
    if (!passwordValid) {
      await logAuthAccessDenied({
        req,
        userId: user.id,
        area: 'app',
        method: 'local',
      })
      return failureResponse()
    }

    return await completeLocalLoginSession({
      req,
      user,
      strategy: LOCAL_JWT_STRATEGY_APP,
      successRedirect: SUCCESS_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AppLocalLoginRejectedError) {
      return failureResponse()
    }
    return failureResponse()
  }
}

export function createAppLocalLoginEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/login/app',
    handler: appLocalLoginHandler,
  }
}
