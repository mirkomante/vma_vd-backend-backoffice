/**
 * Verifica logica shell 8.2 (navigazione e home). Eseguire: pnpm payload run scripts/verify-lib-app-8_2.ts
 */
import { APP_NAV_GROUPS } from '@/lib/app/navigation'
import { getVisibleHomeSectionCards, getVisibleNavigation } from '@/lib/app/navigationForUser'

const manager = { adminRole: 'none' as const, appRole: 'manager' as const, active: true }

const expectedNavLabels = APP_NAV_GROUPS.flatMap((group) =>
  group.items.filter((item) => item.enabled).map((item) => item.label),
).join(',')

const navLabels = getVisibleNavigation(manager).flatMap((g) => g.items.map((i) => i.label))
if (navLabels.join(',') !== expectedNavLabels) {
  throw new Error(
    `navigazione attesa ${expectedNavLabels} — ottenuto: ${navLabels.join(',')}`,
  )
}

const homeTitles = getVisibleHomeSectionCards({
  adminRole: 'admin',
  appRole: 'none',
  active: true,
}).map((c) => c.title)
if (homeTitles.join(',') !== 'Prenotazioni,Menù,Orari') {
  throw new Error(`ordine home atteso Prenotazioni,Menù,Orari — ottenuto: ${homeTitles.join(',')}`)
}

console.log('OK: verify-lib-app-8_2')
