'use client'

import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
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
  description?: string
  children: ReactNode
  onApply: () => void
  onReset: () => void
}

export function MenuFilterSheet({
  open,
  onOpenChange,
  title = 'Filtri',
  description,
  children,
  onApply,
  onReset,
}: MenuFilterSheetProps) {
  const isMobile = useIsMobile()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">{children}</div>
        <SheetFooter className="flex-row gap-2">
          <Button type="button" size="lg" className="flex-1" onClick={onApply}>
            Applica
          </Button>
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onReset}>
            Azzera
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
