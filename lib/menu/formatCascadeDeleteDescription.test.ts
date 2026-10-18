import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  CASCADE_DELETE_IRREVERSIBLE,
  formatFixedMenuDeleteDescription,
  formatServiceDeleteDescription,
} from './formatCascadeDeleteDescription.ts'

describe('formatServiceDeleteDescription', () => {
  it('senza uso', () => {
    assert.equal(formatServiceDeleteDescription([]), CASCADE_DELETE_IRREVERSIBLE)
  })

  it('un menù fisso', () => {
    assert.equal(
      formatServiceDeleteDescription(['Degustazione']),
      `Verrà tolto anche da 1 menù fisso: Degustazione. ${CASCADE_DELETE_IRREVERSIBLE}`,
    )
  })

  it('quattro menù con troncamento', () => {
    assert.equal(
      formatServiceDeleteDescription(['M1', 'M2', 'M3', 'M4']),
      `Verrà tolto anche da 4 menù fissi: M1, M2, M3, e altri 1. ${CASCADE_DELETE_IRREVERSIBLE}`,
    )
  })
})

describe('formatFixedMenuDeleteDescription', () => {
  it('senza giorni speciali', () => {
    assert.equal(formatFixedMenuDeleteDescription([]), CASCADE_DELETE_IRREVERSIBLE)
  })

  it('ordina le date', () => {
    const text = formatFixedMenuDeleteDescription(['2026-12-31', '2026-01-02'])
    assert.match(text, /2 giorni speciali/)
    assert.match(text, /Non si può annullare/)
  })
})
