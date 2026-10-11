'use server'

import { APIError, ValidationError } from 'payload'

import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import { hoursFormValuesFromGlobal, hoursFormValuesToWriteData } from '@/lib/app/hours/formModel'
import type { HoursFormValues } from '@/lib/app/hours/types'
import { shouldSimulateHoursLoadError, shouldSimulateHoursSaveError } from '@/lib/app/hours/devSimulate'
import { mapServerValidationPath } from '@/lib/app/hours/validateForm'
import type { HoursFieldKey } from '@/lib/app/hours/types'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import type { ImpostazioniSistema } from '@/payload-types'

export type LoadHoursResult =
  | { ok: true; values: HoursFormValues }
  | { ok: false; error: 'load' }

export type SaveHoursResult =
  | { ok: true; values: HoursFormValues }
  | {
      ok: false
      error: 'server' | 'validation'
      fieldErrors?: Partial<Record<HoursFieldKey, string>>
      message?: string
    }

export async function loadHoursSettingsAction(): Promise<LoadHoursResult> {
  if (shouldSimulateHoursLoadError()) {
    return { ok: false, error: 'load' }
  }

  try {
    const req = await createAppPayloadRequest('/app/hours')
    const doc = (await req.payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      req,
    })) as ImpostazioniSistema

    return { ok: true, values: hoursFormValuesFromGlobal(doc) }
  } catch {
    return { ok: false, error: 'load' }
  }
}

function extractValidationErrors(error: unknown): Partial<Record<HoursFieldKey, string>> {
  const fieldErrors: Partial<Record<HoursFieldKey, string>> = {}
  if (!(error instanceof ValidationError)) {
    return fieldErrors
  }
  for (const item of error.data.errors ?? []) {
    const key = mapServerValidationPath(item.path)
    if (key && item.message) {
      fieldErrors[key] = item.message
    }
  }
  return fieldErrors
}

export async function saveHoursSettingsAction(
  values: HoursFormValues,
): Promise<SaveHoursResult> {
  if (shouldSimulateHoursSaveError()) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest('/app/hours')
    const data = hoursFormValuesToWriteData(values)

    await req.payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      req,
      data: data as Partial<ImpostazioniSistema>,
    })

    const doc = (await req.payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      req,
    })) as ImpostazioniSistema

    return { ok: true, values: hoursFormValuesFromGlobal(doc) }
  } catch (error) {
    if (error instanceof ValidationError) {
      const fieldErrors = extractValidationErrors(error)
      return {
        ok: false,
        error: 'validation',
        fieldErrors,
        message: error.message,
      }
    }
    if (error instanceof APIError && error.status === 403) {
      return { ok: false, error: 'server' }
    }
    return { ok: false, error: 'server' }
  }
}
