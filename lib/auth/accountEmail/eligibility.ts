import type { LoginMethod, UserAccessFields } from '@/lib/auth/roles'

import type { User } from '@/payload-types'

/** Solo SSO puro: `sso-and-local` riceve solo attivazione (fase-8 §8.4). */
export function isSsoOnlyLoginMethod(
  loginMethod: LoginMethod | null | undefined,
): boolean {
  return loginMethod === 'sso'
}

export function shouldSendAccountCreatedEmail(args: {
  doc: User
  operation: 'create' | 'update'
  previousDoc?: User | null
}): boolean {
  const { doc, operation, previousDoc } = args

  if (!isSsoOnlyLoginMethod(doc.loginMethod)) {
    return false
  }

  if (doc.accountCreatedEmailSentAt) {
    return false
  }

  if (!doc.email) {
    return false
  }

  if (operation === 'create') {
    return doc.active === true
  }

  if (operation === 'update') {
    const wasInactive = previousDoc?.active === false
    const isActive = doc.active === true
    return wasInactive && isActive
  }

  return false
}

export function userAccessFieldsFromDoc(doc: User): UserAccessFields {
  return {
    adminRole: doc.adminRole,
    appRole: doc.appRole,
    active: doc.active,
    loginMethod: doc.loginMethod,
    emailVerified: doc.emailVerified,
  }
}
