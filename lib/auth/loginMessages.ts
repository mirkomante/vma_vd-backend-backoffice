/** Query param (valore libero) per mostrare il messaggio generico di rifiuto login. */
export const AUTH_FAILURE_QUERY_PARAM = 'authFailed'

/** Messaggio unico per ogni fallimento di autenticazione (SSO, locale, inattivo, ecc.). */
export const GENERIC_LOGIN_FAILURE_MESSAGE =
  'Accesso non riuscito. Verifica le credenziali o contatta l’amministratore.'

export function loginFailureRedirectPath(loginPath: string): string {
  const separator = loginPath.includes('?') ? '&' : '?'
  return `${loginPath}${separator}${AUTH_FAILURE_QUERY_PARAM}=1`
}
