import { SectionCard } from '@/components/app/home/section-card'
import { getVisibleHomeSectionCards } from '@/lib/app/navigationForUser'
import { requireAppAccess } from '@/lib/app/requireAppAccess'

export const metadata = {
  title: 'Area App',
}

export default async function AppHomePage() {
  const user = await requireAppAccess()
  const cards = getVisibleHomeSectionCards(user)

  if (cards.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Nessuna sezione disponibile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Il tuo account non ha accesso a nessuna sezione. Se ritieni di dover avere accesso,
          contatta l&apos;amministratore.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Area App</h1>
        <p className="text-sm text-muted-foreground">Scegli una sezione.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <SectionCard key={card.section} card={card} />
        ))}
      </div>
    </div>
  )
}
