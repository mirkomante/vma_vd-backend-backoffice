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
  normalizeDrinkAbvForImport,
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
    for (const rejected of ['8 anni', '20 anni', '25 anni'] as const) {
      assert.equal(validateSpiritAgingField(rejected, { operation: 'create' }), SPIRIT_AGING_ERROR_MESSAGE)
    }
  })

  it('import accetta invecchiamenti estesi senza arrotondare', () => {
    for (const years of ['14', '15', '16', '21'] as const) {
      const aging = normalizeSpiritAgingForImport(`${years} anni`)
      assert.equal(aging.ok, true)
      if (aging.ok) {
        assert.equal(aging.canonical, `${years} anni`)
      }
    }
    assert.equal(normalizeSpiritAgingForImport('8 anni').ok, false)
    assert.equal(normalizeSpiritAgingForImport('20 anni').ok, false)
    const fifteen = normalizeSpiritAgingForImport('15 anni')
    assert.equal(fifteen.ok, true)
    if (fifteen.ok) {
      assert.equal(fifteen.canonical, '15 anni')
      assert.notEqual(fifteen.canonical, '12 anni')
      assert.notEqual(fifteen.canonical, '18 anni')
    }
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

  it('import normalizza suffisso % vol; validate abv resta rigido', () => {
    const volVariants = ['30 % vol', '45% vol', '30 %vol', '30% vol.', '45 % VOL'] as const
    for (const raw of volVariants) {
      const spirit = normalizeSpiritAbvForImport(raw)
      assert.equal(spirit.ok, true)
      if (spirit.ok) {
        assert.match(spirit.canonical ?? '', /^(30|45)%$/)
      }
      assert.equal(validateSpiritAbvField(raw, { operation: 'create' }), SPIRIT_ABV_ERROR_MESSAGE)
    }
    assert.equal(normalizeSpiritAbvForImport('30 vol').ok, false)
    assert.equal(validateWineAbvField('30 % vol', { operation: 'create' }), WINE_ABV_ERROR_MESSAGE)
    const wineVol = normalizeWineAbvForImport('12,5 % vol')
    assert.equal(wineVol.ok, true)
    if (wineVol.ok) {
      assert.equal(wineVol.canonical, '12,5%')
    }
    const drinkVol = normalizeDrinkAbvForImport('5 % vol')
    assert.equal(drinkVol.ok, true)
    if (drinkVol.ok) {
      assert.equal(drinkVol.canonical, '5%')
    }
  })
})

describe('drink validate', () => {
  it('volume e abv solo forma esatta', () => {
    assert.equal(validateDrinkVolumeField('75cl', { operation: 'create' }), DRINK_VOLUME_ERROR_MESSAGE)
    assert.equal(validateDrinkAbvField('20%', { operation: 'create' }), DRINK_ABV_ERROR_MESSAGE)
    assert.equal(validateDrinkAbvField('5,5%', { operation: 'create' }), true)
  })
})
