import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { isPublishedGlobalMessageReadable } from './isPublishedGlobalMessageReadable.ts'

describe('isPublishedGlobalMessageReadable', () => {
  it('null o assente → non leggibile', () => {
    assert.equal(isPublishedGlobalMessageReadable(null), false)
    assert.equal(isPublishedGlobalMessageReadable(undefined), false)
  })

  it('summary presente → leggibile', () => {
    assert.equal(
      isPublishedGlobalMessageReadable({
        effectiveIt: 'Ciao',
        updatedAtIso: '2026-01-01T12:00:00.000Z',
      }),
      true,
    )
  })
})
