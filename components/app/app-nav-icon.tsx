'use client'

import {
  Beer,
  CalendarDays,
  Clock,
  CupSoda,
  List,
  Settings,
  UtensilsCrossed,
  Wine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { AppNavIconKey } from '@/lib/app/nav-icon-keys'

const ICONS: Record<AppNavIconKey, LucideIcon> = {
  'utensils-crossed': UtensilsCrossed,
  wine: Wine,
  'cup-soda': CupSoda,
  beer: Beer,
  list: List,
  clock: Clock,
  'calendar-days': CalendarDays,
  settings: Settings,
}

type AppNavIconProps = {
  name: AppNavIconKey
  className?: string
}

export function AppNavIcon({ name, className }: AppNavIconProps) {
  const Icon = ICONS[name]
  return <Icon className={className} aria-hidden />
}
