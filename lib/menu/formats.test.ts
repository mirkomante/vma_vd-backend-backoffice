import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  DRINK_ABV_ERROR_MESSAGE,
  DRINK_VOLUME_ERROR_MESSAGE,
  SPIRIT_ABV_ERROR_MESSAGE,
  SPIRIT_AGING_ERROR_MESSAGE,
  WINE_ABV_ERROR_MESSAGE,
  WINE_YEAR_ERROR_MESSAGE,
  isCanonicalWineYear,
  normalizeSpiritAgingForImport,
  normalizeSpiritAbvForImport,
  normalizeWineAbvForImport,
  normalizeWineVolumeForImport,
  normalizeWineYearForImport,
  validateDrinkAbvField,
  validateSpiritAbvField,
  validateWineAbvField,
  validateWineYearField,
} from './formats.ts'

const CURRENT_YEAR = 2026

describe('wine year', () => {
  it('canonical and NV', () => {
    assert.equal(isCanonicalWineYear('2020', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('1900', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear(String(CURRENT_YEAR), CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('NV', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('nv', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('1899', CURRENT_YEAR), false)
    assert.equal(isCanonicalWineYear(String(CURRENT_YEAR + 1), CURRENT_YEAR), false)
    assert.equal(isCanonicalWineYear('99', CURRENT_YEAR), false)
  })

  it('import normalizes NV case', () => {
    const r = normalizeWineYearForImport('nv', CURRENT_YEAR)
    assert.equal(r.ok, true)
    if (r.ok) {
      assert.equal(r.canonical, 'NV')
    }
  })

  it('import rejects unknown year', () => {
    const r = normalizeWineYearForImport('12,8%', CURRENT_YEAR)
    assert.equal(r.ok, false)
  })

  it('validate message from spec', () => {
    assert.equal(
      validateWineYearField('12,8%', { operation: 'create' }),
      WINE_YEAR_ERROR_MESSAGE(CURRENT_YEAR),
    )
  })

  it('partial update skips untouched field', () => {
    assert.equal(
      validateWineYearField('12,8%', {
        operation: 'update',
        data: { disabled: true },
        previousValue: '12,8%',
      }),
      true,
    )
  })
})

describe('wine volume and abv import', () => {
  it('volume aliases', () => {
    const r = normalizeWineVolumeForImport('75cl')
    assert.equal(r.ok, true)
    if (r.ok) {
      assert.equal(r.canonical, '75 cl')
    }
  })

  it('rejects off-list capacity', () => {
    assert.equal(normalizeWineVolumeForImport('70 cl').ok, false)
  })

  it('abv writing variants without rounding', () => {
    const r = normalizeWineAbvForImport('13.5%')
    assert.equal(r.ok, true)
    if (r.ok) {
      assert.equal(r.canonical, '13,5%')
    }
    assert.equal(normalizeWineAbvForImport('12,8%').ok, false)
  })

  it('validate abv message from spec', () => {
    assert.equal(validateWineAbvField('12,8%', { operation: 'create' }), WINE_ABV_ERROR_MESSAGE)
  })
})

describe('spirit formats', () => {
  it('abv integer grid only', () => {
    assert.equal(normalizeSpiritAbvForImport('40%').ok, true)
    assert.equal(normalizeSpiritAbvForImport('40.5%').ok, false)
    assert.equal(normalizeSpiritAbvForImport('46%').ok, false)
    assert.equal(validateSpiritAbvField('46%', { operation: 'create' }), SPIRIT_ABV_ERROR_MESSAGE)
  })

  it('aging', () => {
    const r = normalizeSpiritAgingForImport('10  ANNI')
    assert.equal(r.ok, true)
    if (r.ok) {
      assert.equal(r.canonical, '10 anni')
    }
    assert.equal(normalizeSpiritAgingForImport('4 anni').ok, false)
  })
})

describe('drink formats', () => {
  it('abv message from spec', () => {
    assert.equal(validateDrinkAbvField('20%', { operation: 'create' }), DRINK_ABV_ERROR_MESSAGE)
  })

  it('volume off-list', () => {
    assert.equal(normalizeWineVolumeForImport('20 cl').ok, false)
    assert.equal(SPIRIT_AGING_ERROR_MESSAGE.includes('24 anni'), true)
    assert.equal(DRINK_VOLUME_ERROR_MESSAGE.includes('75 cl'), true)
  })
})
