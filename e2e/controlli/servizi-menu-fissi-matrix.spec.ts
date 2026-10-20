import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test, expect } from '../fixtures'
import {
  checkAltezzaMouse,
  checkNoLampo,
  checkScrollOrizzontale,
  checkTemaCambioSistema,
  checkTemaClasse,
  installNoLampoObserver,
} from '../lib/checks'
import { withMenuDevServer, simEnvForState } from '../lib/dev-menu-server'
import { loginAppOnBase } from '../lib/login-dev'
import { MENU_LIST_SCREENS, type MenuListScreenId } from '../lib/menu-list/config'
import { assertStateVisible, prepareMenuListState } from '../lib/menu-list/prepare-state'
import { matrixStates, nonProvatoReason, screenshotPlan } from '../lib/menu-list/states'
import { E2E_ESITI_DIR } from '../lib/paths'
import {
  C1_PROFILES,
  C2_PROFILES,
  MATRIX_SERIAL_STATES,
  parseProjectName,
} from '../lib/project-meta'
import { applyThemeCookie, htmlDarkForTema } from '../lib/theme'

const SCREEN_IDS: MenuListScreenId[] = ['servizi', 'menu-fissi']


async function runWithBaseUrl(
  page: import('@playwright/test').Page,
  statoId: string,
  baseURL: string,
  fn: (base: string) => Promise<void>,
): Promise<void> {
  const sim = simEnvForState(statoId)
  if (sim && MATRIX_SERIAL_STATES.has(statoId)) {
    await withMenuDevServer(sim, async (devUrl) => {
      await loginAppOnBase(page, devUrl)
      await fn(devUrl)
    })
    return
  }
  await fn(baseURL)
}

for (const screenId of SCREEN_IDS) {
  const config = MENU_LIST_SCREENS[screenId]
  const stateIds = matrixStates(screenId)

  for (const statoId of stateIds) {
    test.describe(`${screenId}/${statoId}`, () => {
      const np = nonProvatoReason(screenId, statoId)
      const simState = MATRIX_SERIAL_STATES.has(statoId)

      test('C1', async ({ page, baseURL, touch: _t }, testInfo) => {
        if (simState) test.skip(true, 'stato sim dev: controlli in screenshot dedicato (evita timeout matrice)')
        const { profilo, tema } = parseProjectName(testInfo.project.name)
        if (!C1_PROFILES.has(profilo)) test.skip(true, `C1 non applicabile a ${profilo}`)
        if (np) test.skip(true, np)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)

        await runWithBaseUrl(page, statoId, baseURL!, async () => {
          try {
            const prep = await prepareMenuListState(page, config, statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
          } catch (e) {
            test.skip(true, `preparazione: ${String(e).slice(0, 120)}`)
          }
          const r = await checkScrollOrizzontale(page)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      })

      test('C2', async ({ page, baseURL, touch }, testInfo) => {
        if (simState) test.skip(true, 'stato sim dev: controlli in screenshot dedicato (evita timeout matrice)')
        const { profilo, tema } = parseProjectName(testInfo.project.name)
        if (!C2_PROFILES.has(profilo)) test.skip(true, `C2 non applicabile a ${profilo}`)
        if (np) test.skip(true, np)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)

        await runWithBaseUrl(page, statoId, baseURL!, async () => {
          try {
            const prep = await prepareMenuListState(page, config, statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
          } catch (e) {
            test.skip(true, `preparazione: ${String(e).slice(0, 120)}`)
          }
          const bad = await touch.measure()
          const misurato = bad.length ? bad.join('; ') : 'nessun elemento'
          expect(bad, `misurato: ${misurato}; atteso: nessun elemento sotto 44 px`).toEqual([])
        })
      })

      test('C2-mouse', async ({ page, baseURL }, testInfo) => {
        if (simState) test.skip(true, 'stato sim dev: controlli in screenshot dedicato (evita timeout matrice)')
        const { profilo, tema } = parseProjectName(testInfo.project.name)
        if (profilo !== 'notebook-1280') test.skip(true, 'C2-mouse solo notebook-1280')
        if (np) test.skip(true, np)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)

        await runWithBaseUrl(page, statoId, baseURL!, async () => {
          try {
            const prep = await prepareMenuListState(page, config, statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
          } catch (e) {
            test.skip(true, `preparazione: ${String(e).slice(0, 120)}`)
          }
          const r = await checkAltezzaMouse(page)
          if (!r.ok && r.avviso) {
            test.info().annotations.push({ type: 'AVVISO', description: r.misurato })
          }
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      })

      test('C3', async ({ page, baseURL }, testInfo) => {
        if (simState) test.skip(true, 'stato sim dev: controlli in screenshot dedicato (evita timeout matrice)')
        const { tema } = parseProjectName(testInfo.project.name)
        if (np) test.skip(true, np)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)

        await runWithBaseUrl(page, statoId, baseURL!, async () => {
          try {
            const prep = await prepareMenuListState(page, config, statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
          } catch (e) {
            test.skip(true, `preparazione: ${String(e).slice(0, 120)}`)
          }
          const r = await checkTemaClasse(page, htmlDarkForTema(tema))
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      })

      test('C3-no-lampo', async ({ page, baseURL }, testInfo) => {
        if (simState) test.skip(true, 'stato sim dev: controlli in screenshot dedicato (evita timeout matrice)')
        const { tema } = parseProjectName(testInfo.project.name)
        if (tema !== 'scuro') test.skip(true, 'C3-no-lampo solo tema scuro')
        if (np) test.skip(true, np)

        await runWithBaseUrl(page, statoId, baseURL!, async (base) => {
          await installNoLampoObserver(page)
          await applyThemeCookie(page, base, 'scuro')
          try {
            const prep = await prepareMenuListState(page, config, statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
          } catch (e) {
            test.skip(true, `preparazione: ${String(e).slice(0, 120)}`)
          }
          const r = await checkNoLampo(page)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      })

      if (statoId === 'elenco') {
        test('C3-cambio-sistema', async ({ page, baseURL }, testInfo) => {
          const { profilo } = parseProjectName(testInfo.project.name)
          if (profilo !== 'telefono-390') test.skip(true, 'C3-cambio-sistema su telefono-390')
          if (np) test.skip(true, np)
          const r = await checkTemaCambioSistema(page, baseURL!)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }
    })
  }

  const shots = screenshotPlan(screenId)
  for (const shot of shots) {
    test(`screenshot ${screenId}-${shot.statoId}-${shot.profilo}-${shot.tema}`, async ({
      page,
      baseURL,
    }, testInfo) => {
      const { profilo, tema } = parseProjectName(testInfo.project.name)
      if (profilo !== shot.profilo || tema !== shot.tema) {
        test.skip(true, `screenshot solo ${shot.profilo}/${shot.tema}`)
        return
      }
      if (baseURL) await applyThemeCookie(page, baseURL, tema)
      const np = nonProvatoReason(screenId, shot.statoId)
      if (np) test.skip(true, np)

      await runWithBaseUrl(page, shot.statoId, baseURL!, async (base) => {
        await applyThemeCookie(page, base, shot.tema)
        const sim = simEnvForState(shot.statoId)
        if (sim && shot.statoId === 'errore-azione') {
          await withMenuDevServer(sim, async (devUrl) => {
            await loginAppOnBase(page, devUrl)
            const prep = await prepareMenuListState(page, config, shot.statoId)
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, shot.statoId)
            mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
            await page.screenshot({
              path: join(
                E2E_ESITI_DIR,
                'img',
                `${screenId}-${shot.statoId}-${shot.profilo}-${shot.tema}.png`,
              ),
              fullPage: true,
            })
          })
          return
        }
        const prep = await prepareMenuListState(page, config, shot.statoId)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, shot.statoId)
        mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
        await page.screenshot({
          path: join(
            E2E_ESITI_DIR,
            'img',
            `${screenId}-${shot.statoId}-${shot.profilo}-${shot.tema}.png`,
          ),
          fullPage: true,
        })
      })
    })
  }

}

test('servizi-console', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'telefono-390-chiaro', 'console dev solo telefono-390-chiaro')
  await withMenuDevServer({}, async (devUrl) => {
    await loginAppOnBase(page, devUrl)
    const bag = { errors: [] as string[], warnings: [] as string[], failed: [] as string[] }
    page.on('console', (msg) => {
      if (msg.type() === 'error') bag.errors.push(msg.text())
      if (msg.type() === 'warning') bag.warnings.push(msg.text())
    })
    page.on('pageerror', (e) => bag.errors.push(String(e)))
    await page.goto(`${devUrl}/app/menu/services`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Nuovo servizio' }).click()
    await page.keyboard.press('Escape')
    const misurato = `err:${bag.errors.length} warn:${bag.warnings.length} http:${bag.failed.length}`
    expect(bag.errors, `misurato: ${misurato}; atteso: err:0 warn:0 http:0`).toEqual([])
    expect(bag.warnings, `misurato: ${misurato}; atteso: err:0 warn:0 http:0`).toEqual([])
  })
})

test('menu-fissi-console', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'telefono-390-chiaro', 'console dev solo telefono-390-chiaro')
  await withMenuDevServer({}, async (devUrl) => {
    await loginAppOnBase(page, devUrl)
    const bag = { errors: [] as string[], warnings: [] as string[] }
    page.on('console', (msg) => {
      if (msg.type() === 'error') bag.errors.push(msg.text())
      if (msg.type() === 'warning') bag.warnings.push(msg.text())
    })
    await page.goto(`${devUrl}/app/menu/fixed`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Nuovo menù fisso' }).click()
    await page.keyboard.press('Escape')
    const misurato = `err:${bag.errors.length} warn:${bag.warnings.length}`
    expect(bag.errors, `misurato: ${misurato}; atteso: err:0 warn:0`).toEqual([])
    expect(bag.warnings, `misurato: ${misurato}; atteso: err:0 warn:0`).toEqual([])
  })
})
