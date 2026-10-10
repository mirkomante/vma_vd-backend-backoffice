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
 * Login locale Area App: solo `adminRole: none` con accesso App (ADR-004, fase-8 §5-bis).
 * L’allow-list domini (2.2) non si applica.
 */
export function assertUserAllowedForAppLocalLogin(user: UserAccessFields): void {
  if ((user.adminRole ?? 'none') !== 'none') {
    throw new AppLocalLoginRejectedError()
  }

  if (!canAccessAppArea(user)) {
    throw new AppLocalLoginRejectedError()
  }

  if (user.emailVerified === false) {
    throw new AppLocalLoginRejectedError()
  }
}

export type UserWithLocalCredentials = Pick<User, 'hash' | 'salt'> & UserAccessFields
