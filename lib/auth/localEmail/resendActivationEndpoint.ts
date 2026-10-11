import type { Endpoint, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

import { loginMethodIncludesLocal } from '@/lib/auth/roles'
import { isStaffAdminRequest } from '@/lib/auth/userAccess'

import { activationEmailContent, sendAppAuthEmail } from './send'
import { generateAuthEmailToken } from './tokens'

const USERS_SLUG = 'users' as const

type ResendBody = {
  id?: number | string
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status })
}

async function readJsonBody(req: PayloadRequest): Promise<ResendBody> {
  if (!req.json) {
    return {}
  }
  try {
    const parsed = await req.json()
    return parsed && typeof parsed === 'object' ? (parsed as ResendBody) : {}
  } catch {
    return {}
  }
}

async function resendActivationHandler(req: PayloadRequest): Promise<Response> {
  if (!isStaffAdminRequest(req)) {
    return jsonResponse({ ok: false, message: 'Operazione non consentita.' }, 403)
  }

  const body = await readJsonBody(req)
  const id = body.id
  if (id === undefined || id === null || id === '') {
    return jsonResponse({ ok: false, message: 'Invio non riuscito. Riprova più tardi.' }, 400)
  }

  try {
    const user = await req.payload.findByID({
      id,
      collection: USERS_SLUG,
      depth: 0,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    })

    const profile = user as User

    if (
      !loginMethodIncludesLocal(profile.loginMethod) ||
      profile.emailVerified !== false ||
      !profile.email
    ) {
      return jsonResponse({ ok: false, message: 'Operazione non consentita.' }, 403)
    }

    const token = generateAuthEmailToken()
    await req.payload.update({
      id: profile.id,
      collection: USERS_SLUG,
      data: {
        emailVerificationToken: token,
      },
      depth: 0,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    })

    const { subject, html } = activationEmailContent(token)
    const sent = await sendAppAuthEmail({
      payload: req.payload,
      req,
      to: profile.email,
      subject,
      html,
    })

    if (!sent) {
      return jsonResponse({ ok: false, message: 'Invio non riuscito. Riprova più tardi.' }, 502)
    }

    return jsonResponse({ ok: true, message: 'Email di attivazione inviata.' }, 200)
  } catch {
    return jsonResponse({ ok: false, message: 'Invio non riuscito. Riprova più tardi.' }, 500)
  }
}

export function createResendActivationEndpoint(): Endpoint {
  return {
    method: 'post',
    path: '/resend-activation',
    handler: resendActivationHandler,
  }
}
