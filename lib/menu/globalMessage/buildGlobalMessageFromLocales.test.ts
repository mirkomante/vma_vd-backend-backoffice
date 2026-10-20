import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { buildAvailabilityDocument } from '@/lib/menu/availability/buildAvailabilityDocument'

import { buildGlobalMessageFromLocales } from './buildGlobalMessageFromLocales.ts'

const emptyState = {
  dishes: [],
  wines: [],
  drinks: [],
  spirits: [],
  fixedMenus: [],
  services: [],
  globalMessageIt: '',
  globalMessageEn: '',
}

describe('buildGlobalMessageFromLocales', () => {
  const cases: { it: string; en: string }[] = [
    { it: 'Ciao', en: 'Hello' },
    { it: 'Solo IT', en: '' },
    { it: '', en: 'Only EN' },
    { it: '', en: '' },
  ]

  for (const { it: itText, en: enText } of cases) {
    it(`coincide con buildAvailabilityDocument (${itText || '∅'}, ${enText || '∅'})`, () => {
      const fromHelper = buildGlobalMessageFromLocales(itText, enText)
      const doc = buildAvailabilityDocument(
        { ...emptyState, globalMessageIt: itText, globalMessageEn: enText },
        new Date('2026-01-01T12:00:00.000Z'),
      )
      assert.deepEqual(fromHelper, doc.globalMessage)
    })
  }
})
