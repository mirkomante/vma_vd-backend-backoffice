#!/usr/bin/env node
/** Verifica che controlli-6.6.json sia cablato (id e tipi) per le schermate Menù indicate. */
import { loadControlli } from './lib/cli.mjs'
import {
  auditControlliWiring,
  catalogControlIdsFromControlli,
  HANDLED_CONTROL_TYPES,
} from './lib/controlli-handlers.mjs'

const loaded = loadControlli('controlli-6.6.json')
const controlli = loaded.controlli

const argScreens = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const defaultScreens = ['vini', 'distillati', 'bevande', 'piatti', 'servizi', 'menu-fissi']
const screens = argScreens.length ? argScreens : defaultScreens

const issues = auditControlliWiring(controlli, { screenIds: new Set(screens) })
if (issues.length) {
  console.error('FALLITO cablaggio:', issues.join('\n'))
  process.exit(1)
}

for (const comune of controlli.comuni ?? []) {
  if (['NO-OVERRIDE', 'RICOMPILA-ASSENTE', 'RICOMPILA-PRESENTE'].includes(comune.id)) {
    if (!HANDLED_CONTROL_TYPES.has(comune.tipo)) {
      console.error(`tipo non gestito: comuni/${comune.id}`)
      process.exit(1)
    }
  }
}

for (const id of screens) {
  const ids = catalogControlIdsFromControlli(controlli, id)
  const screen = controlli.schermate.find((s) => s.id === id)
  if (!screen) {
    console.error(`schermata assente nel JSON: ${id}`)
    process.exit(1)
  }
  for (const c of screen?.controlli ?? []) {
    if (!HANDLED_CONTROL_TYPES.has(c.tipo)) {
      console.error(`tipo non gestito: ${id}/${c.id} (${c.tipo})`)
      process.exit(1)
    }
  }
  console.log(`${id}: ${ids.length} controlli, tipi OK`)
}

console.log(`OK cablaggio controlli-6.6 (${screens.join(', ')})`)
