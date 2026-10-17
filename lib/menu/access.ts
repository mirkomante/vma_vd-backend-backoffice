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

/** Collection contenuti menù (6.2): lettura come tassonomie (anonima + staff/manager App). */
export function canReadMenuContentRequest(req: PayloadRequest): boolean {
  return canReadMenuTaxonomiesRequest(req)
}

/** Creazione e modifica: staff Admin o manager App (ADR-113 §3). */
export function canWriteMenuContentRequest(req: PayloadRequest): boolean {
  if (!isStaffAdminRequest(req) && !isActiveAppManagerRequest(req)) {
    return false
  }
  return true
}

/**
 * Cancellazione fisica dei contenuti menù (escluse le categorie dei menu fissi):
 * staff Admin o manager App attivo (ADR-113 emendamento 2026-10-14, fase 6.6 Parte 0).
 */
export function canDeleteMenuContentRequest(req: PayloadRequest): boolean {
  return isStaffAdminRequest(req) || isActiveAppManagerRequest(req)
}

/** Cancellazione categorie menu fisso: solo staff Admin (il manager disabilita). */
export function canDeleteFixedMenuCategoryRequest(req: PayloadRequest): boolean {
  return isStaffAdminRequest(req)
}
