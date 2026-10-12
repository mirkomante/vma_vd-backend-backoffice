import type { PayloadRequest } from 'payload'

import {
  asUserAccessFields,
  isActiveAppManagerRequest,
  isActiveUser,
  isStaffAdminRequest,
} from '@/lib/auth/userAccess'

/**
 * Lettura tassonomie menù e Global `menu-general`: anonima (contratto ADR-112);
 * autenticato solo se attivo e staff Admin o manager App (ADR-113).
 * `adminRole: manager` senza `appRole` escluso.
 */
export function canReadMenuTaxonomiesRequest(req: PayloadRequest): boolean {
  if (!req.user) {
    return true
  }
  const user = asUserAccessFields(req.user)
  if (!isActiveUser(user)) {
    return false
  }
  return isStaffAdminRequest(req) || isActiveAppManagerRequest(req)
}

/** Creazione, modifica e cancellazione tassonomie: solo staff Admin (ADR-113, ADR-108 §9). */
export function canWriteMenuTaxonomiesRequest(req: PayloadRequest): boolean {
  return isStaffAdminRequest(req)
}

export function canReadMenuGeneralRequest(req: PayloadRequest): boolean {
  return canReadMenuTaxonomiesRequest(req)
}

/** Global `menu-general`: staff Admin o manager App; i campi futuri restano staff-only a livello di campo. */
export function canUpdateMenuGeneralRequest(req: PayloadRequest): boolean {
  return isStaffAdminRequest(req) || isActiveAppManagerRequest(req)
}
