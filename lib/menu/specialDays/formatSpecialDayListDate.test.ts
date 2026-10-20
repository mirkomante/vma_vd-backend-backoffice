import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatSpecialDayListDate } from './formatSpecialDayListDate.ts'

describe('formatSpecialDayListDate', () => {
  it('prima lettera maiuscola', () => {
    const formatted = formatSpecialDayListDate('2026-12-31')
    assert.match(formatted, /^[A-ZÀ-Ö]/)
  })
})
