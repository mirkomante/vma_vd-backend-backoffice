import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { normalizeGlobalMessageFormForSave } from './formModel.ts'

describe('globalMessage formModel', () => {
  it('normalizza a capo e spazi', () => {
    const normalized = normalizeGlobalMessageFormForSave({
      messageIt: '  ciao\nmondo  ',
      messageEn: '',
    })
    assert.equal(normalized.messageIt, 'ciao mondo')
  })
})
