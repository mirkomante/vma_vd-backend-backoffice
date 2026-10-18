import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
  PIATTI_FIXED_MENU_LIST_SEPARATOR,
} from './dishes/copy.ts'
import { formatListedReferences } from './formatListedReferences.ts'

describe('formatListedReferences', () => {
  it('elenca tutti se al massimo tre', () => {
    assert.equal(
      formatListedReferences(
        ['A', 'B'],
        3,
        PIATTI_FIXED_MENU_LIST_SEPARATOR,
        PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
      ),
      'A, B',
    )
  })

  it('tronca e aggiunge e altri N', () => {
    assert.equal(
      formatListedReferences(
        ['A', 'B', 'C', 'D'],
        3,
        PIATTI_FIXED_MENU_LIST_SEPARATOR,
        PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
      ),
      'A, B, C, e altri 1',
    )
  })
})
