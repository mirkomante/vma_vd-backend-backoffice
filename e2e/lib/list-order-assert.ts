import { expect } from '@playwright/test'

const collator = new Intl.Collator('it', { sensitivity: 'base' })

export function rowNameFromTr(row: Element): string {
  const edit = row.querySelector('[aria-label^="Modifica "]')?.getAttribute('aria-label')
  if (edit?.startsWith('Modifica ')) return edit.slice('Modifica '.length)
  const cellLabel = row.querySelector('td [aria-label]')?.getAttribute('aria-label') ?? ''
  return cellLabel.split(',')[0]?.trim() ?? ''
}

export type NameGroup = { groupLabel: string; names: string[] }

export function firstListMismatch(
  received: string[],
  expected: string[],
): { index: number; received: string; expected: string } | null {
  const len = Math.max(received.length, expected.length)
  for (let i = 0; i < len; i++) {
    if (received[i] !== expected[i]) {
      return {
        index: i,
        received: received[i] ?? '(mancante)',
        expected: expected[i] ?? '(mancante)',
      }
    }
  }
  return null
}

export function assertNamesSorted(
  label: string,
  names: readonly string[],
): void {
  const sorted = [...names].sort((a, b) => collator.compare(a, b))
  const mismatch = firstListMismatch([...names], sorted)
  expect(
    names,
    mismatch
      ? `${label}: primo scostamento indice ${mismatch.index}; misurato «${mismatch.received}»; atteso «${mismatch.expected}»; adiacenti misurato: «${names[mismatch.index - 1] ?? '—'}», «${names[mismatch.index + 1] ?? '—'}»; atteso: «${sorted[mismatch.index - 1] ?? '—'}», «${sorted[mismatch.index + 1] ?? '—'}»`
      : `${label}: ordine per nome (it-IT, sensitivity base)`,
  ).toEqual(sorted)
}

export function assertGroupedNamesSorted(groups: readonly NameGroup[]): void {
  for (const group of groups) {
    assertNamesSorted(`gruppo «${group.groupLabel}»`, group.names)
  }
}
