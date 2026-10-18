'use client'

import { Badge } from '@/components/ui/badge'
import type { WineListRow } from '@/lib/app/wines/types'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  VINI_BADGE_DISABLED,
  VINI_COLUMN_ACTIONS_SR,
  VINI_COLUMN_AVAILABLE,
  VINI_COLUMN_NAME,
  VINI_COLUMN_ORIGIN,
  VINI_COLUMN_PRICE,
} from '@/lib/menu/wines/copy'
import {
  formatWineOriginLine,
  formatWinePriceCell,
  formatWineSubline,
} from '@/lib/menu/wines/display'
import type { CatalogListConfig } from '@/components/app/menu/catalog/catalog-list-config'
import { winesCatalogTexts } from './wines-catalog-texts'

export const winesCatalogConfig: CatalogListConfig<WineListRow> = {
  texts: winesCatalogTexts,
  showAvailabilityColumn: true,
  tableColumns: [
    { id: 'name', header: VINI_COLUMN_NAME },
    { id: 'origin', header: VINI_COLUMN_ORIGIN, headerClassName: 'w-56' },
    { id: 'price', header: VINI_COLUMN_PRICE, headerClassName: 'w-28' },
    { id: 'available', header: VINI_COLUMN_AVAILABLE, headerClassName: 'w-28' },
    { id: 'actions', header: VINI_COLUMN_ACTIONS_SR, headerClassName: 'w-24' },
  ],
  renderTableCells: (row) => {
    const disabledRow = Boolean(row.disabled)
    const sub = formatWineSubline(row.winery, row.year)
    const price = formatWinePriceCell(row.price, row.glassPrice)
    const origin = formatWineOriginLine(row.countryName, row.regionName)
    return [
      <div key="name" className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{row.name}</span>
          {disabledRow ? <Badge variant="outline">{VINI_BADGE_DISABLED}</Badge> : null}
        </div>
        {sub ? <p className="truncate text-sm text-muted-foreground">{sub}</p> : null}
      </div>,
      <span key="origin" className="text-sm">{origin}</span>,
      <div key="price" className="text-sm">
        <p>{price.main}</p>
        {price.sub ? <p className="text-muted-foreground">{price.sub}</p> : null}
      </div>,
    ]
  },
  renderCardSecondary: (row) => formatWineSubline(row.winery, row.year),
  renderCardTertiary: (row) => {
    const price = formatWinePriceCell(row.price, row.glassPrice)
    const origin = formatWineOriginLine(row.countryName, row.regionName)
    return `${price.main}${origin ? ` · ${origin}` : ''}`
  },
  tableRowAriaLabel: (row) => {
    const price = formatMenuPriceEuro(row.price)
    return `${row.name}, ${price}`
  },
}
