import type { Page } from '@playwright/test'

export async function waitDocumentAnimations(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))),
  )
}

/**
 * Prima dello screenshot: scorre il foglio fino alla sezione dello stato e attende le animazioni.
 */
export async function frameStateForScreenshot(page: Page, shotKey: string): Promise<void> {
  const sheet = page.locator('[data-slot=sheet-content]').last()
  const hasSheet = await sheet.isVisible().catch(() => false)

  if (shotKey === 'scegli-piatti') {
    await waitDocumentAnimations(page)
    return
  }

  if (!hasSheet) {
    await waitDocumentAnimations(page)
    return
  }

  const scrollLegend = async (name: string | RegExp) => {
    const legend = sheet.getByText(name, { exact: typeof name === 'string' })
    await legend.first().scrollIntoViewIfNeeded()
    await waitDocumentAnimations(page)
  }

  switch (shotKey) {
    case 'modulo-piatti':
      await page.locator('#fixed-menu-dishes-section').scrollIntoViewIfNeeded()
      break
    case 'modulo-servizi':
      await scrollLegend('Servizi')
      break
    case 'modulo-inglese-aperto':
      await sheet.getByRole('button', { name: /Traduzione inglese/i }).scrollIntoViewIfNeeded()
      break
    case 'modulo-fondo':
      await sheet.getByRole('button', { name: 'Salva' }).scrollIntoViewIfNeeded()
      break
    case 'modulo-origine':
      await scrollLegend(/^Origine$/)
      break
    case 'visibilita-categoria':
    case 'visibilita-avviso':
      await scrollLegend('Categoria e visibilità')
      break
    case 'disponibilita':
      if (await sheet.getByText('Disponibilità').isVisible().catch(() => false)) {
        await scrollLegend('Disponibilità')
      }
      break
    default:
      break
  }

  await waitDocumentAnimations(page)
}
