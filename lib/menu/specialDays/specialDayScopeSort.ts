import { SPECIAL_DAY_SCOPE_OPTIONS, type SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'

const SCOPE_ORDER: readonly SpecialDayScope[] = SPECIAL_DAY_SCOPE_OPTIONS.map((o) => o.value)

const scopeRank = new Map(SCOPE_ORDER.map((scope, index) => [scope, index]))

/** Ordine a parità di data: giornata intera, pranzo, cena (come `SPECIAL_DAY_SCOPE_OPTIONS`). */
export function compareSpecialDayScope(a: SpecialDayScope, b: SpecialDayScope): number {
  const ra = scopeRank.get(a) ?? 0
  const rb = scopeRank.get(b) ?? 0
  return ra - rb
}
