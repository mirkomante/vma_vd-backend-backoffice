import { SectionPlaceholder } from '@/components/app/section-placeholder'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'

export const metadata = {
  title: 'Piatti · Area App',
}

export default async function MenuPlaceholderPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  return <SectionPlaceholder title="Piatti" />
}
