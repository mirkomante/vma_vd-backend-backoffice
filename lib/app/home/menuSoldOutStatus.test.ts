import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatMenuSoldOutStatusLine } from './menuSoldOutStatus.ts'

describe('formatMenuSoldOutStatusLine', () => {
  it('zero', () => {
    assert.equal(formatMenuSoldOutStatusLine(0), 'Nessun piatto terminato')
  })

  it('singolare', () => {
    assert.equal(formatMenuSoldOutStatusLine(1), '1 piatto terminato')
  })

  it('plurale', () => {
    assert.equal(formatMenuSoldOutStatusLine(3), '3 piatti terminati')
  })
})
