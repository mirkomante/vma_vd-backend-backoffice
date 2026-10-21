import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test } from '../fixtures'
import { withMenuGeneralBackup } from '../lib/global-message/backup'
import {
  assertGlobalMessageStateVisible,
  prepareGlobalMessageState,
} from '../lib/global-message/prepare-state'
import {
  nonProvatoReason as globalNonProvato,
  screenshotFileName as globalShotName,
  screenshotPlan as globalScreenshotPlan,
} from '../lib/global-message/states'
import { projectTag } from '../lib/matrix-projects'
import { E2E_ESITI_DIR } from '../lib/paths'
import { assertPrepared } from '../lib/prepare-assert'
import { frameStateForScreenshot } from '../lib/screenshot-frame'
import {
  assertSpecialDayStateVisible,
  prepareSpecialDayState,
} from '../lib/special-days/prepare-state'
import {
  nonProvatoReason as specialNonProvato,
  screenshotFileName as specialShotName,
  screenshotPlan as specialScreenshotPlan,
} from '../lib/special-days/states'
import { applyThemeCookie } from '../lib/theme'

for (const shot of specialScreenshotPlan()) {
  const project = `${shot.profilo}-${shot.tema}`
  test(`screenshot giorni-speciali-${shot.shotKey} ${projectTag(project)}`, async ({
    page,
    baseURL,
    payload,
    payloadWorker,
  }) => {
    if (baseURL) await applyThemeCookie(page, baseURL, shot.tema)
    const prep = await prepareSpecialDayState(page, shot.statoId, payload, payloadWorker)
    assertPrepared(prep)
    await assertSpecialDayStateVisible(page, shot.statoId)
    await frameStateForScreenshot(page, shot.shotKey)
    mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
    await page.screenshot({
      path: join(E2E_ESITI_DIR, 'img', specialShotName(shot)),
      fullPage: true,
    })
  })
}

for (const shot of globalScreenshotPlan()) {
  const project = `${shot.profilo}-${shot.tema}`
  test(`screenshot messaggio-globale-${shot.shotKey} ${projectTag(project)}`, async ({
    page,
    baseURL,
    payload,
    payloadWorker,
  }) => {
    await withMenuGeneralBackup(payloadWorker, payload.managerEmail, async () => {
      if (baseURL) await applyThemeCookie(page, baseURL, shot.tema)
      const prep = await prepareGlobalMessageState(page, shot.statoId, payload, payloadWorker)
      assertPrepared(prep)
      await assertGlobalMessageStateVisible(page, shot.statoId)
      await frameStateForScreenshot(page, shot.shotKey)
      mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
      await page.screenshot({
        path: join(E2E_ESITI_DIR, 'img', globalShotName(shot)),
        fullPage: true,
      })
    })
  })
}

for (const statoId of ['vuoto', 'caricamento', 'errore-caricamento', 'errore-azione']) {
  const reason = specialNonProvato(statoId)
  if (!reason) continue
  test(`giorni-speciali NON PROVATO screenshot ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'skip', description: reason })
    test.skip(true, reason)
  })
}

for (const statoId of ['caricamento', 'errore-caricamento', 'errore-azione', 'pubblicazione']) {
  const reason = globalNonProvato(statoId)
  if (!reason) continue
  test(`messaggio-globale NON PROVATO screenshot ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
    testInfo.annotations.push({ type: 'skip', description: reason })
    test.skip(true, reason)
  })
}
