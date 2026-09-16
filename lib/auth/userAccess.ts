import type { PayloadRequest } from 'payload'

import { grantsLocalCredentialsToPanelAdmin } from './localPasswordGuard'
import type { AdminRole, UserAccessFields, UserWriteData } from './roles'

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

/**
 * Create: staff Admin/super-admin. Senza `data` (lista Admin, pulsante Crea)
 * si consente l’apertura del form; in submit si rifiuta un Admin di pannello
 * creato con metodo locale o password — i super-admin di bootstrap restano
 * l’unica eccezione lato Area Admin.
 */
export function canCreateUser(args: {
  req: PayloadRequest
  data?: UserWriteData
}): boolean {
  const { req, data } = args
  if (!isStaffAdminRequest(req)) {
    return false
  }

  if (!data) {
    return true
  }

  return !grantsLocalCredentialsToPanelAdmin(data)
}
