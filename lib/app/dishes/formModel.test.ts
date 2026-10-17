import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { PIATTI_ERROR_REQUIRED } from '@/lib/menu/dishes/copy'

import { validateDishForm } from './formModel.ts'
import { emptyDishFormValues } from './types.ts'

describe('validateDishForm', () => {
  it('modulo vuoto', () => {
    const errors = validateDishForm(emptyDishFormValues())
    assert.equal(errors.name, PIATTI_ERROR_REQUIRED)
    assert.ok(errors.price)
    assert.ok(errors.categoryId)
  })
})
