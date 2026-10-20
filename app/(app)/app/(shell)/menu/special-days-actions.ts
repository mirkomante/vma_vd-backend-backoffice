'use server'

import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  runCatalogSave,
  sleepCatalogLoadDelay,
} from '@/lib/app/menu/catalog/catalogActions'
import {
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import {
  specialDayFormToWriteData,
  type SpecialDayFieldErrors,
} from '@/lib/app/specialDays/formModel'
import type { SpecialDayFormValues, SpecialDayListRow } from '@/lib/app/specialDays/types'
import { compareSpecialDayScope } from '@/lib/menu/specialDays/specialDayScopeSort'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import { SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import { relationshipId, relationshipName } from '@/lib/menu/relationshipId'
import { todayRomeAsSpecialDayDate } from '@/lib/menu/specialDayDate'
import type { SpecialDay } from '@/payload-types'

const SPECIAL_DAYS_PATH = '/app/menu/special-days'

function docToRow(doc: SpecialDay, todayNoon: string): SpecialDayListRow {
  const date = doc.date
  const fixedMenus = doc.content?.fixedMenus ?? []
  const names = fixedMenus
    .map((entry) => relationshipName(entry))
    .filter((name) => name.length > 0)
    .join(', ')
  const fixedMenuIds = fixedMenus
    .map((entry) => relationshipId(entry))
    .filter((id): id is number | string => id != null)
    .map(String)

  return {
    id: String(doc.id),
    date,
    dateInput: date.slice(0, 10),
    scope: doc.scope,
    disabled: Boolean(doc.disabled),
    messageIt: doc.content?.message ?? '',
    menuNames: names,
    fixedMenuIds,
    isToday: date.slice(0, 10) === todayNoon.slice(0, 10),
  }
}

function sortRows(rows: SpecialDayListRow[], direction: 'asc' | 'desc'): SpecialDayListRow[] {
  const copy = [...rows]
  copy.sort((a, b) => {
    const cmp = a.date.localeCompare(b.date)
    if (cmp !== 0) {
      return direction === 'asc' ? cmp : -cmp
    }
    return compareSpecialDayScope(a.scope, b.scope)
  })
  return copy
}

export type ListSpecialDaysResult =
  | { ok: true; upcoming: SpecialDayListRow[]; past: SpecialDayListRow[]; allDays: SpecialDayListRow[] }
  | { ok: false; error: 'load' }

export async function listSpecialDaysAction(): Promise<ListSpecialDaysResult> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'load' }
  }

  await sleepCatalogLoadDelay()

  try {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const todayNoon = todayRomeAsSpecialDayDate()

    const [upcomingRes, pastRes] = await Promise.all([
      req.payload.find({
        collection: SPECIAL_DAYS_SLUG,
        depth: 1,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'date',
        where: {
          date: { greater_than_equal: todayNoon },
        },
      }),
      req.payload.find({
        collection: SPECIAL_DAYS_SLUG,
        depth: 1,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: '-date',
        where: {
          date: { less_than: todayNoon },
        },
      }),
    ])

    const upcoming = sortRows(
      (upcomingRes.docs as SpecialDay[]).map((doc) => docToRow(doc, todayNoon)),
      'asc',
    )
    const past = sortRows(
      (pastRes.docs as SpecialDay[]).map((doc) => docToRow(doc, todayNoon)),
      'desc',
    )

    return { ok: true, upcoming, past, allDays: [...upcoming, ...past] }
  } catch {
    return { ok: false, error: 'load' }
  }
}

export type LoadSpecialDayFormResult =
  | { ok: true; values: SpecialDayFormValues }
  | { ok: false; error: 'load' }

export async function loadSpecialDayFormAction(
  specialDayId: string,
): Promise<LoadSpecialDayFormResult> {
  try {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const doc = (await req.payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: specialDayId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as SpecialDay

    const fixedMenuIds =
      doc.content?.fixedMenus
        ?.map((entry) => relationshipId(entry))
        .filter((id): id is number | string => id != null)
        .map(String) ?? []

    let messageEn = ''
    try {
      const enDoc = (await req.payload.findByID({
        collection: SPECIAL_DAYS_SLUG,
        id: specialDayId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as SpecialDay
      messageEn = enDoc.content?.message ?? ''
    } catch {
      // nessuna traduzione
    }

    return {
      ok: true,
      values: {
        dateInput: doc.date.slice(0, 10),
        scope: doc.scope,
        fixedMenuIds,
        messageIt: doc.content?.message ?? '',
        messageEn,
        disabled: Boolean(doc.disabled),
      },
    }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeSpecialDayEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  values: SpecialDayFormValues,
) {
  await req.payload.update({
    id,
    collection: SPECIAL_DAYS_SLUG,
    context: appLocalApiContext().context,
    data: {
      content: {
        message: values.messageEn.trim(),
      },
    },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveSpecialDayResult =
  | { ok: true; row: SpecialDayListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: SpecialDayFieldErrors }

export async function createSpecialDayAction(
  values: SpecialDayFormValues,
): Promise<SaveSpecialDayResult> {
  let createdId: string | number | null = null
  const saved = await runCatalogSave(SPECIAL_DAYS_PATH, async () => {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const data = specialDayFormToWriteData(values)
    const created = (await req.payload.create({
      collection: SPECIAL_DAYS_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as SpecialDay
    createdId = created.id
    await writeSpecialDayEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    if (saved.error === 'validation') {
      return {
        ok: false,
        error: 'validation',
        fieldErrors: saved.fieldErrors as SpecialDayFieldErrors,
      }
    }
    return { ok: false, error: saved.error }
  }
  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const doc = (await req.payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: createdId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as SpecialDay
    return { ok: true, row: docToRow(doc, todayRomeAsSpecialDayDate()) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateSpecialDayAction(
  specialDayId: string,
  values: SpecialDayFormValues,
): Promise<SaveSpecialDayResult> {
  const saved = await runCatalogSave(SPECIAL_DAYS_PATH, async () => {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const data = specialDayFormToWriteData(values)
    await req.payload.update({
      id: specialDayId,
      collection: SPECIAL_DAYS_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })
    await writeSpecialDayEnglish(req, specialDayId, values)
  })

  if (!saved.ok) {
    if (saved.error === 'validation') {
      const fieldErrors = (saved.fieldErrors ?? {}) as SpecialDayFieldErrors
      return { ok: false, error: 'validation', fieldErrors }
    }
    return { ok: false, error: saved.error }
  }

  try {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const doc = (await req.payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: specialDayId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as SpecialDay
    return { ok: true, row: docToRow(doc, todayRomeAsSpecialDayDate()) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchSpecialDayDisabledAction(
  specialDayId: string,
  disabled: boolean,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  const { patchCatalogDisabled } = await import('@/lib/app/menu/catalog/catalogActions')
  return patchCatalogDisabled(SPECIAL_DAYS_PATH, SPECIAL_DAYS_SLUG, specialDayId, disabled)
}

export async function deleteSpecialDayAction(
  specialDayId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  const { deleteCatalogItem } = await import('@/lib/app/menu/catalog/catalogActions')
  return deleteCatalogItem(SPECIAL_DAYS_PATH, SPECIAL_DAYS_SLUG, specialDayId)
}
