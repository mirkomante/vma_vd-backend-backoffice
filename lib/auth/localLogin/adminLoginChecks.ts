import type { User } from '@/payload-types'

import { loginMethodIncludesLocal, type UserAccessFields } from '@/lib/auth/roles'
import { canAccessAdminPanel } from '@/lib/auth/userAccess'

export class AdminLocalLoginRejectedError extends Error {
  constructor() {
    super('Admin local login rejected')
    this.name = 'AdminLocalLoginRejectedError'
  }
}

/** Accesso locale di emergenza: solo super-admin attivo con metodo che ammette password locale. */
export function assertUserAllowedForAdminLocalLogin(user: UserAccessFields): void {
  if (user.active === false) {
    throw new AdminLocalLoginRejectedError()
  }

  if (user.adminRole !== 'super-admin') {
    throw new AdminLocalLoginRejectedError()
  }

  if (!canAccessAdminPanel(user)) {
    throw new AdminLocalLoginRejectedError()
  }

  if (!loginMethodIncludesLocal(user.loginMethod)) {
    throw new AdminLocalLoginRejectedError()
  }
}

export type UserWithLocalCredentials = Pick<User, 'hash' | 'salt'> & UserAccessFields
