import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { formatMenuContentDeleteDetail } from '@/lib/menu/menuContentDeleteLog'
import { SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'
import type { SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'
import type { Payload } from 'payload'

import { createFixedMenuFixtureLocal, managerUser } from '../menu-list/payload-actions'
import { ensureWorkerMenuSeeds, type SeedSlug } from '../menu-list/ensure-fixtures'

export async function ensureTwoVerifyFixedMenus(
  payload: Payload,
  managerEmail: string,
  nome: (slug: string) => string,
  register: (collection: SeedSlug, id: number | string) => void,
  registerMenu: (id: number | string) => void,
): Promise<{ menuA: string; menuB: string; menuAId: number; menuBId: number }> {
  await ensureWorkerMenuSeeds(payload, managerEmail, nome, register)
  const menuA = nome('menu-a')
  const menuB = nome('menu-b')
  const ids = await createFixedMenuFixtureLocal(payload, managerEmail, {
    dishName: nome('p1'),
    categoryName: nome('cat'),
    menuNames: [menuA, menuB],
  })
  registerMenu(ids[0])
  registerMenu(ids[1])
  return { menuA, menuB, menuAId: ids[0] as number, menuBId: ids[1] as number }
}

export async function createSpecialDayAsManager(
  payload: Payload,
  managerEmail: string,
  spec: {
    date: string
    scope: SpecialDayScope
    fixedMenuIds: number[]
    messageIt?: string
    messageEn?: string
    disabled?: boolean
  },
): Promise<number | string> {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.create({
    collection: SPECIAL_DAYS_SLUG,
    data: {
      date: spec.date,
      scope: spec.scope,
      disabled: spec.disabled ?? false,
      content: {
        fixedMenus: spec.fixedMenuIds,
        message: spec.messageIt ?? '',
      },
    },
    overrideAccess: false,
    user,
    locale: 'it',
  })
  if (spec.messageEn) {
    await payload.update({
      collection: SPECIAL_DAYS_SLUG,
      id: doc.id,
      data: { content: { message: spec.messageEn } },
      overrideAccess: false,
      user,
      locale: 'en',
    })
  }
  return doc.id
}

export async function readSpecialDayAsManager(
  payload: Payload,
  managerEmail: string,
  id: number | string,
): Promise<{
  date: string
  scope: SpecialDayScope
  disabled: boolean
  menuIds: number[]
  messageIt: string
  messageEn: string
}> {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.findByID({
    collection: SPECIAL_DAYS_SLUG,
    id,
    depth: 1,
    locale: 'it',
    overrideAccess: false,
    user,
  })
  let messageEn = ''
  try {
    const en = await payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id,
      depth: 0,
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: false,
      user,
    })
    messageEn = (en as { content?: { message?: string } }).content?.message ?? ''
  } catch {
    messageEn = ''
  }
  const menus =
    (doc as { content?: { fixedMenus?: unknown[]; message?: string } }).content?.fixedMenus ?? []
  const menuIds = menus
    .map((m) => relationshipId(m))
    .filter((x): x is number | string => x != null)
    .map((x) => Number(x))
  return {
    date: String((doc as { date: string }).date),
    scope: (doc as { scope: SpecialDayScope }).scope,
    disabled: Boolean((doc as { disabled?: boolean }).disabled),
    menuIds,
    messageIt: (doc as { content?: { message?: string } }).content?.message ?? '',
    messageEn,
  }
}

export async function findSpecialDayDeleteLog(
  payload: Payload,
  managerEmail: string,
  documentId: string,
  dateIso: string,
  scope: SpecialDayScope,
): Promise<{ found: boolean; detail: string | null; expectedDetail: string }> {
  const user = await managerUser(payload, managerEmail)
  const expectedName = `${dateIso.slice(0, 10)} ambito=${scope}`
  const expectedDetail = formatMenuContentDeleteDetail(expectedName, 0)
  const logs = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    overrideAccess: true,
    depth: 0,
    limit: 5,
    sort: '-createdAt',
    where: {
      and: [
        { user: { equals: user.id } },
        { eventType: { equals: 'delete' } },
        { area: { equals: 'app' } },
        { collection: { equals: SPECIAL_DAYS_SLUG } },
        { documentId: { equals: documentId } },
      ],
    },
  })
  const row = logs.docs[0] as { detail?: string } | undefined
  return { found: Boolean(row), detail: row?.detail ?? null, expectedDetail }
}
