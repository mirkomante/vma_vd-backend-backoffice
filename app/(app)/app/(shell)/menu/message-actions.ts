'use server'

import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import { markGlobalMessageSaveForDevPublishDelay } from '@/lib/app/globalMessage/devPublishReadDelay'
import { normalizeGlobalMessageFormForSave } from '@/lib/app/globalMessage/formModel'
import type { GlobalMessageFormValues } from '@/lib/app/globalMessage/types'
import {
  readActualPublishedGlobalMessageSnapshot,
  readPublishedGlobalMessageForUi,
  type PublishedSnapshotReadResult,
} from '@/lib/app/globalMessage/readPublishedSnapshot'
import {
  shouldSimulateMenuLoadError,
  shouldSimulateMenuSaveError,
} from '@/lib/app/menu/devSimulate'
import { MENU_GENERAL_SLUG } from '@/lib/menu/constants'
import type { MenuGeneral } from '@/payload-types'

const MESSAGE_PATH = '/app/menu/message'

export type LoadGlobalMessageResult =
  | { ok: true; values: GlobalMessageFormValues }
  | { ok: false; error: 'load' }

export async function loadGlobalMessageSettingsAction(): Promise<LoadGlobalMessageResult> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'load' }
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

    return {
      ok: true,
      values: {
        messageIt: itDoc.globalMessage ?? '',
        messageEn,
      },
    }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeGlobalMessageLocales(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  values: GlobalMessageFormValues,
) {
  await req.payload.updateGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale: 'it',
    overrideAccess: false,
    req,
    data: { globalMessage: values.messageIt },
  })
  await req.payload.updateGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
    data: { globalMessage: values.messageEn },
  })
}

export type SaveGlobalMessageResult =
  | { ok: true; values: GlobalMessageFormValues }
  | { ok: false; error: 'server' }

export async function saveGlobalMessageAction(
  values: GlobalMessageFormValues,
): Promise<SaveGlobalMessageResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  const normalized = normalizeGlobalMessageFormForSave(values)

  try {
    const previousSnapshot = await readActualPublishedGlobalMessageSnapshot()
    const req = await createAppPayloadRequest(MESSAGE_PATH)
    await writeGlobalMessageLocales(req, normalized)
    markGlobalMessageSaveForDevPublishDelay(previousSnapshot, Date.now())
    return { ok: true, values: normalized }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function clearGlobalMessageAction(): Promise<SaveGlobalMessageResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  const empty = { messageIt: '', messageEn: '' }
  try {
    const req = await createAppPayloadRequest(MESSAGE_PATH)
    await writeGlobalMessageLocales(req, empty)
    return { ok: true, values: empty }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function readPublishedGlobalMessageAction(): Promise<PublishedSnapshotReadResult> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'read' }
  }
  return readPublishedGlobalMessageForUi()
}
