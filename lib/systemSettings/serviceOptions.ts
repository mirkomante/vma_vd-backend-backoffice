/** Valori `services[].name` e etichette Admin (unica fonte per select e RowLabel). */
export const SERVICE_NAME_OPTIONS = [
  { label: 'Pranzo', value: 'lunch' },
  { label: 'Cena', value: 'dinner' },
] as const

export type ServiceName = (typeof SERVICE_NAME_OPTIONS)[number]['value']

const SERVICE_LABEL_BY_VALUE: Record<ServiceName, string> = {
  lunch: 'Pranzo',
  dinner: 'Cena',
}

export function serviceLabelForName(name: string | null | undefined): string | null {
  if (!name) {
    return null
  }
  return SERVICE_LABEL_BY_VALUE[name as ServiceName] ?? null
}

/** Es. «Pranzo 12:30 – 14:30»; senza orari solo il nome; riga nuova «Servizio (nuovo)». */
export function formatServiceRowLabel(
  name?: string | null,
  startTime?: string | null,
  endTime?: string | null,
): string {
  const label = serviceLabelForName(name)
  if (!label) {
    return 'Servizio (nuovo)'
  }
  const start = startTime?.trim()
  const end = endTime?.trim()
  if (start && end) {
    return `${label} ${start} – ${end}`
  }
  return label
}
