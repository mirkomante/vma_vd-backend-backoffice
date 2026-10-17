import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'node:test'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const SPEC_PATH = join(ROOT, 'docs/design/schermate/piatti/spec.md')
const COPY_PATH = join(ROOT, 'lib/menu/dishes/copy.ts')

const FIXED_EXPORTS = [
  'PIATTI_PAGE_TITLE',
  'PIATTI_PAGE_DESCRIPTION',
  'PIATTI_NEW_BUTTON',
  'PIATTI_SEARCH_PLACEHOLDER',
  'PIATTI_FILTERS_BUTTON',
  'PIATTI_FILTERS_SHEET_DESCRIPTION',
  'PIATTI_TOAST_SOLD_OUT',
  'PIATTI_TOAST_PUBLIC_MINUTES',
  'PIATTI_DELETE_CONFIRM_IRREVERSIBLE',
  'PIATTI_ACTION_ERROR_TITLE',
  'PIATTI_ACTION_ERROR_DESCRIPTION',
  'PIATTI_FORM_NEW_SUBTITLE',
  'PIATTI_FORM_TRANSLATION_HINT',
  'PIATTI_ERROR_PRICE',
  'PIATTI_LIST_PARTIAL_DESCRIPTION',
  'PIATTI_LOAD_ERROR_TITLE',
  'PIATTI_EMPTY_TITLE',
  'PIATTI_NO_RESULTS_TITLE',
  'PIATTI_CLEAR_FILTERS',
] as const

function loadCopyExports(): Record<string, string> {
  const src = readFileSync(COPY_PATH, 'utf8')
  const exports: Record<string, string> = {}
  for (const m of src.matchAll(/^export const (\w+) = '([^']*)'/gm)) {
    exports[m[1]] = m[2]
  }
  for (const m of src.matchAll(/^export const (\w+) =\n  '([^']*)'/gm)) {
    exports[m[1]] = m[2]
  }
  return exports
}

describe('piatti copy vs spec §6', () => {
  it('nessun apostrofo dritto né backtick nei valori', () => {
    const src = readFileSync(COPY_PATH, 'utf8')
    for (const line of src.split('\n')) {
      if (!line.includes('export const')) continue
      const valueMatch = line.match(/= '([^']*)'/) ?? line.match(/= '([^']*)';/)
      if (valueMatch && valueMatch[1].includes('`')) {
        assert.fail(`backtick in ${line}`)
      }
      if (valueMatch && valueMatch[1].includes("'")) {
        assert.fail(`apostrofo dritto in ${line}`)
      }
    }
  })

  it('costanti fisse presenti identiche nella sezione Testi', () => {
    const spec = readFileSync(SPEC_PATH, 'utf8')
    const testiStart = spec.indexOf('## 6. Testi')
    const testiEnd = spec.indexOf('## 7. Comportamenti')
    assert.ok(testiStart >= 0 && testiEnd > testiStart)
    const testiSection = spec.slice(testiStart, testiEnd)
    const copy = loadCopyExports()

    for (const key of FIXED_EXPORTS) {
      const value = copy[key]
      assert.ok(value, `manca export ${key}`)
      assert.ok(
        testiSection.includes(value),
        `«${value}» (${key}) non trovato in spec §6`,
      )
    }
  })
})
