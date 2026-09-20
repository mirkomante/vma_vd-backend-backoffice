import type { UserAccessFields } from '@/lib/auth/roles'
import { canAccessAdminPanel } from '@/lib/auth/userAccess'

import type { OAuthLoginArea } from './areas'
import { OAuthLoginRejectedError } from './errors'

export function assertUserAllowedForOAuthLogin(
  user: UserAccessFields,
  area: OAuthLoginArea,
): void {
  if (user.active === false) {
    throw new OAuthLoginRejectedError()
  }

  const method = user.loginMethod
  if (method === 'local') {
    throw new OAuthLoginRejectedError()
  }

  if (area === 'admin') {
    if (!canAccessAdminPanel(user)) {
      throw new OAuthLoginRejectedError()
    }
    return
  }

  if (user.appRole === 'none' || user.appRole == null) {
    throw new OAuthLoginRejectedError()
  }
}
