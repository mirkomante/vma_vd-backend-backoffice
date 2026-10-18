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

export function showMoreButtonLabel(screenId) {
  if (screenId === 'vini') return 'Mostra altri vini'
  if (screenId === 'distillati') return 'Mostra altri distillati'
  if (screenId === 'bevande') return 'Mostra altre bevande'
  return 'Mostra altri'
}
