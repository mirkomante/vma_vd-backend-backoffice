import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  CASCADE_DELETE_IRREVERSIBLE,
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
