'use client'

import { DishRowActionsIcons } from '@/components/app/dishes/dish-row-actions-icons'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  PIATTI_STATUS_AVAILABLE,
  PIATTI_STATUS_DISABLED,
  PIATTI_STATUS_SOLD_OUT,
  PIATTI_TOGGLE_LABEL,
} from '@/lib/menu/dishes/copy'
import {
  dishDisplayStatus,
  dishDisplayStatusLabel,
} from '@/lib/menu/dishes/displayStatus'
import type { DishListRow } from '@/lib/menu/dishes/groupByCategory'
import { formatSoldOutExpiryLine } from '@/lib/menu/dishes/soldOutExpiryText'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'

type DishRowTableProps = {
  dish: DishListRow
  serviceHours: ServiceHoursRow[]
  now: Date
  onToggleSoldOut: (checked: boolean) => void
  onEdit: () => void
  onVisibility: () => void
  onDelete: () => void
  pending?: boolean
}

export function DishRowTable({
  dish,
  serviceHours,
  now,
  onToggleSoldOut,
  onEdit,
  onVisibility,
  onDelete,
  pending,
}: DishRowTableProps) {
  const status = dishDisplayStatus(dish)
  const statusLabel = dishDisplayStatusLabel(status)
  const expiry =
    status === 'soldOut' ? formatSoldOutExpiryLine(now, serviceHours) : null
  const disabledRow = Boolean(dish.disabled)
  const cardLabel = `${dish.name}, ${formatMenuPriceEuro(dish.price)}, ${statusLabel}`

  return (
    <TableRow className={disabledRow ? 'opacity-50' : undefined} aria-label={cardLabel}>
      <TableCell className="max-w-0 truncate font-medium">{dish.name}</TableCell>
      <TableCell className="whitespace-nowrap">{formatMenuPriceEuro(dish.price)}</TableCell>
      <TableCell>
        {status === 'available' ? (
          <span className="text-sm text-muted-foreground">{PIATTI_STATUS_AVAILABLE}</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <Badge variant={status === 'disabled' ? 'secondary' : 'default'}>
              {status === 'soldOut' ? PIATTI_STATUS_SOLD_OUT : PIATTI_STATUS_DISABLED}
            </Badge>
            {expiry ? <span className="text-xs text-muted-foreground">{expiry}</span> : null}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={Boolean(dish.soldOut)}
          disabled={disabledRow || pending}
          onCheckedChange={onToggleSoldOut}
          aria-label={`${PIATTI_TOGGLE_LABEL}: ${dish.name}`}
        />
      </TableCell>
      <TableCell className="w-36">
        <DishRowActionsIcons
          itemName={dish.name}
          disabledRow={disabledRow}
          onEdit={onEdit}
          onVisibility={onVisibility}
          onDelete={onDelete}
          pending={pending}
        />
      </TableCell>
    </TableRow>
  )
}
