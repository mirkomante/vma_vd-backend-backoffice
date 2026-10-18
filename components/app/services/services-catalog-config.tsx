'use client'

import { Badge } from '@/components/ui/badge'
import type { ServiceListRow } from '@/lib/app/services/types'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  SERVIZI_BADGE_DISABLED,
  SERVIZI_COLUMN_ACTIONS_SR,
  SERVIZI_COLUMN_AVAILABLE,
  SERVIZI_COLUMN_NAME,
  SERVIZI_COLUMN_PRICE,
  serviziListCount,
} from '@/lib/menu/services/copy'
import type { CatalogListConfig } from '@/components/app/menu/catalog/catalog-list-config'
import { servicesCatalogTexts } from './services-catalog-texts'

export const servicesCatalogConfig: CatalogListConfig<ServiceListRow> = {
  texts: servicesCatalogTexts,
  formatListCount: serviziListCount,
  showAvailabilityColumn: true,
  tableColumns: [
    { id: 'name', header: SERVIZI_COLUMN_NAME },
    { id: 'price', header: SERVIZI_COLUMN_PRICE, headerClassName: 'w-28' },
    { id: 'available', header: SERVIZI_COLUMN_AVAILABLE, headerClassName: 'w-28' },
    { id: 'actions', header: SERVIZI_COLUMN_ACTIONS_SR, headerClassName: 'w-24' },
  ],
  renderTableCells: (row) => {
    const disabledRow = Boolean(row.disabled)
    return [
      <div key="name" className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{row.name}</span>
          {disabledRow ? <Badge variant="outline">{SERVIZI_BADGE_DISABLED}</Badge> : null}
        </div>
      </div>,
      <span key="price" className="text-sm">{formatMenuPriceEuro(row.price)}</span>,
    ]
  },
  renderCardSecondary: (row) => formatMenuPriceEuro(row.price),
  tableRowAriaLabel: (row) => `${row.name}, ${formatMenuPriceEuro(row.price)}`,
}
