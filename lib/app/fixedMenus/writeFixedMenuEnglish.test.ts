import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { FixedMenu } from '@/payload-types'

import { buildFixedMenuEnglishUpdateData } from './writeFixedMenuEnglish.ts'
import type { FixedMenuFormValues } from './types'

describe('buildFixedMenuEnglishUpdateData', () => {
  it('riscrive tutte le righe piatti con id e dish', () => {
    const itDoc = {
      id: 1,
      name: 'Menu IT',
      price: 10,
      category: 1,
      visibility: 'always',
      dishes: [
        { id: 'row-a', dish: 10, portion: '2 pezzi' },
        { id: 'row-b', dish: 20, portion: null },
      ],
    } as unknown as FixedMenu

    const values = {
      nameEn: 'Menu EN',
      descriptionEn: 'Desc EN',
      dishes: [
        {
          rowId: 'row-a',
          dishId: '10',
          dishName: 'P1',
          dishStatus: 'available',
          portionIt: '2 pezzi',
          portionEn: '2 pieces',
        },
        {
          rowId: 'row-b',
          dishId: '20',
          dishName: 'P2',
          dishStatus: 'available',
          portionIt: '',
          portionEn: '',
        },
      ],
    } as Pick<FixedMenuFormValues, 'nameEn' | 'descriptionEn' | 'dishes'>

    const data = buildFixedMenuEnglishUpdateData(itDoc, values as FixedMenuFormValues)
    assert.equal(data.name, 'Menu EN')
    assert.equal(data.description, 'Desc EN')
    assert.equal(data.dishes.length, 2)
    assert.deepEqual(data.dishes[0], { id: 'row-a', dish: 10, portion: '2 pieces' })
    assert.deepEqual(data.dishes[1], { id: 'row-b', dish: 20, portion: '' })
  })

  it('name vuoto resta vuoto (no fallback italiano)', () => {
    const itDoc = {
      id: 1,
      name: 'Solo IT',
      price: 1,
      category: 1,
      visibility: 'always',
      dishes: [],
    } as unknown as FixedMenu
    const data = buildFixedMenuEnglishUpdateData(itDoc, {
      nameEn: '   ',
      descriptionEn: '',
      dishes: [],
    } as FixedMenuFormValues)
    assert.equal(data.name, '')
  })
})
