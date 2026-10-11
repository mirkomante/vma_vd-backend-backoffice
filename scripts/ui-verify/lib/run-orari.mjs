import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import net from 'node:net'

import {
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  installNoLampoObserver,
  checkNoLampo,
  checkTemaCambioSistema,
  withinTolerance,
  openMobileSidebar,
  openUserMenu,
} from './engine.mjs'
import {
  hoursPayloadRun,
  hoursRestoreFrom,
  hoursSnapshotToTemp,
  hoursVerifySnapshot,
} from './hours-payload.mjs'
import {
  waitForPageLayoutStable,
  waitForStableBoundingBox,
} from './measure-stable.mjs'

const ROOT = join(import.meta.dirname, '../../..')
const SIM_PORT = 3200
const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])
const ENGLISH_A11Y = ['Close', 'Edit', 'Delete', 'Remove', 'Save', 'Cancel', 'Add', 'Toggle']

const ORARI_SCREENSHOT_STATES = new Set([
  'iniziale',
  'errore-validazione',
  'salvato',
  'foglio-chiusura',
  'conferma-rimozione',
  'salvataggio-in-corso',
  'errore-server',
  'non-configurato',
  'errore-caricamento',
  'uscita',
])

async function mainStateDigest(page) {
  const text = await page.locator('main').innerText().catch(() => '')
  const norm = text.replace(/\s+/g, ' ').trim().slice(0, 480)
  const alerts = (await page.locator('[role="alert"]').allTextContents().catch(() => [])).join(' | ').slice(0, 160)
  const timeInputs = await page.locator('input[type="time"]').count()
  const saveVisible = await page
    .getByRole('button', { name: 'Salva modifiche' })
    .isVisible()
    .catch(() => false)
  return { norm, alerts, timeInputs, saveVisible, url: page.url() }
}

async function addDiagnosticRow(report, addRow, screenshot, page, rowBase, shotName, temaKey = 'chiaro') {
  const d = await mainStateDigest(page)
  if (shotName && screenshot) {
    await screenshot(page, report, shotName, temaKey)
  }
  addRow(report, {
    ...rowBase,
    misurato: `${rowBase.misurato} | pagina:${d.norm.slice(0, 140)} | timeInputs:${d.timeInputs} | salvaVis:${d.saveVisible}`,
    evidenza: `${rowBase.evidenza ?? ''} | shot:${shotName ?? '—'} | alert:${d.alerts || '—'} | ${d.url}`.slice(0, 900),
  })
}

function loadValidationMessages() {
  const src = readFileSync(join(ROOT, 'lib/systemSettings/timeOfDay.ts'), 'utf8')
  const required = src.match(/value === ''\) \{\s*return '([^']+)'/)?.[1]
  const invalid = src.match(/!isValidTimeOfDay\(value\)\) \{\s*return '([^']+)'/)?.[1]
  if (!required || !invalid) throw new Error('Messaggi timeOfDay non letti da lib')
  return { required, invalid }
}

const TIME_MSG = loadValidationMessages()

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function isPortFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer()
    s.once('error', () => resolve(false))
    s.once('listening', () => s.close(() => resolve(true)))
    s.listen(port, '127.0.0.1')
  })
}

async function waitForUrl(baseUrl, ms = 120000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(baseUrl, { redirect: 'manual' })
      if (res.status < 500) return
    } catch {
      /* retry */
    }
    await sleep(600)
  }
  throw new Error(`Server non raggiungibile: ${baseUrl}`)
}

/** Server dev dedicato (simulazioni APP_HOURS_DEV_SIMULATE_* richiedono NODE_ENV development). */
function startDevServer(port, extraEnv) {
  try {
    unlinkSync(join(ROOT, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  const child = spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: ROOT,
    env: { ...process.env, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stderr?.on('data', (chunk) => {
    const t = String(chunk)
    if (t.includes('Error') || t.includes('ready')) {
      process.stderr.write(`[sim:${port}] ${t.slice(0, 120)}\n`)
    }
  })
  return child
}

async function waitDialogTouchTargetsReady(page) {
  const dialog = page.getByRole('alertdialog')
  await dialog.waitFor({ state: 'visible' })
  const firstBtn = dialog.getByRole('button').first()
  await waitForStableBoundingBox(page, firstBtn, { attempts: 60, intervalMs: 100 })
  try {
    await page.waitForFunction(
      () => {
        const b = document.querySelector('[role="alertdialog"] button')
        if (!b) return false
        const h = b.getBoundingClientRect().height
        return h >= 43.5
      },
      { timeout: 8000 },
    )
  } catch {
    await waitForStableBoundingBox(page, firstBtn, { attempts: 20, intervalMs: 100 })
  }
}

async function waitForPortFree(port, ms = 30000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    if (await isPortFree(port)) return
    await sleep(500)
  }
  throw new Error(`Porta ${port} ancora occupata dopo ${ms}ms`)
}

export async function gotoHoursReady(page, baseUrl) {
  await page.goto('/app/hours', { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: 'Orari' }).waitFor({ timeout: 20000 })
}

async function setTimeInput(page, id, value) {
  await page.locator(`#${id}`).fill(value)
}

async function clickSave(page) {
  await page.getByRole('button', { name: 'Salva modifiche' }).click()
}

async function makeDirty(page) {
  const el = page.locator('#hours-lunch-start')
  const v = await el.inputValue()
  const next = v === '12:00' ? '12:01' : '12:00'
  await el.fill(next)
}

function attachConsoleListeners(page) {
  const bag = { errors: [], warnings: [], failed: [] }
  page.on('console', (msg) => {
    if (msg.type() === 'error') bag.errors.push(msg.text())
    if (msg.type() === 'warning') bag.warnings.push(msg.text())
  })
  page.on('pageerror', (e) => bag.errors.push(String(e)))
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) bag.failed.push(`${res.status()} ${res.url()}`)
  })
  return bag
}

function consoleEsito(bag) {
  const ok = bag.errors.length === 0 && bag.warnings.length === 0 && bag.failed.length === 0
  return {
    ok,
    misurato: `err:${bag.errors.length} warn:${bag.warnings.length} http:${bag.failed.length}`,
    evidenza: [...bag.errors, ...bag.warnings, ...bag.failed].slice(0, 3).join(' | ') || '—',
  }
}

async function prepareState(page, stateId, profiloKey, temaKey) {
  await gotoHoursReady(page)
  switch (stateId) {
    case 'iniziale':
      return
    case 'modificato':
      await makeDirty(page)
      return
    case 'errore-validazione':
      await page.locator('#hours-lunch-start').fill('')
      await clickSave(page)
      return
    case 'salvato':
      if (profiloKey !== 'telefono-390' || temaKey !== 'chiaro') return
      await page.locator('#hours-lunch-start').fill('12:15')
      await page.locator('#hours-lunch-end').fill('14:15')
      await page.getByRole('button', { name: 'Salva modifiche' }).waitFor({ state: 'visible', timeout: 10000 })
      await clickSave(page)
      await page.getByText('Orari salvati').waitFor({ timeout: 15000 })
      return
    case 'foglio-chiusura':
      await page.getByRole('button', { name: 'Aggiungi chiusura' }).click()
      await page.getByRole('heading', { name: 'Nuova chiusura' }).waitFor()
      return
    case 'conferma-rimozione':
      await page.locator('#hours-holiday-year').fill('2026')
      await page.getByRole('button', { name: 'Rimuovi festività di un anno' }).click()
      await page.getByRole('alertdialog').waitFor()
      return
    case 'salvataggio-in-corso':
      await makeDirty(page)
      return
    case 'errore-server':
    case 'errore-caricamento':
    case 'non-configurato':
    case 'uscita':
      return
    default:
      return
  }
}

async function freshHoursPage(browser, baseUrl, loginApp, testUser, testPassword, profiloKey, temaKey, newPage, snapshotPath) {
  hoursRestoreFrom(snapshotPath)
  const { ctx: pctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
  await loginApp(page, baseUrl, testUser.email, testPassword)
  await page.goto('/app/hours', { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: 'Orari' }).waitFor({ timeout: 20000 })
  return { pctx, page }
}

async function measureFormColumn(page, profiloKey, tol) {
  const col = page.locator('main .max-w-xl').first()
  await waitForStableBoundingBox(page, col)
  const box = await col.boundingBox()
  if (!box) return { ok: false, misurato: 'colonna assente', atteso: 'presente' }
  const mainBox = await page.locator('main').boundingBox()
  const vw = await page.evaluate(() => window.innerWidth)
  if (profiloKey === 'notebook-1280') {
    const mainX = mainBox?.x ?? 0
    const mainW = mainBox?.width ?? vw
    const expectedLeft = mainX + (mainW - 576) / 2
    const contentCenter = mainX + mainW / 2
    const wOk = withinTolerance(box.width, 576, tol)
    const centerOk = withinTolerance(box.x + box.width / 2, contentCenter, tol + 8)
    const leftOk = withinTolerance(box.x, expectedLeft, tol + 8)
    const toggle = page.locator('[aria-label="Giorni di riposo settimanali"] [data-state]')
    const firstToggle = page.locator('[aria-label="Giorni di riposo settimanali"] button').first()
    const groupBox = await page.locator('[aria-label="Giorni di riposo settimanali"]').boundingBox()
    const itemBox = await firstToggle.boundingBox()
    const gOk = groupBox ? withinTolerance(groupBox.width, 392, tol + 4) : false
    const iOk = itemBox ? withinTolerance(itemBox.width, 56, tol + 4) : false
    const ok = wOk && centerOk && leftOk && gOk && iOk
    return {
      ok,
      misurato: `form ${Math.round(box.width)}px x=${Math.round(box.x)} (main ${Math.round(mainX)}+${Math.round(mainW)}); gruppo ${groupBox ? Math.round(groupBox.width) : '?'}; voce ${itemBox ? Math.round(itemBox.width) : '?'}`,
      atteso: `576 centrato in main (left≈${Math.round(expectedLeft)}); gruppo 392; voce 56`,
    }
  }
  const marginOk = withinTolerance(box.x, 16, tol + 2) && withinTolerance(vw - (box.x + box.width), 16, tol + 2)
  const firstToggle = page.locator('[aria-label="Giorni di riposo settimanali"] button').first()
  const itemBox = await firstToggle.boundingBox()
  const iOk = itemBox ? withinTolerance(itemBox.width, 47, 3) : false
  return {
    ok: marginOk && iOk,
    misurato: `margini ~${Math.round(box.x)}/${Math.round(vw - box.x - box.width)}; voce ${itemBox ? Math.round(itemBox.width) : '?'}`,
    atteso: '16px margini; voce ~47px',
  }
}

export async function runOrariChecks(ctx) {
  const {
    browser,
    baseUrl,
    report,
    runCtx,
    CONTROLLI,
    newPage,
    loginApp,
    testUser,
    testPassword,
    addRow,
    progressStep,
    resultToEsito,
    screenshot,
    SHOT_PROFILES,
    SHOT_TEMI,
  } = ctx

  const temiAll = runCtx.temiKeys()
  const profiliAll = runCtx.profiliAccess().concat(
    runCtx.profiliShell().filter((p) => !runCtx.profiliAccess().includes(p)),
  )
  const profiliUnique = [...new Set(profiliAll)]

  const snapshotPath = hoursSnapshotToTemp()
  const baselineSlice = JSON.parse(readFileSync(snapshotPath, 'utf8'))
  report.anomalie.push(
    `Global iniziale (snapshot): weeklyClosedDays=${JSON.stringify(baselineSlice.weeklyClosedDays ?? [])}; services=${(baselineSlice.services ?? []).length}; closures=${(baselineSlice.annualClosures ?? []).length}; bnb=${baselineSlice.bnb ? 'presente' : 'assente'}`,
  )

  try {
    try {
      const audit = hoursPayloadRun('audit-closures')
      if (audit.duplicateIds?.length) {
        report.anomalie.push(
          `annualClosures: id duplicati nel Global dev (${audit.duplicateIds.length}): ${audit.duplicateIds.slice(0, 5).join(', ')}`,
        )
      }
      if (audit.rowsWithoutId > 0) {
        report.anomalie.push(`annualClosures: ${audit.rowsWithoutId} righe senza id`)
      }
    } catch (e) {
      report.anomalie.push(`audit-closures: ${e.message}`)
    }

    if (runCtx.shouldRun('orari-stato-iniziale')) {
      progressStep('orari', 'stato-iniziale', 'telefono-390', 'chiaro')
      const { pctx, page } = await freshHoursPage(
        browser,
        baseUrl,
        loginApp,
        testUser,
        testPassword,
        'telefono-390',
        'chiaro',
        newPage,
        snapshotPath,
      )
      const saveBar = await page.locator('[data-slot="app-save-bar"]').count()
      const alerts = await page.locator('[role="alert"]').count()
      const statusText = await page.locator('[role="status"]').innerText().catch(() => '')
      const ok = saveBar === 0 && alerts === 0 && !statusText.includes('Orari salvati')
      addRow(report, {
        id: 'orari-stato-iniziale',
        schermata: 'orari/iniziale',
        profiloTema: 'telefono-390/chiaro',
        esito: ok ? 'OK' : 'FALLITO',
        misurato: `saveBar:${saveBar} alert:${alerts} status:${statusText.slice(0, 40)}`,
        atteso: 'nessuna barra né avviso su pagina appena caricata',
        evidenza: '/app/hours',
      })
      await pctx.close()
    }

    for (const stato of [
      'iniziale',
      'modificato',
      'errore-validazione',
      'salvato',
      'foglio-chiusura',
      'conferma-rimozione',
    ]) {
      for (const temaKey of temiAll) {
        for (const profiloKey of profiliUnique) {
          if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820' && profiloKey !== 'soglia-767') continue
          if (['soglia-767', 'soglia-768'].includes(profiloKey)) continue
          progressStep('orari', stato, profiloKey, temaKey)
          const { ctx: pctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
          const sch = `orari/${stato}`
          const pt = `${profiloKey}/${temaKey}`
          try {
          hoursRestoreFrom(snapshotPath)
          await loginApp(page, baseUrl, testUser.email, testPassword)
          await page.goto('/app/hours', { waitUntil: 'networkidle' })
          await page.locator('h1', { hasText: 'Orari' }).waitFor({ timeout: 20000 })
          await prepareState(page, stato, profiloKey, temaKey)
          if (stato === 'foglio-chiusura' || stato === 'conferma-rimozione') {
            await waitForPageLayoutStable(page)
          }

          if (C1_PROFILES.has(profiloKey) && runCtx.shouldRun('C1')) {
            const r = await checkScrollOrizzontale(page)
            addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: '/app/hours' })
          }
          if (C2_PROFILES.has(profiloKey) && runCtx.shouldRun('C2')) {
            let r = await checkToccoMinimo(page, { stableFirst: true })
            addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: stato })
            if (stato === 'foglio-chiusura') {
              await waitForStableBoundingBox(page, page.getByRole('dialog').first())
              r = await checkToccoMinimo(page, { stableFirst: true })
              addRow(report, { id: 'C2', schermata: `${sch} (foglio)`, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: 'foglio' })
            }
            if (stato === 'conferma-rimozione' && profiloKey === 'telefono-390') {
              await waitDialogTouchTargetsReady(page)
              r = await checkToccoMinimo(page, { stableFirst: true })
              addRow(report, { id: 'C2', schermata: `${sch} (dialog)`, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: 'dialog' })
            }
          }
          if (profiloKey === 'notebook-1280' && runCtx.shouldRun('C2-mouse')) {
            const r = await checkAltezzaMouse(page)
            addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), ...r, evidenza: stato })
          }
          if (runCtx.shouldRun('C3')) {
            const r = await checkTemaClasse(page, CONTROLLI.temi[temaKey].html_dark)
            addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: stato })
          }
          if (['scuro', 'sistema-scuro'].includes(temaKey) && runCtx.shouldRun('C3-no-lampo')) {
            await installNoLampoObserver(page)
            await page.reload({ waitUntil: 'networkidle' })
            await loginApp(page, baseUrl, testUser.email, testPassword)
            await prepareState(page, stato, profiloKey, temaKey)
            const r = await checkNoLampo(page)
            addRow(report, { id: 'C3-no-lampo', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: stato })
          }

          if (SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey) && ORARI_SCREENSHOT_STATES.has(stato)) {
            if (stato === 'salvato' && (profiloKey !== 'telefono-390' || temaKey !== 'chiaro')) {
              /* solo riferimento 390-chiaro nel JSON immagini */
            } else {
              await screenshot(page, report, `orari-${stato}-${profiloKey}-${temaKey}`, temaKey)
            }
          }
          } catch (err) {
            report.anomalie.push(`orari ${sch} ${pt}: ${err.message}`)
            await addDiagnosticRow(report, addRow, screenshot, page, {
              id: 'runtime-orari-stato',
              schermata: sch,
              profiloTema: pt,
              esito: 'FALLITO',
              misurato: err.message,
              atteso: 'stato preparato',
              evidenza: `motivo: ${stato} non raggiunto`,
            }, `orari-runtime-${stato}-${profiloKey}-${temaKey}`, temaKey)
          }
          await pctx.close()
        }
      }
    }

    if (runCtx.shouldRun('orari-testi')) {
      progressStep('orari', 'testi', 'telefono-390', 'chiaro')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoHoursReady(page)
      const body = await page.locator('main').innerText()
      const checks = [
        'Orari',
        'Orari di vietnamonamour.com: ristorante e B&B.',
        'Servizi del ristorante',
        'Giorni di riposo settimanali',
        'Chiusure annuali',
        'B&B (vietnamonamour.com)',
        'Aggiungi chiusura',
      ]
      const missing = checks.filter((t) => !body.includes(t))
      addRow(report, {
        id: 'orari-testi',
        schermata: 'orari/iniziale',
        profiloTema: 'telefono-390/chiaro',
        esito: missing.length === 0 ? 'OK' : 'FALLITO',
        misurato: missing.length ? `mancano: ${missing.join(', ')}` : 'testi principali presenti',
        atteso: 'testi sezione 6 spec',
        evidenza: '/app/hours',
      })
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-campi-ora')) {
      const global = hoursPayloadRun('read-as', [testUser.email])
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoHoursReady(page)
      const count = await page.locator('input[type="time"]').count()
      const lunch = global.services?.find((s) => s.name === 'lunch')
      const dinner = global.services?.find((s) => s.name === 'dinner')
      const vals = {
        lunchStart: await page.locator('#hours-lunch-start').inputValue(),
        lunchEnd: await page.locator('#hours-lunch-end').inputValue(),
        dinnerStart: await page.locator('#hours-dinner-start').inputValue(),
        dinnerEnd: await page.locator('#hours-dinner-end').inputValue(),
        bnbIn: await page.locator('#hours-bnb-check-in').inputValue(),
        bnbOut: await page.locator('#hours-bnb-check-out').inputValue(),
      }
      const match =
        vals.lunchStart === lunch?.startTime &&
        vals.lunchEnd === lunch?.endTime &&
        vals.dinnerStart === dinner?.startTime &&
        vals.dinnerEnd === dinner?.endTime &&
        vals.bnbIn === global.bnb?.checkInTime &&
        vals.bnbOut === global.bnb?.checkOutTime
      addRow(report, {
        id: 'orari-campi-ora',
        schermata: 'orari/iniziale',
        profiloTema: 'telefono-390/chiaro',
        esito: count === 6 && match ? 'OK' : 'FALLITO',
        misurato: `n=${count} match=${match}`,
        atteso: '6 input time coerenti con Global',
        evidenza: JSON.stringify(vals),
      })
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-colonna')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { pctx, page } = await freshHoursPage(
          browser,
          baseUrl,
          loginApp,
          testUser,
          testPassword,
          profiloKey,
          'chiaro',
          newPage,
          snapshotPath,
        )
        const r = await measureFormColumn(page, profiloKey, 2)
        addRow(report, {
          id: 'orari-colonna',
          schermata: 'orari/iniziale',
          profiloTema: `${profiloKey}/chiaro`,
          esito: r.ok ? 'OK' : 'FALLITO',
          misurato: r.misurato,
          atteso: r.atteso,
          evidenza: '/app/hours',
        })
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-giorno-selezionato')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { pctx, page } = await freshHoursPage(
          browser,
          baseUrl,
          loginApp,
          testUser,
          testPassword,
          'telefono-390',
          temaKey,
          newPage,
          snapshotPath,
        )
        const lunBtn = page.getByRole('button', { name: 'Lunedì' })
        const before = await lunBtn.getAttribute('data-state')
        await lunBtn.click()
        await sleep(200)
        const pressed = await lunBtn.getAttribute('data-state')
        const colors = await page.evaluate(() => {
          const probe = document.createElement('div')
          probe.className = 'bg-primary text-primary-foreground'
          probe.style.position = 'absolute'
          probe.style.visibility = 'hidden'
          document.body.appendChild(probe)
          const primaryBg = getComputedStyle(probe).backgroundColor
          const primaryFg = getComputedStyle(probe).color
          probe.remove()
          const btn = document.querySelector('[aria-label="Giorni di riposo settimanali"] button[data-state="on"]')
          if (!btn) return null
          const cs = getComputedStyle(btn)
          return { btnBg: cs.backgroundColor, btnFg: cs.color, primaryBg, primaryFg }
        })
        const ok =
          pressed === 'on' &&
          colors &&
          colors.btnBg === colors.primaryBg &&
          colors.btnFg === colors.primaryFg
        const row = {
          id: 'orari-giorno-selezionato',
          schermata: 'orari/iniziale',
          profiloTema: `telefono-390/${temaKey}`,
          esito: ok ? 'OK' : 'FALLITO',
          misurato: colors
            ? `prima:${before} dopo:${pressed} ${colors.btnBg}`
            : `prima:${before} dopo:${pressed} (nessun toggle on)`,
          atteso: 'dopo click Lun: data-state=on e token primary',
          evidenza: 'click esplicito su Lunedì da baseline senza giorni attivi',
        }
        if (ok) addRow(report, row)
        else {
          await addDiagnosticRow(
            report,
            addRow,
            screenshot,
            page,
            { ...row, evidenza: `${row.evidenza} | motivo: toggle o colori non conformi` },
            `orari-giorno-selezionato-${temaKey}`,
            temaKey,
          )
        }
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-modificato-barra')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { pctx, page } = await freshHoursPage(
          browser,
          baseUrl,
          loginApp,
          testUser,
          testPassword,
          profiloKey,
          'chiaro',
          newPage,
          snapshotPath,
        )
        const original = await page.locator('#hours-lunch-start').inputValue()
        await makeDirty(page)
        const visible =
          (await page.locator('[data-slot="app-save-bar"]').isVisible()) &&
          (await page.getByText('Modifiche non salvate').isVisible())
        await page.locator('#hours-lunch-start').fill(original)
        await sleep(400)
        const hidden = (await page.locator('[data-slot="app-save-bar"]').count()) === 0
        addRow(report, {
          id: 'orari-modificato-barra',
          schermata: 'orari/modificato',
          profiloTema: `${profiloKey}/chiaro`,
          esito: visible && hidden ? 'OK' : 'FALLITO',
          misurato: `compare:${visible} scompare:${hidden}`,
          atteso: 'barra con testi attesi poi assente',
          evidenza: '/app/hours',
        })
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-barra-misure')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { pctx, page } = await freshHoursPage(
          browser,
          baseUrl,
          loginApp,
          testUser,
          testPassword,
          profiloKey,
          'chiaro',
          newPage,
          snapshotPath,
        )
        await makeDirty(page)
        const bar = page.locator('[data-slot="app-save-bar"]')
        await bar.waitFor({ state: 'visible', timeout: 10000 })
        await waitForStableBoundingBox(page, bar)
        const box = await bar.boundingBox()
        const buttons = bar.locator('button')
        const h0 = await waitForStableBoundingBox(page, buttons.nth(0))
        const h1 = await waitForStableBoundingBox(page, buttons.nth(1))
        let ok = Boolean(box)
        let misurato = 'barra assente'
        if (box && profiloKey === 'telefono-390') {
          ok =
            box.height <= 97 &&
            h0 &&
            h1 &&
            withinTolerance(h0.height, 44, 2) &&
            withinTolerance(h1.height, 44, 2) &&
            h0.y === h1.y
          misurato = `h=${Math.round(box.height)} btn=${h0 ? Math.round(h0.height) : '?'}`
        } else if (box && profiloKey === 'notebook-1280') {
          const col = await page.locator('main .max-w-xl').first().boundingBox()
          const text = bar.locator('p').first()
          const textBox = await text.boundingBox()
          ok =
            col &&
            withinTolerance(box.x, col.x, 4) &&
            withinTolerance(box.width, col.width, 4) &&
            textBox &&
            h0 &&
            textBox.x < h0.x
          misurato = `allineamento colonna=${ok}`
        }
        const row = {
          id: 'orari-barra-misure',
          schermata: 'orari/modificato',
          profiloTema: `${profiloKey}/chiaro`,
          esito: ok ? 'OK' : 'FALLITO',
          misurato,
          atteso: profiloKey === 'telefono-390' ? '≤97px, pulsanti 44 affiancati' : 'testo sx pulsanti dx',
          evidenza:
            profiloKey === 'notebook-1280'
              ? `motivo: allineamento barra/colonna/testo (box bar=${box ? `${Math.round(box.x)},${Math.round(box.width)}` : '?'})`
              : '/app/hours',
        }
        if (ok) addRow(report, row)
        else {
          await addDiagnosticRow(
            report,
            addRow,
            screenshot,
            page,
            row,
            `orari-barra-misure-${profiloKey}-chiaro`,
            'chiaro',
          )
        }
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-errore-validazione')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { pctx, page } = await freshHoursPage(
          browser,
          baseUrl,
          loginApp,
          testUser,
          testPassword,
          'telefono-390',
          temaKey,
          newPage,
          snapshotPath,
        )
        let saveRequests = 0
        page.on('request', (req) => {
          if (req.method() === 'POST' && req.url().includes('hours')) saveRequests += 1
        })
        await page.locator('#hours-lunch-start').fill('')
        await clickSave(page)
        await sleep(400)
        const alert = await page.getByText('Controlla i campi evidenziati').isVisible()
        const fieldMsg = await page.getByText(TIME_MSG.required).count()
        const focused = await page.evaluate(() => document.activeElement?.id === 'hours-lunch-start')
        const inViewLoose = await page.evaluate(() => {
          const el = document.getElementById('hours-lunch-start')
          if (!el) return false
          const r = el.getBoundingClientRect()
          const vh = window.innerHeight
          return r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0
        })
        const rect = await page.locator('#hours-lunch-start').boundingBox()
        const vh = await page.evaluate(() => window.innerHeight)
        const centered = rect ? Math.abs((rect.top + rect.bottom) / 2 - vh / 2) <= 120 : false
        let colorOk = true
        if (temaKey === 'chiaro') {
          colorOk = await page.evaluate(() => {
            const err = document.querySelector('[data-invalid="true"]')
            if (!err) return false
            const el = err.querySelector('input') ?? err
            const border = getComputedStyle(el).borderColor
            const probe = document.createElement('div')
            probe.className = 'text-destructive'
            probe.style.visibility = 'hidden'
            document.body.appendChild(probe)
            const destructive = getComputedStyle(probe).color
            probe.remove()
            return border.includes('oklch') || border === destructive
          })
        }
        const coreOk =
          saveRequests === 0 &&
          alert &&
          fieldMsg > 0 &&
          focused &&
          inViewLoose &&
          (temaKey !== 'chiaro' || colorOk)
        let esito = 'FALLITO'
        if (coreOk) esito = 'OK'
        else if (
          saveRequests === 0 &&
          alert &&
          fieldMsg > 0 &&
          focused &&
          (temaKey !== 'chiaro' || colorOk) &&
          (!inViewLoose || !centered)
        ) {
          esito = 'AVVISO'
        }
        addRow(report, {
          id: 'orari-errore-validazione',
          schermata: 'orari/errore-validazione',
          profiloTema: `telefono-390/${temaKey}`,
          esito,
          misurato: `req:${saveRequests} alert:${alert} focus:${focused} inView:${inViewLoose} centered:${centered}`,
          atteso: 'nessuna richiesta; avviso; messaggio campo; focus; in vista (non centratura se primo schermo)',
          evidenza:
            esito === 'AVVISO'
              ? `controllo dubbio: campo in vista nel primo schermo, centratura non esigibile; ${TIME_MSG.required}`
              : TIME_MSG.required,
        })
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-salvataggio-ok')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoHoursReady(page)
      await page.locator('#hours-lunch-start').fill('11:00')
      await page.locator('#hours-lunch-end').fill('13:30')
      await clickSave(page)
      await page.getByText('Orari salvati').waitFor({ timeout: 20000 })
      const after = await page.locator('#hours-lunch-start').inputValue()
      await page.reload({ waitUntil: 'networkidle' })
      await page.locator('h1', { hasText: 'Orari' }).waitFor()
      const reloaded = await page.locator('#hours-lunch-start').inputValue()
      addRow(report, {
        id: 'orari-salvataggio-ok',
        schermata: 'orari/salvato',
        profiloTema: 'telefono-390/chiaro',
        esito: after === '11:00' && reloaded === '11:00' ? 'OK' : 'FALLITO',
        misurato: `save:${after} reload:${reloaded}`,
        atteso: '11:00 persistito',
        evidenza: '/app/hours',
      })
      await pctx.close()
      hoursRestoreFrom(snapshotPath)
    }

    if (runCtx.shouldRun('orari-salvataggio-in-corso')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoHoursReady(page)
      await page.route('**/*', async (route) => {
        const req = route.request()
        if (req.method() === 'POST' && req.url().includes('hours')) {
          await sleep(1500)
        }
        await route.continue()
      })
      await makeDirty(page)
      await clickSave(page)
      await page.getByText('Salvataggio in corso…').waitFor({ timeout: 5000 })
      await screenshot(page, report, 'orari-salvataggio-in-corso-telefono-390-chiaro', 'chiaro')
      const busy = await page.locator('fieldset[aria-busy="true"]').count()
      const disabled = await page.locator('fieldset[aria-busy="true"] input:disabled').count()
      const saveBtn = page.getByRole('button', { name: /Salvataggio/ })
      const spinner = await saveBtn.locator('[data-slot="spinner"], svg').count()
      addRow(report, {
        id: 'orari-salvataggio-in-corso',
        schermata: 'orari/salvataggio-in-corso',
        profiloTema: 'telefono-390/chiaro',
        esito: busy > 0 && disabled > 0 && spinner > 0 ? 'OK' : 'FALLITO',
        misurato: `busy:${busy} disabled:${disabled} spinner:${spinner}`,
        atteso: 'fieldset disabilitato; testo in corso; spinner',
        evidenza: 'route delay 1500ms',
      })
      await page.unroute('**/*')
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-annulla')) {
      const { pctx, page } = await freshHoursPage(
        browser,
        baseUrl,
        loginApp,
        testUser,
        testPassword,
        'telefono-390',
        'chiaro',
        newPage,
        snapshotPath,
      )
      const before = await page.locator('#hours-lunch-start').inputValue()
      await makeDirty(page)
      await page.getByRole('button', { name: 'Aggiungi chiusura' }).click()
      await page.getByLabel('Etichetta').fill('Test annulla')
      await page.getByLabel('Data').fill('2030-06-15')
      await page.getByRole('button', { name: 'Applica' }).click()
      await page.getByRole('button', { name: 'Annulla modifiche' }).click()
      const after = await page.locator('#hours-lunch-start').inputValue()
      const empty = (await page.getByText('Test annulla').count()) === 0
      const barGone = (await page.locator('[data-slot="app-save-bar"]').count()) === 0
      const ok = after === before && empty && barGone
      const row = {
        id: 'orari-annulla',
        schermata: 'orari/modificato',
        profiloTema: 'telefono-390/chiaro',
        esito: ok ? 'OK' : 'FALLITO',
        misurato: `valoreRipristinato:${after === before} chiusuraAssente:${empty} barraAssente:${barGone}`,
        atteso: 'stato salvato ripristinato (valore, chiusura prova, barra)',
        evidenza: ok ? '/app/hours' : `motivo: barraGone=${barGone} empty=${empty} valore=${after === before}`,
      }
      if (ok) addRow(report, row)
      else await addDiagnosticRow(report, addRow, screenshot, page, row, 'orari-annulla-telefono-390-chiaro', 'chiaro')
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-festivita')) {
      const { pctx, page } = await freshHoursPage(
        browser,
        baseUrl,
        loginApp,
        testUser,
        testPassword,
        'telefono-390',
        'chiaro',
        newPage,
        snapshotPath,
      )
      const steps = []
      await page.locator('#hours-holiday-year').fill('1899')
      await page.getByRole('button', { name: 'Aggiungi festività' }).click()
      steps.push(await page.getByText('Inserisci un anno valido (1900–2100).').isVisible())
      await page.locator('#hours-holiday-year').fill('2026')
      await page.getByRole('button', { name: 'Aggiungi festività' }).click()
      steps.push(await page.getByText(/Aggiunte 13 festività del 2026/).isVisible())
      const rows = await page.locator('[aria-label^="Modifica chiusura"]').count()
      steps.push(rows >= 13)
      await page.getByRole('button', { name: 'Aggiungi festività' }).click()
      steps.push(await page.getByText('Le festività del 2026 sono già tutte presenti.').isVisible())
      const okFest = steps.every(Boolean)
      const rowFest = {
        id: 'orari-festivita',
        schermata: 'orari/festivita',
        profiloTema: 'telefono-390/chiaro',
        esito: okFest ? 'OK' : 'FALLITO',
        misurato: steps.map((s, i) => `step${i}:${s}`).join(' '),
        atteso: 'step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti',
        evidenza: okFest
          ? '2026'
          : `motivo: step1 (Aggiunte 13 festività)=${steps[1]}; altri=${steps.join(',')}`,
      }
      if (okFest) addRow(report, rowFest)
      else await addDiagnosticRow(report, addRow, screenshot, page, rowFest, 'orari-festivita-telefono-390-chiaro', 'chiaro')
      await page.getByRole('button', { name: 'Annulla modifiche' }).click()
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-chiusure-foglio')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoHoursReady(page)
        await page.getByRole('button', { name: 'Aggiungi chiusura' }).click()
        const sheet = page.getByRole('dialog')
        await sheet.waitFor()
        const box = await sheet.boundingBox()
        const vw = await page.evaluate(() => window.innerWidth)
        const fromSide = box && box.x > vw / 4
        const fromBottom = box && box.y > (await page.evaluate(() => window.innerHeight)) / 3
        const sideOk = profiloKey === 'notebook-1280' ? fromSide : fromBottom
        const applyDisabled = await page.getByRole('button', { name: 'Applica' }).isDisabled()
        await page.getByLabel('Data').fill('2031-03-10')
        const stillDisabled = await page.getByRole('button', { name: 'Applica' }).isDisabled()
        await page.getByLabel('Etichetta').fill('Prova foglio')
        const enabled = !(await page.getByRole('button', { name: 'Applica' }).isDisabled())
        await page.getByRole('button', { name: 'Applica' }).click()
        const rowVisible = await page.getByText('Prova foglio').isVisible()
        addRow(report, {
          id: 'orari-chiusure-foglio',
          schermata: 'orari/foglio-chiusura',
          profiloTema: `${profiloKey}/chiaro`,
          esito: sideOk && applyDisabled && stillDisabled && enabled && rowVisible ? 'OK' : 'FALLITO',
          misurato: `sheet:${sideOk} apply:${enabled} row:${rowVisible}`,
          atteso: 'foglio; Applica disabilitato finché incompleto',
          evidenza: profiloKey,
        })
        await page.getByRole('button', { name: 'Annulla modifiche' }).click()
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-intestazione-anno')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoHoursReady(page)
        await page.locator('#hours-holiday-year').fill('2026')
        await page.getByRole('button', { name: 'Aggiungi festività' }).click()
        const yearHead = page.locator('main').getByText('2026', { exact: true }).first()
        const font = await yearHead.evaluate((el) => {
          const cs = getComputedStyle(el)
          return { size: cs.fontSize, weight: cs.fontWeight, color: cs.color }
        })
        const fg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--foreground'))
        const ok =
          font.size === '16px' &&
          (font.weight === '600' || font.weight === 'semibold') &&
          font.color
        addRow(report, {
          id: 'orari-intestazione-anno',
          schermata: 'orari/iniziale',
          profiloTema: `telefono-390/${temaKey}`,
          esito: ok ? 'OK' : 'FALLITO',
          misurato: JSON.stringify(font),
          atteso: '16px peso 600 foreground',
          evidenza: 'intestazione anno',
        })
        await page.getByRole('button', { name: 'Annulla modifiche' }).click()
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-barre-agganciate')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoHoursReady(page)
        await page.evaluate(() => {
          const spacer = document.createElement('div')
          spacer.id = 'ui-verify-scroll-spacer'
          spacer.style.height = '600px'
          document.querySelector('main')?.prepend(spacer)
        })
        await makeDirty(page)
        await page.evaluate(() => window.scrollTo(0, 600))
        await sleep(200)
        const topbar = await page.locator('header').first().boundingBox()
        const saveBar = await page.locator('[data-slot="app-save-bar"]').boundingBox()
        const vh = await page.evaluate(() => window.innerHeight)
        const ok = topbar && withinTolerance(topbar.y, 0, 1) && saveBar && withinTolerance(saveBar.y + saveBar.height, vh, 2)
        addRow(report, {
          id: 'orari-barre-agganciate',
          schermata: 'orari/modificato',
          profiloTema: `${profiloKey}/chiaro`,
          esito: ok ? 'OK' : 'FALLITO',
          misurato: `top:${topbar?.y} saveBottom:${saveBar ? saveBar.y + saveBar.height : '?'} vh:${vh}`,
          atteso: 'topbar 0; save bar bottom=vh',
          evidenza: 'scroll 600px',
        })
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-uscita')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        try {
          await loginApp(page, baseUrl, testUser.email, testPassword)
          await gotoHoursReady(page)
          await makeDirty(page)
          if (profiloKey === 'telefono-390') {
            await openMobileSidebar(page)
          }
          await page.getByRole('link', { name: 'Piatti' }).first().click()
          const dialog = page.getByRole('alertdialog')
          await dialog.waitFor({ timeout: 5000 })
          await screenshot(page, report, `orari-uscita-${profiloKey}-chiaro`, 'chiaro')
          const stay = await dialog.getByRole('button', { name: 'Resta qui' }).isVisible()
          await dialog.getByRole('button', { name: 'Resta qui' }).click()
          const stillHours = page.url().includes('/hours')
          if (profiloKey === 'telefono-390') await openMobileSidebar(page)
          await page.getByRole('link', { name: 'Piatti' }).first().click()
          await dialog.waitFor()
          await dialog.getByRole('button', { name: 'Esci senza salvare' }).click()
          await page.waitForURL('**/app/menu**', { timeout: 15000 })
          const left = page.url().includes('/menu')
          addRow(report, {
            id: 'orari-uscita',
            schermata: 'orari/uscita',
            profiloTema: `${profiloKey}/chiaro`,
            esito: stay && stillHours && left ? 'OK' : 'FALLITO',
            misurato: `stay:${stillHours} left:${left}`,
            atteso: 'conferma; Resta qui; Esci naviga',
            evidenza: 'Piatti',
          })
        } catch (e) {
          await addDiagnosticRow(
            report,
            addRow,
            screenshot,
            page,
            {
              id: 'orari-uscita',
              schermata: 'orari/uscita',
              profiloTema: `${profiloKey}/chiaro`,
              esito: 'FALLITO',
              misurato: e.message,
              atteso: 'conferma uscita con modifiche non salvate',
              evidenza: `motivo: navigazione o menu mobile (${profiloKey})`,
            },
            `orari-uscita-${profiloKey}-chiaro`,
            'chiaro',
          )
        }
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('orari-dati')) {
      const path = hoursSnapshotToTemp()
      try {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoHoursReady(page)
        await page.locator('#hours-dinner-start').fill('20:00')
        await page.locator('#hours-dinner-end').fill('22:30')
        await clickSave(page)
        await page.getByText('Orari salvati').waitFor({ timeout: 20000 })
        const global = hoursPayloadRun('read-as', [testUser.email])
        const dinner = global.services?.find((s) => s.name === 'dinner')
        const ok = dinner?.startTime === '20:00' && dinner?.endTime === '22:30'
        addRow(report, {
          id: 'orari-dati',
          schermata: 'orari/dati',
          profiloTema: 'telefono-390/chiaro',
          esito: ok ? 'OK' : 'FALLITO',
          misurato: JSON.stringify(dinner),
          atteso: 'dinner 20:00-22:30 nel Global',
          evidenza: 'Local API manager',
        })
        await pctx.close()
      } finally {
        hoursRestoreFrom(path)
      }
    }

    if (runCtx.shouldRun('orari-validazione-server')) {
      const path = hoursSnapshotToTemp()
      try {
        const out = hoursPayloadRun('invalid-times', [], { UI_VERIFY_MANAGER_EMAIL: testUser.email })
        const ok = out.results?.every((r) => r.ok)
        addRow(report, {
          id: 'orari-validazione-server',
          schermata: 'orari/server',
          profiloTema: '—',
          esito: ok ? 'OK' : 'FALLITO',
          misurato: JSON.stringify(out.results),
          atteso: TIME_MSG.invalid,
          evidenza: 'Local API',
        })
      } finally {
        hoursRestoreFrom(path)
      }
    }

    if (runCtx.shouldRun('orari-permessi')) {
      const perm = hoursPayloadRun('permissions')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await page.goto('/app/hours', { waitUntil: 'networkidle' })
      const redirected = page.url().includes('/login')
      const ok =
        perm.admin.read &&
        perm.admin.write &&
        perm.superAdmin.read &&
        perm.superAdmin.write &&
        !perm.noRole.read &&
        !perm.noRole.write &&
        redirected
      addRow(report, {
        id: 'orari-permessi',
        schermata: 'orari/permessi',
        profiloTema: '—',
        esito: ok ? 'OK' : 'FALLITO',
        misurato: JSON.stringify({ perm, redirected }),
        atteso: 'staff OK; noRole negato; URL senza sessione→login',
        evidenza: 'Local API + GET /hours anon',
      })
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-nomi-accessibili')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoHoursReady(page)
      const labels = await page.evaluate(() => {
        const texts = []
        document.querySelectorAll('[aria-label]').forEach((el) => texts.push(el.getAttribute('aria-label') ?? ''))
        return texts.join('\n')
      })
      const body = await page.locator('main').innerText()
      const found = ENGLISH_A11Y.filter((w) => labels.includes(w) || body.includes(w))
      addRow(report, {
        id: 'orari-nomi-accessibili',
        schermata: 'orari/iniziale',
        profiloTema: 'telefono-390/chiaro',
        esito: found.length === 0 ? 'OK' : 'FALLITO',
        misurato: found.join(', ') || 'nessuno',
        atteso: 'nessuna stringa inglese vietata',
        evidenza: '/app/hours',
      })
      await pctx.close()
    }

    if (runCtx.shouldRun('orari-giorni-riposo')) {
      const path = hoursSnapshotToTemp()
      try {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoHoursReady(page)
        await page.getByRole('button', { name: 'Lunedì' }).click()
        await page.getByRole('button', { name: 'Mercoledì' }).click()
        await page.getByRole('button', { name: 'Lunedì' }).click()
        await clickSave(page)
        await page.getByText('Orari salvati').waitFor({ timeout: 20000 })
        const global = hoursPayloadRun('read-as', [testUser.email])
        const days = global.weeklyClosedDays ?? []
        const onlyWed = days.length === 1 && days[0] === 'wednesday'
        await page.getByRole('button', { name: 'Mercoledì' }).click()
        await clickSave(page)
        await page.getByText('Orari salvati').waitFor({ timeout: 20000 })
        const global2 = hoursPayloadRun('read-as', [testUser.email])
        const empty = (global2.weeklyClosedDays ?? []).length === 0
        addRow(report, {
          id: 'orari-giorni-riposo',
          schermata: 'orari/giorni',
          profiloTema: 'telefono-390/chiaro',
          esito: onlyWed && empty ? 'OK' : 'FALLITO',
          misurato: `wed:${onlyWed} empty:${empty}`,
          atteso: 'toggle e weeklyClosedDays vuoto',
          evidenza: JSON.stringify(global2.weeklyClosedDays),
        })
        await pctx.close()
      } finally {
        hoursRestoreFrom(path)
      }
    }

    if (runCtx.shouldRun('orari-non-configurato')) {
      progressStep('orari', 'non-configurato', 'telefono-390', 'chiaro')
      const pathNc = hoursSnapshotToTemp()
      try {
        hoursPayloadRun('clear-services')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await page.goto('/app/hours', { waitUntil: 'networkidle' })
        await page.locator('h1', { hasText: 'Orari' }).waitFor({ timeout: 20000 })
        const info = await page.getByText('Orari non configurati').isVisible()
        if (info && screenshot) {
          await screenshot(page, report, 'orari-non-configurato-telefono-390-chiaro', 'chiaro')
        }
        const lunchInput = page.locator('#hours-lunch-start')
        const hasLunch = await lunchInput.count()
        const lunch = hasLunch ? await lunchInput.inputValue() : '—'
        if (hasLunch) {
          await lunchInput.fill('12:00')
          await page.locator('#hours-lunch-end').fill('14:00')
          await page.locator('#hours-dinner-start').fill('19:00')
          await page.locator('#hours-dinner-end').fill('22:00')
          await clickSave(page)
          await page.getByText('Orari salvati').waitFor({ timeout: 20000 })
        }
        const infoGone = !(await page.getByText('Orari non configurati').isVisible())
        const timeCount = await page.locator('input[type="time"]').count()
        const okNc = info && lunch === '' && infoGone && timeCount >= 4
        const rowNc = {
          id: 'orari-non-configurato',
          schermata: 'orari/non-configurato',
          profiloTema: 'telefono-390/chiaro',
          esito: okNc ? 'OK' : 'FALLITO',
          misurato: `info:${info} lunch:${lunch} timeInputs:${timeCount} hasLunchField:${hasLunch} gone:${infoGone}`,
          atteso: 'avviso Orari non configurati; 4 campi ora visibili e vuoti; scompare dopo save',
          evidenza: `clear-services | motivo: ${!info ? 'manca avviso' : timeCount < 4 ? `solo ${timeCount} input time (attesi 4+)` : !infoGone ? 'avviso resta' : 'altro'}`,
        }
        if (okNc) addRow(report, rowNc)
        else {
          await addDiagnosticRow(
            report,
            addRow,
            screenshot,
            page,
            rowNc,
            'orari-non-configurato-telefono-390-chiaro',
            'chiaro',
          )
        }
        await pctx.close()
      } catch (e) {
        addRow(report, {
          id: 'orari-non-configurato',
          schermata: 'orari/non-configurato',
          profiloTema: 'telefono-390/chiaro',
          esito: 'FALLITO',
          misurato: e.message,
          atteso: 'flusso non-configurato',
          evidenza: 'clear-services',
        })
      } finally {
        hoursRestoreFrom(pathNc)
      }
    }

    if (runCtx.shouldRun('C3-cambio-sistema') && runCtx.screenIncluded('orari')) {
      const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'sistema-chiaro', baseUrl)
      const r = await checkTemaCambioSistema(page, baseUrl)
      addRow(report, {
        id: 'C3-cambio-sistema',
        schermata: 'orari',
        profiloTema: 'notebook-1280/sistema',
        esito: resultToEsito(r),
        ...r,
        evidenza: 'login path reused',
      })
      await pctx.close()
    }
  } finally {
    hoursRestoreFrom(snapshotPath)
    try {
      const v = hoursVerifySnapshot(snapshotPath)
      if (!v.equal) {
        report.anomalie.push(
          `verify-snapshot: Global non identico al baseline dopo ripristino (closures=${v.closureCount}, weeklyClosedDays=${JSON.stringify(v.weeklyClosedDays)})`,
        )
      }
    } catch (e) {
      report.anomalie.push(`verify-snapshot: ${e.message}`)
    }
  }
}

export async function runOrariDevSimulations(ctx) {
  const { report, runCtx, newPage, loginApp, testUser, testPassword, addRow, progressStep, screenshot } = ctx

  if (
    !runCtx.shouldRun('orari-errore-server') &&
    !runCtx.shouldRun('orari-errore-caricamento') &&
    !runCtx.shouldRun('orari-non-configurato')
  ) {
    return
  }

  const snapshotPath = hoursSnapshotToTemp()

  try {
    if (!(await isPortFree(SIM_PORT))) {
      report.anomalie.push(`Porta ${SIM_PORT} occupata: simulazioni Orari non eseguite`)
      if (runCtx.shouldRun('orari-errore-server')) {
        addRow(report, {
          id: 'orari-errore-server',
          esito: 'NON PROVATO',
          misurato: '—',
          atteso: '—',
          evidenza: `porta ${SIM_PORT} occupata`,
        })
      }
      if (runCtx.shouldRun('orari-errore-caricamento')) {
        addRow(report, {
          id: 'orari-errore-caricamento',
          esito: 'NON PROVATO',
          misurato: '—',
          atteso: '—',
          evidenza: `porta ${SIM_PORT} occupata`,
        })
      }
      return
    }

    if (runCtx.shouldRun('orari-errore-server')) {
      progressStep('orari', 'errore-server', 'telefono-390', 'chiaro')
      await waitForPortFree(SIM_PORT)
      const child = startDevServer(SIM_PORT, { APP_HOURS_DEV_SIMULATE_SAVE_ERROR: '1' })
      try {
        await waitForUrl(`http://localhost:${SIM_PORT}`, 120000)
        const browser = ctx.browser ?? ctx.playwrightBrowser
        if (!browser) throw new Error('browser Playwright mancante per simulazione')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', `http://localhost:${SIM_PORT}`)
        await loginApp(page, `http://localhost:${SIM_PORT}`, testUser.email, testPassword)
        await gotoHoursReady(page)
        await makeDirty(page)
        await clickSave(page)
        await page.getByText('Salvataggio non riuscito').waitFor({ timeout: 15000 })
        if (screenshot) {
          await screenshot(page, report, 'orari-errore-server-telefono-390-chiaro', 'chiaro')
        }
        const bar = await page.locator('[data-slot="app-save-bar"]').isVisible()
        await pctx.close()
        addRow(report, {
          id: 'orari-errore-server',
          schermata: 'orari/errore-server (sim)',
          profiloTema: 'telefono-390/chiaro',
          esito: bar ? 'OK' : 'FALLITO',
          misurato: `avviso+barra:${bar}`,
          atteso: 'errore simulato con barra visibile',
          evidenza: `localhost:${SIM_PORT}`,
        })
      } catch (e) {
        addRow(report, {
          id: 'orari-errore-server',
          esito: 'FALLITO',
          misurato: e.message,
          atteso: 'server :3200 raggiungibile e flusso simulazione',
          evidenza: String(SIM_PORT),
        })
      } finally {
        child.kill('SIGTERM')
        await waitForPortFree(SIM_PORT)
      }
    }

    if (runCtx.shouldRun('orari-errore-caricamento')) {
      progressStep('orari', 'errore-caricamento', 'telefono-390', 'chiaro')
      await waitForPortFree(SIM_PORT)
      const child = startDevServer(SIM_PORT, { APP_HOURS_DEV_SIMULATE_LOAD_ERROR: '1' })
      try {
        await waitForUrl(`http://localhost:${SIM_PORT}`, 120000)
        const browser = ctx.browser ?? ctx.playwrightBrowser
        if (!browser) throw new Error('browser Playwright mancante per simulazione')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', `http://localhost:${SIM_PORT}`)
        await loginApp(page, `http://localhost:${SIM_PORT}`, testUser.email, testPassword)
        await page.goto('/app/hours', { waitUntil: 'networkidle' })
        const alert = await page.getByText('Impossibile caricare gli orari').isVisible()
        if (screenshot && alert) {
          await screenshot(page, report, 'orari-errore-caricamento-telefono-390-chiaro', 'chiaro')
        }
        const inputs = await page.locator('input[type="time"]').count()
        await page.getByRole('button', { name: 'Riprova' }).click()
        await sleep(2000)
        addRow(report, {
          id: 'orari-errore-caricamento',
          schermata: 'orari/errore-caricamento',
          profiloTema: 'telefono-390/chiaro',
          esito: alert && inputs === 0 ? 'OK' : 'FALLITO',
          misurato: `alert:${alert} inputs:${inputs}`,
          atteso: 'solo avviso e Riprova',
          evidenza: `localhost:${SIM_PORT}`,
        })
        await pctx.close()
      } catch (e) {
        addRow(report, {
          id: 'orari-errore-caricamento',
          esito: 'FALLITO',
          misurato: e.message,
          atteso: 'server :3200 raggiungibile',
          evidenza: String(SIM_PORT),
        })
      } finally {
        child.kill('SIGTERM')
        await waitForPortFree(SIM_PORT)
      }
    }
  } finally {
    hoursRestoreFrom(snapshotPath)
  }
}

export async function runOrariConsole(ctx) {
  const { browser, baseUrl, report, newPage, loginApp, testUser, testPassword, addRow, progressStep, browserVersion } =
    ctx
  if (!ctx.runCtx.shouldRun('orari-console')) return

  for (const profiloKey of ['telefono-390', 'notebook-1280']) {
    progressStep('orari', 'console', profiloKey, 'chiaro')
    const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    const bag = attachConsoleListeners(page)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoHoursReady(page)
    await page.getByRole('button', { name: 'Aggiungi chiusura' }).click()
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Aggiungi festività' }).click()
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => el.remove())
    })
    await openUserMenu(page, { mobilePanelFirst: profiloKey === 'telefono-390' })
    await page.keyboard.press('Escape')
    await sleep(300)
    const c = consoleEsito(bag)
    addRow(report, {
      id: 'orari-console',
      schermata: '/app/hours',
      profiloTema: `${profiloKey}/chiaro/Chromium ${browserVersion}`,
      esito: c.ok ? 'OK' : 'FALLITO',
      misurato: c.misurato,
      atteso: 'zero error/warning/pageerror',
      evidenza: c.evidenza,
    })
    await pctx.close()
  }
}
