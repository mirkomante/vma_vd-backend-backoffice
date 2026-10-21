# Esito verifica — locale-prod e2e — 2026-10-21
Commit: 0dd273633519 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 37 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 24

## ERRORE-STRUMENTO (10)
- screenshot vini-origine-senza-regioni [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot giorni-speciali-attivazione [telefono-390-chiaro] (telefono-390-chiaro): Error: stato attivazione non preparato
- screenshot vini-errore-anno [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot vini-errore-geografia [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
- screenshot giorni-speciali-eliminato [telefono-390-chiaro] (telefono-390-chiaro): Error: stato eliminato non preparato
- screenshot messaggio-globale-salvato [telefono-390-chiaro] (telefono-390-chiaro): Error: stato salvato non preparato
- screenshot messaggio-globale-tolto [telefono-390-chiaro] (telefono-390-chiaro): Error: stato tolto non preparato
- screenshot giorni-speciali-modulo-inglese-aperto [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot giorni-speciali-data-passata [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot messaggio-globale-inglese-aperto [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| vini NON PROVATO vuoto [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | database popolato | motivo nel skip | skipped |
| vini NON PROVATO piu-di-100-vini [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
| vini NON PROVATO piu-di-100-bevande [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
| vini NON PROVATO caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| vini NON PROVATO errore-caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| vini NON PROVATO errore-azione [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| screenshot vini-filtri [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-filtri-attivi [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati NON PROVATO caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| distillati NON PROVATO errore-caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| distillati NON PROVATO errore-azione [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| distillati NON PROVATO vuoto [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | database popolato | motivo nel skip | skipped |
| distillati NON PROVATO piu-di-100-distillati [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
| screenshot distillati-elenco [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot distillati-filtri [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot distillati-filtri-attivi [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande NON PROVATO caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| bevande NON PROVATO errore-caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| bevande NON PROVATO errore-azione [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| bevande NON PROVATO vuoto [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | database popolato | motivo nel skip | skipped |
| bevande NON PROVATO piu-di-100-bevande [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
| screenshot vini-origine-senza-regioni [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot bevande-elenco [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot bevande-filtri [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elenco [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-attivazione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato attivazione non preparato | nessuna eccezione fuori asserzione | failed |
| screenshot vini-errore-anno [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot bevande-filtri-attivi [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-modulo [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-nuovo [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-modulo-menu [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-nuovo-errori [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-errore-geografia [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-sovrapposizione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-eliminato [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato eliminato non preparato | nessuna eccezione fuori asserzione | failed |
| screenshot messaggio-globale-elenco [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elimina [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-modificato [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-salvato [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato salvato non preparato | nessuna eccezione fuori asserzione | failed |
| screenshot messaggio-globale-file-non-leggibile [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-nessun-messaggio [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-togli [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-tolto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato tolto non preparato | nessuna eccezione fuori asserzione | failed |
| giorni-speciali NON PROVATO screenshot vuoto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | database popolato | motivo nel skip | skipped |
| giorni-speciali NON PROVATO screenshot caricamento [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| giorni-speciali NON PROVATO screenshot errore-caricamento [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| giorni-speciali NON PROVATO screenshot errore-azione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| messaggio-globale NON PROVATO screenshot caricamento [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| messaggio-globale NON PROVATO screenshot errore-caricamento [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| messaggio-globale NON PROVATO screenshot errore-azione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| messaggio-globale NON PROVATO screenshot pubblicazione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| screenshot giorni-speciali-modulo-inglese-aperto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-data-passata [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot vini-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elenco [telefono-390-scuro] | controlli/special-global-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [telefono-390-scuro] | controlli/special-global-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-inglese-aperto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot distillati-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-modulo [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elenco [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot distillati-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elenco [notebook-1280-scuro] | controlli/special-global-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [notebook-1280-scuro] | controlli/special-global-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot distillati-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
