import type { User } from '@/payload-types'

import { canAccessAppArea } from '@/lib/auth/userAccess'
import type { UserAccessFields } from '@/lib/auth/roles'

export class AppLocalLoginRejectedError extends Error {
  constructor() {
    super('App local login rejected')
    this.name = 'AppLocalLoginRejectedError'
  }
}

/**
 * Login locale Area App: utente attivo con ruolo App.
 * L’allow-list domini (2.2) non si applica. Utente solo-SSO o senza hash:
 * il confronto password fallisce da solo, nessun caso speciale.
 */
export function assertUserAllowedForAppLocalLogin(user: UserAccessFields): void {
  if (!canAccessAppArea(user)) {
    throw new AppLocalLoginRejectedError()
  }

  if (user.emailVerified === false) {
    throw new AppLocalLoginRejectedError()
  }
}

export type UserWithLocalCredentials = Pick<User, 'hash' | 'salt'> & UserAccessFields
