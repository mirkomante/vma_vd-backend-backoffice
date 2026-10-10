import type { UserAccessFields } from '@/lib/auth/roles'

/** Iniziali dall'email (shell spec §2). */
export function initialsFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
}

/** Etichetta ruolo sotto «Area App» (D12); `adminRole` prevale su `appRole`. */
export function appAreaRoleLabel(user: UserAccessFields): string | null {
  const adminRole = user.adminRole ?? 'none'
  if (adminRole === 'super-admin') {
    return 'Super-admin'
  }
  if (adminRole === 'admin') {
    return 'Admin'
  }
  if (user.appRole === 'manager') {
    return 'Manager'
  }
  return null
}
