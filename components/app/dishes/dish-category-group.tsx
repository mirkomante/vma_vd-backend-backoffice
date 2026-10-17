'use client'

import { DishRowCard } from '@/components/app/dishes/dish-row-card'
import { DishRowTable } from '@/components/app/dishes/dish-row-table'
import {
  PIATTI_COLUMN_ACTIONS_SR,
  PIATTI_COLUMN_NAME,
  PIATTI_COLUMN_PRICE,
  PIATTI_COLUMN_SOLD_OUT,
  PIATTI_COLUMN_STATUS,
} from '@/lib/menu/dishes/copy'
import type { DishCategoryGroup, DishListRow } from '@/lib/menu/dishes/groupByCategory'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'

type DishCategoryGroupBlockProps = {
  group: DishCategoryGroup
  serviceHours: ServiceHoursRow[]
  now: Date
  pendingDishId: string | null
  onToggleSoldOut: (dish: DishListRow, checked: boolean) => void
  onEdit: (dish: DishListRow) => void
  onVisibility: (dish: DishListRow) => void
  onDelete: (dish: DishListRow) => void
}

export function DishCategoryGroupBlock({
  group,
  serviceHours,
  now,
  pendingDishId,
  onToggleSoldOut,
  onEdit,
  onVisibility,
  onDelete,
}: DishCategoryGroupBlockProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold">{group.heading}</h2>
      <div className="hidden md:block">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>{PIATTI_COLUMN_NAME}</TableHead>
              <TableHead className="w-24">{PIATTI_COLUMN_PRICE}</TableHead>
              <TableHead className="w-40">{PIATTI_COLUMN_STATUS}</TableHead>
              <TableHead className="w-20">{PIATTI_COLUMN_SOLD_OUT}</TableHead>
              <TableHead className="w-36">
                <span className="sr-only">{PIATTI_COLUMN_ACTIONS_SR}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.dishes.map((dish) => (
              <DishRowTable
                key={dish.id}
                dish={dish}
                serviceHours={serviceHours}
                now={now}
                pending={String(pendingDishId) === String(dish.id)}
                onToggleSoldOut={(checked) => onToggleSoldOut(dish, checked)}
                onEdit={() => onEdit(dish)}
                onVisibility={() => onVisibility(dish)}
                onDelete={() => onDelete(dish)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2 md:hidden">
        {group.dishes.map((dish) => (
          <DishRowCard
            key={dish.id}
            dish={dish}
            serviceHours={serviceHours}
            now={now}
            pending={String(pendingDishId) === String(dish.id)}
            onToggleSoldOut={(checked) => onToggleSoldOut(dish, checked)}
            onEdit={() => onEdit(dish)}
            onVisibility={() => onVisibility(dish)}
            onDelete={() => onDelete(dish)}
          />
        ))}
      </div>
    </section>
  )
}
