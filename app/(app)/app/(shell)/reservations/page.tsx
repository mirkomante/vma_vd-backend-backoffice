import { SectionPlaceholder } from '@/components/app/section-placeholder'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'

export const metadata = {
  title: 'Elenco · Area App',
}

export default async function ReservationsPlaceholderPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'reservations')

  return <SectionPlaceholder title="Prenotazioni" />
}
