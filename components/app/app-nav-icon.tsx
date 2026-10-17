'use client'

import {
  BookOpen,
  CalendarDays,
  CalendarHeart,
  Clock,
  ConciergeBell,
  CupSoda,
  Martini,
  Megaphone,
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
  martini: Martini,
  'book-open': BookOpen,
  'concierge-bell': ConciergeBell,
  'calendar-heart': CalendarHeart,
  megaphone: Megaphone,
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
