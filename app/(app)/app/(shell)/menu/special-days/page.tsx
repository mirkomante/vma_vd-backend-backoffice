import { SpecialDaysPage } from '@/components/app/special-days/special-days-page'
import { loadSpecialDaysPageContext } from '@/lib/app/specialDays/loadSpecialDaysPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { SPECIAL_DAYS_PAGE_TITLE } from '@/lib/menu/specialDays/copy'

export const metadata = {
  title: `${SPECIAL_DAYS_PAGE_TITLE} · Area App`,
}

export default async function MenuSpecialDaysPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadSpecialDaysPageContext()

  return <SpecialDaysPage context={context} />
}
