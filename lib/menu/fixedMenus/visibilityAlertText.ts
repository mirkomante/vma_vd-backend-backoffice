import type { FixedMenuVisibilityAlert } from './effectiveVisibility.ts'

export function formatFixedMenuVisibilityAlertText(alert: FixedMenuVisibilityAlert): string {
  if (alert.kind === 'info') {
    return `La categoria «${alert.categoryName}» compare solo ${alert.meal}: anche questo menù compare solo ${alert.meal}.`
  }
  return `La categoria «${alert.categoryName}» compare solo ${alert.categoryMeal} e il menù solo ${alert.menuMeal}: non comparirà mai.`
}
