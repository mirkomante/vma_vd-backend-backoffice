import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  boundaryInstantRome,
  firstResetBoundaryBetween,
  listServiceStartBoundariesBetween,
  nextServiceStartBoundaryAfter,
  type ServiceHoursRow,
} from './serviceBoundaries.ts'

const SERVICES: ServiceHoursRow[] = [
  { name: 'lunch', startTime: '12:30', endTime: '14:30' },
  { name: 'dinner', startTime: '19:30', endTime: '22:30' },
]

function instantRome(romeDate: string, hhmm: string): Date {
  const d = boundaryInstantRome(romeDate, hhmm)
  assert.ok(d, `boundary ${romeDate} ${hhmm}`)
  return d
}

describe('nextServiceStartBoundaryAfter', () => {
  it('prima del pranzo → pranzo stesso giorno', () => {
    const after = instantRome('2026-10-15', '10:00')
    const next = nextServiceStartBoundaryAfter(after, SERVICES)
    assert.equal(next?.service, 'lunch')
    assert.equal(next?.romeDate, '2026-10-15')
  })

  it('tra pranzo e cena → cena stesso giorno', () => {
    const after = instantRome('2026-10-15', '15:00')
    const next = nextServiceStartBoundaryAfter(after, SERVICES)
    assert.equal(next?.service, 'dinner')
    assert.equal(next?.romeDate, '2026-10-15')
  })

  it('dopo la cena → pranzo giorno successivo', () => {
    const after = instantRome('2026-10-15', '23:00')
    const next = nextServiceStartBoundaryAfter(after, SERVICES)
    assert.equal(next?.service, 'lunch')
    assert.equal(next?.romeDate, '2026-10-16')
  })

  it('ora legale primavera: confine calcolato', () => {
    const gap = boundaryInstantRome('2026-03-29', '02:30')
    assert.ok(gap)
    const after = instantRome('2026-03-29', '08:00')
    const next = nextServiceStartBoundaryAfter(after, SERVICES)
    assert.equal(next?.service, 'lunch')
    assert.equal(next?.romeDate, '2026-03-29')
  })

  it('orari vuoti → null', () => {
    const after = instantRome('2026-10-15', '10:00')
    assert.equal(nextServiceStartBoundaryAfter(after, []), null)
    assert.equal(
      nextServiceStartBoundaryAfter(after, [
        { name: 'lunch', startTime: '', endTime: '14:30' },
        { name: 'dinner', startTime: '', endTime: '22:30' },
      ]),
      null,
    )
  })

  it('coincide con il primo confine che userebbe il reset 6.4', () => {
    const cases = [
      { label: 'mattina', after: '2026-10-15', time: '10:00', now: '2026-10-15', nowTime: '23:00' },
      { label: 'pomeriggio', after: '2026-10-15', time: '15:00', now: '2026-10-15', nowTime: '23:00' },
      { label: 'sera', after: '2026-10-15', time: '23:00', now: '2026-10-16', nowTime: '14:00' },
      { label: 'DST', after: '2026-03-29', time: '08:00', now: '2026-03-29', nowTime: '23:00' },
    ]

    for (const c of cases) {
      const after = instantRome(c.after, c.time)
      const now = instantRome(c.now, c.nowTime)
      const next = nextServiceStartBoundaryAfter(after, SERVICES)
      const resetFirst = firstResetBoundaryBetween(after, now, SERVICES)
      assert.deepEqual(
        next?.instant.toISOString(),
        resetFirst?.instant.toISOString(),
        `reset coherence ${c.label}`,
      )
      if (next) {
        const between = listServiceStartBoundariesBetween(after, next.instant, SERVICES)
        assert.equal(between.length, 1, `single boundary ${c.label}`)
        assert.equal(between[0].instant.toISOString(), next.instant.toISOString())
      }
    }
  })
})
