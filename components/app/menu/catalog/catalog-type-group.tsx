'use client'

import { MenuContentRowActions } from '@/components/app/menu/menu-content-row-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import type { CatalogListConfig, CatalogListRowBase } from './catalog-list-config'

type CatalogTypeGroupBlockProps<TRow extends CatalogListRowBase> = {
  group: CatalogTypeGroup<TRow>
  config: CatalogListConfig<TRow>
  pendingRowId: string | null
  onToggleAvailable: (row: TRow, checked: boolean) => void
  onEdit: (row: TRow) => void
  onDelete: (row: TRow) => void
}

export function CatalogTypeGroupBlock<TRow extends CatalogListRowBase>({
  group,
  config,
  pendingRowId,
  onToggleAvailable,
  onEdit,
  onDelete,
}: CatalogTypeGroupBlockProps<TRow>) {
  const isMobile = useIsMobile()
  const { texts, tableColumns, renderTableCells, renderCardSecondary, renderCardTertiary, tableRowAriaLabel } =
    config

  return (
    <section className="flex flex-col gap-2" data-block={`gruppo-${group.typeId}`}>
      {group.heading ? <h2 className="text-base font-semibold">{group.heading}</h2> : null}
      {!isMobile ? (
      <div>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              {tableColumns.map((col) => (
                <TableHead key={col.id} className={col.headerClassName}>
                  {col.header === texts.columnActionsSr ? (
                    <span className="sr-only">{col.header}</span>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.rows.map((row) => {
              const disabledRow = Boolean(row.disabled)
              const cells = renderTableCells(row)
              return (
                <TableRow
                  key={String(row.id)}
                  className={disabledRow ? 'opacity-50' : undefined}
                  aria-label={tableRowAriaLabel(row)}
                >
                  {cells.map((cell, index) => (
                    <TableCell key={tableColumns[index]?.id ?? index}>{cell}</TableCell>
                  ))}
                  {config.showAvailabilityColumn ? (
                    <TableCell>
                      <Switch
                        checked={!disabledRow}
                        disabled={pendingRowId === String(row.id)}
                        onCheckedChange={(checked) => onToggleAvailable(row, checked)}
                        aria-label={`${texts.toggleLabel}: ${row.name}`}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell className="w-24">
                    <div className="flex items-center gap-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(row)}
                        aria-label={`Modifica ${row.name}`}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row)}
                        aria-label={`Elimina ${row.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      ) : (
      <div className="flex flex-col gap-2">
        {group.rows.map((row) => {
          const disabledRow = Boolean(row.disabled)
          const tertiary = renderCardTertiary?.(row)
          return (
            <Card
              key={String(row.id)}
              size="sm"
              className={disabledRow ? 'opacity-50' : undefined}
              aria-label={tableRowAriaLabel(row)}
            >
              <CardContent className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{row.name}</p>
                  <div className="mt-0.5 text-sm text-muted-foreground">{renderCardSecondary(row)}</div>
                  {tertiary ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">{tertiary}</p>
                  ) : null}
                  {disabledRow ? (
                    <Badge variant="outline" className="mt-1">
                      {texts.disabledBadge}
                    </Badge>
                  ) : null}
                </div>
                <MenuContentRowActions
                  itemName={row.name}
                  toggleLabel={texts.toggleLabel}
                  toggleChecked={!disabledRow}
                  toggleDisabled={pendingRowId === String(row.id)}
                  showToggleLabel
                  onToggleChange={(checked) => onToggleAvailable(row, checked)}
                  onEdit={() => onEdit(row)}
                  onDelete={() => onDelete(row)}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}
    </section>
  )
}
