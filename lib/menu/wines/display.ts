import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import { VINI_GLASS_PRICE_PREFIX } from './copy'

export function formatWineSubline(winery: string, year: string): string {
  const parts = [winery, year].filter(Boolean)
  return parts.join(' · ')
}

export function formatWineOriginLine(countryName: string, regionName: string): string {
  if (!countryName) {
    return ''
  }
  if (!regionName) {
    return countryName
  }
  return `${countryName} · ${regionName}`
}

export function formatWinePriceCell(price: number, glassPrice: number | null): {
  main: string
  sub?: string
} {
  const main = `${formatMenuPriceEuro(price)}`
  if (glassPrice == null) {
    return { main }
  }
  return { main, sub: `${VINI_GLASS_PRICE_PREFIX} ${formatMenuPriceEuro(glassPrice)}` }
}
