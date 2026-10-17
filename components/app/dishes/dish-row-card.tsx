'use client'

import { MenuContentRowActions } from '@/components/app/menu/menu-content-row-actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  PIATTI_STATUS_DISABLED,
  PIATTI_STATUS_SOLD_OUT,
  PIATTI_TOGGLE_LABEL,
} from '@/lib/menu/dishes/copy'
import { dishDisplayStatus, dishDisplayStatusLabel } from '@/lib/menu/dishes/displayStatus'
import type { DishListRow } from '@/lib/menu/dishes/groupByCategory'
import { formatSoldOutExpiryLine } from '@/lib/menu/dishes/soldOutExpiryText'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'

type DishRowCardProps = {
  dish: DishListRow
  serviceHours: ServiceHoursRow[]
  now: Date
  onToggleSoldOut: (checked: boolean) => void
  onEdit: () => void
  onVisibility: () => void
  onDelete: () => void
  pending?: boolean
}

export function DishRowCard({
  dish,
  serviceHours,
  now,
  onToggleSoldOut,
  onEdit,
  onVisibility,
  onDelete,
  pending,
}: DishRowCardProps) {
  const status = dishDisplayStatus(dish)
  const statusLabel = dishDisplayStatusLabel(status)
  const expiry =
    status === 'soldOut' ? formatSoldOutExpiryLine(now, serviceHours) : null
  const disabledRow = Boolean(dish.disabled)

  return (
    <Card
      size="sm"
      className={disabledRow ? 'opacity-50' : undefined}
      aria-label={`${dish.name}, ${formatMenuPriceEuro(dish.price)}, ${statusLabel}`}
    >
      <CardContent className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{dish.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-sm text-muted-foreground">{formatMenuPriceEuro(dish.price)}</p>
            {status !== 'available' ? (
              <>
                <Badge variant={status === 'disabled' ? 'secondary' : 'default'}>
                  {status === 'soldOut' ? PIATTI_STATUS_SOLD_OUT : PIATTI_STATUS_DISABLED}
                </Badge>
                {expiry ? <span className="text-xs text-muted-foreground">{expiry}</span> : null}
              </>
            ) : null}
          </div>
        </div>
        <MenuContentRowActions
          itemName={dish.name}
          toggleLabel={PIATTI_TOGGLE_LABEL}
          toggleChecked={Boolean(dish.soldOut)}
          toggleDisabled={disabledRow || pending}
          showToggleLabel
          onToggleChange={onToggleSoldOut}
          onEdit={onEdit}
          onDelete={onDelete}
          visibilityAction={disabledRow ? 'enable' : 'disable'}
          onVisibilityAction={onVisibility}
        />
      </CardContent>
    </Card>
  )
}
