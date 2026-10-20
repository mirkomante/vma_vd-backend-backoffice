import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { isSpecialDayDateBeforeToday, validateSpecialDayForm } from './formModel.ts'
import { emptySpecialDayFormValues } from './types.ts'

describe('specialDay formModel', () => {
  it('data passata rispetto a soglia Roma', () => {
    assert.equal(isSpecialDayDateBeforeToday('2026-10-14', '2026-10-15T12:00:00.000Z'), true)
    assert.equal(isSpecialDayDateBeforeToday('2026-10-15', '2026-10-15T12:00:00.000Z'), false)
  })

  it('sovrapposizione blocca validazione', () => {
    const errors = validateSpecialDayForm(
      { ...emptySpecialDayFormValues(), dateInput: '2026-12-01', fixedMenuIds: ['1'] },
      'overlap',
    )
    assert.equal(errors.overlap, 'overlap')
  })
})
