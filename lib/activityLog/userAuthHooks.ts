import type { CollectionAfterLoginHook, CollectionAfterLogoutHook } from 'payload'

import type { User } from '@/payload-types'

import { logActivity } from './logActivity'
import { resolveAuthContext } from './resolveAuthContext'

export const logAuthLoginHook: CollectionAfterLoginHook<User> = async ({ req, user }) => {
  const { area, method } = resolveAuthContext(req, user)

  await logActivity(req, {
    user: user.id,
    eventType: 'login',
    area,
    method,
  })
}

export const logAuthLogoutHook: CollectionAfterLogoutHook = async ({ req }) => {
  const sessionUser = req.user
  if (!sessionUser?.id) {
    return
  }

  const { area, method } = resolveAuthContext(req, sessionUser)

  await logActivity(req, {
    user: sessionUser.id,
    eventType: 'logout',
    area,
    method,
  })
}
