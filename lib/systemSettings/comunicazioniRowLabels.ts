/** Etichette riga array tab Comunicazioni (fase-7.3, UX post-smoke prod). */

export function formatResendSenderRowLabel(
  name: string | null | undefined,
  address: string | null | undefined,
): string {
  const trimmedName = typeof name === 'string' ? name.trim() : ''
  const trimmedAddress = typeof address === 'string' ? address.trim() : ''
  if (trimmedName && trimmedAddress) {
    return `${trimmedName} · ${trimmedAddress}`
  }
  if (trimmedName) {
    return trimmedName
  }
  if (trimmedAddress) {
    return trimmedAddress
  }
  return 'Mittente (nuovo)'
}

export function formatStaffNotificationContactRowLabel(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const trimmedName = typeof name === 'string' ? name.trim() : ''
  const trimmedEmail = typeof email === 'string' ? email.trim() : ''
  if (trimmedName && trimmedEmail) {
    return `${trimmedName} · ${trimmedEmail}`
  }
  if (trimmedName) {
    return trimmedName
  }
  if (trimmedEmail) {
    return trimmedEmail
  }
  return 'Contatto (nuovo)'
}
