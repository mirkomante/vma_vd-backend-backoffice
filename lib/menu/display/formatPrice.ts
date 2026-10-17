/** Spazio normale prima del simbolo, come nei mockup («48,00 €»). */
export const MENU_PRICE_EURO_SUFFIX = ' €'

/** Prezzo in elenco: due decimali, virgola, spazio, €. */
export function formatMenuPriceEuro(value: number): string {
  const amount = formatMenuPriceAmount(value)
  return `${amount}${MENU_PRICE_EURO_SUFFIX}`
}

/** Valore per campi modulo «Prezzo (€)» (senza simbolo). */
export function formatMenuPriceAmount(value: number): string {
  return value.toFixed(2).replace('.', ',')
}
