'use client'

import { Badge } from '@/components/ui/badge'
import type { SpiritListRow } from '@/lib/app/spirits/types'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  DISTILLATI_BADGE_DISABLED,
  DISTILLATI_COLUMN_ACTIONS_SR,
  DISTILLATI_COLUMN_AVAILABLE,
  DISTILLATI_COLUMN_COUNTRY,
  DISTILLATI_COLUMN_NAME,
  DISTILLATI_COLUMN_PRICE,
} from '@/lib/menu/spirits/copy'
import { formatSpiritCardTertiary, formatSpiritSubline } from '@/lib/menu/spirits/display'
import type { CatalogListConfig } from '@/components/app/menu/catalog/catalog-list-config'
import { spiritsCatalogTexts } from './spirits-catalog-texts'

export const spiritsCatalogConfig: CatalogListConfig<SpiritListRow> = {
  texts: spiritsCatalogTexts,
  showAvailabilityColumn: true,
  tableColumns: [
    { id: 'name', header: DISTILLATI_COLUMN_NAME },
    { id: 'country', header: DISTILLATI_COLUMN_COUNTRY, headerClassName: 'w-40' },
    { id: 'price', header: DISTILLATI_COLUMN_PRICE, headerClassName: 'w-28' },
    { id: 'available', header: DISTILLATI_COLUMN_AVAILABLE, headerClassName: 'w-28' },
    { id: 'actions', header: DISTILLATI_COLUMN_ACTIONS_SR, headerClassName: 'w-24' },
  ],
  renderTableCells: (row) => {
    const disabledRow = Boolean(row.disabled)
    const sub = formatSpiritSubline(row.aging, row.abv)
    return [
      <div key="name" className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{row.name}</span>
          {disabledRow ? <Badge variant="outline">{DISTILLATI_BADGE_DISABLED}</Badge> : null}
        </div>
        {sub ? <p className="truncate text-sm text-muted-foreground">{sub}</p> : null}
      </div>,
      <span key="country" className="text-sm">{row.countryName}</span>,
      <span key="price" className="text-sm">{formatMenuPriceEuro(row.price)}</span>,
    ]
  },
  renderCardSecondary: (row) => formatSpiritSubline(row.aging, row.abv),
  renderCardTertiary: (row) => formatSpiritCardTertiary(row.price, row.countryName),
  tableRowAriaLabel: (row) => `${row.name}, ${formatMenuPriceEuro(row.price)}`,
}
