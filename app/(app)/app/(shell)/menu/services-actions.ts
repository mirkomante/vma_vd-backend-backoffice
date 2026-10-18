'use server'

import {
  deleteCatalogItem,
  listFlatCatalogPage,
  patchCatalogDisabled,
  runCatalogSave,
} from '@/lib/app/menu/catalog/catalogActions'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  mergeServiceEnglishName,
  serviceFormToUpdateData,
  serviceFormToWriteData,
  serviceFormValuesFromDoc,
  validateServiceForm,
  type ServiceFieldErrors,
} from '@/lib/app/services/formModel'
import type { ServiceFormValues, ServiceListRow } from '@/lib/app/services/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { FIXED_MENUS_SLUG, MENU_SERVICES_SLUG } from '@/lib/menu/constants'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import type { FixedMenu, MenuService } from '@/payload-types'

const SERVICES_PATH = '/app/menu/services'

function serviceToListRow(doc: MenuService): ServiceListRow {
  return {
    id: doc.id,
    name: doc.name,
    price: doc.price,
    disabled: doc.disabled,
    typeId: '_flat',
    typeName: '',
  }
}

export type ListServicesResult =
  | {
      ok: true
      rows: ServiceListRow[]
      groups: CatalogTypeGroup<ServiceListRow>[]
      totalDocs: number
      hasMore: boolean
      emptyDatabase: boolean
      page: number
    }
  | { ok: false; error: 'load' }

export async function listServicesAction(
  page: number,
  previousRows?: readonly ServiceListRow[],
): Promise<ListServicesResult> {
  const result = await listFlatCatalogPage(SERVICES_PATH, {
    collection: MENU_SERVICES_SLUG,
    page,
    mapDoc: (doc) => serviceToListRow(doc as MenuService),
    previousRows,
  })
  if (!result.ok) {
    return result
  }
  return result
}

export type LoadServiceFormResult =
  | { ok: true; values: ServiceFormValues }
  | { ok: false; error: 'load' }

export async function loadServiceFormAction(serviceId: string): Promise<LoadServiceFormResult> {
  try {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const doc = (await req.payload.findByID({
      collection: MENU_SERVICES_SLUG,
      id: serviceId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuService
    let values = serviceFormValuesFromDoc(doc)
    try {
      const en = (await req.payload.findByID({
        collection: MENU_SERVICES_SLUG,
        id: serviceId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as MenuService
      values = mergeServiceEnglishName(values, en.name)
    } catch {
      // nessuna traduzione
    }
    return { ok: true, values }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeServiceEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  values: ServiceFormValues,
) {
  await req.payload.update({
    id,
    collection: MENU_SERVICES_SLUG,
    context: appLocalApiContext().context,
    data: {
      name: values.nameEn.trim(),
    },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveServiceResult =
  | { ok: true; row: ServiceListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: ServiceFieldErrors }

export async function createServiceAction(values: ServiceFormValues): Promise<SaveServiceResult> {
  const fieldErrors = validateServiceForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(SERVICES_PATH, async () => {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const data = serviceFormToWriteData(values)
    const created = (await req.payload.create({
      collection: MENU_SERVICES_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuService
    createdId = created.id
    await writeServiceEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    return { ok: false, error: saved.error, fieldErrors: saved.fieldErrors as ServiceFieldErrors }
  }
  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const doc = (await req.payload.findByID({
      collection: MENU_SERVICES_SLUG,
      id: createdId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuService
    return { ok: true, row: serviceToListRow(doc) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateServiceAction(
  serviceId: string,
  values: ServiceFormValues,
): Promise<SaveServiceResult> {
  const fieldErrors = validateServiceForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(SERVICES_PATH, async () => {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const existing = (await req.payload.findByID({
      collection: MENU_SERVICES_SLUG,
      id: serviceId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuService
    const initial = serviceFormValuesFromDoc(existing)
    const patch = serviceFormToUpdateData(initial, values)
    if (Object.keys(patch).length > 0) {
      await req.payload.update({
        id: serviceId,
        collection: MENU_SERVICES_SLUG,
        context: appLocalApiContext().context,
        data: patch,
        depth: 0,
        locale: 'it',
        overrideAccess: false,
        req,
      })
    }
    await writeServiceEnglish(req, serviceId, values)
  })

  if (!saved.ok) {
    return { ok: false, error: saved.error, fieldErrors: saved.fieldErrors as ServiceFieldErrors }
  }

  try {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const doc = (await req.payload.findByID({
      collection: MENU_SERVICES_SLUG,
      id: serviceId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as MenuService
    return { ok: true, row: serviceToListRow(doc) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchServiceDisabledAction(
  serviceId: string,
  disabled: boolean,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return patchCatalogDisabled(SERVICES_PATH, MENU_SERVICES_SLUG, serviceId, disabled)
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return deleteCatalogItem(SERVICES_PATH, MENU_SERVICES_SLUG, serviceId)
}

export type ServiceDeleteImpactResult =
  | { ok: true; fixedMenuNames: string[] }
  | { ok: false; error: 'load' }

export async function loadServiceDeleteImpactAction(
  serviceId: string,
): Promise<ServiceDeleteImpactResult> {
  try {
    const req = await createAppPayloadRequest(SERVICES_PATH)
    const found = await req.payload.find({
      collection: FIXED_MENUS_SLUG,
      depth: 0,
      limit: 100,
      locale: 'it',
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'name',
      where: {
        services: { contains: serviceId },
      },
    })
    const names = (found.docs as FixedMenu[])
      .map((m) => m.name)
      .sort((a, b) => compareItalianNames(a, b))
    return { ok: true, fixedMenuNames: names }
  } catch {
    return { ok: false, error: 'load' }
  }
}
