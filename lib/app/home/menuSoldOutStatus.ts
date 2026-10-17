/** Testo della riga di stato Menù in home (integrazione §3). */
export function formatMenuSoldOutStatusLine(count: number): string {
  if (count <= 0) {
    return 'Nessun piatto terminato'
  }
  if (count === 1) {
    return '1 piatto terminato'
  }
  return `${count} piatti terminati`
}
