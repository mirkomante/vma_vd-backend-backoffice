import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter'

import { E2E_ESITI_DIR, E2E_PROGRESS_LOG, REPO_ROOT } from '../lib/paths'
import { runProcess } from '../lib/exec'

const LAUNCHER = process.env.E2E_SUITE === 'controlli' ? 'e2e/T1c-playwright' : 'e2e/T0-playwright'

type RowEsito = 'OK' | 'FALLITO' | 'AVVISO' | 'NON PROVATO' | 'ERRORE-STRUMENTO'

type Row = {
  id: string
  schermata: string
  profiloTema: string
  esito: RowEsito
  misurato: string
  atteso: string
  evidenza: string
  seconds: number
}

function classify(result: TestResult, test: TestCase): RowEsito {
  if (result.status === 'timedOut') return 'ERRORE-STRUMENTO'
  if (result.status === 'passed') {
    if (test.annotations.some((a) => a.type === 'AVVISO')) return 'AVVISO'
    return 'OK'
  }
  if (result.status === 'skipped') return 'NON PROVATO'
  if (result.status === 'failed') {
    const msg = result.error?.message ?? ''
    if (msg.includes('expect(') || msg.includes('toBe') || msg.includes('toHave')) {
      return 'FALLITO'
    }
    return 'ERRORE-STRUMENTO'
  }
  return 'ERRORE-STRUMENTO'
}

function instrumentoDetail(result: TestResult): string {
  if (result.status === 'timedOut') return 'tempo'
  if (result.error?.message?.includes('Test timeout')) return 'tempo'
  return (result.error?.message ?? 'errore').split('\n')[0]?.slice(0, 200) ?? 'errore'
}

async function gitCommitShort(): Promise<string> {
  const r = await runProcess('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, timeoutMs: 15_000 })
  return r.code === 0 ? r.stdout.trim().slice(0, 12) : 'unknown'
}

export default class E2eReporter implements Reporter {
  private rows: Row[] = []
  private progress = createWriteStream(E2E_PROGRESS_LOG, { flags: 'a' })
  private started = Date.now()

  onTestEnd(test: TestCase, result: TestResult): void {
    const esito = classify(result, test)
    const seconds = (result.duration / 1000).toFixed(1)
    const schermata = test.parent.title || 'smoke'
    const profiloTema = test.parent.project()?.name ?? '—'
    const row: Row = {
      id: test.title,
      schermata,
      profiloTema,
      esito,
      misurato:
        esito === 'ERRORE-STRUMENTO'
          ? instrumentoDetail(result)
          : esito === 'FALLITO' || esito === 'AVVISO'
            ? (result.error?.message?.split('\n')[0] ?? '—').slice(0, 200)
            : esito === 'NON PROVATO'
              ? test.annotations.find((a) => a.type === 'skip')?.description ?? 'saltato'
              : 'conforme',
      atteso:
        esito === 'FALLITO' || esito === 'AVVISO'
          ? 'asserzione soddisfatta'
          : esito === 'NON PROVATO'
            ? 'motivo nel skip'
            : esito === 'ERRORE-STRUMENTO'
              ? 'nessuna eccezione fuori asserzione'
              : 'come da JSON',
      evidenza: result.status,
      seconds: Number(seconds),
    }
    this.rows.push(row)
    const line = `${new Date().toISOString()}\t${profiloTema}\t${schermata}\t${test.title}\t${esito}\t${seconds}s\n`
    this.progress.write(line)
    process.stdout.write(`[e2e] ${profiloTema} ${test.title} ${esito} ${seconds}s\n`)
  }

  async onEnd(result: FullResult): Promise<void> {
    this.progress.end()
    mkdirSync(E2E_ESITI_DIR, { recursive: true })
    const commit = await gitCommitShort()
    const counts = {
      OK: 0,
      FALLITO: 0,
      AVVISO: 0,
      'NON PROVATO': 0,
      'ERRORE-STRUMENTO': 0,
    }
    const strumento: Row[] = []
    for (const row of this.rows) {
      counts[row.esito] += 1
      if (row.esito === 'ERRORE-STRUMENTO') strumento.push(row)
    }

    const risultati = {
      commit,
      launcher: LAUNCHER,
      browser: 'chromium (Playwright)',
      controlli:
        process.env.E2E_SUITE === 'controlli'
          ? 'controlli-6.6.json (T1c servizi, menu-fissi)'
          : 'controlli-6.6.json (smoke T0)',
      durataSecondi: Math.round((Date.now() - this.started) / 1000),
      riepilogo: counts,
      esiti: this.rows,
      erroriStrumento: strumento,
      anomalie: [],
      exitCode: result.status,
    }
    writeFileSync(join(E2E_ESITI_DIR, 'risultati.json'), JSON.stringify(risultati, null, 2), 'utf8')

    const md = [
      `# Esito verifica — locale-prod e2e — ${new Date().toISOString().slice(0, 10)}`,
      `Commit: ${commit} · Lanciatore: ${LAUNCHER} · Browser: chromium (Playwright) · Controlli: smoke T0`,
      '',
      '## Riepilogo',
      `OK: ${counts.OK} · FALLITO: ${counts.FALLITO} · AVVISO: ${counts.AVVISO} · NON PROVATO: ${counts['NON PROVATO']}`,
      '',
      `## ERRORE-STRUMENTO (${counts['ERRORE-STRUMENTO']})`,
      ...strumento.map((r) => `- ${r.id} (${r.profiloTema}): ${r.misurato}`),
      '',
      '## Esiti',
      '| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |',
      '|---|---|---|---|---|---|---|',
      ...this.rows.map(
        (r) =>
          `| ${r.id} | ${r.schermata} | ${r.profiloTema} | ${r.esito} | ${r.misurato} | ${r.atteso} | ${r.evidenza} |`,
      ),
      '',
    ].join('\n')
    writeFileSync(join(E2E_ESITI_DIR, 'rapporto.md'), md, 'utf8')
  }

  printsToStdio(): boolean {
    return true
  }

  onBegin(config: FullConfig, suite: Suite): void {
    void config
    void suite
  }
}
