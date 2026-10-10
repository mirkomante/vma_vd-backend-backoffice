import { SectionPlaceholder } from '@/components/app/section-placeholder'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'

export const metadata = {
  title: 'Orari · Area App',
}

export default async function HoursPlaceholderPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'hours')

  return <SectionPlaceholder title="Orari" />
}
