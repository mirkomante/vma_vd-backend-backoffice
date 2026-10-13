import { binaryAvailabilityStatus, dishAvailabilityStatus } from './mapItemStatus'
import type { AvailabilityDocumentV1, MenuAvailabilityCmsState } from './types'

function idKey(id: number | string): string {
  return String(id)
}

function buildGlobalMessage(
  it: string,
  en: string,
): AvailabilityDocumentV1['globalMessage'] | undefined {
  const itTrim = it.trim()
  const enTrim = en.trim()
  if (!itTrim && !enTrim) {
    return undefined
  }
  const messageIt = itTrim || enTrim
  const messageEn = enTrim || messageIt
  return { it: messageIt, en: messageEn }
}

/** Generatore puro: stato CMS → documento JSON (ADR-112 §3). */
export function buildAvailabilityDocument(
  state: MenuAvailabilityCmsState,
  generatedAt: Date,
): AvailabilityDocumentV1 {
  const dishes: AvailabilityDocumentV1['dishes'] = {}
  for (const doc of state.dishes) {
    dishes[idKey(doc.id)] = { status: dishAvailabilityStatus(doc) }
  }

  const wines: AvailabilityDocumentV1['wines'] = {}
  for (const doc of state.wines) {
    wines[idKey(doc.id)] = { status: binaryAvailabilityStatus(doc) }
  }

  const drinks: AvailabilityDocumentV1['drinks'] = {}
  for (const doc of state.drinks) {
    drinks[idKey(doc.id)] = { status: binaryAvailabilityStatus(doc) }
  }

  const spirits: AvailabilityDocumentV1['spirits'] = {}
  for (const doc of state.spirits) {
    spirits[idKey(doc.id)] = { status: binaryAvailabilityStatus(doc) }
  }

  const fixedMenus: AvailabilityDocumentV1['fixedMenus'] = {}
  for (const doc of state.fixedMenus) {
    fixedMenus[idKey(doc.id)] = { status: binaryAvailabilityStatus(doc) }
  }

  const services: AvailabilityDocumentV1['services'] = {}
  for (const doc of state.services) {
    services[idKey(doc.id)] = { status: binaryAvailabilityStatus(doc) }
  }

  const doc: AvailabilityDocumentV1 = {
    schemaVersion: 1,
    updatedAt: generatedAt.toISOString(),
    dishes,
    wines,
    drinks,
    spirits,
    fixedMenus,
    services,
  }

  const globalMessage = buildGlobalMessage(state.globalMessageIt, state.globalMessageEn)
  if (globalMessage) {
    doc.globalMessage = globalMessage
  }

  return doc
}
