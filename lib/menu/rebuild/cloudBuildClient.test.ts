import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import {
  runMenuRebuildCloudBuildTrigger,
  setCloudBuildClientDepsForTests,
  setMenuRebuildClientTimeoutForTests,
} from './cloudBuildClient.ts'

describe('runMenuRebuildCloudBuildTrigger', () => {
  afterEach(() => {
    setCloudBuildClientDepsForTests(null)
    setMenuRebuildClientTimeoutForTests(null)
  })

  it('interrompe entro il timeout se fetch non completa e rispetta AbortSignal', async () => {
    setMenuRebuildClientTimeoutForTests(80)

    setCloudBuildClientDepsForTests({
      getAccessToken: async () => 'fake-token',
      fetchFn: (_url, init) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal
          if (!signal) {
            reject(new Error('signal mancante'))
            return
          }
          if (signal.aborted) {
            reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
            return
          }
          signal.addEventListener(
            'abort',
            () => {
              reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
            },
            { once: true },
          )
        }),
    })

    const started = Date.now()
    await assert.rejects(
      () => runMenuRebuildCloudBuildTrigger('projects/p/locations/europe-west1/triggers/t'),
      (err: unknown) => {
        const name = err instanceof Error ? err.name : ''
        const message = err instanceof Error ? err.message : String(err)
        return name === 'AbortError' || message.includes('abort') || message.includes('Aborted')
      },
    )
    const elapsed = Date.now() - started
    assert.ok(elapsed < 500, `atteso errore entro ~80 ms, trascorsi ${elapsed} ms`)
    assert.ok(elapsed >= 50, `timeout troppo breve: ${elapsed} ms`)
  })
})