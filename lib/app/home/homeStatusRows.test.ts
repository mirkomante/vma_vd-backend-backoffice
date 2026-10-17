import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { UserAccessFields } from '../../auth/roles.ts'

/** Copia minima di `canAccessAppArea` per test node senza alias `@/`. */
function canAccessAppAreaForTest(user: UserAccessFields): boolean {
  if (user.active === false) {
    return false
  }
  const adminRole = user.adminRole ?? 'none'
  if (adminRole === 'admin' || adminRole === 'super-admin') {
    return true
  }
  return user.appRole === 'manager'
}

/** Deve restare allineata a `hasAnyHomeStatusRow` in `homeStatusRows.ts`. */
function hasAnyHomeStatusRowForTest(user: UserAccessFields): boolean {
  return canAccessAppAreaForTest(user)
}

describe('hasAnyHomeStatusRow', () => {
  it('manager con sezione menu', () => {
    assert.equal(
      hasAnyHomeStatusRowForTest({ adminRole: 'none', appRole: 'manager', active: true }),
      true,
    )
  })

  it('admin con accesso app', () => {
    assert.equal(
      hasAnyHomeStatusRowForTest({ adminRole: 'admin', appRole: 'none', active: true }),
      true,
    )
  })

  it('false senza accesso app', () => {
    assert.equal(
      hasAnyHomeStatusRowForTest({ adminRole: 'none', appRole: 'none', active: true }),
      false,
    )
  })
})
