import { FixedMenusListPage } from '@/components/app/fixed-menus/fixed-menus-list-page'
import { loadFixedMenusPageContext } from '@/lib/app/fixedMenus/loadFixedMenusPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { MENU_FISSI_PAGE_TITLE } from '@/lib/menu/fixed-menus/copy'

export const metadata = {
  title: `${MENU_FISSI_PAGE_TITLE} · Area App`,
}

export default async function MenuFixedPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadFixedMenusPageContext()

  return <FixedMenusListPage context={context} />
}
