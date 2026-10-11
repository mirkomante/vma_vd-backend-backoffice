import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import { shouldSimulateHoursLoadError } from '@/lib/app/hours/devSimulate'
import { emptyHoursFormValues, hoursFormValuesFromGlobal } from '@/lib/app/hours/formModel'
import type { HoursFormValues } from '@/lib/app/hours/types'
import type { ImpostazioniSistema } from '@/payload-types'

export type HoursPageData = {
  values: HoursFormValues
  loadError: boolean
}

const fallbackDoc: ImpostazioniSistema = {
  id: 0,
  bnb: { checkInTime: '', checkOutTime: '' },
}

export async function loadHoursPageData(): Promise<HoursPageData> {
  if (shouldSimulateHoursLoadError()) {
    return { values: emptyHoursFormValues(), loadError: true }
  }

  try {
    const req = await createAppPayloadRequest('/app/hours')
    const doc = (await req.payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      req,
    })) as ImpostazioniSistema

    return { values: hoursFormValuesFromGlobal(doc), loadError: false }
  } catch {
    return { values: hoursFormValuesFromGlobal(fallbackDoc), loadError: true }
  }
}
