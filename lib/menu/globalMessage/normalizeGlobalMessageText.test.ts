import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  collapseGlobalMessageNewlines,
  normalizeGlobalMessageForSave,
} from './normalizeGlobalMessageText.ts'

describe('normalizeGlobalMessageText', () => {
  it('a capo come spazio', () => {
    assert.equal(collapseGlobalMessageNewlines('Domani chiusi\nper ferie.'), 'Domani chiusi per ferie.')
  })

  it('trim al salvataggio', () => {
    assert.equal(normalizeGlobalMessageForSave('  oggi chiusi  '), 'oggi chiusi')
  })
})
