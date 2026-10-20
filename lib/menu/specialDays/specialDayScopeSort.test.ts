import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { compareSpecialDayScope } from './specialDayScopeSort.ts'

describe('compareSpecialDayScope', () => {
  it('giornata intera prima di pranzo e cena (non ordine alfabetico API)', () => {
    assert.ok(compareSpecialDayScope('day', 'lunch') < 0)
    assert.ok(compareSpecialDayScope('lunch', 'dinner') < 0)
    assert.ok(compareSpecialDayScope('dinner', 'lunch') > 0)
  })
})
