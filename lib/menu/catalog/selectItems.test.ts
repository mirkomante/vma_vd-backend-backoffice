import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { buildSelectItems } from './selectItems.ts'

describe('buildSelectItems', () => {
  it('valore salvato fuori elenco: mostra il nome salvato', () => {
    const items = buildSelectItems([{ id: '1', label: 'Italia' }], '99', 'Libano')
    assert.equal(items['1'], 'Italia')
    assert.equal(items['99'], 'Libano')
  })

  it('valore cambiato dall’utente: il nuovo id usa l’etichetta dalle opzioni', () => {
    const items = buildSelectItems(
      [
        { id: '1', label: 'Italia' },
        { id: '2', label: 'Francia' },
      ],
      '1',
      'Italia (salvata)',
    )
    const currentId = '2'
    assert.equal(items[currentId], 'Francia')
    assert.equal(items['1'], 'Italia')
    assert.notEqual(items[currentId], 'Italia (salvata)')
  })

  it('opzioni non ancora caricate: mostra comunque il nome salvato', () => {
    const items = buildSelectItems([], '42', 'Giappone')
    assert.equal(Object.keys(items).length, 1)
    assert.equal(items['42'], 'Giappone')
  })

  it('valore salvato dentro l’elenco: nessuna duplicazione, etichetta dalle opzioni', () => {
    const items = buildSelectItems([{ id: '1', label: 'Italia' }], '1', 'Nome obsoleto')
    assert.equal(Object.keys(items).length, 1)
    assert.equal(items['1'], 'Italia')
  })

  it('usa il valore come etichetta se manca savedLabel', () => {
    const items = buildSelectItems([], '12,8%', null)
    assert.equal(items['12,8%'], '12,8%')
  })
})
