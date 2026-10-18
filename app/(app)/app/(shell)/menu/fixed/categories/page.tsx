import { FixedMenuCategoriesPage } from '@/components/app/fixed-menus/fixed-menu-categories-page'
import { loadFixedMenuCategoriesPageContext } from '@/lib/app/fixedMenus/loadFixedMenusPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { MENU_FISSI_PAGE_TITLE, MENU_FISSI_TAB_CATEGORIES } from '@/lib/menu/fixed-menus/copy'

export const metadata = {
  title: `${MENU_FISSI_PAGE_TITLE} · ${MENU_FISSI_TAB_CATEGORIES} · Area App`,
}

export default async function MenuFixedCategoriesPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadFixedMenuCategoriesPageContext()

  return <FixedMenuCategoriesPage context={context} />
}
