# Esito verifica — locale-prod e2e — 2026-10-20
Commit: be7012edbcc0 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 10 · FALLITO: 1 · AVVISO: 0 · NON PROVATO: 8

## ERRORE-STRUMENTO (1)
- menu-fissi-persistenza [telefono-390-chiaro] (telefono-390-chiaro): TimeoutError: locator.click: Timeout 15000ms exceeded.

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| giorni-speciali-attivazione [telefono-390-chiaro] | Giorni speciali | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali-console [telefono-390-chiaro] | Giorni speciali | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-elimina-senza-uso [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | FALLITO | Error: POSSIBILE DIFETTO DELL'APP: pulsante Elimina verify-ui-990044b7-w3-menu-libero non trovato nell'elenco menù fissi | asserzione soddisfatta | failed |
| giorni-speciali-elimina-registro-permessi [telefono-390-chiaro] | Giorni speciali | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali-persistenza [telefono-390-chiaro] | Giorni speciali | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| giorni-speciali-sovrapposizione [telefono-390-chiaro] | Giorni speciali | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-nomi-accessibili [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-console [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-testi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-modulo-validazione [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-disponibilita [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-elimina-cascade-registro-permessi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale-salvataggio [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-elimina-usato [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale-togli [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale-file-non-leggibile [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| messaggio-globale-file-riceve-messaggio [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| messaggio-globale-pubblicazione [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| messaggio-globale-permessi [telefono-390-chiaro] | Messaggio globale | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-persistenza [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | ERRORE-STRUMENTO | TimeoutError: locator.click: Timeout 15000ms exceeded. | nessuna eccezione fuori asserzione | failed |
