import { compareAnnualClosureRows } from '@/lib/systemSettings/annualClosures'
import type { AnnualClosureLike } from '@/lib/systemSettings/italianPublicHolidays'

type MoveFieldRow = (args: { path: string; moveFromIndex: number; moveToIndex: number }) => void

/** Riordina le righe dell'array nel form Admin per data crescente (bubble sort + moveFieldRow). */
export function reorderAnnualClosuresInForm(
  path: string,
  getDataByPath: (fieldPath: string) => unknown,
  moveFieldRow: MoveFieldRow,
): void {
  const rows = (getDataByPath(path) as AnnualClosureLike[] | undefined) ?? []
  if (rows.length < 2) {
    return
  }

  const working = [...rows]
  for (let i = 0; i < working.length - 1; i++) {
    for (let j = 0; j < working.length - i - 1; j++) {
      if (compareAnnualClosureRows(working[j], working[j + 1]) > 0) {
        moveFieldRow({ path, moveFromIndex: j, moveToIndex: j + 1 })
        ;[working[j], working[j + 1]] = [working[j + 1], working[j]]
      }
    }
  }
}
