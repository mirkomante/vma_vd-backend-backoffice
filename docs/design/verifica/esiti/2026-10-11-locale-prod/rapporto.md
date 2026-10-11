# Esito verifica — locale-prod — 2026-10-11
Commit: 94b566d635bf · Lanciatore: 3.1.2 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.5.json v3 · Durata: 3 min 13 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 351 · FALLITO: 7 · AVVISO: 0 · NON PROVATO: 17 · Controlli distinti nel JSON corrente: 29

## Pacchetto: accesso
Righe: 177 · OK: 177 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 71 · OK: 70 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: orari
Righe: 106 · OK: 96 · FALLITO: 7

### FALLITO (orari)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valoreRipristinato:true chiusuraAssente:true barraAssente:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `stato salvato ripristinato (valore, chiusura prova, barra)` | evidenza: motivo: barraGone=false empty=true valore=true | shot:orari-annulla-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `testo sx pulsanti dx` | evidenza: motivo: allineamento barra/colonna/testo (box bar=256,1024) | shot:orari-barra-misure-notebook-1280-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `step0:true step1:false step2:true step3:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  | timeInputs:6 | salvaVis:true` | atteso `step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti` | evidenza: motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true | shot:orari-festivita-telefono-390-chiaro | alert:Le festività del 2026 sono già tutte presenti. |  | http://localhost:3100/app/hours
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/chiaro | misurato `prima:null dopo:null (nessun toggle on) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `dopo click Lun: data-state=on e token primary` | evidenza: click esplicito su Lunedì da baseline senza giorni attivi | motivo: toggle o colori non conformi | shot:orari-giorno-selezionato-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/scuro | misurato `prima:null dopo:null (nessun toggle on) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `dopo click Lun: data-state=on e token primary` | evidenza: click esplicito su Lunedì da baseline senza giorni attivi | motivo: toggle o colori non conformi | shot:orari-giorno-selezionato-scuro | alert:— | http://localhost:3100/app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:12:30 timeInputs:6 hasLunchField:1 gone:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Orari salvati Servizi del ristorante Orario di inizio e fin | timeInputs:6 | salvaVis:false` | atteso `avviso Orari non configurati; 4 campi ora visibili e vuoti; scompare dopo save` | evidenza: clear-services | motivo: manca avviso | shot:orari-non-configurato-telefono-390-chiaro | alert:Orari salvati |  | http://localhost:3100/app/hours
- **orari-stato-iniziale** | orari/iniziale | telefono-390/chiaro | misurato `saveBar:0 alert:1 status:` | atteso `nessuna barra né avviso su pagina appena caricata` | evidenza: /app/hours

## Pacchetto: completo
Righe: 21 · OK: 8 · FALLITO: 0

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
- **avviso-login-password-aggiornata**: OK in 4/4 combinazioni
- **avviso-login-rifiutato**: OK in 4/4 combinazioni
- **C1**: OK in 52/52 combinazioni
- **C2**: OK in 46/46 combinazioni
- **C2-mouse**: OK in 26/26 combinazioni
- **C3**: OK in 52/52 combinazioni
- **C3-cambio-sistema**: OK in 1/1 combinazioni
- **C9**: OK in 8/8 combinazioni
- **home-colonne**: OK in 2/2 combinazioni
- **home-nessuna-riga-di-stato**: OK in 2/2 combinazioni
- **home-testi**: OK in 2/2 combinazioni
- **login-campi**: OK in 4/4 combinazioni
- **login-gerarchia**: OK in 4/4 combinazioni
- **login-link-destinazioni**: OK in 4/4 combinazioni
- **login-testi**: OK in 4/4 combinazioni
- **login-titolo-documento**: OK in 12/12 combinazioni
- **orari-campi-ora**: OK in 1/1 combinazioni
- **orari-chiusure-foglio**: OK in 2/2 combinazioni
- **orari-colonna**: OK in 2/2 combinazioni
- **orari-dati**: OK in 1/1 combinazioni
- **orari-errore-validazione**: OK in 2/2 combinazioni
- **orari-giorni-riposo**: OK in 1/1 combinazioni
- **orari-intestazione-anno**: OK in 2/2 combinazioni
- **orari-modificato-barra**: OK in 2/2 combinazioni
- **orari-nomi-accessibili**: OK in 1/1 combinazioni
- **orari-permessi**: OK in 1/1 combinazioni
- **orari-salvataggio-in-corso**: OK in 1/1 combinazioni
- **orari-salvataggio-ok**: OK in 1/1 combinazioni
- **orari-testi**: OK in 1/1 combinazioni
- **orari-validazione-server**: OK in 1/1 combinazioni
- **AMBIENTE**: OK in 2/3 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **orari-barra-misure**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **orari-annulla** | orari/modificato | telefono-390/chiaro | misurato `valoreRipristinato:true chiusuraAssente:true barraAssente:false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `stato salvato ripristinato (valore, chiusura prova, barra)` | evidenza: motivo: barraGone=false empty=true valore=true | shot:orari-annulla-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-barra-misure** | orari/modificato | notebook-1280/chiaro | misurato `allineamento colonna=false | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `testo sx pulsanti dx` | evidenza: motivo: allineamento barra/colonna/testo (box bar=256,1024) | shot:orari-barra-misure-notebook-1280-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-festivita** | orari/festivita | telefono-390/chiaro | misurato `step0:true step1:false step2:true step3:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  | timeInputs:6 | salvaVis:true` | atteso `step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti` | evidenza: motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true | shot:orari-festivita-telefono-390-chiaro | alert:Le festività del 2026 sono già tutte presenti. |  | http://localhost:3100/app/hours
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/chiaro | misurato `prima:null dopo:null (nessun toggle on) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `dopo click Lun: data-state=on e token primary` | evidenza: click esplicito su Lunedì da baseline senza giorni attivi | motivo: toggle o colori non conformi | shot:orari-giorno-selezionato-chiaro | alert:— | http://localhost:3100/app/hours
- **orari-giorno-selezionato** | orari/iniziale | telefono-390/scuro | misurato `prima:null dopo:null (nessun toggle on) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:true` | atteso `dopo click Lun: data-state=on e token primary` | evidenza: click esplicito su Lunedì da baseline senza giorni attivi | motivo: toggle o colori non conformi | shot:orari-giorno-selezionato-scuro | alert:— | http://localhost:3100/app/hours
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `info:false lunch:12:30 timeInputs:6 hasLunchField:1 gone:true | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Orari salvati Servizi del ristorante Orario di inizio e fin | timeInputs:6 | salvaVis:false` | atteso `avviso Orari non configurati; 4 campi ora visibili e vuoti; scompare dopo save` | evidenza: clear-services | motivo: manca avviso | shot:orari-non-configurato-telefono-390-chiaro | alert:Orari salvati |  | http://localhost:3100/app/hours
- **orari-stato-iniziale** | orari/iniziale | telefono-390/chiaro | misurato `saveBar:0 alert:1 status:` | atteso `nessuna barra né avviso su pagina appena caricata` | evidenza: /app/hours

### AVVISO
- (nessuno)

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
- **AMBIENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
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
| AMBIENTE | NON PROVATO (2/3) |
| C1 | OK (52/52) |
| C2 | OK (46/46) |
| C2-mouse | OK (26/26) |
| C3 | OK (52/52) |
| C9 | OK (8/8) |
| orari-annulla | FALLITO (0/1) |
| orari-barra-misure | FALLITO (1/2) |
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
| orari-giorno-selezionato | FALLITO (0/2) |
| orari-intestazione-anno | OK (2/2) |
| orari-modificato-barra | OK (2/2) |
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
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| AMBIENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| orari-errore-server | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-stato-iniziale | orari/iniziale | telefono-390/chiaro | FALLITO | saveBar:0 alert:1 status: | nessuna barra né avviso su pagina appena caricata | /app/hours |
| orari-giorno-selezionato | orari/iniziale | telefono-390/chiaro | FALLITO | prima:null dopo:null (nessun toggle on) \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | dopo click Lun: data-state=on e token primary | click esplicito su Lunedì da baseline senza giorni attivi \| motivo: toggle o colori non conformi \| shot:orari-giorno-selezionato-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-giorno-selezionato | orari/iniziale | telefono-390/scuro | FALLITO | prima:null dopo:null (nessun toggle on) \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | dopo click Lun: data-state=on e token primary | click esplicito su Lunedì da baseline senza giorni attivi \| motivo: toggle o colori non conformi \| shot:orari-giorno-selezionato-scuro \| alert:— \| http://localhost:3100/app/hours |
| orari-barra-misure | orari/modificato | notebook-1280/chiaro | FALLITO | allineamento colonna=false \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | testo sx pulsanti dx | motivo: allineamento barra/colonna/testo (box bar=256,1024) \| shot:orari-barra-misure-notebook-1280-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-annulla | orari/modificato | telefono-390/chiaro | FALLITO | valoreRipristinato:true chiusuraAssente:true barraAssente:false \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:true | stato salvato ripristinato (valore, chiusura prova, barra) | motivo: barraGone=false empty=true valore=true \| shot:orari-annulla-telefono-390-chiaro \| alert:— \| http://localhost:3100/app/hours |
| orari-festivita | orari/festivita | telefono-390/chiaro | FALLITO | step0:true step1:false step2:true step3:true \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Le festività del 2026 sono già tutte presenti. Servizi del  \| timeInputs:6 \| salvaVis:true | step0 anno invalido; step1 messaggio 13 festività 2026; step2 righe; step3 già presenti | motivo: step1 (Aggiunte 13 festività)=false; altri=true,false,true,true \| shot:orari-festivita-telefono-390-chiaro \| alert:Le festività del 2026 sono già tutte presenti. \|  \| http://localhost:3100/app/hours |
| orari-non-configurato | orari/non-configurato | telefono-390/chiaro | FALLITO | info:false lunch:12:30 timeInputs:6 hasLunchField:1 gone:true \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Orari salvati Servizi del ristorante Orario di inizio e fin \| timeInputs:6 \| salvaVis:false | avviso Orari non configurati; 4 campi ora visibili e vuoti; scompare dopo save | clear-services \| motivo: manca avviso \| shot:orari-non-configurato-telefono-390-chiaro \| alert:Orari salvati \|  \| http://localhost:3100/app/hours |
| orari-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-errore-server: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-errore-caricamento: simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)
- orari-console: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- Global iniziale (snapshot): weeklyClosedDays=[]; services=2; closures=3; bnb=presente
