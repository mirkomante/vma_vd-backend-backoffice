import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatAvailabilityUpdatedAtRome } from './formatAvailabilityUpdatedAtRome.ts'

describe('formatAvailabilityUpdatedAtRome', () => {
  it('ora legale (CEST)', () => {
    const formatted = formatAvailabilityUpdatedAtRome('2026-07-15T10:30:00.000Z')
    assert.match(formatted, /^\d{2}:\d{2}$/)
    assert.equal(formatted, '12:30')
  })

  it('ora solare (CET)', () => {
    assert.equal(formatAvailabilityUpdatedAtRome('2026-01-15T10:30:00.000Z'), '11:30')
  })
})
