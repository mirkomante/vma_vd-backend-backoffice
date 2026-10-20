import { MENU_GENERAL_SLUG } from '@/lib/menu/constants'
import type { Payload } from 'payload'

import { managerUser } from '../menu-list/payload-actions'

/** Solo per ripristino del Global in test messaggio globale (overrideAccess manager). */
export async function readMenuGeneralTexts(
  payload: Payload,
  managerEmail: string,
): Promise<{ messageIt: string; messageEn: string }> {
  const user = await managerUser(payload, managerEmail)
  const itDoc = await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale: 'it',
    overrideAccess: false,
    user,
  })
  let messageEn = ''
  try {
    const enDoc = await payload.findGlobal({
      slug: MENU_GENERAL_SLUG,
      depth: 0,
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: false,
      user,
    })
    messageEn = (enDoc as { globalMessage?: string }).globalMessage ?? ''
  } catch {
    messageEn = ''
  }
  return {
    messageIt: (itDoc as { globalMessage?: string }).globalMessage ?? '',
    messageEn,
  }
}

export async function writeMenuGeneralTexts(
  payload: Payload,
  managerEmail: string,
  values: { messageIt: string; messageEn: string },
): Promise<void> {
  const user = await managerUser(payload, managerEmail)
  await payload.updateGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale: 'it',
    overrideAccess: false,
    user,
    data: { globalMessage: values.messageIt },
  })
  await payload.updateGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: false,
    user,
    data: { globalMessage: values.messageEn },
  })
}
