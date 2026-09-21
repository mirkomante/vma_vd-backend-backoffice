import type { Endpoint, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { validatePasswordPolicy } from '@/lib/auth/passwordPolicy'

import { parseAuthFormBody, readPasswordField, readTokenField } from './parseFormBody'

const USERS_SLUG = 'users' as const
const FAILURE_PATH = '/app/login/reset'
const SUCCESS_REDIRECT = '/app/login?reset=1'

function failureResponse(token: string | null): Response {
  const path = token
    ? `${FAILURE_PATH}?token=${encodeURIComponent(token)}&resetFailed=1`
    : `${FAILURE_PATH}?resetFailed=1`
  return new Response(null, {
    headers: { Location: path },
    status: 302,
  })
}

function successResponse(): Response {
  return new Response(null, {
    headers: { Location: SUCCESS_REDIRECT },
    status: 302,
  })
}

async function resetPasswordHandler(req: PayloadRequest): Promise<Response> {
  try {
    await parseAuthFormBody(req)
    const token = readTokenField(req)
    const password = readPasswordField(req)
    if (!token || !password) {
      return failureResponse(token)
    }

    const policy = validatePasswordPolicy(password)
    if (policy !== true) {
      return failureResponse(token)
    }

    const found = await req.payload.find({
      collection: USERS_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      req,
      showHiddenFields: true,
      where: {
        and: [
          { resetPasswordToken: { equals: token } },
          { resetPasswordExpiration: { greater_than: new Date().toISOString() } },
        ],
      },
    })

    const user = found.docs[0] as User | undefined
    if (!user) {
      return failureResponse(token)
    }

    await req.payload.update({
      id: user.id,
      collection: USERS_SLUG,
      data: {
        password,
        // Allineato al form Admin (campo virtual passwordConfirm obbligatorio in beforeValidate).
        passwordConfirm: password,
        resetPasswordToken: null,
        resetPasswordExpiration: new Date().toISOString(),
        emailVerified: true,
      },
      overrideAccess: true,
      req,
    })

    return successResponse()
  } catch {
    return failureResponse(null)
  }
}

export function createAppResetPasswordEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/reset-password/app',
    handler: resetPasswordHandler,
  }
}
