import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { appAreaRoleLabel, initialsFromEmail } from './userDisplay.ts'

describe('initialsFromEmail', () => {
  it('usa le prime due parti separate da punto', () => {
    assert.equal(initialsFromEmail('marco.rossi@esempio.it'), 'MR')
  })

  it('usa le prime due lettere senza separatori', () => {
    assert.equal(initialsFromEmail('marco@esempio.it'), 'MA')
  })
})

describe('appAreaRoleLabel', () => {
  it('preferisce adminRole', () => {
    assert.equal(
      appAreaRoleLabel({ adminRole: 'admin', appRole: 'manager', active: true }),
      'Admin',
    )
  })

  it('restituisce Manager per appRole manager', () => {
    assert.equal(
      appAreaRoleLabel({ adminRole: 'none', appRole: 'manager', active: true }),
      'Manager',
    )
  })
})
