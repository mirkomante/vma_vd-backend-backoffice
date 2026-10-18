import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'

export function formatDrinkSubline(volume: string, abv: string): string {
  const parts = [volume, abv].filter(Boolean)
  return parts.join(' · ')
}

export function formatDrinkCardTertiary(price: number, countryName: string): string {
  const priceStr = formatMenuPriceEuro(price)
  return countryName ? `${priceStr} · ${countryName}` : priceStr
}
