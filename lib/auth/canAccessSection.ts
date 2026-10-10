import type { AppSection, UserAccessFields } from './roles'
import { canAccessAppArea } from './userAccess'

/**
 * Controllo centralizzato accesso alle sezioni dell'Area App (ADR-113 §3).
 * Nessuna distinzione per sezione: delega a `canAccessAppArea`.
 */
export function canAccessSection(user: UserAccessFields, section: AppSection): boolean {
  void section
  return canAccessAppArea(user)
}
