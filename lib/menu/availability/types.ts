import type { AvailabilityItemStatus } from './mapItemStatus'

export type AvailabilityDocumentV1 = {
  schemaVersion: 1
  updatedAt: string
  dishes: Record<string, { status: AvailabilityItemStatus }>
  wines: Record<string, { status: AvailabilityItemStatus }>
  drinks: Record<string, { status: AvailabilityItemStatus }>
  spirits: Record<string, { status: AvailabilityItemStatus }>
  fixedMenus: Record<string, { status: AvailabilityItemStatus }>
  services: Record<string, { status: AvailabilityItemStatus }>
  globalMessage?: { it: string; en: string }
}

export type MenuAvailabilityCmsState = {
  dishes: Array<{ id: number | string; disabled?: boolean | null; soldOut?: boolean | null }>
  wines: Array<{ id: number | string; disabled?: boolean | null }>
  drinks: Array<{ id: number | string; disabled?: boolean | null }>
  spirits: Array<{ id: number | string; disabled?: boolean | null }>
  fixedMenus: Array<{ id: number | string; disabled?: boolean | null }>
  services: Array<{ id: number | string; disabled?: boolean | null }>
  globalMessageIt: string
  globalMessageEn: string
}

export type ServiceBoundaryKey = {
  service: 'lunch' | 'dinner'
  /** Giorno di calendario Europe/Rome YYYY-MM-DD */
  romeDate: string
  /** Istante UTC del confine (inizio servizio). */
  instant: Date
}
