export type AvailabilityItemStatus = 'available' | 'soldOut' | 'hidden'

export function dishAvailabilityStatus(doc: {
  disabled?: boolean | null
  soldOut?: boolean | null
}): AvailabilityItemStatus {
  if (doc.disabled) {
    return 'hidden'
  }
  if (doc.soldOut) {
    return 'soldOut'
  }
  return 'available'
}

export function binaryAvailabilityStatus(doc: { disabled?: boolean | null }): AvailabilityItemStatus {
  return doc.disabled ? 'hidden' : 'available'
}
