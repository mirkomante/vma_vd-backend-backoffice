import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { boundaryInstantRome } from '../availability/serviceBoundaries.ts'

import {
  formatSoldOutExpiryLine,
  formatSoldOutSwitchDescription,
} from './soldOutExpiryText.ts'

const SERVICES = [
  { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
  { name: 'dinner' as const, startTime: '19:30', endTime: '22:30' },
]

function at(romeDate: string, hhmm: string): Date {
  const d = boundaryInstantRome(romeDate, hhmm)
  assert.ok(d)
  return d
}

describe('formatSoldOutExpiryLine', () => {
  it('tre fasce della giornata', () => {
    assert.equal(
      formatSoldOutExpiryLine(at('2026-10-15', '10:00'), SERVICES),
      'fino all’apertura del pranzo',
    )
    assert.equal(
      formatSoldOutExpiryLine(at('2026-10-15', '15:00'), SERVICES),
      'fino all’apertura della cena',
    )
    assert.equal(
      formatSoldOutExpiryLine(at('2026-10-15', '23:00'), SERVICES),
      'fino all’apertura del pranzo di domani',
    )
  })

  it('orari vuoti → null e descrizione modulo generica', () => {
    const now = at('2026-10-15', '10:00')
    assert.equal(formatSoldOutExpiryLine(now, []), null)
    assert.equal(
      formatSoldOutSwitchDescription(now, []),
      'Temporaneo: si azzera da solo all’inizio del servizio successivo.',
    )
  })
})
