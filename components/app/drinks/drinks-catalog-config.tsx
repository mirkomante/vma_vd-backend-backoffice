'use client'

import { Badge } from '@/components/ui/badge'
import type { DrinkListRow } from '@/lib/app/drinks/types'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  BEVANDE_BADGE_DISABLED,
  BEVANDE_COLUMN_ACTIONS_SR,
  BEVANDE_COLUMN_AVAILABLE,
  BEVANDE_COLUMN_COUNTRY,
  BEVANDE_COLUMN_NAME,
  BEVANDE_COLUMN_PRICE,
} from '@/lib/menu/drinks/copy'
import { formatDrinkCardTertiary, formatDrinkSubline } from '@/lib/menu/drinks/display'
import type { CatalogListConfig } from '@/components/app/menu/catalog/catalog-list-config'
import { drinksCatalogTexts } from './drinks-catalog-texts'

export const drinksCatalogConfig: CatalogListConfig<DrinkListRow> = {
  texts: drinksCatalogTexts,
  showAvailabilityColumn: true,
  tableColumns: [
    { id: 'name', header: BEVANDE_COLUMN_NAME },
    { id: 'country', header: BEVANDE_COLUMN_COUNTRY, headerClassName: 'w-40' },
    { id: 'price', header: BEVANDE_COLUMN_PRICE, headerClassName: 'w-28' },
    { id: 'available', header: BEVANDE_COLUMN_AVAILABLE, headerClassName: 'w-28' },
    { id: 'actions', header: BEVANDE_COLUMN_ACTIONS_SR, headerClassName: 'w-24' },
  ],
  renderTableCells: (row) => {
    const disabledRow = Boolean(row.disabled)
    const sub = formatDrinkSubline(row.volume, row.abv)
    return [
      <div key="name" className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{row.name}</span>
          {disabledRow ? <Badge variant="outline">{BEVANDE_BADGE_DISABLED}</Badge> : null}
        </div>
        {sub ? <p className="truncate text-sm text-muted-foreground">{sub}</p> : null}
      </div>,
      <span key="country" className="text-sm">{row.countryName}</span>,
      <span key="price" className="text-sm">{formatMenuPriceEuro(row.price)}</span>,
    ]
  },
  renderCardSecondary: (row) => formatDrinkSubline(row.volume, row.abv),
  renderCardTertiary: (row) => formatDrinkCardTertiary(row.price, row.countryName),
  tableRowAriaLabel: (row) => `${row.name}, ${formatMenuPriceEuro(row.price)}`,
}
