import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function initReport({ ambiente, data, commit, launcherVersion, browsers, controlliVersion }) {
  const dir = join(import.meta.dirname, '../../../docs/design/verifica/esiti', `${data}-${ambiente}`)
  const imgDir = join(dir, 'img')
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
  mkdirSync(imgDir, { recursive: true })
  const rows = []
  const nonProvato = []
  const anomalie = []

  return {
    dir,
    imgDir,
    meta: { ambiente, data, commit, launcherVersion, browsers, controlliVersion },
    rows,
    nonProvato,
    anomalie,
    add(row) {
      rows.push(row)
    },
    addNonProvato(id, motivo) {
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
      const counts = { OK: 0, FALLITO: 0, AVVISO: 0, 'NON PROVATO': 0 }
      for (const r of rows) counts[r.esito] = (counts[r.esito] ?? 0) + 1

      const header = `# Esito verifica — ${ambiente} — ${data}
Commit: ${commit} · Lanciatore: ${launcherVersion} · Browser: ${browsers} · Controlli: controlli-8.2.json v${controlliVersion}

## Riepilogo
OK: ${counts.OK} · FALLITO: ${counts.FALLITO} · AVVISO: ${counts.AVVISO ?? 0} · NON PROVATO: ${counts['NON PROVATO'] ?? 0}

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
${rows.map((r) => `| ${r.id} | ${r.schermata} | ${r.profiloTema} | ${r.esito} | ${escapeCell(r.misurato)} | ${escapeCell(r.atteso)} | ${escapeCell(r.evidenza)} |`).join('\n')}

## Non provato (e perché)
${nonProvato.length ? nonProvato.map((n) => `- ${n.id}: ${n.motivo}`).join('\n') : '- (nessuno)'}

## Anomalie dell'ambiente
${anomalie.length ? anomalie.map((a) => `- ${a}`).join('\n') : '- (nessuna)'}
`
      writeFileSync(join(dir, 'rapporto.md'), header, 'utf8')
      writeFileSync(
        join(dir, 'risultati.json'),
        JSON.stringify({ meta: { ambiente, data, commit, launcherVersion, browsers, controlliVersion }, counts, rows, nonProvato, anomalie }, null, 2),
        'utf8',
      )
      return dir
    },
  }
}

function escapeCell(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}
