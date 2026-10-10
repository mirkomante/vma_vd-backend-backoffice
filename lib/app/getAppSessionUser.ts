import config from '@payload-config'
import { headers } from 'next/headers'
import { createPayloadRequest } from 'payload'
import type { TypedUser } from 'payload'

import type { UserAccessFields } from '@/lib/auth/roles'
import { asUserAccessFields } from '@/lib/auth/userAccess'

export type AppSessionUser = UserAccessFields & { email: string }

/** Utente autenticato dalla sessione Payload (cookie), o `null`. */
export async function getAppSessionUser(): Promise<AppSessionUser | null> {
  const headersList = await headers()
  const requestHeaders = new Headers()
  headersList.forEach((value, key) => {
    requestHeaders.append(key, value)
  })

  const request = new Request('http://localhost/app', {
    headers: requestHeaders,
  })

  const req = await createPayloadRequest({
    config,
    request,
    canSetHeaders: false,
  })

  const fields = asUserAccessFields(req.user)
  const email = (req.user as TypedUser & { email?: string })?.email
  if (!fields || typeof email !== 'string' || email.length === 0) {
    return null
  }

  return { ...fields, email }
}
