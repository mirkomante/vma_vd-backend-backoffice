import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { effectiveSavedGlobalMessageText } from './effectiveSavedGlobalMessageText.ts'

describe('effectiveSavedGlobalMessageText', () => {
  it('preferisce italiano', () => {
    assert.equal(effectiveSavedGlobalMessageText('Ciao', 'Hi'), 'Ciao')
  })

  it('ripiega su inglese se italiano vuoto', () => {
    assert.equal(effectiveSavedGlobalMessageText('', 'Hi'), 'Hi')
  })

  it('entrambi vuoti', () => {
    assert.equal(effectiveSavedGlobalMessageText('  ', ''), '')
  })
})
