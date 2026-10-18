import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { applyDishPickerSelection } from './applyDishPickerSelection.ts'
import {
  fixedMenuVisibilityAlert,
  fixedMenusEffectiveVisibility,
  prefillMenuVisibilityFromCategory,
} from './effectiveVisibility.ts'
import { groupFixedMenusByCategory } from './groupFixedMenusByCategory.ts'
import { moveListItem } from './moveListItem.ts'

describe('moveListItem', () => {
  it('scambia con il vicino', () => {
    assert.deepEqual(moveListItem(['a', 'b', 'c'], 1, 'up'), ['b', 'a', 'c'])
    assert.deepEqual(moveListItem(['a', 'b', 'c'], 1, 'down'), ['a', 'c', 'b'])
  })

  it('non cambia ai bordi', () => {
    assert.deepEqual(moveListItem(['a'], 0, 'up'), ['a'])
    assert.deepEqual(moveListItem(['a', 'b'], 1, 'down'), ['a', 'b'])
  })
})

describe('applyDishPickerSelection', () => {
  const rows = [
    { dishId: '1', rowId: 'r1', portionIt: 'A', portionEn: '' },
    { dishId: '2', rowId: 'r2', portionIt: 'B', portionEn: '' },
  ]

  it('mantiene ordine e porzioni, aggiunge in fondo', () => {
    const next = applyDishPickerSelection(rows, ['2', '3'], (id) => ({
      dishId: id,
      portionIt: '',
      portionEn: '',
    }))
    assert.deepEqual(next.map((r) => r.dishId), ['2', '3'])
    assert.equal(next[0]?.portionIt, 'B')
  })
})

describe('fixedMenusEffectiveVisibility', () => {
  it('intersezione pranzo/cena', () => {
    assert.equal(fixedMenusEffectiveVisibility('lunch_only', 'lunch_only'), 'lunch_only')
    assert.equal(fixedMenusEffectiveVisibility('lunch_only', 'dinner_only'), null)
    assert.equal(fixedMenusEffectiveVisibility('always', 'lunch_only'), 'lunch_only')
  })
})

describe('fixedMenuVisibilityAlert', () => {
  it('avviso informativo se categoria limitata e menù sempre', () => {
    const alert = fixedMenuVisibilityAlert('always', 'lunch_only', 'Business lunch')
    assert.equal(alert?.kind, 'info')
  })

  it('avviso errore se visibilità non si incrociano', () => {
    const alert = fixedMenuVisibilityAlert('lunch_only', 'dinner_only', 'X')
    assert.equal(alert?.kind, 'error')
  })
})

describe('prefillMenuVisibilityFromCategory', () => {
  it('non sovrascrive dopo scelta manuale', () => {
    assert.equal(prefillMenuVisibilityFromCategory('lunch_only', true), null)
    assert.equal(prefillMenuVisibilityFromCategory('lunch_only', false), 'lunch_only')
  })
})

describe('groupFixedMenusByCategory', () => {
  it('ordina categorie e menù per nome', () => {
    const groups = groupFixedMenusByCategory([
      {
        id: 1,
        name: 'Zeta',
        categoryId: 'b',
        categoryName: 'Beta',
        categoryDisabled: false,
        categoryVisibility: 'always',
      },
      {
        id: 2,
        name: 'Alfa',
        categoryId: 'a',
        categoryName: 'Alfa',
        categoryDisabled: true,
        categoryVisibility: 'lunch_only',
      },
    ])
    assert.equal(groups[0]?.typeName, 'Alfa')
    assert.equal(groups[0]?.rows[0]?.name, 'Alfa')
    assert.match(groups[1]?.heading ?? '', /Beta/)
  })
})
