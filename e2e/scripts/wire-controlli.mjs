#!/usr/bin/env node
/**
 * Verifica che ogni id di controllo in controlli-6.6.json abbia un test e2e o una voce NON PROVATO.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const CONTROLLI_PATH = join(ROOT, 'docs/design/verifica/controlli-6.6.json')
const REGISTRY_PATH = join(ROOT, 'e2e/controlli/wire-registry.json')
const E2E_DIR = join(ROOT, 'e2e')

function collectControlIds(controlli) {
  const ids = new Set()
  for (const c of controlli.comuni ?? []) {
    if (c.id) ids.add(c.id)
  }
  for (const screen of controlli.schermate ?? []) {
    for (const c of screen.controlli ?? []) {
      if (c.id) ids.add(c.id)
    }
  }
  for (const c of controlli['online-senza-credenziali'] ?? []) {
    if (c.id) ids.add(c.id)
  }
  return [...ids].sort()
}

function walkSpecs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    if (statSync(abs).isDirectory()) {
      walkSpecs(abs, acc)
    } else if (name.endsWith('.spec.ts')) {
      acc.push(readFileSync(abs, 'utf8'))
    }
  }
  return acc
}

const controlli = JSON.parse(readFileSync(CONTROLLI_PATH, 'utf8'))
const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'))
const specs = walkSpecs(E2E_DIR).join('\n')
const nonProvati = registry.nonProvati ?? {}
const defaultReason = nonProvati.__default__

const missing = []
for (const id of collectControlIds(controlli)) {
  const inRegistry = nonProvati[id] || defaultReason
  const inSpec =
    specs.includes(`control:${id}`) ||
    specs.includes(`'${id}'`) ||
    specs.includes(`"${id}"`)
  if (!inRegistry && !inSpec) {
    missing.push(id)
  }
}

if (missing.length) {
  console.error('FALLITO wire: id senza test né NON PROVATO:', missing.slice(0, 20).join(', '))
  if (missing.length > 20) console.error(`… e altri ${missing.length - 20}`)
  process.exit(1)
}

console.log(`OK wire controlli-6.6 (${collectControlIds(controlli).length} id, registry T0)`)
