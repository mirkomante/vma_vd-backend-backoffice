import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { drinkFormToWriteData, validateDrinkForm } from './formModel.ts'
import { emptyDrinkFormValues } from './types.ts'

describe('drinkFormModel', () => {
  it('validate richiede nome, tipologia e prezzo', () => {
    const errors = validateDrinkForm(emptyDrinkFormValues())
    assert.ok(errors.name)
    assert.ok(errors.typeId)
    assert.ok(errors.price)
  })

  it('write senza paese non imposta country', () => {
    const data = drinkFormToWriteData({
      ...emptyDrinkFormValues(),
      name: 'Acqua',
      typeId: '1',
      priceInput: '3,00',
    })
    assert.equal(data.country, undefined)
  })
})
