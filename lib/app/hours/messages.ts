export function addedHolidaysMessage(count: number, year: number): string {
  if (count === 1) {
    return `Aggiunta 1 festività del ${year}`
  }
  return `Aggiunte ${count} festività del ${year}`
}

export function removedHolidaysMessage(count: number, year: number): string {
  if (count === 1) {
    return `Rimossa 1 festività del ${year}`
  }
  return `Rimosse ${count} festività del ${year}`
}

export function removeHolidaysConfirmBody(count: number): string {
  if (count === 1) {
    return 'Verrà tolta 1 chiusura con data uguale a una festività predefinita del {anno}, anche se ne hai cambiato l’etichetta. Poi premi «Salva modifiche».'
  }
  return `Verranno tolte ${count} chiusure con data uguale a una festività predefinita del {anno}, anche se ne hai cambiato l’etichetta. Poi premi «Salva modifiche».`
}

export function removeHolidaysConfirmDescription(count: number, year: number): string {
  const body = removeHolidaysConfirmBody(count).replace('{anno}', String(year))
  return body
}
