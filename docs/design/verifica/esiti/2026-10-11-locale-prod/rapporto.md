# Esito verifica — locale-prod — 2026-10-11
Commit: af472456fe1a · Lanciatore: 3.1.1 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.5.json v3 · Durata: 4 min 7 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 92 · FALLITO: 13 · AVVISO: 0 · NON PROVATO: 9 · Controlli distinti nel JSON corrente: 29

## Pacchetto: accesso
Righe: 4 · OK: 3 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 1 · OK: 0 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: orari
Righe: 102 · OK: 86 · FALLITO: 13

### FALLITO (orari)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valore:true chiusura:true` | atteso `stato salvato ripristinato` | evidenza: /app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false` | atteso `testo sx pulsanti dx` | evidenza: /app/hours
- **orari-errore-validazione** | orari/errore-validazione | telefono-390/chiaro | misurato `req:0 alert:true focus:true view:false scroll:true` | atteso `nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive` | evidenza: Orario obbligatorio.
- **orari-errore-validazione** | orari/errore-validazione | telefono-390/scuro | misurato `req:0 alert:true focus:true view:false scroll:true` | atteso `nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive` | evidenza: Orario obbligatorio.
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `0:true 1:false 2:true 3:true` | atteso `flusso festività (parziale step 1-4)` | evidenza: 2026
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/chiaro | misurato `state:null` | atteso `sfondo --primary e testo --primary-foreground` | evidenza: Lun attivo
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/scuro | misurato `state:null` | atteso `sfondo --primary e testo --primary-foreground` | evidenza: Lun attivo
- **orari-modificato-barra** | orari/modificato | telefono-390/chiaro | misurato `compare:true scompare:false` | atteso `barra con testi attesi poi assente` | evidenza: /app/hours
- **orari-modificato-barra** | orari/modificato | notebook-1280/chiaro | misurato `compare:true scompare:false` | atteso `barra con testi attesi poi assente` | evidenza: /app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:— inputs:0 gone:true` | atteso `avviso; campi vuoti; scompare dopo save` | evidenza: clear-services
- **orari-stato-iniziale** | orari/iniziale | telefono-390/chiaro | misurato `saveBar:1 alert:1 status:` | atteso `nessuna barra né avviso su pagina appena caricata` | evidenza: /app/hours
- **runtime-orari-stato** | orari/conferma-rimozione | notebook-1280/chiaro | misurato `page.waitForFunction: Timeout 30000ms exceeded.` | atteso `stato preparato` | evidenza: conferma-rimozione
- **runtime-orari-stato** | orari/conferma-rimozione | notebook-1280/scuro | misurato `page.waitForFunction: Timeout 30000ms exceeded.` | atteso `stato preparato` | evidenza: conferma-rimozione

## Pacchetto: completo
Righe: 7 · OK: 3 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 3/3 combinazioni
- **C1**: OK in 22/22 combinazioni
- **C2**: OK in 16/16 combinazioni
- **C2-mouse**: OK in 10/10 combinazioni
- **C3**: OK in 22/22 combinazioni
- **C9**: OK in 3/3 combinazioni
- **orari-campi-ora**: OK in 1/1 combinazioni
- **orari-chiusure-foglio**: OK in 2/2 combinazioni
- **orari-colonna**: OK in 2/2 combinazioni
- **orari-dati**: OK in 1/1 combinazioni
- **orari-giorni-riposo**: OK in 1/1 combinazioni
- **orari-intestazione-anno**: OK in 2/2 combinazioni
- **orari-nomi-accessibili**: OK in 1/1 combinazioni
- **orari-permessi**: OK in 1/1 combinazioni
- **orari-salvataggio-in-corso**: OK in 1/1 combinazioni
- **orari-salvataggio-ok**: OK in 1/1 combinazioni
- **orari-testi**: OK in 1/1 combinazioni
- **orari-validazione-server**: OK in 1/1 combinazioni
- **orari-barra-misure**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valore:true chiusura:true` | atteso `stato salvato ripristinato` | evidenza: /app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false` | atteso `testo sx pulsanti dx` | evidenza: /app/hours
- **orari-errore-validazione** | orari/errore-validazione | telefono-390/chiaro | misurato `req:0 alert:true focus:true view:false scroll:true` | atteso `nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive` | evidenza: Orario obbligatorio.
- **orari-errore-validazione** | orari/errore-validazione | telefono-390/scuro | misurato `req:0 alert:true focus:true view:false scroll:true` | atteso `nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive` | evidenza: Orario obbligatorio.
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `0:true 1:false 2:true 3:true` | atteso `flusso festività (parziale step 1-4)` | evidenza: 2026
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/chiaro | misurato `state:null` | atteso `sfondo --primary e testo --primary-foreground` | evidenza: Lun attivo
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/scuro | misurato `state:null` | atteso `sfondo --primary e testo --primary-foreground` | evidenza: Lun attivo
- **orari-modificato-barra** | orari/modificato | telefono-390/chiaro | misurato `compare:true scompare:false` | atteso `barra con testi attesi poi assente` | evidenza: /app/hours
- **orari-modificato-barra** | orari/modificato | notebook-1280/chiaro | misurato `compare:true scompare:false` | atteso `barra con testi attesi poi assente` | evidenza: /app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:— inputs:0 gone:true` | atteso `avviso; campi vuoti; scompare dopo save` | evidenza: clear-services
- **orari-stato-iniziale** | orari/iniziale | telefono-390/chiaro | misurato `saveBar:1 alert:1 status:` | atteso `nessuna barra né avviso su pagina appena caricata` | evidenza: /app/hours
- **runtime-orari-stato** | orari/conferma-rimozione | notebook-1280/chiaro | misurato `page.waitForFunction: Timeout 30000ms exceeded.` | atteso `stato preparato` | evidenza: conferma-rimozione
- **runtime-orari-stato** | orari/conferma-rimozione | notebook-1280/scuro | misurato `page.waitForFunction: Timeout 30000ms exceeded.` | atteso `stato preparato` | evidenza: conferma-rimozione

### AVVISO
- (nessuno)

### NON PROVATO
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **orari-errore-server** | — | — | misurato `—` | atteso `—` | evidenza: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- **orari-errore-caricamento** | — | — | misurato `—` | atteso `—` | evidenza: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- **orari-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (3/3) |
| C1 | OK (22/22) |
| C2 | OK (16/16) |
| C2-mouse | OK (10/10) |
| C3 | OK (22/22) |
| C9 | OK (3/3) |
| orari-annulla | FALLITO (0/1) |
| orari-barra-misure | FALLITO (1/2) |
| orari-campi-ora | OK (1/1) |
| orari-chiusure-foglio | OK (2/2) |
| orari-colonna | OK (2/2) |
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
| orari-non-configurato | FALLITO (0/1) |
| orari-permessi | OK (1/1) |
| orari-salvataggio-in-corso | OK (1/1) |
| orari-salvataggio-ok | OK (1/1) |
| orari-stato-iniziale | FALLITO (0/1) |
| orari-testi | OK (1/1) |
| orari-validazione-server | OK (1/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| orari-errore-server | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-stato-iniziale | orari/iniziale | telefono-390/chiaro | FALLITO | saveBar:1 alert:1 status: | nessuna barra né avviso su pagina appena caricata | /app/hours |
| runtime-orari-stato | orari/conferma-rimozione | notebook-1280/chiaro | FALLITO | page.waitForFunction: Timeout 30000ms exceeded. | stato preparato | conferma-rimozione |
| runtime-orari-stato | orari/conferma-rimozione | notebook-1280/scuro | FALLITO | page.waitForFunction: Timeout 30000ms exceeded. | stato preparato | conferma-rimozione |
| orari-giorno-selezionato | orari/iniziale | telefono-390/chiaro | FALLITO | state:null | sfondo --primary e testo --primary-foreground | Lun attivo |
| orari-giorno-selezionato | orari/iniziale | telefono-390/scuro | FALLITO | state:null | sfondo --primary e testo --primary-foreground | Lun attivo |
| orari-modificato-barra | orari/modificato | telefono-390/chiaro | FALLITO | compare:true scompare:false | barra con testi attesi poi assente | /app/hours |
| orari-modificato-barra | orari/modificato | notebook-1280/chiaro | FALLITO | compare:true scompare:false | barra con testi attesi poi assente | /app/hours |
| orari-barra-misure | orari/modificato | notebook-1280/chiaro | FALLITO | allineamento colonna=false | testo sx pulsanti dx | /app/hours |
| orari-errore-validazione | orari/errore-validazione | telefono-390/chiaro | FALLITO | req:0 alert:true focus:true view:false scroll:true | nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive | Orario obbligatorio. |
| orari-errore-validazione | orari/errore-validazione | telefono-390/scuro | FALLITO | req:0 alert:true focus:true view:false scroll:true | nessuna richiesta; avviso; campo; focus; scroll smooth centrato; destructive | Orario obbligatorio. |
| orari-annulla | orari/modificato | telefono-390/chiaro | FALLITO | valore:true chiusura:true | stato salvato ripristinato | /app/hours |
| orari-festivita | orari/festivita | telefono-390/chiaro | FALLITO | 0:true 1:false 2:true 3:true | flusso festività (parziale step 1-4) | 2026 |
| orari-non-configurato | orari/non-configurato | telefono-390/chiaro | FALLITO | info:false lunch:— inputs:0 gone:true | avviso; campi vuoti; scompare dopo save | clear-services |
| orari-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-errore-server: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-errore-caricamento: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-console: controllo non eseguito dal lanciatore in questa esecuzione

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

- orari orari/conferma-rimozione notebook-1280/chiaro: page.waitForFunction: Timeout 30000ms exceeded.
- orari orari/conferma-rimozione notebook-1280/scuro: page.waitForFunction: Timeout 30000ms exceeded.
