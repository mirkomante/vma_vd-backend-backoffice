#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const esitiDir = join(ROOT, 'docs/design/verifica/esiti/2026-10-19-T1c')
const raw = JSON.parse(readFileSync(join(esitiDir, 'risultati.json'), 'utf8'))

const counts = raw.riepilogo ?? {}
const byControl = new Map()
for (const row of raw.esiti ?? []) {
  const key = row.id
  if (!byControl.has(key)) byControl.set(key, { OK: 0, FALLITO: 0, AVVISO: 0, 'NON PROVATO': 0, 'ERRORE-STRUMENTO': 0 })
  const b = byControl.get(key)
  b[row.esito] = (b[row.esito] ?? 0) + 1
}

const lines = [
  `# Esito verifica — locale-prod e2e — 2026-10-19`,
  `Commit: ${raw.commit} · Lanciatore: ${raw.launcher} · Browser: ${raw.browser} · Controlli: ${raw.controlli}`,
  `Durata: ${raw.durataSecondi}s`,
  '',
  '## Riepilogo',
  `OK: ${counts.OK ?? 0} · FALLITO: ${counts.FALLITO ?? 0} · AVVISO: ${counts.AVISO ?? 0} · NON PROVATO: ${counts['NON PROVATO'] ?? 0}`,
  '',
  `## ERRORE-STRUMENTO (${counts['ERRORE-STRUMENTO'] ?? 0})`,
  ...(raw.erroriStrumento ?? []).map((r) => `- ${r.id} (${r.profiloTema}): ${r.misurato}`),
  '',
  '## Esiti per controllo (aggregato)',
  '| Id | OK | FALLITO | AVVISO | NON PROVATO | ERRORE-STRUMENTO |',
  '|---|---:|---:|---:|---:|---:|',
  ...[...byControl.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([id, b]) => `| ${id} | ${b.OK} | ${b.FALLITO} | ${b.AVISO} | ${b['NON PROVATO']} | ${b['ERRORE-STRUMENTO']} |`),
  '',
]

const failures = (raw.esiti ?? []).filter((r) => r.esito === 'FALLITO' || r.esito === 'ERRORE-STRUMENTO')
if (failures.length) {
  lines.push('## Dettaglio FALLITO / ERRORE-STRUMENTO', '')
  for (const r of failures.slice(0, 80)) {
    lines.push(
      `- **${r.id}** ${r.schermata} · ${r.profiloTema}: ${r.esito} — misurato: ${r.misurato}; atteso: ${r.atteso}`,
    )
  }
}

writeFileSync(join(esitiDir, 'rapporto.md'), lines.join('\n'), 'utf8')
console.log('rapporto.md aggiornato')
