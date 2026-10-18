import type { MenuVisibilityValue } from '@/lib/menu/visibilityField'
import {
  MENU_FISSI_VISIBILITY_ALWAYS,
  MENU_FISSI_VISIBILITY_DINNER,
  MENU_FISSI_VISIBILITY_LUNCH,
} from '@/lib/menu/fixed-menus/copy'

export function menuVisibilityLabel(value: MenuVisibilityValue): string {
  switch (value) {
    case 'lunch_only':
      return MENU_FISSI_VISIBILITY_LUNCH
    case 'dinner_only':
      return MENU_FISSI_VISIBILITY_DINNER
    default:
      return MENU_FISSI_VISIBILITY_ALWAYS
  }
}

export function menuVisibilityMealPhrase(value: MenuVisibilityValue): 'a pranzo' | 'a cena' {
  return value === 'dinner_only' ? 'a cena' : 'a pranzo'
}
