import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseDishPriceInput } from './parseDishPrice.ts'

describe('parseDishPriceInput', () => {
  it('forme valide e invalide', () => {
    assert.equal(parseDishPriceInput('9,5'), 9.5)
    assert.equal(parseDishPriceInput('9,50'), 9.5)
    assert.equal(parseDishPriceInput('9.50'), 9.5)
    assert.equal(parseDishPriceInput('abc'), null)
    assert.equal(parseDishPriceInput('9,555'), null)
  })
})
