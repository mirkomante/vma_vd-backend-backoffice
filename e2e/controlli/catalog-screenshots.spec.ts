import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test } from '../fixtures'
import { CATALOG_SCREENS, type CatalogScreenId } from '../lib/catalog/config'
import { assertCatalogStateVisible, prepareCatalogState } from '../lib/catalog/prepare-state'
import { nonProvatoReason, screenshotFileName, screenshotPlan } from '../lib/catalog/states'
import { E2E_ESITI_DIR } from '../lib/paths'
import { assertPrepared } from '../lib/prepare-assert'
import { projectTag } from '../lib/matrix-projects'
import { frameStateForScreenshot } from '../lib/screenshot-frame'
import { applyThemeCookie } from '../lib/theme'

const SCREEN_IDS: CatalogScreenId[] = ['vini', 'distillati', 'bevande']

for (const screenId of SCREEN_IDS) {
  const config = CATALOG_SCREENS[screenId]

  for (const statoId of [
    'caricamento',
    'errore-caricamento',
    'errore-azione',
    'vuoto',
    'piu-di-100-vini',
    'piu-di-100-distillati',
    'piu-di-100-bevande',
  ]) {
    if (screenId === 'vini' && statoId === 'piu-di-100-distillati') continue
    if (screenId === 'distillati' && (statoId === 'piu-di-100-vini' || statoId === 'piu-di-100-bevande')) continue
    if (screenId === 'bevande' && (statoId === 'piu-di-100-vini' || statoId === 'piu-di-100-distillati')) continue
    const reason = nonProvatoReason(screenId, statoId)
    if (!reason) continue
    test(`${screenId} NON PROVATO ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
      testInfo.annotations.push({ type: 'skip', description: reason })
      test.skip(true, reason)
    })
  }

  const shots = screenshotPlan(screenId).filter((s) => !nonProvatoReason(screenId, s.statoId))
  for (const shot of shots) {
    const project = `${shot.profilo}-${shot.tema}`
    test(`screenshot ${screenId}-${shot.shotKey} ${projectTag(project)}`, async ({ page, baseURL, payload }) => {
      if (baseURL) await applyThemeCookie(page, baseURL, shot.tema)
      const prep = await prepareCatalogState(page, config, shot.statoId, payload)
      assertPrepared(prep)
      await assertCatalogStateVisible(page, config, shot.statoId)
      await frameStateForScreenshot(page, shot.shotKey)
      mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
      await page.screenshot({
        path: join(E2E_ESITI_DIR, 'img', screenshotFileName(screenId, shot)),
        fullPage: true,
      })
    })
  }
}
