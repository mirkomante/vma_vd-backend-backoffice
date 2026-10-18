import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { validateServiceForm } from './formModel.ts'

describe('validateServiceForm', () => {
  it('accetta prezzi con virgola o punto', () => {
    assert.deepEqual(
      validateServiceForm({ name: 'Coperto', nameEn: '', priceInput: '2,5', disabled: false }),
      {},
    )
    assert.deepEqual(
      validateServiceForm({ name: 'Coperto', nameEn: '', priceInput: '2.50', disabled: false }),
      {},
    )
  })

  it('prezzo vuoto è obbligatorio', () => {
    assert.equal(
      validateServiceForm({ name: 'X', nameEn: '', priceInput: '', disabled: false }).price,
      'Campo obbligatorio.',
    )
  })

  it('rifiuta prezzo non valido', () => {
    assert.ok(validateServiceForm({ name: 'X', nameEn: '', priceInput: 'abc', disabled: false }).price)
  })
})
