'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { AppNavIcon } from '@/components/app/app-nav-icon'
import { Card, CardContent } from '@/components/ui/card'
import type { HomeSectionCardDef } from '@/lib/app/navigation'

type SectionCardProps = {
  card: HomeSectionCardDef
}

export function SectionCard({ card }: SectionCardProps) {
  return (
    // ui-check-allow: scheda di sezione intera tappabile (shell spec §8)
    <Link
      href={card.href}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
            <AppNavIcon name={card.iconKey} className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{card.title}</div>
            <div className="text-xs text-muted-foreground">{card.description}</div>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
