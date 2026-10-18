import { DrinksCatalogPage } from '@/components/app/drinks/drinks-catalog-page'
import { loadDrinksPageContext } from '@/lib/app/drinks/loadDrinksPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { BEVANDE_PAGE_TITLE } from '@/lib/menu/drinks/copy'

export const metadata = {
  title: `${BEVANDE_PAGE_TITLE} · Area App`,
}

export default async function MenuDrinksPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadDrinksPageContext()

  return <DrinksCatalogPage context={context} />
}
