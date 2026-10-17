/** «1 {singolare}» al singolare, altrimenti «N {plurale}». */
export function pluralizeIt(
  count: number,
  singular: string,
  plural: string,
): string {
  if (count === 1) {
    return `1 ${singular}`
  }
  return `${count} ${plural}`
}
