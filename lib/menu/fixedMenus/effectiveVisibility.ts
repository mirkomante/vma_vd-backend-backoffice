import type { MenuVisibilityValue } from '@/lib/menu/visibilityField'

import { menuVisibilityMealPhrase } from './visibilityLabels'

export type FixedMenuVisibilityAlert =
  | { kind: 'info'; categoryName: string; meal: 'a pranzo' | 'a cena' }
  | { kind: 'error'; categoryName: string; categoryMeal: 'a pranzo' | 'a cena'; menuMeal: 'a pranzo' | 'a cena' }

/** Intersezione menù + categoria (ADR-108 / ADR-112). */
export function fixedMenusEffectiveVisibility(
  menuVisibility: MenuVisibilityValue,
  categoryVisibility: MenuVisibilityValue,
): MenuVisibilityValue | null {
  if (menuVisibility === 'always') {
    return categoryVisibility === 'always' ? 'always' : categoryVisibility
  }
  if (categoryVisibility === 'always') {
    return menuVisibility
  }
  if (menuVisibility === categoryVisibility) {
    return menuVisibility
  }
  return null
}

export function fixedMenuVisibilityAlert(
  menuVisibility: MenuVisibilityValue,
  categoryVisibility: MenuVisibilityValue,
  categoryName: string,
): FixedMenuVisibilityAlert | null {
  if (categoryVisibility === 'always') {
    return null
  }
  if (menuVisibility === 'always') {
    return {
      kind: 'info',
      categoryName,
      meal: menuVisibilityMealPhrase(categoryVisibility),
    }
  }
  const effective = fixedMenusEffectiveVisibility(menuVisibility, categoryVisibility)
  if (effective === null) {
    return {
      kind: 'error',
      categoryName,
      categoryMeal: menuVisibilityMealPhrase(categoryVisibility),
      menuMeal: menuVisibilityMealPhrase(menuVisibility),
    }
  }
  return null
}

export function prefillMenuVisibilityFromCategory(
  categoryVisibility: MenuVisibilityValue,
  visibilityTouched: boolean,
): MenuVisibilityValue | null {
  if (visibilityTouched) {
    return null
  }
  return categoryVisibility
}
