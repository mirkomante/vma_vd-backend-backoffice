/**
 * Interazioni UI condivise per Vini / Distillati / Bevande (foglio filtri origine, select svuotabili, anno NV, «Mostra altri …»).
 */

export async function openFiltersSheet(page, filtersButtonName = 'Filtri') {
  await page.getByRole('button', { name: filtersButtonName }).click()
  await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15000 })
}

export async function selectComboboxOption(page, comboboxLabel, optionText) {
  await page.getByRole('combobox', { name: comboboxLabel }).click()
  await page.getByRole('option', { name: optionText, exact: true }).click()
}

/** Apre il combobox e sceglie con tastiera (utile se l'opzione è fuori viewport). */
export async function selectComboboxOptionByKeyboard(page, comboboxLabel, optionText) {
  const combo = page.getByRole('combobox', { name: comboboxLabel })
  await combo.click()
  const listbox = page.getByRole('listbox')
  await listbox.waitFor({ state: 'visible', timeout: 12000 })
  const prefix = optionText.slice(0, Math.min(8, optionText.length))
  await combo.pressSequentially(prefix, { delay: 40 })
  const opt = listbox.getByRole('option', { name: optionText, exact: true })
  try {
    await opt.scrollIntoViewIfNeeded({ timeout: 5000 })
    await opt.click({ timeout: 8000 })
  } catch {
    await page.keyboard.press('Enter')
  }
  await listbox.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {})
}

export async function readComboboxTriggerText(page, comboboxLabel) {
  const combo = page.getByRole('combobox', { name: comboboxLabel })
  return (await combo.innerText()).trim()
}

export async function waitForListboxOptions(page, { minCount = 1, timeoutMs = 12000 } = {}) {
  const listbox = page.getByRole('listbox')
  await listbox.waitFor({ state: 'visible', timeout: timeoutMs })
  await page.waitForFunction(
    (min) => {
      const lb = document.querySelector('[role=listbox]')
      if (!lb) return false
      return lb.querySelectorAll('[role=option]').length >= min
    },
    minCount,
    { timeout: timeoutMs },
  )
  return (await listbox.getByRole('option').allTextContents()).map((t) => t.trim()).filter(Boolean)
}

/** Modulo catalogo aperto: nome compilato (edit) o foglio visibile (nuovo). */
export async function waitForCatalogEditSheetReady(page, nameFieldId) {
  const sheet = page.locator('[data-slot=sheet-content]')
  await sheet.waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForFunction(
    (id) => {
      const el = document.getElementById(id)
      return el && String(el.value ?? '').trim().length > 0
    },
    nameFieldId,
    { timeout: 15000 },
  )
  await page.waitForTimeout(150)
}

/** Prima voce «vuota» del select (Nessuna regione, Nessun paese, …). */
export async function clearComboboxToEmptyOption(page, comboboxLabel, emptyOptionLabel) {
  await selectComboboxOption(page, comboboxLabel, emptyOptionLabel)
}

/**
 * Cascata paese → regione → denominazione nel foglio filtri (Vini).
 * @param {{ country?: string, region?: string, appellation?: string, countryLabel?: string, regionLabel?: string, appellationLabel?: string }} opts
 */
export async function applyOriginFilterCascade(page, opts) {
  const countryLabel = opts.countryLabel ?? 'Paese'
  const regionLabel = opts.regionLabel ?? 'Regione'
  const appellationLabel = opts.appellationLabel ?? 'Denominazione'
  if (opts.country) await selectComboboxOption(page, countryLabel, opts.country)
  if (opts.region) await selectComboboxOption(page, regionLabel, opts.region)
  if (opts.appellation) await selectComboboxOption(page, appellationLabel, opts.appellation)
}

export async function applyFiltersSheet(page, applyLabel = 'Applica') {
  await page.getByRole('button', { name: applyLabel }).click()
  await page.waitForTimeout(400)
}

export async function removeFilterChip(page, chipAccessibleName) {
  await page.getByRole('button', { name: chipAccessibleName }).click()
}

/** Casella «Senza annata (NV)» nel modulo vino. */
export async function toggleWineNvCheckbox(page, label = 'Senza annata (NV)') {
  const box = page.getByRole('checkbox', { name: label })
  await box.click()
}

export async function readWineYearInput(page, fieldLabel = 'Anno') {
  return page.getByRole('textbox', { name: fieldLabel })
}

/** Avviso elenco parziale e pulsante «Mostra altri …» (101 record). */
export async function clickShowMoreCatalog(page, buttonLabel) {
  const btn = page.getByRole('button', { name: buttonLabel })
  await btn.waitFor({ timeout: 20000 })
  await btn.click()
  await page.waitForTimeout(600)
}

/** Ultimo combobox nel foglio Filtri = Stato (tipologia/paese/… prima). */
export async function selectFiltersStateOption(page, stateLabel) {
  const sheet = page.locator('[data-slot=sheet-content]')
  await sheet.waitFor({ state: 'visible', timeout: 15000 })
  const combo = sheet.getByRole('combobox').last()
  await combo.click()
  await page.getByRole('option', { name: stateLabel, exact: true }).click()
}

export async function measureDeleteDialogButtons(page) {
  return page.evaluate(() => {
    const dlg = document.querySelector('[role=alertdialog]')
    if (!dlg) return null
    const btns = [...dlg.querySelectorAll('button')].filter((b) => getComputedStyle(b).visibility !== 'hidden')
    const pick = (label) => {
      const b = btns.find((x) => x.textContent?.trim() === label)
      if (!b) return null
      const r = b.getBoundingClientRect()
      return `${Math.round(r.width)}x${Math.round(r.height)}`
    }
    return { indietro: pick('Indietro'), elimina: pick('Elimina') }
  })
}

export function showMoreButtonLabel(screenId) {
  if (screenId === 'vini') return 'Mostra altri vini'
  if (screenId === 'distillati') return 'Mostra altri distillati'
  if (screenId === 'bevande') return 'Mostra altre bevande'
  return 'Mostra altri'
}
