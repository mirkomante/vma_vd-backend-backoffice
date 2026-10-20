import { todayRomeAsSpecialDayDate } from '@/lib/menu/specialDayDate'

export type SpecialDayDateLike = {
  date: string
}

/** Prossimi: data >= soglia «oggi» Roma; Passati: data < soglia. */
export function splitSpecialDaysByRomeToday<T extends SpecialDayDateLike>(
  days: readonly T[],
  todayNoonUtc: string = todayRomeAsSpecialDayDate(),
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = []
  const past: T[] = []
  const todayKey = todayNoonUtc.slice(0, 10)
  for (const day of days) {
    const dateKey = day.date.slice(0, 10)
    if (dateKey >= todayKey) {
      upcoming.push(day)
    } else {
      past.push(day)
    }
  }
  return { upcoming, past }
}
