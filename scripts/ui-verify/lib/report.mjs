import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import { allControlIds } from './controlli-index.mjs'

const PACCHETTO_ORDER = ['accesso', 'shell', 'orari', 'online', 'completo']

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
  preserveEsiti = true,
}) {
  const dir = join(import.meta.dirname, '../../../docs/design/verifica/esiti', `${data}-${ambiente}`)
  const imgDir = join(dir, 'img')
  mkdirSync(imgDir, { recursive: true })

  const risultatiPath = join(dir, 'risultati.json')
  let rows = []
  let anomalie = []
  let screenshotHashes = []
  let priorMeta = {}

  if (preserveEsiti && existsSync(risultatiPath)) {
    try {
      const prev = JSON.parse(readFileSync(risultatiPath, 'utf8'))
      rows = prev.rows ?? []
      anomalie = prev.anomalie ?? []
      screenshotHashes = prev.screenshotHashes ?? []
      priorMeta = prev.meta ?? {}
    } catch {
      /* riparte vuoto se JSON corrotto */
    }
  } else if (!preserveEsiti && existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(imgDir, { recursive: true })
  }

  const expectedIds = allControlIds(controlli, ambiente, expectedIdsOptions)

  const launcherHeader =
    livelloEseguito === 'completo'
      ? `${launcherVersion}`
      : `${launcherVersion} (${livelloEseguito})`

  return {
    dir,
    imgDir,
    pacchettoDefault: null,
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
      priorMeta,
    },
    rows,
    nonProvato: [],
    anomalie,
    screenshotHashes,
    expectedIds,
    invalidRun: false,
    replacePacchetto(pacchetto) {
      if (!pacchetto) return
      this.rows = this.rows.filter((r) => (r.pacchetto ?? inferPacchettoFromRow(r)) !== pacchetto)
    },
    add(row) {
      const pacchetto = row.pacchetto ?? this.pacchettoDefault ?? inferPacchettoFromRow(row)
      this.rows.push({ ...row, pacchetto })
    },
    addNonProvato(id, motivo) {
      if (this.nonProvato.some((n) => n.id === id)) return
      this.nonProvato.push({ id, motivo })
      this.rows.push({
        id,
        schermata: '—',
        profiloTema: '—',
        pacchetto: this.pacchettoDefault ?? 'completo',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: motivo,
      })
    },
    write() {
      const recordedIds = new Set(this.rows.map((r) => r.id))
      for (const id of expectedIds) {
        if (!recordedIds.has(id)) {
          this.addNonProvato(id, 'controllo non eseguito dal lanciatore in questa esecuzione')
        }
      }

      const counts = { OK: 0, FALLITO: 0, AVVISO: 0, 'NON PROVATO': 0 }
      for (const r of this.rows) counts[r.esito] = (counts[r.esito] ?? 0) + 1

      const okById = new Map()
      for (const r of this.rows) {
        const g = okById.get(r.id) ?? { ok: 0, total: 0 }
        g.total += 1
        if (r.esito === 'OK') g.ok += 1
        okById.set(r.id, g)
      }

      const falliti = this.rows.filter((r) => r.esito === 'FALLITO')
      const avvisi = this.rows.filter((r) => r.esito === 'AVVISO')
      const nonPr = this.rows.filter((r) => r.esito === 'NON PROVATO')

      const fallitiGrouped = formatFallitiGrouped(falliti)

      const okLines = [...okById.entries()]
        .filter(([, g]) => g.ok === g.total && g.total > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, g]) => `- **${id}**: OK in ${g.ok}/${g.total} combinazioni`)

      const partialOk = [...okById.entries()].filter(([, g]) => g.ok > 0 && g.ok < g.total)
      for (const [controlId, g] of partialOk) {
        okLines.push(
          `- **${controlId}**: OK in ${g.ok}/${g.total} combinazioni (con fallimenti o avvisi su altre combinazioni)`,
        )
      }

      const distinctControls = expectedIds.length

      const synth = expectedIds.map((id) => {
        const related = this.rows.filter((r) => r.id === id)
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

      const sectionBlocks = buildPacchettoSections(this.rows, {
        okLines,
        fallitiGrouped,
        avvisi,
        nonPr,
      })

      const header = `# Esito verifica — ${ambiente} — ${data}
Commit: ${commit} · Lanciatore: ${this.meta.launcherHeader ?? launcherVersion} · Browser: ${this.meta.browsers ?? browsers} · Controlli: ${this.meta.controlliBasename ?? controlliBasename} v${controlliVersion}${durata}${this.invalidRun ? ' · **ESECUZIONE NON VALIDA** (controllo AMBIENTE fallito)' : ''}

## Riepilogo (tutti i pacchetti in cartella)
OK: ${counts.OK} · FALLITO: ${counts.FALLITO} · AVVISO: ${counts.AVVISO} · NON PROVATO: ${counts['NON PROVATO']} · Controlli distinti nel JSON corrente: ${distinctControls}

${sectionBlocks}

## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
${synth.join('\n')}

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
${this.rows
  .filter((r) => r.esito !== 'OK')
  .map(
    (r) =>
      `| ${r.id} | ${r.schermata} | ${r.profiloTema} | ${r.esito} | ${escapeCell(r.misurato)} | ${escapeCell(r.atteso)} | ${escapeCell(r.evidenza)} |`,
  )
  .join('\n') || '| — | — | — | — | — | — | — |'}

## Non provato (e perché)
${this.nonProvato.length ? this.nonProvato.map((n) => `- ${n.id}: ${n.motivo}`).join('\n') : '- (nessuno)'}

## Anomalie dell'ambiente
${this.anomalie.length ? this.anomalie.map((a) => `- ${a}`).join('\n') : '- (nessuna)'}
`
      writeFileSync(join(dir, 'rapporto.md'), header, 'utf8')
      writeFileSync(
        risultatiPath,
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
            rows: this.rows,
            nonProvato: this.nonProvato,
            anomalie: this.anomalie,
            screenshotHashes: this.screenshotHashes,
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

function inferPacchettoFromRow(row) {
  const id = row.id ?? ''
  const sch = row.schermata ?? ''
  if (id.startsWith('orari-') || sch.startsWith('orari/')) return 'orari'
  if (id.startsWith('on')) return 'online'
  if (
    sch.includes('login') ||
    sch.includes('forgot') ||
    sch.includes('reset') ||
    sch.includes('verify') ||
    id.startsWith('login-') ||
    id.startsWith('forgot-') ||
    id.startsWith('reset-') ||
    id.startsWith('verify-') ||
    id.startsWith('acc-')
  ) {
    return 'accesso'
  }
  if (id.startsWith('shell-') || sch.startsWith('shell/') || id === 'home-testi') return 'shell'
  if (sch.startsWith('orari')) return 'orari'
  return 'completo'
}

function buildPacchettoSections(allRows, { okLines, fallitiGrouped, avvisi, nonPr }) {
  const present = new Set(allRows.map((r) => r.pacchetto ?? inferPacchettoFromRow(r)))
  const blocks = []
  for (const p of PACCHETTO_ORDER) {
    if (!present.has(p)) continue
    const subset = allRows.filter((r) => (r.pacchetto ?? inferPacchettoFromRow(r)) === p)
    const ok = subset.filter((r) => r.esito === 'OK').length
    const fail = subset.filter((r) => r.esito === 'FALLITO')
    blocks.push(`## Pacchetto: ${p}
Righe: ${subset.length} · OK: ${ok} · FALLITO: ${fail.length}

### FALLITO (${p})
${fail.length ? formatFallitiGrouped(fail) : '- (nessuno)'}
`)
  }
  blocks.push(`## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
${okLines.length ? okLines.join('\n') : '- (nessuno)'}

### FALLITO (tutte le righe, dettaglio)
${fallitiGrouped || '- (nessuno)'}

### AVVISO
${avvisi.length ? avvisi.map((r) => lineDetail(r)).join('\n') : '- (nessuno)'}

### NON PROVATO
${nonPr.length ? nonPr.map((r) => lineDetail(r)).join('\n') : '- (nessuno)'}
`)
  return blocks.join('\n')
}

function lineDetail(r) {
  return `- **${r.id}** | ${r.schermata} | ${r.profiloTema} | misurato \`${escapeInline(r.misurato)}\` | atteso \`${escapeInline(r.atteso)}\` | evidenza: ${escapeInline(r.evidenza)}`
}

function formatFallitiGrouped(falliti) {
  return falliti
    .slice()
    .sort((a, b) => `${a.id}${a.schermata}`.localeCompare(`${b.id}${b.schermata}`))
    .map(
      (r) =>
        `- **${r.id}** | ${r.schermata} | ${r.profiloTema} | misurato \`${escapeInline(r.misurato)}\` | atteso \`${escapeInline(r.atteso)}\` | evidenza: ${escapeInline(r.evidenza)}`,
    )
    .join('\n')
}

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
  return String(s ?? '').replace(/`/g, "'").slice(0, 400)
}
