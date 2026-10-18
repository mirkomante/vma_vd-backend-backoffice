import { WinesCatalogPage } from '@/components/app/wines/wines-catalog-page'
import { loadWinesPageContext } from '@/lib/app/wines/loadWinesPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { VINI_PAGE_TITLE } from '@/lib/menu/wines/copy'

export const metadata = {
  title: `${VINI_PAGE_TITLE} · Area App`,
}

export default async function MenuWinesPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadWinesPageContext()

  return <WinesCatalogPage context={context} />
}
