import { SpiritsCatalogPage } from '@/components/app/spirits/spirits-catalog-page'
import { loadSpiritsPageContext } from '@/lib/app/spirits/loadSpiritsPageContext'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { DISTILLATI_PAGE_TITLE } from '@/lib/menu/spirits/copy'

export const metadata = {
  title: `${DISTILLATI_PAGE_TITLE} · Area App`,
}

export default async function MenuSpiritsPage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const context = await loadSpiritsPageContext()

  return <SpiritsCatalogPage context={context} />
}
