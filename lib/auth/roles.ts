/**
 * Valori di schema allineati alla collection `users` (ADR-001 baseline di catalogo, ereditata senza deviazione).
 */

export const ADMIN_ROLE_OPTIONS = [
  { label: 'Nessuno', value: 'none' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super-admin', value: 'super-admin' },
] as const

export const APP_ROLE_OPTIONS = [
  { label: 'Nessuno', value: 'none' },
  /** Operatività quotidiana su menù digitale e prenotazioni (Area App) — ADR-102 */
  { label: 'Manager', value: 'manager' },
] as const

export const LOGIN_METHOD_OPTIONS = [
  { label: 'Solo SSO (Google)', value: 'sso' },
  { label: 'Solo credenziali locali', value: 'local' },
  { label: 'SSO e locale', value: 'sso-and-local' },
] as const

export type AdminRole = (typeof ADMIN_ROLE_OPTIONS)[number]['value']
export type AppRole = (typeof APP_ROLE_OPTIONS)[number]['value']
export type LoginMethod = (typeof LOGIN_METHOD_OPTIONS)[number]['value']

/** Metodi che ammettono una password locale (emergenza super-admin o login App). */
export const LOCAL_LOGIN_METHODS: readonly LoginMethod[] = ['local', 'sso-and-local']

export function loginMethodIncludesLocal(
  method: LoginMethod | null | undefined,
): boolean {
  return method === 'local' || method === 'sso-and-local'
}

/** Sezioni dell'Area App il cui enforcement permessi verrà collegato in Fase 5/6 */
export type AppSection = 'menu' | 'reservations'

export type UserAccessFields = {
  id?: number | string
  active?: boolean | null
  adminRole?: AdminRole | null
  appRole?: AppRole | null
  loginMethod?: LoginMethod | null
  /** Assente sui record precedenti all’introduzione del campo: trattato come verificato. */
  emailVerified?: boolean | null
  /** Credenziali route emergenza /admin/login/local; non esposte in Admin né via API. */
  bootstrapCredentialHash?: string | null
  bootstrapCredentialSalt?: string | null
}

/** Payload in scrittura (create/update), include l'eventuale password in chiaro. */
export type UserWriteData = Partial<UserAccessFields> & {
  password?: string | null
  /** Solo form Admin; non persistito (campo virtual o rimosso in hook). */
  passwordConfirm?: string | null
}
