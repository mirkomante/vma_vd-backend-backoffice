import type { Payload, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

const USERS_SLUG = 'users' as const

export async function verifyAppEmailToken(args: {
  payload: Payload
  token: string
  req?: PayloadRequest
}): Promise<boolean> {
  const { payload, token, req } = args
  const trimmed = token.trim()
  if (!trimmed) {
    return false
  }

  const found = await payload.find({
    collection: USERS_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    showHiddenFields: true,
    where: { emailVerificationToken: { equals: trimmed } },
  })

  const user = found.docs[0] as User | undefined
  if (!user) {
    return false
  }

  await payload.update({
    id: user.id,
    collection: USERS_SLUG,
    data: {
      emailVerified: true,
      emailVerificationToken: null,
    },
    overrideAccess: true,
    req,
  })

  return true
}
