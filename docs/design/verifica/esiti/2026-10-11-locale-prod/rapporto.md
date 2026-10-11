# Esito verifica — locale-prod — 2026-10-11
Commit: 2be902544741 · Lanciatore: 3.1.3 (L2) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.5.json v3 · Durata: 12 min 1 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 839 · FALLITO: 7 · AVVISO: 2 · NON PROVATO: 18 · Controlli distinti nel JSON corrente: 35

## Pacchetto: accesso
Righe: 180 · OK: 180 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 328 · OK: 323 · FALLITO: 2

### FALLITO (shell)
- **shell-menu-utente** | shell/home | telefono-390/chiaro | misurato `menu non apribile: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM
Call log:
  - attempting scroll into view action
    - waiting for element to be stable
` | atteso `Tema+Esci, no Admin` | evidenza: /app
- **shell-segnaposto** | shell/segnaposto-hours | telefono-390/chiaro | misurato `Orari / Orari di vietnamonamour.com: ristorante ` | atteso `Orari + descrizione segnaposto` | evidenza: /app/hours

## Pacchetto: orari
Righe: 334 · OK: 327 · FALLITO: 5

### FALLITO (orari)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valoreRipristinato:true chiusuraAssente:true barraAssente:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `stato salvato ripristinato (valore, chiusura prova, barra)` | evidenza: motivo: barraGone=false empty=true valore=true | shot:orari-annulla-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `testo sx pulsanti dx` | evidenza: motivo: allineamento barra/colonna/testo (box bar=256,1024) | shot:orari-barra-misure-notebook-1280-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `step0:true step1:false step2:true step3:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  | timeInputs:6 | salvaVis:true` | atteso `step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti` | evidenza: motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true | shot:orari-festivita-telefono-390-chiaro | alert:Le festività del 2026 sono già tutte presenti. | Le festività del 2026 sono già tutte presenti. | http://localhost:3100/app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:12:30 dinnerStart:19:30 timeInputs:6 values:["12:30","14:30","19:30","22:00","14:00","10:00"] salvati:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:false` | atteso `dopo clear-services e reload: avviso «Orari non configurati» e campi ora vuoti` | evidenza: clear-services+reload | manca avviso | shot:orari-non-configurato-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-uscita** | orari/uscita | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

    at openMobileSidebar (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/engine.mjs:828:69)
    at runOrariChecks (/Users/m` | atteso `conferma uscita con modifiche non salvate` | evidenza: motivo: navigazione o menu mobile (telefono-390) | shot:orari-uscita-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours

## Pacchetto: completo
Righe: 24 · OK: 9 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **acc-avvisi**: OK in 12/12 combinazioni
- **acc-centratura**: OK in 12/12 combinazioni
- **acc-collegamenti-sottolineati**: OK in 12/12 combinazioni
- **acc-colonna**: OK in 12/12 combinazioni
- **acc-fuori-shell**: OK in 12/12 combinazioni
- **acc-icona**: OK in 12/12 combinazioni
- **acc-margine**: OK in 6/6 combinazioni
- **acc-padding-scheda**: OK in 12/12 combinazioni
- **acc-spazi-16**: OK in 12/12 combinazioni
- **AMBIENTE**: OK in 3/3 combinazioni
- **avviso-login-password-aggiornata**: OK in 4/4 combinazioni
- **avviso-login-rifiutato**: OK in 4/4 combinazioni
- **C1**: OK in 104/104 combinazioni
- **C2**: OK in 114/114 combinazioni
- **C2-mouse**: OK in 40/40 combinazioni
- **C3**: OK in 157/157 combinazioni
- **C3-cambio-sistema**: OK in 3/3 combinazioni
- **C3-no-lampo**: OK in 48/48 combinazioni
- **C9**: OK in 9/9 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-colonne**: OK in 5/5 combinazioni
- **home-nessuna-riga-di-stato**: OK in 5/5 combinazioni
- **home-testi**: OK in 5/5 combinazioni
- **login-campi**: OK in 4/4 combinazioni
- **login-gerarchia**: OK in 4/4 combinazioni
- **login-link-destinazioni**: OK in 4/4 combinazioni
- **login-testi**: OK in 4/4 combinazioni
- **login-titolo-documento**: OK in 12/12 combinazioni
- **orari-barre-agganciate**: OK in 2/2 combinazioni
- **orari-campi-ora**: OK in 1/1 combinazioni
- **orari-chiusure-foglio**: OK in 2/2 combinazioni
- **orari-colonna**: OK in 2/2 combinazioni
- **orari-dati**: OK in 1/1 combinazioni
- **orari-errore-validazione**: OK in 2/2 combinazioni
- **orari-giorni-riposo**: OK in 1/1 combinazioni
- **orari-giorno-selezionato**: OK in 2/2 combinazioni
- **orari-intestazione-anno**: OK in 2/2 combinazioni
- **orari-modificato-barra**: OK in 2/2 combinazioni
- **orari-nomi-accessibili**: OK in 1/1 combinazioni
- **orari-permessi**: OK in 1/1 combinazioni
- **orari-salvataggio-in-corso**: OK in 1/1 combinazioni
- **orari-salvataggio-ok**: OK in 1/1 combinazioni
- **orari-stato-iniziale**: OK in 1/1 combinazioni
- **orari-testi**: OK in 1/1 combinazioni
- **orari-validazione-server**: OK in 1/1 combinazioni
- **reset-senza-token-vuoto**: OK in 1/1 combinazioni
- **shell-barra-alta**: OK in 30/30 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 49/49 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 49/49 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **orari-barra-misure**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **orari-uscita**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-margine-contenuto**: OK in 28/30 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-menu-utente**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-segnaposto**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valoreRipristinato:true chiusuraAssente:true barraAssente:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `stato salvato ripristinato (valore, chiusura prova, barra)` | evidenza: motivo: barraGone=false empty=true valore=true | shot:orari-annulla-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `testo sx pulsanti dx` | evidenza: motivo: allineamento barra/colonna/testo (box bar=256,1024) | shot:orari-barra-misure-notebook-1280-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `step0:true step1:false step2:true step3:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  | timeInputs:6 | salvaVis:true` | atteso `step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti` | evidenza: motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true | shot:orari-festivita-telefono-390-chiaro | alert:Le festività del 2026 sono già tutte presenti. | Le festività del 2026 sono già tutte presenti. | http://localhost:3100/app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:12:30 dinnerStart:19:30 timeInputs:6 values:["12:30","14:30","19:30","22:00","14:00","10:00"] salvati:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:false` | atteso `dopo clear-services e reload: avviso «Orari non configurati» e campi ora vuoti` | evidenza: clear-services+reload | manca avviso | shot:orari-non-configurato-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-uscita** | orari/uscita | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

    at openMobileSidebar (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/engine.mjs:828:69)
    at runOrariChecks (/Users/m` | atteso `conferma uscita con modifiche non salvate` | evidenza: motivo: navigazione o menu mobile (telefono-390) | shot:orari-uscita-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **shell-menu-utente** | shell/home | telefono-390/chiaro | misurato `menu non apribile: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM
Call log:
  - attempting scroll into view action
    - waiting for element to be stable
` | atteso `Tema+Esci, no Admin` | evidenza: /app
- **shell-segnaposto** | shell/segnaposto-hours | telefono-390/chiaro | misurato `Orari / Orari di vietnamonamour.com: ristorante ` | atteso `Orari + descrizione segnaposto` | evidenza: /app/hours

### AVVISO
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/chiaro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/scuro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours

### NON PROVATO
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
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
| C1 | OK (104/104) |
| C2 | OK (114/114) |
| C2-mouse | OK (40/40) |
| C3 | OK (157/157) |
| C3-cambio-sistema | OK (3/3) |
| C3-no-lampo | OK (48/48) |
| C9 | OK (9/9) |
| orari-annulla | FALLITO (0/1) |
| orari-barra-misure | FALLITO (1/2) |
| orari-barre-agganciate | OK (2/2) |
| orari-campi-ora | OK (1/1) |
| orari-chiusure-foglio | OK (2/2) |
| orari-colonna | OK (2/2) |
| orari-console | NON PROVATO (0/1) |
| orari-dati | OK (1/1) |
| orari-errore-caricamento | NON PROVATO (0/1) |
| orari-errore-server | NON PROVATO (0/1) |
| orari-errore-validazione | OK (2/2) |
| orari-festivita | FALLITO (0/1) |
| orari-giorni-riposo | OK (1/1) |
| orari-giorno-selezionato | OK (2/2) |
| orari-intestazione-anno | OK (2/2) |
| orari-modificato-barra | OK (2/2) |
| orari-nomi-accessibili | OK (1/1) |
| orari-non-configurato | FALLITO (0/1) |
| orari-permessi | OK (1/1) |
| orari-salvataggio-in-corso | OK (1/1) |
| orari-salvataggio-ok | OK (1/1) |
| orari-stato-iniziale | OK (1/1) |
| orari-testi | OK (1/1) |
| orari-uscita | FALLITO (1/2) |
| orari-validazione-server | OK (1/1) |
| shell-admin-link | NON PROVATO (0/7) |
| verify-link-valido | NON PROVATO (0/8) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| orari-errore-server | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-barra-misure | orari/modificato | notebook-1280/chiaro | FALLITO | allineamento colonna=false \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | testo sx pulsanti dx | motivo: allineamento barra/colonna/testo (box bar=256,1024) \| shot:orari-barra-misure-notebook-1280-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-annulla | orari/modificato | telefono-390/chiaro | FALLITO | valoreRipristinato:true chiusuraAssente:true barraAssente:false \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | stato salvato ripristinato (valore, chiusura prova, barra) | motivo: barraGone=false empty=true valore=true \| shot:orari-annulla-telefono-390-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-festivita | orari/festivita | telefono-390/chiaro | FALLITO | step0:true step1:false step2:true step3:true \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  \| timeInputs:6 \| salvaVis:true | step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti | motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true \| shot:orari-festivita-telefono-390-chiaro \| alert:Le festività del 2026 sono già tutte presenti. \| Le festività del 2026 sono già tutte presenti. \| http://localhost:3100/app/hours |
| orari-uscita | orari/uscita | telefono-390/chiaro | FALLITO | locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })  locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })      at openMobileSidebar (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/engine.mjs:828:69)     at runOrariChecks (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/run-orari.mjs:1050:52)     at async runLocaleProd (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:598:5)     at async file:///Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:1125:9     at async runAmbienteWithBudget (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:995:5)     at async main (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:1124:7) \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:false | conferma uscita con modifiche non salvate | motivo: navigazione o menu mobile (telefono-390) \| shot:orari-uscita-telefono-390-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-non-configurato | orari/non-configurato | telefono-390/chiaro | FALLITO | info:false lunch:12:30 dinnerStart:19:30 timeInputs:6 values:["12:30","14:30","19:30","22:00","14:00","10:00"] salvati:false \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:false | dopo clear-services e reload: avviso «Orari non configurati» e campi ora vuoti | clear-services+reload \| manca avviso \| shot:orari-non-configurato-telefono-390-chiaro \| alert:— \| http://localhost:3100/app/hours |
| shell-menu-utente | shell/home | telefono-390/chiaro | FALLITO | menu non apribile: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM Call log:   - attempting scroll into view action     - waiting for element to be stable  | Tema+Esci, no Admin | /app |
| shell-segnaposto | shell/segnaposto-hours | telefono-390/chiaro | FALLITO | Orari / Orari di vietnamonamour.com: ristorante  | Orari + descrizione segnaposto | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/chiaro | AVVISO | 224 px | 24 px | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/scuro | AVVISO | 224 px | 24 px | /app/hours |
| orari-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-errore-server: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-errore-caricamento: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-console: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- Global iniziale (snapshot): weeklyClosedDays=[]; services=2; closures=3; bnb=presente
- orari-stato-iniziale · avvisi main: 0
- orari/iniziale · telefono-360/chiaro · avvisi main: 0
- orari/iniziale · telefono-390/chiaro · avvisi main: 0
- orari/iniziale · notebook-1280/chiaro · avvisi main: 0
- orari/iniziale · tablet-820/chiaro · avvisi main: 0
- orari/iniziale · telefono-360/scuro · avvisi main: 0
- orari/iniziale · telefono-390/scuro · avvisi main: 0
- orari/iniziale · notebook-1280/scuro · avvisi main: 0
- orari/iniziale · tablet-820/scuro · avvisi main: 0
- orari/iniziale · telefono-360/sistema-chiaro · avvisi main: 0
- orari/iniziale · telefono-390/sistema-chiaro · avvisi main: 0
- orari/iniziale · notebook-1280/sistema-chiaro · avvisi main: 0
- orari/iniziale · tablet-820/sistema-chiaro · avvisi main: 0
- orari/iniziale · telefono-360/sistema-scuro · avvisi main: 0
- orari/iniziale · telefono-390/sistema-scuro · avvisi main: 0
- orari/iniziale · notebook-1280/sistema-scuro · avvisi main: 0
- orari/iniziale · tablet-820/sistema-scuro · avvisi main: 0
- orari/modificato · telefono-360/chiaro · avvisi main: 0
- orari/modificato · telefono-390/chiaro · avvisi main: 0
- orari/modificato · notebook-1280/chiaro · avvisi main: 0
- orari/modificato · tablet-820/chiaro · avvisi main: 0
- orari/modificato · telefono-360/scuro · avvisi main: 0
- orari/modificato · telefono-390/scuro · avvisi main: 0
- orari/modificato · notebook-1280/scuro · avvisi main: 0
- orari/modificato · tablet-820/scuro · avvisi main: 0
- orari/modificato · telefono-360/sistema-chiaro · avvisi main: 0
- orari/modificato · telefono-390/sistema-chiaro · avvisi main: 0
- orari/modificato · notebook-1280/sistema-chiaro · avvisi main: 0
- orari/modificato · tablet-820/sistema-chiaro · avvisi main: 0
- orari/modificato · telefono-360/sistema-scuro · avvisi main: 0
- orari/modificato · telefono-390/sistema-scuro · avvisi main: 0
- orari/modificato · notebook-1280/sistema-scuro · avvisi main: 0
- orari/modificato · tablet-820/sistema-scuro · avvisi main: 0
- orari/errore-validazione · telefono-360/chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-390/chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · notebook-1280/chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · tablet-820/chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-360/scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-390/scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · notebook-1280/scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · tablet-820/scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-360/sistema-chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-390/sistema-chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · notebook-1280/sistema-chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · tablet-820/sistema-chiaro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-360/sistema-scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · telefono-390/sistema-scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · notebook-1280/sistema-scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/errore-validazione · tablet-820/sistema-scuro · avvisi main: 3 → Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Controlla i campi evidenziatiAlcuni orari non sono validi: non è stato salvato nulla. | Orario obbligatorio.
- orari/salvato · telefono-360/chiaro · avvisi main: 0
- orari/salvato · telefono-390/chiaro · avvisi main: 2 → Orari salvati | Orari salvati
- orari/salvato · notebook-1280/chiaro · avvisi main: 0
- orari/salvato · tablet-820/chiaro · avvisi main: 0
- orari/salvato · telefono-360/scuro · avvisi main: 0
- orari/salvato · telefono-390/scuro · avvisi main: 0
- orari/salvato · notebook-1280/scuro · avvisi main: 0
- orari/salvato · tablet-820/scuro · avvisi main: 0
- orari/salvato · telefono-360/sistema-chiaro · avvisi main: 0
- orari/salvato · telefono-390/sistema-chiaro · avvisi main: 0
- orari/salvato · notebook-1280/sistema-chiaro · avvisi main: 0
- orari/salvato · tablet-820/sistema-chiaro · avvisi main: 0
- orari/salvato · telefono-360/sistema-scuro · avvisi main: 0
- orari/salvato · telefono-390/sistema-scuro · avvisi main: 0
- orari/salvato · notebook-1280/sistema-scuro · avvisi main: 0
- orari/salvato · tablet-820/sistema-scuro · avvisi main: 0
- orari/foglio-chiusura · telefono-360/chiaro · avvisi main: 0
- orari/foglio-chiusura · telefono-390/chiaro · avvisi main: 0
- orari/foglio-chiusura · notebook-1280/chiaro · avvisi main: 0
- orari/foglio-chiusura · tablet-820/chiaro · avvisi main: 0
- orari/foglio-chiusura · telefono-360/scuro · avvisi main: 0
- orari/foglio-chiusura · telefono-390/scuro · avvisi main: 0
- orari/foglio-chiusura · notebook-1280/scuro · avvisi main: 0
- orari/foglio-chiusura · tablet-820/scuro · avvisi main: 0
- orari/foglio-chiusura · telefono-360/sistema-chiaro · avvisi main: 0
- orari/foglio-chiusura · telefono-390/sistema-chiaro · avvisi main: 0
- orari/foglio-chiusura · notebook-1280/sistema-chiaro · avvisi main: 0
- orari/foglio-chiusura · tablet-820/sistema-chiaro · avvisi main: 0
- orari/foglio-chiusura · telefono-360/sistema-scuro · avvisi main: 0
- orari/foglio-chiusura · telefono-390/sistema-scuro · avvisi main: 0
- orari/foglio-chiusura · notebook-1280/sistema-scuro · avvisi main: 0
- orari/foglio-chiusura · tablet-820/sistema-scuro · avvisi main: 0
- orari/conferma-rimozione · telefono-360/chiaro · avvisi main: 0
- orari/conferma-rimozione · telefono-390/chiaro · avvisi main: 0
- orari/conferma-rimozione · notebook-1280/chiaro · avvisi main: 0
- orari/conferma-rimozione · tablet-820/chiaro · avvisi main: 0
- orari/conferma-rimozione · telefono-360/scuro · avvisi main: 0
- orari/conferma-rimozione · telefono-390/scuro · avvisi main: 0
- orari/conferma-rimozione · notebook-1280/scuro · avvisi main: 0
- orari/conferma-rimozione · tablet-820/scuro · avvisi main: 0
- orari/conferma-rimozione · telefono-360/sistema-chiaro · avvisi main: 0
- orari/conferma-rimozione · telefono-390/sistema-chiaro · avvisi main: 0
- orari/conferma-rimozione · notebook-1280/sistema-chiaro · avvisi main: 0
- orari/conferma-rimozione · tablet-820/sistema-chiaro · avvisi main: 0
- orari/conferma-rimozione · telefono-360/sistema-scuro · avvisi main: 0
- orari/conferma-rimozione · telefono-390/sistema-scuro · avvisi main: 0
- orari/conferma-rimozione · notebook-1280/sistema-scuro · avvisi main: 0
- orari/conferma-rimozione · tablet-820/sistema-scuro · avvisi main: 0
- orari-uscita telefono-390: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

    at openMobileSidebar (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/engine.mjs:828:69)
    at runOrariChecks (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/lib/run-orari.mjs:1050:52)
    at async runLocaleProd (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:598:5)
    at async file:///Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:1125:9
    at async runAmbienteWithBudget (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:995:5)
    at async main (/Users/mirko/Documents/GitHub/vma_vd-backend-backoffice/scripts/ui-verify/run.mjs:1124:7)
- Regressione shell 8.2 (L2) nella stessa esecuzione locale-prod
- Tempo massimo ambiente scaduto (12 min, configurabile con UI_VERIFY_TIMEOUT_MS o UI_VERIFY_TIMEOUT_<AMBIENTE>_MS): esecuzione interrotta.
- shell shell/segnaposto-hours tablet-820/scuro: Tempo massimo ambiente scaduto
