# Esito verifica — locale-prod — 2026-10-11
Commit: 60356e92b7cd · Lanciatore: 3.1.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.5.json v3 · Durata: 2 min 9 s

## Riepilogo
OK: 78 · FALLITO: 20 · AVVISO: 0 · NON PROVATO: 6 · Controlli distinti nel JSON: 29

## Esiti compatti

### OK (raggruppati)
- **AMBIENTE**: OK in 1/1 combinazioni
- **C1**: OK in 21/21 combinazioni
- **C2-mouse**: OK in 10/10 combinazioni
- **C3**: OK in 21/21 combinazioni
- **C9**: OK in 1/1 combinazioni
- **orari-campi-ora**: OK in 1/1 combinazioni
- **orari-chiusure-foglio**: OK in 2/2 combinazioni
- **orari-dati**: OK in 1/1 combinazioni
- **orari-giorni-riposo**: OK in 1/1 combinazioni
- **orari-intestazione-anno**: OK in 2/2 combinazioni
- **orari-nomi-accessibili**: OK in 1/1 combinazioni
- **orari-permessi**: OK in 1/1 combinazioni
- **orari-salvataggio-in-corso**: OK in 1/1 combinazioni
- **orari-salvataggio-ok**: OK in 1/1 combinazioni
- **orari-testi**: OK in 1/1 combinazioni
- **C2**: OK in 11/15 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **orari-colonna**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO
- **C2** (4 combinazioni): es. `Annulla 274x42; Rimuovi 274x42` · atteso `nessun elemento sotto 44 px` · orari/conferma-rimozione · telefono-390/chiaro; orari/conferma-rimozione (dialog) · telefono-390/chiaro; orari/conferma-rimozione · telefono-390/scuro; orari/conferma-rimozione (dialog) · telefono-390/scuro
- **orari-annulla** (1 combinazioni): es. `valore:true chiusura:true` · atteso `stato salvato ripristinato` · orari/modificato · telefono-390/chiaro
- **orari-barra-misure** (2 combinazioni): es. `h=117 btn=44` · atteso `≤97px, pulsanti 44 affiancati` · orari/modificato · telefono-390/chiaro; orari/modificato · notebook-1280/chiaro
- **orari-colonna** (1 combinazioni): es. `form 576px x=480; gruppo 392; voce 56` · atteso `576 centrato; gruppo 392; voce 56` · orari/iniziale · notebook-1280/chiaro
- **orari-errore-validazione** (2 combinazioni): es. `req:0 alert:true focus:true view:false` · atteso `nessuna richiesta; avviso; campo; focus; destructive` · orari/errore-validazione · telefono-390/chiaro; orari/errore-validazione · telefono-390/scuro
- **orari-festivita** (1 combinazioni): es. `0:true 1:false 2:true 3:true` · atteso `flusso festività (parziale step 1-4)` · orari/festivita · telefono-390/chiaro
- **orari-giorno-selezionato** (2 combinazioni): es. `nessun giorno on` · atteso `sfondo --primary e testo --primary-foreground` · orari/iniziale · telefono-390/chiaro; orari/iniziale · telefono-390/scuro
- **orari-modificato-barra** (2 combinazioni): es. `compare:true scompare:false` · atteso `barra con testi attesi poi assente` · orari/modificato · telefono-390/chiaro; orari/modificato · notebook-1280/chiaro
- **orari-stato-iniziale** (1 combinazioni): es. `saveBar:1 alert:1` · atteso `nessuna barra né avviso` · orari/iniziale · telefono-390/chiaro
- **orari-validazione-server** (1 combinazioni): es. `[{"value":"25:99","ok":false,"message":"The following field is invalid: services.0.startTime"},{"value":"9:30","ok":false,"message":"The following field is invalid: services.0.startTime"}]` · atteso `Formato non valido: usa HH:mm in 24 ore (es. 09:30).` · orari/server · —
- **runtime-orari-stato** (3 combinazioni): es. `locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible
` · atteso `stato preparato` · orari/salvato · notebook-1280/chiaro; orari/salvato · telefono-390/scuro; orari/salvato · notebook-1280/scuro

### AVVISO
- (nessuno)

### NON PROVATO
- **verify-link-valido** (—, —): misurato `—` · atteso `—` · facoltativo: token reale monouso non ottenuto
- **shell-admin-link** (—, —): misurato `—` · atteso `—` · NON PROVABILE con utente solo App (adminRole none)
- **orari-errore-server** (—, —): misurato `—` · atteso `—` · simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- **orari-errore-caricamento** (—, —): misurato `—` · atteso `—` · simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- **orari-console** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-non-configurato** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione

## Tabella controlli distinti (JSON)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (1/1) |
| C1 | OK (21/21) |
| C2 | FALLITO (11/15) |
| C2-mouse | OK (10/10) |
| C3 | OK (21/21) |
| C9 | OK (1/1) |
| orari-annulla | FALLITO (0/1) |
| orari-barra-misure | FALLITO (0/2) |
| orari-campi-ora | OK (1/1) |
| orari-chiusure-foglio | OK (2/2) |
| orari-colonna | FALLITO (1/2) |
| orari-console | NON PROVATO (0/1) |
| orari-dati | OK (1/1) |
| orari-errore-caricamento | NON PROVATO (0/1) |
| orari-errore-server | NON PROVATO (0/1) |
| orari-errore-validazione | FALLITO (0/2) |
| orari-festivita | FALLITO (0/1) |
| orari-giorni-riposo | OK (1/1) |
| orari-giorno-selezionato | FALLITO (0/2) |
| orari-intestazione-anno | OK (2/2) |
| orari-modificato-barra | FALLITO (0/2) |
| orari-nomi-accessibili | OK (1/1) |
| orari-non-configurato | NON PROVATO (0/1) |
| orari-permessi | OK (1/1) |
| orari-salvataggio-in-corso | OK (1/1) |
| orari-salvataggio-ok | OK (1/1) |
| orari-stato-iniziale | FALLITO (0/1) |
| orari-testi | OK (1/1) |
| orari-validazione-server | FALLITO (0/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| orari-errore-server | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| runtime-orari-stato | orari/salvato | notebook-1280/chiaro | FALLITO | locator.waitFor: Timeout 10000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible  | stato preparato | salvato |
| runtime-orari-stato | orari/salvato | telefono-390/scuro | FALLITO | locator.waitFor: Timeout 10000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible  | stato preparato | salvato |
| runtime-orari-stato | orari/salvato | notebook-1280/scuro | FALLITO | locator.waitFor: Timeout 10000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible  | stato preparato | salvato |
| C2 | orari/conferma-rimozione | telefono-390/chiaro | FALLITO | Annulla 274x42; Rimuovi 274x42 | nessun elemento sotto 44 px | conferma-rimozione |
| C2 | orari/conferma-rimozione (dialog) | telefono-390/chiaro | FALLITO | Annulla 274x42; Rimuovi 274x42 | nessun elemento sotto 44 px | dialog |
| C2 | orari/conferma-rimozione | telefono-390/scuro | FALLITO | Annulla 274x42; Rimuovi 274x42 | nessun elemento sotto 44 px | conferma-rimozione |
| C2 | orari/conferma-rimozione (dialog) | telefono-390/scuro | FALLITO | Annulla 274x42; Rimuovi 274x42 | nessun elemento sotto 44 px | dialog |
| orari-stato-iniziale | orari/iniziale | telefono-390/chiaro | FALLITO | saveBar:1 alert:1 | nessuna barra né avviso | /app/hours |
| orari-colonna | orari/iniziale | notebook-1280/chiaro | FALLITO | form 576px x=480; gruppo 392; voce 56 | 576 centrato; gruppo 392; voce 56 | /app/hours |
| orari-giorno-selezionato | orari/iniziale | telefono-390/chiaro | FALLITO | nessun giorno on | sfondo --primary e testo --primary-foreground | Lun attivo |
| orari-giorno-selezionato | orari/iniziale | telefono-390/scuro | FALLITO | nessun giorno on | sfondo --primary e testo --primary-foreground | Lun attivo |
| orari-modificato-barra | orari/modificato | telefono-390/chiaro | FALLITO | compare:true scompare:false | barra con testi attesi poi assente | /app/hours |
| orari-modificato-barra | orari/modificato | notebook-1280/chiaro | FALLITO | compare:true scompare:false | barra con testi attesi poi assente | /app/hours |
| orari-barra-misure | orari/modificato | telefono-390/chiaro | FALLITO | h=117 btn=44 | ≤97px, pulsanti 44 affiancati | /app/hours |
| orari-barra-misure | orari/modificato | notebook-1280/chiaro | FALLITO | allineamento colonna=false | testo sx pulsanti dx | /app/hours |
| orari-errore-validazione | orari/errore-validazione | telefono-390/chiaro | FALLITO | req:0 alert:true focus:true view:false | nessuna richiesta; avviso; campo; focus; destructive | Orario obbligatorio. |
| orari-errore-validazione | orari/errore-validazione | telefono-390/scuro | FALLITO | req:0 alert:true focus:true view:false | nessuna richiesta; avviso; campo; focus; destructive | Orario obbligatorio. |
| orari-annulla | orari/modificato | telefono-390/chiaro | FALLITO | valore:true chiusura:true | stato salvato ripristinato | /app/hours |
| orari-festivita | orari/festivita | telefono-390/chiaro | FALLITO | 0:true 1:false 2:true 3:true | flusso festività (parziale step 1-4) | 2026 |
| orari-validazione-server | orari/server | — | FALLITO | [{"value":"25:99","ok":false,"message":"The following field is invalid: services.0.startTime"},{"value":"9:30","ok":false,"message":"The following field is invalid: services.0.startTime"}] | Formato non valido: usa HH:mm in 24 ore (es. 09:30). | Local API |
| orari-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-non-configurato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-errore-server: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-errore-caricamento: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-console: controllo non eseguito dal lanciatore in questa esecuzione
- orari-non-configurato: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- orari orari/salvato notebook-1280/chiaro: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible

- orari orari/salvato telefono-390/scuro: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible

- orari orari/salvato notebook-1280/scuro: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Salva modifiche' }) to be visible

