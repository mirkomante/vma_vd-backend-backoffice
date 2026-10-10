/**
 * Matrice pura ruoli/guardie fase-8.3 (ADR-113). Nessun Payload runtime.
 * Eseguire: pnpm payload run scripts/verify-roles-8_3-matrix.ts
 */
import { canAccessSection } from '@/lib/auth/canAccessSection'
import type { AdminRole, AppRole, AppSection, UserAccessFields } from '@/lib/auth/roles'
import { canAccessAdminPanel, canAccessAppArea } from '@/lib/auth/userAccess'

const ADMIN_ROLES: AdminRole[] = ['none', 'manager', 'admin', 'super-admin']
const APP_ROLES: AppRole[] = ['none', 'manager']
const SECTIONS: AppSection[] = ['menu', 'hours', 'reservations']

type ActiveVariant = 'true' | 'false' | 'absent'

function activeValue(variant: ActiveVariant): boolean | null | undefined {
  if (variant === 'true') {
    return true
  }
  if (variant === 'false') {
    return false
  }
  return undefined
}

/** Atteso da ADR-113 §2–§3 e fase-8 §5-bis (non dal codice sotto test). */
function expectedCanAccessAdminPanel(
  adminRole: AdminRole,
  active: ActiveVariant,
): boolean {
  if (active === 'false') {
    return false
  }
  return adminRole === 'manager' || adminRole === 'admin' || adminRole === 'super-admin'
}

function expectedCanAccessAppArea(
  adminRole: AdminRole,
  appRole: AppRole,
  active: ActiveVariant,
): boolean {
  if (active === 'false') {
    return false
  }
  if (adminRole === 'admin' || adminRole === 'super-admin') {
    return true
  }
  return appRole === 'manager'
}

function buildUser(
  adminRole: AdminRole,
  appRole: AppRole,
  active: ActiveVariant,
): UserAccessFields {
  const user: UserAccessFields = { adminRole, appRole }
  const value = activeValue(active)
  if (active !== 'absent') {
    user.active = value
  }
  return user
}

let failures = 0

function assertEq(
  label: string,
  actual: boolean,
  expected: boolean,
): void {
  if (actual !== expected) {
    failures += 1
    console.error(`FAIL ${label}: atteso ${expected}, ottenuto ${actual}`)
  }
}

for (const adminRole of ADMIN_ROLES) {
  for (const appRole of APP_ROLES) {
    for (const active of ['true', 'false', 'absent'] as ActiveVariant[]) {
      const user = buildUser(adminRole, appRole, active)
      const panelLabel = `panel adminRole=${adminRole} appRole=${appRole} active=${active}`
      assertEq(
        panelLabel,
        canAccessAdminPanel(user),
        expectedCanAccessAdminPanel(adminRole, active),
      )
      const appLabel = `app adminRole=${adminRole} appRole=${appRole} active=${active}`
      assertEq(
        appLabel,
        canAccessAppArea(user),
        expectedCanAccessAppArea(adminRole, appRole, active),
      )
      for (const section of SECTIONS) {
        const sectionLabel = `section=${section} adminRole=${adminRole} appRole=${appRole} active=${active}`
        assertEq(
          sectionLabel,
          canAccessSection(user, section),
          expectedCanAccessAppArea(adminRole, appRole, active),
        )
      }
    }
  }
}

const total =
  ADMIN_ROLES.length * APP_ROLES.length * 3 * (2 + SECTIONS.length)

if (failures > 0) {
  console.error(`Matrice 8.3: ${failures} errori su ${total} asserzioni.`)
  process.exit(1)
}

console.log(`Matrice 8.3: ${total} asserzioni OK (ADR-113).`)
