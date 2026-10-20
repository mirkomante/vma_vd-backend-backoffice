import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { catalogStatusFilterItems } from './disabledStatusFilter.ts'

describe('catalogStatusFilterItems', () => {
  it('mappa all, enabled e disabled alle etichette dei copy', () => {
    const items = catalogStatusFilterItems({
      all: 'Tutti',
      enabled: 'Abilitati',
      disabled: 'Disabilitati',
    })
    assert.deepEqual(items, {
      all: 'Tutti',
      enabled: 'Abilitati',
      disabled: 'Disabilitati',
    })
  })
})
