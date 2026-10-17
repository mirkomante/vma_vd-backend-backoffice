import { canAccessSection } from '@/lib/auth/canAccessSection'
import type { UserAccessFields } from '@/lib/auth/roles'

/**
 * True se almeno una scheda della home ha una riga di stato prevista per l'utente.
 * Dalla I1: solo la sezione Menù; Prenotazioni (5.5) e Orari (8.5) si aggiungeranno qui.
 */
export function hasAnyHomeStatusRow(user: UserAccessFields): boolean {
  return canAccessSection(user, 'menu')
}
