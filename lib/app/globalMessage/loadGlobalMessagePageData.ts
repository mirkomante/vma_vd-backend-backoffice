import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import { readPublishedGlobalMessageForUi } from '@/lib/app/globalMessage/readPublishedSnapshot'
import { MENU_GENERAL_SLUG } from '@/lib/menu/constants'
import type { MenuGeneral } from '@/payload-types'

import { emptyGlobalMessageFormValues, type GlobalMessagePageData } from './types'

const MESSAGE_PATH = '/app/menu/message'

export async function loadGlobalMessagePageData(): Promise<GlobalMessagePageData> {
  if (shouldSimulateMenuLoadError()) {
    return {
      values: emptyGlobalMessageFormValues(),
      published: null,
      publishedReadable: false,
      loadError: true,
    }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest(MESSAGE_PATH)
    const itDoc = (await req.payload.findGlobal({
      slug: MENU_GENERAL_SLUG,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuGeneral

    let messageEn = ''
    try {
      const enDoc = (await req.payload.findGlobal({
        slug: MENU_GENERAL_SLUG,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as MenuGeneral
      messageEn = enDoc.globalMessage ?? ''
    } catch {
      // nessuna traduzione
    }

    const publishedRead = await readPublishedGlobalMessageForUi()
    const publishedReadable = publishedRead.ok
    const published = publishedRead.ok ? publishedRead.summary : null

    return {
      values: {
        messageIt: itDoc.globalMessage ?? '',
        messageEn,
      },
      published,
      publishedReadable,
      loadError: false,
    }
  } catch {
    return {
      values: emptyGlobalMessageFormValues(),
      published: null,
      publishedReadable: false,
      loadError: true,
    }
  }
}
