import { HoursForm } from '@/components/app/hours/hours-form'
import { loadHoursPageData } from '@/lib/app/hours/loadHoursPageData'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'

export const metadata = {
  title: 'Orari · Area App',
}

export default async function HoursPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'hours')

  const { values, loadError } = await loadHoursPageData()

  return <HoursForm initialValues={values} initialLoadError={loadError} />
}
