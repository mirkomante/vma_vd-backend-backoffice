import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatAnnualClosureDateUtc } from '@/lib/systemSettings/annualClosures'

type AnnualClosureRowProps = {
  label: string
  dateIso: string
  disabled?: boolean
  onEdit: () => void
  onDelete: () => void
}

export function AnnualClosureRow({
  label,
  dateIso,
  disabled,
  onEdit,
  onDelete,
}: AnnualClosureRowProps) {
  const dateLabel = dateIso ? formatAnnualClosureDateUtc(dateIso) : ''

  return (
    <div className="flex items-center gap-2 border-t py-1.5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground tabular-nums">{dateLabel}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        aria-label={`Modifica chiusura ${label}`}
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        aria-label={`Elimina chiusura ${label}`}
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
