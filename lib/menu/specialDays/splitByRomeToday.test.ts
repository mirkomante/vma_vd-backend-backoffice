import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { splitSpecialDaysByRomeToday } from './splitByRomeToday.ts'

describe('splitSpecialDaysByRomeToday', () => {
  const today = '2026-10-15T12:00:00.000Z'

  it('oggi in Prossimi, ieri in Passati', () => {
    const days = [
      { date: '2026-10-14T12:00:00.000Z', id: 'past' },
      { date: '2026-10-15T12:00:00.000Z', id: 'today' },
      { date: '2026-10-16T12:00:00.000Z', id: 'future' },
    ]
    const { upcoming, past } = splitSpecialDaysByRomeToday(days, today)
    assert.deepEqual(upcoming.map((d) => d.id), ['today', 'future'])
    assert.deepEqual(past.map((d) => d.id), ['past'])
  })
})
