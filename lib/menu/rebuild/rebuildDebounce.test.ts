import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MENU_REBUILD_DEBOUNCE_MS } from './constants.ts'
import {
  isWithinRebuildDebounceWindow,
  parseRebuildStartedBuildId,
} from './rebuildDebounce.ts'

describe('isWithinRebuildDebounceWindow', () => {
  const started = new Date('2026-11-16T10:00:00.000Z')

  it('dentro la finestra', () => {
    const now = new Date(started.getTime() + 60_000)
    assert.equal(isWithinRebuildDebounceWindow(started, now, MENU_REBUILD_DEBOUNCE_MS), true)
  })

  it('fuori la finestra', () => {
    const now = new Date(started.getTime() + MENU_REBUILD_DEBOUNCE_MS)
    assert.equal(isWithinRebuildDebounceWindow(started, now, MENU_REBUILD_DEBOUNCE_MS), false)
  })

  it('rifiuta now precedente a startedAt', () => {
    const now = new Date(started.getTime() - 1)
    assert.equal(isWithinRebuildDebounceWindow(started, now, MENU_REBUILD_DEBOUNCE_MS), false)
  })
})

describe('parseRebuildStartedBuildId', () => {
  it('estrae l’id dal detail', () => {
    assert.equal(parseRebuildStartedBuildId('rebuild-started: abc-123'), 'abc-123')
    assert.equal(parseRebuildStartedBuildId('rebuild-started: id non disponibile'), 'id non disponibile')
  })

  it('restituisce null se il prefisso non combacia', () => {
    assert.equal(parseRebuildStartedBuildId('availability-reset: ok'), null)
    assert.equal(parseRebuildStartedBuildId(''), null)
  })
})