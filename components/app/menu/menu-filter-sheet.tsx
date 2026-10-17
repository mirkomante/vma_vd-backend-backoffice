'use client'

import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type MenuFilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
  onApply: () => void
  onReset: () => void
}

export function MenuFilterSheet({
  open,
  onOpenChange,
  title = 'Filtri',
  children,
  onApply,
  onReset,
}: MenuFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        <SheetFooter className="flex-row gap-2">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onReset}>
            Azzera
          </Button>
          <Button type="button" size="lg" className="flex-1" onClick={onApply}>
            Applica
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
