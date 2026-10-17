'use client'

import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

type LocalizedTranslationCollapsibleProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hasEnglish: boolean
  children: ReactNode
}

export function LocalizedTranslationCollapsible({
  open,
  onOpenChange,
  hasEnglish,
  children,
}: LocalizedTranslationCollapsibleProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm">
        <span>Traduzione inglese (facoltativa)</span>
        <span className="flex items-center gap-2">
          <Badge variant="outline">{hasEnglish ? 'Presente' : 'Manca'}</Badge>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}
