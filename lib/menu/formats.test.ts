import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  DRINK_ABV_ERROR_MESSAGE,
  DRINK_VOLUME_ERROR_MESSAGE,
  SPIRIT_ABV_ERROR_MESSAGE,
  SPIRIT_AGING_ERROR_MESSAGE,
  WINE_ABV_ERROR_MESSAGE,
  WINE_VOLUME_ERROR_MESSAGE,
  WINE_YEAR_ERROR_MESSAGE,
  isCanonicalWineYear,
  normalizeSpiritAgingForImport,
  normalizeSpiritAbvForImport,
  normalizeWineAbvForImport,
  normalizeWineVolumeForImport,
  normalizeWineYearForImport,
  validateDrinkAbvField,
  validateDrinkVolumeField,
  validateSpiritAbvField,
  validateSpiritAgingField,
  validateWineAbvField,
  validateWineVolumeField,
  validateWineYearField,
} from './formats.ts'

const CURRENT_YEAR = 2026

describe('wine year validate (forma esatta)', () => {
  it('accetta solo NV maiuscolo o quattro cifre', () => {
    assert.equal(isCanonicalWineYear('2020', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('1900', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear(String(CURRENT_YEAR), CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('NV', CURRENT_YEAR), true)
    assert.equal(isCanonicalWineYear('nv', CURRENT_YEAR), false)
    assert.equal(isCanonicalWineYear(' 2015 ', CURRENT_YEAR), false)
    assert.equal(isCanonicalWineYear('1899', CURRENT_YEAR), false)
    assert.equal(isCanonicalWineYear(String(CURRENT_YEAR + 1), CURRENT_YEAR), false)
  })

  it('validate rifiuta varianti con messaggio spec', () => {
    assert.equal(
      validateWineYearField('nv', { operation: 'create' }),
      WINE_YEAR_ERROR_MESSAGE(CURRENT_YEAR),
    )
    assert.equal(
      validateWineYearField(' 2015 ', { operation: 'create' }),
      WINE_YEAR_ERROR_MESSAGE(CURRENT_YEAR),
    )
    assert.equal(
      validateWineYearField('1899', { operation: 'create' }),
      WINE_YEAR_ERROR_MESSAGE(CURRENT_YEAR),
    )
    assert.equal(
      validateWineYearField(String(CURRENT_YEAR + 1), { operation: 'create' }),
      WINE_YEAR_ERROR_MESSAGE(CURRENT_YEAR),
    )
  })

  it('import normalizes NV case', () => {
    const r = normalizeWineYearForImport('nv', CURRENT_YEAR)
    assert.equal(r.ok, true)
    if (r.ok) {
      assert.equal(r.canonical, 'NV')
    }
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

describe('wine volume and abv validate vs import', () => {
  const abvRejectCases = ['13', '13.5%', '13,50%', ' 13% ', '13 %', '12,8%'] as const

  for (const raw of abvRejectCases) {
    it(`validate abv rifiuta «${raw}»`, () => {
      assert.equal(validateWineAbvField(raw, { operation: 'create' }), WINE_ABV_ERROR_MESSAGE)
    })
  }

  it('validate volume rifiuta varianti', () => {
    assert.equal(validateWineVolumeField('75cl', { operation: 'create' }), WINE_VOLUME_ERROR_MESSAGE)
    assert.equal(validateWineVolumeField('75 CL', { operation: 'create' }), WINE_VOLUME_ERROR_MESSAGE)
    assert.equal(validateWineVolumeField('75 cl', { operation: 'create' }), true)
  })

  it('import normalizza capacità e grado', () => {
    const vol = normalizeWineVolumeForImport('75cl')
    assert.equal(vol.ok, true)
    if (vol.ok) {
      assert.equal(vol.canonical, '75 cl')
    }
    const abv = normalizeWineAbvForImport('13.5%')
    assert.equal(abv.ok, true)
    if (abv.ok) {
      assert.equal(abv.canonical, '13,5%')
    }
    assert.equal(normalizeWineAbvForImport('12,8%').ok, false)
  })
})

describe('spirit validate vs import', () => {
  it('validate abv rifiuta 46%', () => {
    assert.equal(validateSpiritAbvField('46%', { operation: 'create' }), SPIRIT_ABV_ERROR_MESSAGE)
    assert.equal(validateSpiritAbvField('40.5%', { operation: 'create' }), SPIRIT_ABV_ERROR_MESSAGE)
    assert.equal(validateSpiritAbvField('40%', { operation: 'create' }), true)
  })

  it('validate aging rifiuta varianti', () => {
    assert.equal(
      validateSpiritAgingField('5 ANNI', { operation: 'create' }),
      SPIRIT_AGING_ERROR_MESSAGE,
    )
    assert.equal(
      validateSpiritAgingField(' 5 anni', { operation: 'create' }),
      SPIRIT_AGING_ERROR_MESSAGE,
    )
    assert.equal(validateSpiritAgingField('5 anni', { operation: 'create' }), true)
  })

  it('import normalizza aging e abv', () => {
    const aging = normalizeSpiritAgingForImport('10  ANNI')
    assert.equal(aging.ok, true)
    if (aging.ok) {
      assert.equal(aging.canonical, '10 anni')
    }
    assert.equal(normalizeSpiritAbvForImport('40%').ok, true)
    assert.equal(normalizeSpiritAbvForImport('46%').ok, false)
  })
})

describe('drink validate', () => {
  it('volume e abv solo forma esatta', () => {
    assert.equal(validateDrinkVolumeField('75cl', { operation: 'create' }), DRINK_VOLUME_ERROR_MESSAGE)
    assert.equal(validateDrinkAbvField('20%', { operation: 'create' }), DRINK_ABV_ERROR_MESSAGE)
    assert.equal(validateDrinkAbvField('5,5%', { operation: 'create' }), true)
  })
})
