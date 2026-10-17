'use client'

import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DishRowActionsIconsProps = {
  itemName: string
  disabledRow: boolean
  onEdit: () => void
  onVisibility: () => void
  onDelete: () => void
  pending?: boolean
}

export function DishRowActionsIcons({
  itemName,
  disabledRow,
  onEdit,
  onVisibility,
  onDelete,
  pending,
}: DishRowActionsIconsProps) {
  return (
    <div className="flex shrink-0 items-center gap-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={onEdit}
        aria-label={`Modifica ${itemName}`}
      >
        <Pencil className="size-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={onVisibility}
        aria-label={disabledRow ? `Abilita ${itemName}` : `Disabilita ${itemName}`}
      >
        {disabledRow ? (
          <Eye className="size-4" aria-hidden />
        ) : (
          <EyeOff className="size-4" aria-hidden />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={onDelete}
        aria-label={`Elimina ${itemName}`}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
