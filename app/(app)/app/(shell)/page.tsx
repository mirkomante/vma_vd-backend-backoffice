import { Suspense } from 'react'

import { MenuHomeSectionCard } from '@/components/app/home/menu-home-section-card'
import { MenuHomeStatusLineSkeleton } from '@/components/app/home/menu-home-status-line'
import { SectionCard } from '@/components/app/home/section-card'
import { hasAnyHomeStatusRow } from '@/lib/app/home/homeStatusRows'
import { getVisibleHomeSectionCards } from '@/lib/app/navigationForUser'
import { requireAppAccess } from '@/lib/app/requireAppAccess'
import { canAccessSection } from '@/lib/auth/canAccessSection'

export const metadata = {
  title: 'Area App',
}

export default async function AppHomePage() {
  const user = await requireAppAccess()
  const cards = getVisibleHomeSectionCards(user)
  const oggiHeading = hasAnyHomeStatusRow(user)

  if (cards.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Nessuna sezione disponibile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Il tuo account non ha accesso a nessuna sezione. Se ritieni di dover avere accesso,
            contatta l&apos;amministratore.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {oggiHeading ? 'Oggi' : 'Area App'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {oggiHeading
            ? 'Situazione di oggi e accesso alle sezioni.'
            : 'Scegli una sezione.'}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          if (card.section === 'menu' && canAccessSection(user, 'menu')) {
            return (
              <Suspense
                key={card.section}
                fallback={
                  <SectionCard card={card} statusSlot={<MenuHomeStatusLineSkeleton />} />
                }
              >
                <MenuHomeSectionCard card={card} />
              </Suspense>
            )
          }
          return <SectionCard key={card.section} card={card} />
        })}
      </div>
    </div>
  )
}
