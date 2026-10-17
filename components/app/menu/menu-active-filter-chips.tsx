'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

export type MenuActiveFilterChip = {
  id: string
  label: string
}

type MenuActiveFilterChipsProps = {
  filters: readonly MenuActiveFilterChip[]
  onRemove: (id: string) => void
}

export function MenuActiveFilterChips({ filters, onRemove }: MenuActiveFilterChipsProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onRemove(filter.id)}
          aria-label={`Rimuovi filtro ${filter.label}`}
        >
          {filter.label}
          <X className="size-3.5" aria-hidden />
        </Button>
      ))}
    </div>
  )
}
