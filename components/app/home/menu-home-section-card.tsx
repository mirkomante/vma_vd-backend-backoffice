import { loadMenuHomeStatus } from '@/lib/app/home/loadMenuHomeStatus'
import type { HomeSectionCardDef } from '@/lib/app/navigation'

import { MenuHomeStatusLineText } from './menu-home-status-line'
import { SectionCard } from './section-card'

type MenuHomeSectionCardProps = {
  card: HomeSectionCardDef
}

export async function MenuHomeSectionCard({ card }: MenuHomeSectionCardProps) {
  const status = await loadMenuHomeStatus()
  const statusSlot =
    status.kind === 'ready' ? <MenuHomeStatusLineText text={status.line} /> : null

  return <SectionCard card={card} statusSlot={statusSlot} />
}
