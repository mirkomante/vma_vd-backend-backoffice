const italianNameCollator = new Intl.Collator('it', { sensitivity: 'base' })

export function compareItalianNames(a: string, b: string): number {
  return italianNameCollator.compare(a, b)
}

export function sortByItalianName<T>(items: readonly T[], getName: (item: T) => string): T[] {
  return [...items].sort((left, right) => compareItalianNames(getName(left), getName(right)))
}
