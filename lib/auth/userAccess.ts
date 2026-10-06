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

/** Utente presente e non disattivato (`active !== false`). */
export function isActiveUser(user: UserAccessFields | null | undefined): boolean {
  return user != null && user.active !== false
}

export function canAccessAdminPanel(user: UserAccessFields | null | undefined): boolean {
  if (!isActiveUser(user)) {
    return false
  }
  const role = user?.adminRole
  return role === 'admin' || role === 'super-admin'
}

/** Accesso all’Area App: utente attivo con un `appRole` diverso da `none`. */
export function canAccessAppArea(user: UserAccessFields | null | undefined): boolean {
  if (!isActiveUser(user)) {
    return false
  }
  const role = user?.appRole
  return role != null && role !== 'none'
}

export function isSuperAdminRequest(req: PayloadRequest): boolean {
  const user = asUserAccessFields(req.user)
  if (!isActiveUser(user)) {
    return false
  }
  return getAdminRole(user) === 'super-admin'
}

export function isStaffAdminRequest(req: PayloadRequest): boolean {
  const user = asUserAccessFields(req.user)
  if (!isActiveUser(user)) {
    return false
  }
  const role = getAdminRole(user)
  return role === 'admin' || role === 'super-admin'
}

/** Utente App attivo con `appRole: manager` (senza richiedere staff Admin). */
export function isActiveAppManagerRequest(req: PayloadRequest): boolean {
  const user = asUserAccessFields(req.user)
  if (!isActiveUser(user)) {
    return false
  }
  return user?.appRole === 'manager'
}

/**
 * Lettura del Global `impostazioni-sistema`: anonima consentita (campi pubblici via `access` di campo);
 * utente autenticato solo se attivo e staff Admin o manager App.
 */
export function canReadSystemSettingsRequest(req: PayloadRequest): boolean {
  if (!req.user) {
    return true
  }
  const user = asUserAccessFields(req.user)
  if (!isActiveUser(user)) {
    return false
  }
  return isStaffAdminRequest(req) || isActiveAppManagerRequest(req)
}

/** Scrittura del Global: staff Admin o manager App attivo; i campi non-Orari restringono ulteriormente. */
export function canUpdateSystemSettingsRequest(req: PayloadRequest): boolean {
  return isStaffAdminRequest(req) || isActiveAppManagerRequest(req)
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
  if (!isStaffAdminRequest(req) || !req.user) {
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
