import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { buildSelectItems } from './selectItems.ts'

describe('buildSelectItems', () => {
  it('include il valore salvato fuori elenco', () => {
    const items = buildSelectItems([{ id: '1', label: 'Italia' }], '99', 'Libano')
    assert.equal(items['1'], 'Italia')
    assert.equal(items['99'], 'Libano')
  })

  it('usa il valore come etichetta se manca savedLabel', () => {
    const items = buildSelectItems([], '12,8%', null)
    assert.equal(items['12,8%'], '12,8%')
  })
})
