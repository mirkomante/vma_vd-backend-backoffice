# Esito verifica — locale-prod e2e — 2026-10-21
Commit: 69fafbc18885 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 19 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 8

## ERRORE-STRUMENTO (7)
- screenshot giorni-speciali-attivazione [telefono-390-chiaro] (telefono-390-chiaro): Error: stato attivazione non preparato
- screenshot giorni-speciali-eliminato [telefono-390-chiaro] (telefono-390-chiaro): Error: stato eliminato non preparato
- screenshot messaggio-globale-salvato [telefono-390-chiaro] (telefono-390-chiaro): Error: stato salvato non preparato
- screenshot messaggio-globale-tolto [telefono-390-chiaro] (telefono-390-chiaro): Error: stato tolto non preparato
- screenshot giorni-speciali-data-passata [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot messaggio-globale-inglese-aperto [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- screenshot giorni-speciali-modulo-inglese-aperto [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| screenshot giorni-speciali-attivazione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato attivazione non preparato | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-elenco [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-modulo-menu [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-modulo [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-nuovo [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-nuovo-errori [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-sovrapposizione [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-eliminato [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | Error: stato eliminato non preparato | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-elimina [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-modificato [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | OK | conforme | come da JSON | passed |
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
| screenshot giorni-speciali-elenco [telefono-390-scuro] | controlli/special-global-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [telefono-390-scuro] | controlli/special-global-screenshots.spec.ts | telefono-390-scuro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-data-passata [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-elenco [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-inglese-aperto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-modulo-inglese-aperto [telefono-390-chiaro] | controlli/special-global-screenshots.spec.ts | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| screenshot giorni-speciali-modulo [notebook-1280-chiaro] | controlli/special-global-screenshots.spec.ts | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| screenshot giorni-speciali-elenco [notebook-1280-scuro] | controlli/special-global-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| screenshot messaggio-globale-elenco [notebook-1280-scuro] | controlli/special-global-screenshots.spec.ts | notebook-1280-scuro | OK | conforme | come da JSON | passed |
