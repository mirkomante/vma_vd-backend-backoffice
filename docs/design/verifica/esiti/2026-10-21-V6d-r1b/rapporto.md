# Esito verifica — locale-prod e2e — 2026-10-21
Commit: 0dd273633519 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright) · Controlli: smoke T0

## Riepilogo
OK: 11 · FALLITO: 2 · AVVISO: 0 · NON PROVATO: 1

## ERRORE-STRUMENTO (4)
- menu-fissi-colonna-elenco [telefono-390-chiaro] (telefono-390-chiaro): Error: piatto di prova mancante: verify-ui-8681519c-w3-p-col
- menu-fissi-colonna-elenco [notebook-1280-chiaro] (notebook-1280-chiaro): Error: piatto di prova mancante: verify-ui-8681519c-w5-p-col
- menu-fissi-colonna-elenco [soglia-767-chiaro] (soglia-767-chiaro): Error: piatto di prova mancante: verify-ui-8681519c-w8-p-col
- menu-fissi-colonna-elenco [soglia-768-chiaro] (soglia-768-chiaro): Error: piatto di prova mancante: verify-ui-8681519c-w9-p-col

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| menu-fissi-elimina-senza-uso [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-elimina-cascade-registro-permessi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-console [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | NON PROVATO | saltato | motivo nel skip | skipped |
| menu-fissi-testi [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-nomi-accessibili [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-persistenza [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-elimina-usato [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-modulo-validazione [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | ERRORE-STRUMENTO | Error: piatto di prova mancante: verify-ui-8681519c-w3-p-col | nessuna eccezione fuori asserzione | failed |
| menu-fissi-porzione-traduzione [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | FALLITO | Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m | asserzione soddisfatta | failed |
| menu-fissi-disponibilita [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-servizi-piatti [telefono-390-chiaro] | Menù fissi | telefono-390-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [notebook-1280-chiaro] | Menù fissi | notebook-1280-chiaro | ERRORE-STRUMENTO | Error: piatto di prova mancante: verify-ui-8681519c-w5-p-col | nessuna eccezione fuori asserzione | failed |
| menu-fissi-ordine-liste [notebook-1280-chiaro] | Menù fissi | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| vini-ordine-100 [notebook-1280-chiaro] | Vini | notebook-1280-chiaro | OK | conforme | come da JSON | passed |
| menu-fissi-colonna-elenco [soglia-767-chiaro] | Menù fissi | soglia-767-chiaro | ERRORE-STRUMENTO | Error: piatto di prova mancante: verify-ui-8681519c-w8-p-col | nessuna eccezione fuori asserzione | failed |
| menu-fissi-colonna-elenco [soglia-768-chiaro] | Menù fissi | soglia-768-chiaro | ERRORE-STRUMENTO | Error: piatto di prova mancante: verify-ui-8681519c-w9-p-col | nessuna eccezione fuori asserzione | failed |
| piatti-ordine-100 [notebook-1280-chiaro] | Piatti | notebook-1280-chiaro | FALLITO | Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed | asserzione soddisfatta | failed |
