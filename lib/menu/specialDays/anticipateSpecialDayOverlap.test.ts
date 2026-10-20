import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { SPECIAL_DAY_OVERLAP_MESSAGE } from '@/lib/menu/validateSpecialDayOverlap'

import { anticipateSpecialDayOverlap } from './anticipateSpecialDayOverlap.ts'

describe('anticipateSpecialDayOverlap', () => {
  const existing = [
    { id: 1, date: '2026-02-14T12:00:00.000Z', scope: 'dinner' as const, disabled: false },
    { id: 2, date: '2026-02-14T12:00:00.000Z', scope: 'dinner' as const, disabled: true },
  ]

  it('blocca sovrapposizione attiva', () => {
    assert.equal(
      anticipateSpecialDayOverlap(existing, {
        date: '2026-02-14',
        scope: 'day',
        disabled: false,
      }),
      SPECIAL_DAY_OVERLAP_MESSAGE,
    )
  })

  it('ignora disattivati e se stesso', () => {
    assert.equal(
      anticipateSpecialDayOverlap(existing, {
        id: 1,
        date: '2026-02-14',
        scope: 'dinner',
        disabled: false,
      }),
      null,
    )
    assert.equal(
      anticipateSpecialDayOverlap(existing, {
        date: '2026-02-14',
        scope: 'lunch',
        disabled: false,
      }),
      null,
    )
  })
})
