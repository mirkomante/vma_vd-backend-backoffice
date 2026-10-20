import { GlobalMessagePage } from '@/components/app/global-message/global-message-page'
import { loadGlobalMessagePageData } from '@/lib/app/globalMessage/loadGlobalMessagePageData'
import { requireAppAccess, requireAppSection } from '@/lib/app/requireAppAccess'
import { GLOBAL_MESSAGE_PAGE_TITLE } from '@/lib/menu/globalMessage/copy'

export const metadata = {
  title: `${GLOBAL_MESSAGE_PAGE_TITLE} · Area App`,
}

export default async function MenuGlobalMessagePage() {
  const user = await requireAppAccess()
  requireAppSection(user, 'menu')

  const data = await loadGlobalMessagePageData()

  return <GlobalMessagePage initialData={data} />
}
