import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  BEVANDE_FORM_ABV_EMPTY,
  BEVANDE_FORM_COUNTRY_NONE,
  BEVANDE_FORM_VOLUME_EMPTY,
} from '../drinks/copy.ts'
import {
  DISTILLATI_FORM_ABV_EMPTY,
  DISTILLATI_FORM_AGING_EMPTY,
} from '../spirits/copy.ts'
import {
  VINI_FORM_ABV_EMPTY,
  VINI_FORM_VOLUME_EMPTY,
} from '../wines/copy.ts'

import { buildSelectItems } from './selectItems.ts'
import {
  assertNoOptionalSelectPlaceholders,
  fromOptionalSelectValue,
  LEGACY_NO_COUNTRY_VALUE,
  OPTIONAL_SELECT_INTERNAL_VALUE,
  optionalSelectItemsForRoot,
} from './optionalSelectValue.ts'

function chooseEmptyOption(
  current: string,
  selected: string | null | undefined,
): string {
  void current
  return fromOptionalSelectValue(selected)
}

describe('fromOptionalSelectValue', () => {
  it('converte il segnaposto interno in stringa vuota', () => {
    assert.equal(fromOptionalSelectValue(OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(fromOptionalSelectValue(LEGACY_NO_COUNTRY_VALUE), '')
    assert.equal(fromOptionalSelectValue(null), '')
    assert.equal(fromOptionalSelectValue(undefined), '')
    assert.equal(fromOptionalSelectValue(''), '')
  })

  it('lascia invariati i valori reali', () => {
    assert.equal(fromOptionalSelectValue('12 anni'), '12 anni')
    assert.equal(fromOptionalSelectValue('country-id'), 'country-id')
  })
})

describe('optionalSelectItemsForRoot', () => {
  it('mappa la chiave vuota sul segnaposto interno nell’elenco Select', () => {
    const root = optionalSelectItemsForRoot({ '': 'Non indicata', '0,75 l': '0,75 l' })
    assert.equal(root[OPTIONAL_SELECT_INTERNAL_VALUE], 'Non indicata')
    assert.equal(root['0,75 l'], '0,75 l')
    assert.equal(root[''], undefined)
  })
})

describe('tendine facoltative catalogo menù', () => {
  it('distillati — invecchiamento: voce vuota → ""', () => {
    const items = {
      '': DISTILLATI_FORM_AGING_EMPTY,
      ...buildSelectItems([{ id: '12 anni', label: '12 anni' }], ''),
    }
    assert.equal(optionalSelectItemsForRoot(items)[OPTIONAL_SELECT_INTERNAL_VALUE], DISTILLATI_FORM_AGING_EMPTY)
    assert.equal(chooseEmptyOption('12 anni', OPTIONAL_SELECT_INTERNAL_VALUE), '')
  })

  it('distillati — grado: voce vuota → ""', () => {
    assert.equal(chooseEmptyOption('40%', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({
        '': DISTILLATI_FORM_ABV_EMPTY,
        ...buildSelectItems([{ id: '40%', label: '40%' }], ''),
      })[OPTIONAL_SELECT_INTERNAL_VALUE],
      DISTILLATI_FORM_ABV_EMPTY,
    )
  })

  it('bevande — capacità: voce vuota → ""', () => {
    assert.equal(chooseEmptyOption('33 cl', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({
        '': BEVANDE_FORM_VOLUME_EMPTY,
        ...buildSelectItems([{ id: '33 cl', label: '33 cl' }], ''),
      })[OPTIONAL_SELECT_INTERNAL_VALUE],
      BEVANDE_FORM_VOLUME_EMPTY,
    )
  })

  it('bevande — grado: voce vuota → ""', () => {
    assert.equal(chooseEmptyOption('5%', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({
        '': BEVANDE_FORM_ABV_EMPTY,
        ...buildSelectItems([{ id: '5%', label: '5%' }], ''),
      })[OPTIONAL_SELECT_INTERNAL_VALUE],
      BEVANDE_FORM_ABV_EMPTY,
    )
  })

  it('bevande — paese: voce vuota e legacy __no_country__ → ""', () => {
    assert.equal(chooseEmptyOption('1', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(chooseEmptyOption('1', LEGACY_NO_COUNTRY_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({
        '': BEVANDE_FORM_COUNTRY_NONE,
        ...buildSelectItems([{ id: '1', label: 'Italia' }], ''),
      })[OPTIONAL_SELECT_INTERNAL_VALUE],
      BEVANDE_FORM_COUNTRY_NONE,
    )
  })

  it('vini — capacità: voce vuota → ""', () => {
    assert.equal(chooseEmptyOption('0,75 l', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({ '': VINI_FORM_VOLUME_EMPTY, '0,75 l': '0,75 l' })[
        OPTIONAL_SELECT_INTERNAL_VALUE
      ],
      VINI_FORM_VOLUME_EMPTY,
    )
  })

  it('vini — grado: voce vuota → ""', () => {
    assert.equal(chooseEmptyOption('12%', OPTIONAL_SELECT_INTERNAL_VALUE), '')
    assert.equal(
      optionalSelectItemsForRoot({ '': VINI_FORM_ABV_EMPTY, '12%': '12%' })[
        OPTIONAL_SELECT_INTERNAL_VALUE
      ],
      VINI_FORM_ABV_EMPTY,
    )
  })

  it('nessun valore persistibile contiene segnaposti interni', () => {
    for (const sample of ['12 anni', '40%', '33 cl', '5%', '1', '0,75 l', '']) {
      assertNoOptionalSelectPlaceholders(fromOptionalSelectValue(sample))
      assertNoOptionalSelectPlaceholders(fromOptionalSelectValue(OPTIONAL_SELECT_INTERNAL_VALUE))
      assertNoOptionalSelectPlaceholders(fromOptionalSelectValue(LEGACY_NO_COUNTRY_VALUE))
    }
    assert.throws(() => assertNoOptionalSelectPlaceholders(OPTIONAL_SELECT_INTERNAL_VALUE))
    assert.throws(() => assertNoOptionalSelectPlaceholders(LEGACY_NO_COUNTRY_VALUE))
  })
})
