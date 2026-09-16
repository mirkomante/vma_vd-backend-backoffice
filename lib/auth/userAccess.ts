import type { PayloadRequest } from 'payload'

import type { AdminRole, UserAccessFields } from './roles'

export function asUserAccessFields(user: unknown): UserAccessFields | null {
  if (!user || typeof user !== 'object') {
    return null
  }
  return user as UserAccessFields
}

export function getAdminRole(user: UserAccessFields | null | undefined): AdminRole | undefined {
  return user?.adminRole ?? undefined
}

export function canAccessAdminPanel(user: UserAccessFields | null | undefined): boolean {
  if (user?.active === false) {
    return false
  }
  const role = user?.adminRole
  return role === 'admin' || role === 'super-admin'
}

export function isSuperAdminRequest(req: PayloadRequest): boolean {
  return getAdminRole(asUserAccessFields(req.user)) === 'super-admin'
}

export function isStaffAdminRequest(req: PayloadRequest): boolean {
  const role = getAdminRole(asUserAccessFields(req.user))
  return role === 'admin' || role === 'super-admin'
}
