import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import type { MenuVisibilityValue } from '@/lib/menu/visibilityField'
import {
  MENU_FISSI_GROUP_CATEGORY_DISABLED_SUFFIX,
  menuFissiGroupMenuCount,
} from '@/lib/menu/fixed-menus/copy'

import { menuVisibilityLabel } from './visibilityLabels'

export type FixedMenuGroupRow = {
  id: number | string
  name: string
  categoryId: string
  categoryName: string
  categoryDisabled: boolean
  categoryVisibility: MenuVisibilityValue
}

export function formatFixedMenuCategoryGroupHeading(
  categoryName: string,
  menuCount: number,
  categoryVisibility: MenuVisibilityValue,
  categoryDisabled: boolean,
): string {
  const parts = [
    categoryName,
    `${menuFissiGroupMenuCount(menuCount)} · ${menuVisibilityLabel(categoryVisibility)}`,
  ]
  if (categoryDisabled) {
    parts.push(MENU_FISSI_GROUP_CATEGORY_DISABLED_SUFFIX)
  }
  return parts.join(' ')
}

export function groupFixedMenusByCategory<TRow extends FixedMenuGroupRow>(
  rows: readonly TRow[],
): CatalogTypeGroup<TRow>[] {
  const byCategory = new Map<string, CatalogTypeGroup<TRow>>()

  for (const row of rows) {
    let group = byCategory.get(row.categoryId)
    if (!group) {
      group = {
        typeId: row.categoryId,
        typeName: row.categoryName,
        heading: '',
        rows: [],
      }
      byCategory.set(row.categoryId, group)
    }
    group.rows.push(row)
  }

  const groups = [...byCategory.values()]
  for (const group of groups) {
    group.rows.sort((a, b) => compareItalianNames(a.name, b.name))
    const sample = group.rows[0]
    if (sample) {
      group.heading = formatFixedMenuCategoryGroupHeading(
        sample.categoryName,
        group.rows.length,
        sample.categoryVisibility,
        sample.categoryDisabled,
      )
    }
  }

  groups.sort((a, b) => compareItalianNames(a.typeName, b.typeName))
  return groups
}
