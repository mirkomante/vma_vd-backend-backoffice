import { DishesPage } from '@/components/app/dishes/dishes-page'
import { loadDishesPageContext } from '@/lib/app/dishes/loadDishesPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { PIATTI_PAGE_TITLE } from '@/lib/menu/dishes/copy'

export const metadata = {
  title: `${PIATTI_PAGE_TITLE} · Area App`,
}

export default async function MenuDishesPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadDishesPageContext()

  return <DishesPage context={context} />
}
