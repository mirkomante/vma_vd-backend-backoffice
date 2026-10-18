import { waitForAnimationsSettled } from './measure-stable.mjs'
import { measureDeleteDialogButtons } from './catalog-ui-helpers.mjs'

export async function gotoMenuList(page, config, pathOverride = null) {
  const path = pathOverride ?? config.path
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: config.h1 }).waitFor({ timeout: 20000 })
}

export async function clickRowAction(page, name, action) {
  const label =
    action === 'edit'
      ? `Modifica ${name}`
      : action === 'delete'
        ? `Elimina ${name}`
        : action === 'disable'
          ? `Disabilita ${name}`
          : action === 'enable'
            ? `Abilita ${name}`
            : action
  await page.getByRole('button', { name: label }).click({ timeout: 20000 })
}

export async function toggleDisponibile(page, name) {
  await page.getByRole('switch', { name: `Disponibile: ${name}`, exact: true }).click()
}

export async function toggleCategoriaAttiva(page, name) {
  await page.getByRole('switch', { name: `Attiva: ${name}`, exact: true }).click()
}

export async function waitForSheetReady(page, nameFieldSelector = 'input') {
  await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15000 })
  await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
  if (nameFieldSelector.startsWith('#')) {
    await page.locator(nameFieldSelector).waitFor({ timeout: 12000 })
  }
}

export async function readSheetSubtitle(page) {
  return (await page.locator('[data-slot=sheet-content] .text-muted-foreground').first().innerText().catch(() => '')).trim()
}

export async function openTabByName(page, tabName) {
  await page.getByRole('tab', { name: tabName }).click()
}

export async function measureMoveButtons(page, dishName) {
  const up = page.getByRole('button', { name: `Sposta su ${dishName}` })
  const down = page.getByRole('button', { name: `Sposta giù ${dishName}` })
  const upBox = await up.boundingBox()
  const downBox = await down.boundingBox()
  return {
    upH: Math.round(upBox?.height ?? 0),
    downH: Math.round(downBox?.height ?? 0),
  }
}

export { measureDeleteDialogButtons }
