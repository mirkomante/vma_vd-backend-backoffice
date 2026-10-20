import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import {
  applyDevPublishReadDelay,
  markGlobalMessageSaveForDevPublishDelay,
  resetDevPublishReadDelayForTests,
} from './devPublishReadDelay.ts'

const actual = { effectiveIt: 'nuovo', updatedAtIso: '2026-01-02T12:00:00.000Z' }
const previous = { effectiveIt: 'vecchio', updatedAtIso: '2026-01-01T12:00:00.000Z' }

describe('devPublishReadDelay', () => {
  afterEach(() => {
    resetDevPublishReadDelayForTests()
    delete process.env.APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS
    process.env.NODE_ENV = 'test'
  })

  it('ritorna lo snapshot precedente finché non scade il ritardo', () => {
    process.env.APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS = '5000'
    markGlobalMessageSaveForDevPublishDelay(previous, 1000)
    assert.deepEqual(applyDevPublishReadDelay(actual, 2000), previous)
    assert.deepEqual(applyDevPublishReadDelay(actual, 7000), actual)
  })

  it('senza ritardo passa il valore attuale', () => {
    assert.deepEqual(applyDevPublishReadDelay(actual, 1000), actual)
  })
})
