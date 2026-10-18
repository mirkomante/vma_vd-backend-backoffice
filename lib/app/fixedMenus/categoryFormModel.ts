import { MENU_FISSI_ERROR_REQUIRED } from '@/lib/menu/fixed-menus/copy'
import type { FixedMenuCategory } from '@/payload-types'

import type { FixedMenuCategoryFormValues } from './types'

export type FixedMenuCategoryFieldErrors = Partial<Record<'name', string>>

export const FIXED_MENU_CATEGORY_FIELD_DOM_IDS = {
  name: 'fixed-menu-category-field-name',
  nameEn: 'fixed-menu-category-field-name-en',
  visibility: 'fixed-menu-category-field-visibility',
} as const

export function fixedMenuCategoryFormValuesFromDoc(doc: FixedMenuCategory): FixedMenuCategoryFormValues {
  return {
    name: doc.name ?? '',
    nameEn: '',
    visibility: doc.visibility ?? 'always',
    disabled: Boolean(doc.disabled),
  }
}

export function mergeFixedMenuCategoryEnglishName(
  values: FixedMenuCategoryFormValues,
  nameEn: string | null | undefined,
): FixedMenuCategoryFormValues {
  return { ...values, nameEn: nameEn ?? '' }
}

export function hasEnglishFixedMenuCategoryName(values: FixedMenuCategoryFormValues): boolean {
  return values.nameEn.trim().length > 0
}

export function validateFixedMenuCategoryForm(
  values: FixedMenuCategoryFormValues,
): FixedMenuCategoryFieldErrors {
  const errors: FixedMenuCategoryFieldErrors = {}
  if (!values.name.trim()) {
    errors.name = MENU_FISSI_ERROR_REQUIRED
  }
  return errors
}

export function fixedMenuCategoryFormToWriteData(values: FixedMenuCategoryFormValues): {
  name: string
  visibility: FixedMenuCategoryFormValues['visibility']
  disabled: boolean
} {
  return {
    name: values.name.trim(),
    visibility: values.visibility,
    disabled: values.disabled,
  }
}

export function fixedMenuCategoryFormToUpdateData(
  initial: FixedMenuCategoryFormValues,
  values: FixedMenuCategoryFormValues,
): Partial<ReturnType<typeof fixedMenuCategoryFormToWriteData>> {
  const patch: Partial<ReturnType<typeof fixedMenuCategoryFormToWriteData>> = {}
  const next = fixedMenuCategoryFormToWriteData(values)
  const prev = fixedMenuCategoryFormToWriteData(initial)
  if (next.name !== prev.name) {
    patch.name = next.name
  }
  if (next.visibility !== prev.visibility) {
    patch.visibility = next.visibility
  }
  if (next.disabled !== prev.disabled) {
    patch.disabled = next.disabled
  }
  return patch
}
