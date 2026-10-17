import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  MENU_PRICE_EURO_SUFFIX,
  formatMenuPriceAmount,
  formatMenuPriceEuro,
} from './formatPrice.ts'
import { formatSpecialDayDateLong } from './formatSpecialDayDateLong.ts'
import { compareItalianNames, sortByItalianName } from './sortByItalianName.ts'

describe('formatMenuPriceEuro', () => {
  it('elenco con spazio normale prima del euro', () => {
    assert.equal(MENU_PRICE_EURO_SUFFIX, ' €')
    assert.equal(formatMenuPriceEuro(10), '10,00 €')
    assert.equal(formatMenuPriceEuro(48), '48,00 €')
  })

  it('modulo senza simbolo', () => {
    assert.equal(formatMenuPriceAmount(9.5), '9,50')
  })
})

describe('sortByItalianName', () => {
  it('accenti e maiuscole', () => {
    const names = ['Zuppa', 'Écrevisse', 'Anatra', 'agnello']
    const sorted = sortByItalianName(names, (name) => name)
    assert.deepEqual(sorted, ['agnello', 'Anatra', 'Écrevisse', 'Zuppa'])
  })

  it('compareItalianNames coerente con sort', () => {
    assert.ok(compareItalianNames('agnello', 'Anatra') < 0)
    assert.ok(compareItalianNames('Écrevisse', 'Zuppa') < 0)
  })
})

describe('formatSpecialDayDateLong', () => {
  it('formato italiano con giorno della settimana', () => {
    const formatted = formatSpecialDayDateLong('2026-12-31')
    assert.match(formatted, /dicembre/)
    assert.match(formatted, /2026/)
    assert.match(formatted, /31/)
  })
})
