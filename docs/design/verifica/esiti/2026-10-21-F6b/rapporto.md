# Esito verifica — locale-prod e2e — 2026-10-21
Commit: 69fafbc18885 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 163 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 0

## ERRORE-STRUMENTO (25)
- vini C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
- giorni-speciali C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- giorni-speciali C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- messaggio-globale C2 [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
- messaggio-globale C2 [telefono-390-scuro] (telefono-390-scuro): ValidationError: Il seguente campo non è valido: _locale, _parent_id
- giorni-speciali C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- giorni-speciali C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- messaggio-globale C2 [telefono-390-scuro] (telefono-390-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
- giorni-speciali C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- giorni-speciali C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- messaggio-globale C2-mouse [notebook-1280-chiaro] (notebook-1280-chiaro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- vini C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
- giorni-speciali C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- giorni-speciali C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.
- messaggio-globale C2-mouse [notebook-1280-scuro] (notebook-1280-scuro): TimeoutError: locator.waitFor: Timeout 12000ms exceeded.

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| vini C2 [telefono-390-chiaro] | vini/filtri | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/elenco | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/filtri-origine | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/filtri-attivi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/modulo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/nuovo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/nuovo-errori | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/modulo-origine | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/modulo-inglese-aperto | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/elimina | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/nessun-risultato | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/elenco | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/filtri | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/origine-senza-regioni | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2 [telefono-390-chiaro] | distillati/filtri-attivi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/errore-anno | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2 [telefono-390-chiaro] | distillati/modulo-inglese-aperto | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/nuovo-errori | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/modulo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/nuovo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-chiaro] | vini/errore-geografia | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2 [telefono-390-chiaro] | distillati/elimina | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-chiaro] | distillati/nessun-risultato | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/elenco | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/filtri | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/nuovo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/nuovo-errori | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/modulo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/modulo-inglese-aperto | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/filtri-attivi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/elenco | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/modulo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/modulo-menu | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/nuovo | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/nuovo-errori | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/sovrapposizione | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/elimina | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/elimina | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/elenco | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/modificato | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-chiaro] | bevande/nessun-risultato | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/file-non-leggibile | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/nessun-messaggio | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/togli | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/elenco | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/filtri | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/filtri-attivi | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/modulo-inglese-aperto | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| giorni-speciali C2 [telefono-390-chiaro] | giorni-speciali/data-passata | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2 [telefono-390-scuro] | vini/filtri-origine | telefono-390-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-chiaro] | messaggio-globale/inglese-aperto | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2 [telefono-390-scuro] | vini/modulo-inglese-aperto | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/nuovo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/nuovo-errori | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/modulo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/modulo-origine | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/elimina | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/nessun-risultato | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/elenco | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/filtri | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/origine-senza-regioni | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2 [telefono-390-scuro] | vini/errore-anno | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2 [telefono-390-scuro] | distillati/filtri-attivi | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/nuovo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/nuovo-errori | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/elimina | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/modulo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2 [telefono-390-scuro] | vini/errore-geografia | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2 [telefono-390-scuro] | distillati/modulo-inglese-aperto | telefono-390-scuro | OK | conforme | come da JSON | passed |
| distillati C2 [telefono-390-scuro] | distillati/nessun-risultato | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/elenco | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/filtri | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/nuovo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/nuovo-errori | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/filtri-attivi | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/modulo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/modulo-inglese-aperto | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/elenco | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/modulo-menu | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/modulo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/nuovo | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/nuovo-errori | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/sovrapposizione | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/elimina | telefono-390-scuro | OK | conforme | come da JSON | passed |
| bevande C2 [telefono-390-scuro] | bevande/nessun-risultato | telefono-390-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/elimina | telefono-390-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/modificato | telefono-390-scuro | ERRORE-STRUMENTO | ValidationError: Il seguente campo non è valido: _locale, _parent_id | nessuna eccezione fuori asserzione | failed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/elenco | telefono-390-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/file-non-leggibile | telefono-390-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/nessun-messaggio | telefono-390-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/togli | telefono-390-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/elenco | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/filtri | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/filtri-attivi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/modulo-inglese-aperto | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| giorni-speciali C2 [telefono-390-scuro] | giorni-speciali/data-passata | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-chiaro] | vini/filtri-origine | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2 [telefono-390-scuro] | messaggio-globale/inglese-aperto | telefono-390-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-chiaro] | vini/modulo-inglese-aperto | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/nuovo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/nuovo-errori | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/modulo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/modulo-origine | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/elimina | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/nessun-risultato | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/elenco | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/filtri | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/filtri-attivi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/errore-anno | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-chiaro] | vini/origine-senza-regioni | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/modulo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/nuovo-errori | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/nuovo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-chiaro] | vini/errore-geografia | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/modulo-inglese-aperto | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/filtri | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/elimina | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-chiaro] | distillati/nessun-risultato | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/filtri-attivi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/nuovo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/nuovo-errori | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/modulo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/modulo-inglese-aperto | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/elenco | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/modulo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/modulo-menu | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/elenco | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/nuovo | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/nuovo-errori | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/sovrapposizione | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/elimina | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-chiaro] | bevande/nessun-risultato | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/elenco | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/elimina | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/modificato | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/file-non-leggibile | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/nessun-messaggio | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/togli | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/elenco | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/filtri | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/filtri-attivi | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/modulo-inglese-aperto | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| giorni-speciali C2-mouse [notebook-1280-chiaro] | giorni-speciali/data-passata | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-scuro] | vini/filtri-origine | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-chiaro] | messaggio-globale/inglese-aperto | notebook-1280-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-scuro] | vini/modulo-inglese-aperto | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/nuovo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/nuovo-errori | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/modulo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/modulo-origine | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/elimina | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/nessun-risultato | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/elenco | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/filtri | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/origine-senza-regioni | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| vini C2-mouse [notebook-1280-scuro] | vini/errore-anno | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/filtri-attivi | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/nuovo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/nuovo-errori | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/modulo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/elimina | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| vini C2-mouse [notebook-1280-scuro] | vini/errore-geografia | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/modulo-inglese-aperto | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| distillati C2-mouse [notebook-1280-scuro] | distillati/nessun-risultato | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/elenco | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/filtri | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/nuovo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/nuovo-errori | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/filtri-attivi | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/modulo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/modulo-inglese-aperto | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/elenco | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/modulo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/modulo-menu | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/nuovo | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/nuovo-errori | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/sovrapposizione | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/elimina | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/elimina | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/elenco | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/modificato | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| bevande C2-mouse [notebook-1280-scuro] | bevande/nessun-risultato | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/file-non-leggibile | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/nessun-messaggio | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/togli | notebook-1280-scuro | OK | conforme | come da JSON | passed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/modulo-inglese-aperto | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| giorni-speciali C2-mouse [notebook-1280-scuro] | giorni-speciali/data-passata | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
| messaggio-globale C2-mouse [notebook-1280-scuro] | messaggio-globale/inglese-aperto | notebook-1280-scuro | ERRORE-STRUMENTO | TimeoutError: locator.waitFor: Timeout 12000ms exceeded. | nessuna eccezione fuori asserzione | failed |
