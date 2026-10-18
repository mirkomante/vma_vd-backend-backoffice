'use client'

import { Badge } from '@/components/ui/badge'
import type { FixedMenuListRow } from '@/lib/app/fixedMenus/types'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  MENU_FISSI_BADGE_DISABLED,
  MENU_FISSI_BADGE_SPECIAL_ONLY,
  MENU_FISSI_COLUMN_ACTIONS_SR,
  MENU_FISSI_COLUMN_NAME,
  MENU_FISSI_COLUMN_PRICE,
  MENU_FISSI_COLUMN_VISIBILITY,
  MENU_FISSI_TOGGLE_LABEL,
  menuFissiDishCountLabel,
  menuFissiListCount,
} from '@/lib/menu/fixed-menus/copy'
import { menuVisibilityLabel } from '@/lib/menu/fixedMenus/visibilityLabels'
import type { CatalogListConfig } from '@/components/app/menu/catalog/catalog-list-config'
import { fixedMenusCatalogTexts } from './fixed-menus-catalog-texts'

export const fixedMenusCatalogConfig: CatalogListConfig<FixedMenuListRow> = {
  texts: {
    ...fixedMenusCatalogTexts,
    disabledBadge: MENU_FISSI_BADGE_DISABLED,
    toggleLabel: MENU_FISSI_TOGGLE_LABEL,
    columnActionsSr: MENU_FISSI_COLUMN_ACTIONS_SR,
  },
  formatListCount: menuFissiListCount,
  showAvailabilityColumn: true,
  tableColumns: [
    { id: 'name', header: MENU_FISSI_COLUMN_NAME },
    { id: 'visibility', header: MENU_FISSI_COLUMN_VISIBILITY, headerClassName: 'w-32' },
    { id: 'price', header: MENU_FISSI_COLUMN_PRICE, headerClassName: 'w-28' },
    { id: 'available', header: MENU_FISSI_TOGGLE_LABEL, headerClassName: 'w-28' },
    { id: 'actions', header: MENU_FISSI_COLUMN_ACTIONS_SR, headerClassName: 'w-24' },
  ],
  renderTableCells: (row) => {
    const disabledRow = Boolean(row.disabled)
    return [
      <div key="name" className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{row.name}</span>
          {row.specialOnly ? (
            <Badge variant="secondary">{MENU_FISSI_BADGE_SPECIAL_ONLY}</Badge>
          ) : null}
          {disabledRow ? <Badge variant="outline">{MENU_FISSI_BADGE_DISABLED}</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">{menuFissiDishCountLabel(row.dishCount)}</p>
      </div>,
      <span key="visibility" className="text-sm">
        {menuVisibilityLabel(row.visibility)}
      </span>,
      <span key="price" className="text-sm">
        {formatMenuPriceEuro(row.price)}
      </span>,
    ]
  },
  renderCardSecondary: (row) =>
    `${formatMenuPriceEuro(row.price)} · ${menuVisibilityLabel(row.visibility)} · ${menuFissiDishCountLabel(row.dishCount)}`,
  renderCardTertiary: (row) => {
    const badges: string[] = []
    if (row.specialOnly) {
      badges.push(MENU_FISSI_BADGE_SPECIAL_ONLY)
    }
    return badges.join(' ')
  },
  tableRowAriaLabel: (row) =>
    `${row.name}, ${menuVisibilityLabel(row.visibility)}, ${formatMenuPriceEuro(row.price)}`,
}
