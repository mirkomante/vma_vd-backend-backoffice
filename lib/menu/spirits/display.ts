import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'

export function formatSpiritSubline(aging: string, abv: string): string {
  const parts = [aging, abv].filter(Boolean)
  return parts.join(' · ')
}

export function formatSpiritCardTertiary(price: number, countryName: string): string {
  const priceStr = formatMenuPriceEuro(price)
  return countryName ? `${priceStr} · ${countryName}` : priceStr
}
