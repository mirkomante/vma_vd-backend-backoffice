export type WeekdayValue =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type ServiceTimes = {
  startTime: string
  endTime: string
}

export type AnnualClosureFormRow = {
  clientId: string
  date: string
  label: string
  payloadId?: string | null
}

export type HoursFormValues = {
  servicesNotConfigured: boolean
  lunch: ServiceTimes
  dinner: ServiceTimes
  weeklyClosedDays: WeekdayValue[]
  annualClosures: AnnualClosureFormRow[]
  bnb: ServiceTimes
}

export type HoursFieldKey =
  | 'lunch.startTime'
  | 'lunch.endTime'
  | 'dinner.startTime'
  | 'dinner.endTime'
  | 'bnb.checkInTime'
  | 'bnb.checkOutTime'

export const HOURS_FIELD_ORDER: HoursFieldKey[] = [
  'lunch.startTime',
  'lunch.endTime',
  'dinner.startTime',
  'dinner.endTime',
  'bnb.checkInTime',
  'bnb.checkOutTime',
]

export const HOURS_FIELD_DOM_IDS: Record<HoursFieldKey, string> = {
  'lunch.startTime': 'hours-lunch-start',
  'lunch.endTime': 'hours-lunch-end',
  'dinner.startTime': 'hours-dinner-start',
  'dinner.endTime': 'hours-dinner-end',
  'bnb.checkInTime': 'hours-bnb-check-in',
  'bnb.checkOutTime': 'hours-bnb-check-out',
}
