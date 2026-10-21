# Esito verifica — locale-prod e2e — 2026-10-21
Commit: 19f3b0c15f48 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 33 · FALLITO: 1 · AVVISO: 0 · NON PROVATO: 17

## ERRORE-STRUMENTO (3)
- screenshot vini-origine-senza-regioni [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot vini-errore-anno [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot vini-errore-geografia [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| vini NON PROVATO caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| vini NON PROVATO vuoto [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | database popolato | motivo nel skip | skipped |
| vini NON PROVATO errore-azione [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| vini NON PROVATO errore-caricamento [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | le riprova V6 con un dev server alla volta | motivo nel skip | skipped |
| vini NON PROVATO piu-di-100-vini [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
| vini NON PROVATO piu-di-100-bevande [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | NON PROVATO | serve il bulk da 101, lo fa V6 | motivo nel skip | skipped |
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
| menu-fissi-elimina-senza-uso [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-persistenza [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-errore-anno [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| menu-fissi-elimina-usato [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot bevande-filtri-attivi [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-console [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-testi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-modulo-validazione [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-disponibilita [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-elimina-cascade-registro-permessi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-porzione-traduzione [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-errore-geografia [telefono-390-chiaro] | controlli/catalog-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| menu-fissi-servizi-piatti [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot distillati-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [telefono-390-scuro] | controlli/catalog-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| menu-fissi-nomi-accessibili [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | FALLITO | Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed | asserzione soddisfatta | failed |
| screenshot distillati-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [notebook-1280-chiaro] | Menù fissi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [notebook-1280-chiaro] | controlli/catalog-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini-ordine-100 [notebook-1280-chiaro] | Vini | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-ordine-liste [notebook-1280-chiaro] | Menù fissi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [soglia-767-chiaro] | Menù fissi | soglia-767-chiaro | OK | conforme | come da JSON | passed |
| screenshot vini-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot distillati-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot bevande-elenco [notebook-1280-scuro] | controlli/catalog-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [soglia-768-chiaro] | Menù fissi | soglia-768-chiaro | OK | conforme | come da JSON | passed |
