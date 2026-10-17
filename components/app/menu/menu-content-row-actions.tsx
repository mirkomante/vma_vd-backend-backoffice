'use client'

import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
type MenuContentRowActionsProps = {
  itemName: string
  toggleLabel: string
  toggleChecked: boolean
  onToggleChange: (checked: boolean) => void
  onEdit: () => void
  onDelete?: () => void
  visibilityAction?: 'disable' | 'enable'
  onVisibilityAction?: () => void
  toggleDisabled?: boolean
  showToggleLabel?: boolean
}

export function MenuContentRowActions({
  itemName,
  toggleLabel,
  toggleChecked,
  onToggleChange,
  onEdit,
  onDelete,
  visibilityAction,
  onVisibilityAction,
  toggleDisabled = false,
  showToggleLabel = false,
}: MenuContentRowActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-0">
      <div className="flex flex-col items-center gap-0.5">
        <Switch
          checked={toggleChecked}
          disabled={toggleDisabled}
          onCheckedChange={onToggleChange}
          aria-label={`${toggleLabel}: ${itemName}`}
        />
        {showToggleLabel ? (
          <span className="text-xs text-muted-foreground">{toggleLabel}</span>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        aria-label={`Modifica ${itemName}`}
      >
        <Pencil className="size-4" aria-hidden />
      </Button>
      {visibilityAction && onVisibilityAction ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onVisibilityAction}
          aria-label={
            visibilityAction === 'disable'
              ? `Disabilita ${itemName}`
              : `Abilita ${itemName}`
          }
        >
          {visibilityAction === 'disable' ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </Button>
      ) : null}
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={`Elimina ${itemName}`}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  )
}
