import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test, expect } from '../fixtures'
import {
  checkAltezzaMouse,
  checkNoLampo,
  checkScrollOrizzontale,
  checkTemaClasse,
  installNoLampoObserver,
} from '../lib/checks'
import { loginAppOnBase } from '../lib/login-dev'
import {
  C1_PROJECTS,
  C2_MOUSE_PROJECTS,
  C2_PROJECTS,
  C3_NO_LAMPO_PROJECTS,
  MATRIX_PROJECTS,
  SIM_MATRIX_STATES,
} from '../lib/matrix-projects'
import { MENU_LIST_SCREENS, type MenuListScreenId } from '../lib/menu-list/config'
import { assertStateVisible, prepareMenuListState } from '../lib/menu-list/prepare-state'
import { matrixStates, screenshotPlan } from '../lib/menu-list/states'
import { E2E_ESITI_DIR } from '../lib/paths'
import { parseProjectName } from '../lib/project-meta'
import { ensureSimServerForState } from '../lib/sim-dev-servers'
import { applyThemeCookie, htmlDarkForTema } from '../lib/theme'
import { applyProfileViewport } from '../lib/viewports'

const SCREEN_IDS: MenuListScreenId[] = ['servizi', 'menu-fissi']

const SIM_STATE_ORDER = ['caricamento', 'errore-caricamento', 'errore-azione'] as const

function simStates(screenId: MenuListScreenId): string[] {
  const allowed = new Set(matrixStates(screenId).filter((s) => SIM_MATRIX_STATES.has(s)))
  return SIM_STATE_ORDER.filter((s) => allowed.has(s))
}

async function withSimBase(
  page: import('@playwright/test').Page,
  statoId: string,
  profilo: string,
  tema: 'chiaro' | 'scuro',
  fn: () => Promise<void>,
): Promise<void> {
  const base = await ensureSimServerForState(statoId, { warm: false })
  await applyProfileViewport(page, profilo)
  await loginAppOnBase(page, base)
  await applyThemeCookie(page, base, tema)
  await fn()
}

test.describe.configure({ mode: 'serial' })

for (const screenId of SCREEN_IDS) {
  const config = MENU_LIST_SCREENS[screenId]
  for (const statoId of simStates(screenId)) {
    test.describe(`@sim/ ${screenId}/${statoId}`, () => {
      for (const project of C1_PROJECTS) {
        const { profilo, tema } = parseProjectName(project)
        test(`@sim/ C1 ${project}`, async ({ page, payload, payloadWorker }) => {
          await withSimBase(page, statoId, profilo, tema, async () => {
            const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker, {
              skipDb: statoId === 'errore-azione',
            })
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
            const r = await checkScrollOrizzontale(page)
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of C2_PROJECTS) {
        const { profilo, tema } = parseProjectName(project)
        test(`@sim/ C2 ${project}`, async ({ page, touch, payload, payloadWorker }) => {
          await withSimBase(page, statoId, profilo, tema, async () => {
            const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker, {
              skipDb: statoId === 'errore-azione',
            })
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
            const bad = await touch.measure()
            expect(bad, `misurato: ${bad.join('; ') || 'nessun elemento'}; atteso: nessun elemento sotto 44 px`).toEqual([])
          })
        })
      }

      for (const project of C2_MOUSE_PROJECTS) {
        const { profilo, tema } = parseProjectName(project)
        test(`@sim/ C2-mouse ${project}`, async ({ page, payload, payloadWorker }, testInfo) => {
          await withSimBase(page, statoId, profilo, tema, async () => {
            const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker, {
              skipDb: statoId === 'errore-azione',
            })
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
            const r = await checkAltezzaMouse(page)
            if (!r.ok && r.avviso) testInfo.annotations.push({ type: 'AVVISO', description: r.misurato })
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of MATRIX_PROJECTS) {
        const { profilo, tema } = parseProjectName(project)
        test(`@sim/ C3 ${project}`, async ({ page, payload, payloadWorker }) => {
          await withSimBase(page, statoId, profilo, tema, async () => {
            const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker, {
              skipDb: statoId === 'errore-azione',
            })
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
            const r = await checkTemaClasse(page, htmlDarkForTema(tema))
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of C3_NO_LAMPO_PROJECTS) {
        const { profilo, tema } = parseProjectName(project)
        test(`@sim/ C3-no-lampo ${project}`, async ({ page, payload, payloadWorker }) => {
          await withSimBase(page, statoId, profilo, tema, async () => {
            await installNoLampoObserver(page)
            const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker, {
              skipDb: statoId === 'errore-azione',
            })
            if (!prep.ok) test.skip(true, prep.reason)
            await assertStateVisible(page, config, statoId)
            const r = await checkNoLampo(page)
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }
    })
  }

  const simShots = screenshotPlan(screenId).filter((s) => SIM_MATRIX_STATES.has(s.statoId))
  for (const shot of simShots) {
    test(`@sim/ screenshot ${screenId}-${shot.statoId}-${shot.profilo}-${shot.tema}`, async ({
      page,
      payload,
      payloadWorker,
    }) => {
      await withSimBase(page, shot.statoId, shot.profilo, shot.tema, async () => {
        const prep = await prepareMenuListState(page, config, shot.statoId, payload, payloadWorker, {
          skipDb: shot.statoId === 'errore-azione',
        })
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
