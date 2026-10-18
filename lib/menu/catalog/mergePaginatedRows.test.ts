import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { mergePaginatedRows } from './mergePaginatedRows.ts'

describe('mergePaginatedRows', () => {
  it('unisce senza doppioni e ordina per nome', () => {
    const a = [
      { id: 1, name: 'Zinfandel' },
      { id: 2, name: 'Barbera' },
    ]
    const b = [
      { id: 2, name: 'Barbera' },
      { id: 3, name: 'Chianti' },
    ]
    const merged = mergePaginatedRows(a, b)
    assert.deepEqual(merged.map((r) => r.id), [2, 3, 1])
  })
})
