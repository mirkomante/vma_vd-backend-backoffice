import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { extractBuildIdFromOperation } from './extractBuildIdFromOperation.ts'

describe('extractBuildIdFromOperation', () => {
  it('legge metadata.build.id', () => {
    const body = {
      metadata: {
        '@type': 'type.googleapis.com/google.devtools.cloudbuild.v1.BuildOperationMetadata',
        build: { id: '47e510e6-d849-48e8-99d5-0d24f1191c06' },
      },
    }
    assert.equal(extractBuildIdFromOperation(body), '47e510e6-d849-48e8-99d5-0d24f1191c06')
  })

  it('restituisce null senza metadata.build.id', () => {
    assert.equal(extractBuildIdFromOperation({ metadata: { build: {} } }), null)
    assert.equal(extractBuildIdFromOperation(null), null)
    assert.equal(extractBuildIdFromOperation({ done: true }), null)
  })
})