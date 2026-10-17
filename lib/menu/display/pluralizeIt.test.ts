import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { pluralizeIt } from './pluralizeIt.ts'

describe('pluralizeIt', () => {
  it('singolare e plurale', () => {
    assert.equal(pluralizeIt(0, 'piatto', 'piatti'), '0 piatti')
    assert.equal(pluralizeIt(1, 'piatto', 'piatti'), '1 piatto')
    assert.equal(pluralizeIt(2, 'piatto', 'piatti'), '2 piatti')
  })
})
