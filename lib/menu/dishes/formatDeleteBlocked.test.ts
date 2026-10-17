import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatFixedMenusBlockedDeleteDescription } from './formatDeleteBlocked.ts'

describe('formatFixedMenusBlockedDeleteDescription', () => {
  it('uno e quattro menù', () => {
    assert.equal(
      formatFixedMenusBlockedDeleteDescription(['Menu 1']),
      'È usato in 1 menù fisso: Menu 1. Toglilo da lì, poi potrai eliminarlo.',
    )
    assert.equal(
      formatFixedMenusBlockedDeleteDescription(['A', 'B', 'C', 'D']),
      'È usato in 4 menù fissi: A, B, C, e altri 1. Toglilo da lì, poi potrai eliminarlo.',
    )
  })
})
