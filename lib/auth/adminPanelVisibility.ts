import { asUserAccessFields, isActiveUser } from '@/lib/auth/userAccess'

/** Nasconde risorse Admin riservate a staff (admin/super-admin), non al manager CMS (ADR-113). */
export function hideFromAdminRoleManager(user: unknown): boolean {
  const fields = asUserAccessFields(user)
  return isActiveUser(fields) && fields?.adminRole === 'manager'
}
