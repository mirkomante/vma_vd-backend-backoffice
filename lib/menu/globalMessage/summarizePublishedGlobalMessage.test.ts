import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  effectiveItFromPublishedDocument,
  summarizePublishedGlobalMessageFromRaw,
} from './summarizePublishedGlobalMessage.ts'

describe('summarizePublishedGlobalMessage', () => {
  it('null se raw assente', () => {
    assert.equal(summarizePublishedGlobalMessageFromRaw(null), null)
  })

  it('null se JSON non valido', () => {
    assert.equal(summarizePublishedGlobalMessageFromRaw('{'), null)
  })

  it('nessun messaggio se globalMessage assente', () => {
    const raw = JSON.stringify({ schemaVersion: 1, updatedAt: '2026-01-01T12:00:00.000Z', dishes: {} })
    const summary = summarizePublishedGlobalMessageFromRaw(raw)
    assert.deepEqual(summary, {
      effectiveIt: '',
      updatedAtIso: '2026-01-01T12:00:00.000Z',
    })
  })

  it('effectiveIt dal file', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      updatedAt: '2026-01-01T12:00:00.000Z',
      dishes: {},
      globalMessage: { it: 'Ciao', en: 'Hi' },
    })
    assert.equal(summarizePublishedGlobalMessageFromRaw(raw)?.effectiveIt, 'Ciao')
    const minimalDoc = {
      schemaVersion: 1 as const,
      updatedAt: 'x',
      dishes: {},
      wines: {},
      drinks: {},
      spirits: {},
      fixedMenus: {},
      services: {},
      globalMessage: { it: '', en: 'EN only' },
    }
    assert.equal(effectiveItFromPublishedDocument(minimalDoc), 'EN only')
  })
})
