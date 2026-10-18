import { ServicesCatalogPage } from '@/components/app/services/services-catalog-page'
import { loadServicesPageContext } from '@/lib/app/services/loadServicesPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { SERVIZI_PAGE_TITLE } from '@/lib/menu/services/copy'

export const metadata = {
  title: `${SERVIZI_PAGE_TITLE} · Area App`,
}

export default async function MenuServicesPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadServicesPageContext()

  return <ServicesCatalogPage context={context} />
}
