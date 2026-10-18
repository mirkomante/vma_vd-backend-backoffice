import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { spiritFormToUpdateData, validateSpiritForm } from './formModel.ts'
import { emptySpiritFormValues } from './types.ts'

describe('spiritFormModel', () => {
  it('validate richiede nome, tipologia, paese e prezzo', () => {
    const errors = validateSpiritForm(emptySpiritFormValues())
    assert.ok(errors.name)
    assert.ok(errors.typeId)
    assert.ok(errors.countryId)
    assert.ok(errors.price)
  })

  it('update non invia volume e mantiene abv invariato byte-identico', () => {
    const initial = {
      ...emptySpiritFormValues(),
      name: 'Test',
      typeId: '1',
      countryId: '2',
      priceInput: '9,00',
      abv: '43,5%',
      formatSnapshot: { abv: '43,5%', aging: null },
    }
    const values = { ...initial, name: 'Test 2' }
    const patch = spiritFormToUpdateData(initial, values)
    assert.equal('volume' in patch, false)
    assert.equal(patch.abv, undefined)
    assert.equal(patch.name, 'Test 2')
  })
})
