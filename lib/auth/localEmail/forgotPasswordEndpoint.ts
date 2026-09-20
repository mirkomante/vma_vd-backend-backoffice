import type { Endpoint, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { loginMethodIncludesLocal } from '@/lib/auth/roles'

import { parseAuthFormBody, readEmailField } from './parseFormBody'
import { resetPasswordEmailContent, sendAppAuthEmail } from './send'
import { generateAuthEmailToken, resetPasswordExpirationIso } from './tokens'

const USERS_SLUG = 'users' as const
const SUCCESS_REDIRECT = '/app/login/forgot?sent=1'

function successResponse(): Response {
  return new Response(null, {
    headers: { Location: SUCCESS_REDIRECT },
    status: 302,
  })
}

async function forgotPasswordHandler(req: PayloadRequest): Promise<Response> {
  try {
    await parseAuthFormBody(req)
    const email = readEmailField(req)
    if (!email) {
      return successResponse()
    }

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
    if (
      !user ||
      user.active === false ||
      !loginMethodIncludesLocal(user.loginMethod) ||
      typeof user.hash !== 'string'
    ) {
      return successResponse()
    }

    const token = generateAuthEmailToken()
    await req.payload.update({
      id: user.id,
      collection: USERS_SLUG,
      data: {
        resetPasswordToken: token,
        resetPasswordExpiration: resetPasswordExpirationIso(),
      },
      overrideAccess: true,
      req,
    })

    const { subject, html } = resetPasswordEmailContent(token)
    await sendAppAuthEmail({
      payload: req.payload,
      req,
      to: user.email,
      subject,
      html,
    })

    return successResponse()
  } catch {
    return successResponse()
  }
}

export function createAppForgotPasswordEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/forgot-password/app',
    handler: forgotPasswordHandler,
  }
}
