import { loginMethodIncludesLocal, type UserAccessFields } from '@/lib/auth/roles'

/** Utente Area App con credenziali locali (form Admin: password + attivazione email). */
export function isLocalAppUserProfile(
  data: UserAccessFields | null | undefined,
): boolean {
  if (!data) {
    return false
  }
  if (!loginMethodIncludesLocal(data.loginMethod)) {
    return false
  }
  const role = data.appRole
  return role != null && role !== 'none'
}

/**
 * Mostra password/conferma in Admin: login locale/misto su utente senza ruolo Admin.
 * App Role può essere ancora «Nessuno» (salvataggio validato a caso D / caso E).
 */
export function showAppLocalPasswordFields(
  data: UserAccessFields | null | undefined,
): boolean {
  if (!data) {
    return false
  }
  if ((data.adminRole ?? 'none') !== 'none') {
    return false
  }
  return loginMethodIncludesLocal(data.loginMethod)
}
