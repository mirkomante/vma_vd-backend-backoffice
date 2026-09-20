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

/** Accesso all’Area App: utente attivo con un `appRole` diverso da `none`. */
export function canAccessAppArea(user: UserAccessFields | null | undefined): boolean {
  if (user?.active === false) {
    return false
  }
  const role = user?.appRole
  return role != null && role !== 'none'
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
 * creato con metodo locale o password sul profilo standard (bootstrap via script seed).
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

  if (grantsLocalCredentialsToPanelAdmin(data)) {
    return false
  }

  const actorRole = getAdminRole(asUserAccessFields(req.user))
  if (data.adminRole === 'super-admin' && actorRole !== 'super-admin') {
    return false
  }

  return true
}

export function usersUpdateAccess({ req }: { req: PayloadRequest }) {
  if (!isStaffAdminRequest(req)) {
    return false
  }
  const actorRole = getAdminRole(asUserAccessFields(req.user))
  if (actorRole === 'super-admin') {
    return true
  }
  return { adminRole: { not_equals: 'super-admin' } }
}

export function usersDeleteAccess({ req }: { req: PayloadRequest }) {
  if (!req.user) {
    return false
  }
  const notSelf = { id: { not_equals: req.user.id } }
  const actorRole = getAdminRole(asUserAccessFields(req.user))
  if (actorRole === 'super-admin') {
    return notSelf
  }
  if (actorRole === 'admin') {
    return { and: [notSelf, { adminRole: { not_equals: 'super-admin' } }] }
  }
  return false
}
