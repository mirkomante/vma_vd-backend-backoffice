import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import { allControlIds } from './controlli-index.mjs'

export function initReport({
  ambiente,
  data,
  commit,
  launcherVersion,
  browsers,
  controlliVersion,
  controlli,
  controlliBasename = 'controlli-8.2.json',
  livelloEseguito = 'completo',
  expectedIdsOptions = {},
}) {
  const dir = join(import.meta.dirname, '../../../docs/design/verifica/esiti', `${data}-${ambiente}`)
  const imgDir = join(dir, 'img')
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
  mkdirSync(imgDir, { recursive: true })
  const rows = []
  const nonProvato = []
  const anomalie = []
  const screenshotHashes = []
  const expectedIds = allControlIds(controlli, ambiente, expectedIdsOptions)

  const launcherHeader =
    livelloEseguito === 'completo'
      ? `${launcherVersion}`
      : `${launcherVersion} (${livelloEseguito})`

  return {
    dir,
    imgDir,
    meta: {
      ambiente,
      data,
      commit,
      launcherVersion,
      launcherHeader,
      browsers,
      controlliVersion,
      controlliBasename,
      livelloEseguito,
      durataMs: null,
    },
    rows,
    nonProvato,
    anomalie,
    screenshotHashes,
    expectedIds,
    invalidRun: false,
    add(row) {
      rows.push(row)
    },
    addNonProvato(id, motivo) {
      if (nonProvato.some((n) => n.id === id)) return
      nonProvato.push({ id, motivo })
      rows.push({
        id,
        schermata: '—',
        profiloTema: '—',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: motivo,
      })
    },
    write() {
      const recordedIds = new Set(rows.map((r) => r.id))
      for (const id of expectedIds) {
        if (!recordedIds.has(id)) {
          this.addNonProvato(id, 'controllo non eseguito dal lanciatore in questa esecuzione')
        }
      }

      const counts = { OK: 0, FALLITO: 0, AVVISO: 0, 'NON PROVATO': 0 }
      for (const r of rows) counts[r.esito] = (counts[r.esito] ?? 0) + 1

      const okById = new Map()
      for (const r of rows) {
        const g = okById.get(r.id) ?? { ok: 0, total: 0 }
        g.total += 1
        if (r.esito === 'OK') g.ok += 1
        okById.set(r.id, g)
      }

      const falliti = rows.filter((r) => r.esito === 'FALLITO')
      const avvisi = rows.filter((r) => r.esito === 'AVVISO')
      const nonPr = rows.filter((r) => r.esito === 'NON PROVATO')

      const fallitiGrouped = formatFallitiGrouped(falliti)

      const okLines = [...okById.entries()]
        .filter(([, g]) => g.ok === g.total && g.total > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, g]) => `- **${id}**: OK in ${g.ok}/${g.total} combinazioni`)

      const partialOk = [...okById.entries()].filter(([, g]) => g.ok > 0 && g.ok < g.total)
      for (const [controlId, g] of partialOk) {
        okLines.push(`- **${controlId}**: OK in ${g.ok}/${g.total} combinazioni (con fallimenti o avvisi su altre combinazioni)`)
      }

      const distinctControls = expectedIds.length

      const synth = expectedIds.map((id) => {
        const related = rows.filter((r) => r.id === id)
        const order = ['FALLITO', 'AVVISO', 'NON PROVATO', 'OK']
        let worst = 'NON PROVATO'
        for (const o of order) {
          if (related.some((r) => r.esito === o)) {
            worst = o
            break
          }
        }
        const g = okById.get(id)
        const detail = g ? `${g.ok}/${g.total}` : '0/0'
        return `| ${id} | ${worst} (${detail}) |`
      })

      const durata =
        this.meta.durataMs != null
          ? ` · Durata: ${this.meta.durataMs < 60000 ? `${Math.round(this.meta.durataMs / 1000)} s` : `${Math.floor(this.meta.durataMs / 60000)} min ${Math.round((this.meta.durataMs % 60000) / 1000)} s`}`
          : ''

      const header = `# Esito verifica — ${ambiente} — ${data}
Commit: ${commit} · Lanciatore: ${this.meta.launcherHeader ?? launcherVersion} · Browser: ${this.meta.browsers ?? browsers} · Controlli: ${this.meta.controlliBasename ?? controlliBasename} v${controlliVersion}${durata}${this.invalidRun ? ' · **ESECUZIONE NON VALIDA** (controllo AMBIENTE fallito)' : ''}

## Riepilogo
OK: ${counts.OK} · FALLITO: ${counts.FALLITO} · AVVISO: ${counts.AVVISO} · NON PROVATO: ${counts['NON PROVATO']} · Controlli distinti nel JSON: ${distinctControls}

## Esiti compatti

### OK (raggruppati)
${okLines.length ? okLines.join('\n') : '- (nessuno)'}

### FALLITO
${falliti.length ? fallitiGrouped : '- (nessuno)'}

### AVVISO
${avvisi.length ? avvisi.map((r) => lineDetail(r)).join('\n') : '- (nessuno)'}

### NON PROVATO
${nonPr.length ? nonPr.map((r) => lineDetail(r)).join('\n') : '- (nessuno)'}

## Tabella controlli distinti (JSON)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
${synth.join('\n')}

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
${rows
  .filter((r) => r.esito !== 'OK')
  .map((r) => `| ${r.id} | ${r.schermata} | ${r.profiloTema} | ${r.esito} | ${escapeCell(r.misurato)} | ${escapeCell(r.atteso)} | ${escapeCell(r.evidenza)} |`)
  .join('\n') || '| — | — | — | — | — | — | — |'}

## Non provato (e perché)
${nonProvato.length ? nonProvato.map((n) => `- ${n.id}: ${n.motivo}`).join('\n') : '- (nessuno)'}

## Anomalie dell'ambiente
${anomalie.length ? anomalie.map((a) => `- ${a}`).join('\n') : '- (nessuna)'}
`
      writeFileSync(join(dir, 'rapporto.md'), header, 'utf8')
      writeFileSync(
        join(dir, 'risultati.json'),
        JSON.stringify(
          {
            meta: {
              ambiente,
              data,
              commit,
              launcherVersion,
              launcherHeader: this.meta.launcherHeader,
              browsers: this.meta.browsers ?? browsers,
              controlliBasename: this.meta.controlliBasename,
              livelloEseguito: this.meta.livelloEseguito,
              controlliVersion,
              durataMs: this.meta.durataMs,
              invalidRun: this.invalidRun,
            },
            counts,
            distinctControls,
            rows,
            nonProvato,
            anomalie,
          },
          null,
          2,
        ),
        'utf8',
      )
      return dir
    },
  }
}

function lineDetail(r) {
  return `- **${r.id}** (${r.schermata}, ${r.profiloTema}): misurato \`${escapeInline(r.misurato)}\` · atteso \`${escapeInline(r.atteso)}\`${r.evidenza && r.evidenza !== '—' ? ` · ${r.evidenza}` : ''}`
}

function formatFallitiGrouped(falliti) {
  const byId = new Map()
  for (const r of falliti) {
    const g = byId.get(r.id) ?? { id: r.id, count: 0, example: null, combos: [] }
    g.count += 1
    if (!g.example) g.example = r
    g.combos.push(`${r.schermata} · ${r.profiloTema}`)
    byId.set(r.id, g)
  }
  return [...byId.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((g) => {
      const ex = g.example
      const comboList = g.combos.join('; ')
      return `- **${g.id}** (${g.count} combinazioni): es. \`${escapeInline(ex.misurato)}\` · atteso \`${escapeInline(ex.atteso)}\` · ${comboList}`
    })
    .join('\n')
}

/** Dopo gli screenshot: stesso hash con tema diverso → anomalia. */
export function auditScreenshotThemeHashes(report) {
  const byHash = new Map()
  for (const entry of report.screenshotHashes) {
    const prev = byHash.get(entry.hash)
    if (prev && prev.temaKey !== entry.temaKey) {
      report.anomalie.push(
        `screenshot: hash identico tra temi diversi (${prev.temaKey} vs ${entry.temaKey}): ${prev.name} e ${entry.name}`,
      )
    } else if (!prev) {
      byHash.set(entry.hash, entry)
    }
  }
}

function escapeCell(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function escapeInline(s) {
  return String(s ?? '').replace(/`/g, "'").slice(0, 200)
}
