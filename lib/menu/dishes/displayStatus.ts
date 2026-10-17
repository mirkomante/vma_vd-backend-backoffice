export type DishDisplayStatus = 'available' | 'soldOut' | 'disabled'

export function dishDisplayStatus(doc: {
  disabled?: boolean | null
  soldOut?: boolean | null
}): DishDisplayStatus {
  if (doc.disabled) {
    return 'disabled'
  }
  if (doc.soldOut) {
    return 'soldOut'
  }
  return 'available'
}

export function dishDisplayStatusLabel(status: DishDisplayStatus): string {
  switch (status) {
    case 'disabled':
      return 'Disabilitato'
    case 'soldOut':
      return 'Terminato'
    default:
      return 'Disponibile'
  }
}
