# Esito verifica — locale-prod — 2026-10-11
Commit: b567624420e0 · Lanciatore: 3.1.4 (L2) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.5.json v3 · Durata: 12 min 2 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 907 · FALLITO: 9 · AVVISO: 0 · NON PROVATO: 20 · Controlli distinti nel JSON corrente: 35

## Pacchetto: accesso
Righe: 183 · OK: 183 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 392 · OK: 383 · FALLITO: 8

### FALLITO (shell)
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/chiaro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/scuro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/sistema-chiaro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/sistema-scuro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/chiaro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/scuro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/sistema-chiaro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/sistema-scuro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations

## Pacchetto: orari
Righe: 334 · OK: 331 · FALLITO: 1

### FALLITO (orari)
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `services.length=2 dopo clear (atteso 0) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:false` | atteso `clear-services azzera services nel Global` | evidenza: clear:{"cleared":true,"servicesBefore":2,"servicesAfter":2} services.length=2 | serviziHTML:(sezione servizi non trovata) | avvisi main: 0 | shot:orari-non-configurato-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours

## Pacchetto: completo
Righe: 27 · OK: 10 · FALLITO: 0

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
- **AMBIENTE**: OK in 4/4 combinazioni
- **avviso-login-password-aggiornata**: OK in 4/4 combinazioni
- **avviso-login-rifiutato**: OK in 4/4 combinazioni
- **C1**: OK in 108/108 combinazioni
- **C2**: OK in 126/126 combinazioni
- **C2-mouse**: OK in 42/42 combinazioni
- **C3**: OK in 168/168 combinazioni
- **C3-cambio-sistema**: OK in 4/4 combinazioni
- **C3-no-lampo**: OK in 48/48 combinazioni
- **C9**: OK in 10/10 combinazioni
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
- **orari-annulla**: OK in 1/1 combinazioni
- **orari-barra-misure**: OK in 2/2 combinazioni
- **orari-barre-agganciate**: OK in 2/2 combinazioni
- **orari-campi-ora**: OK in 1/1 combinazioni
- **orari-chiusure-foglio**: OK in 2/2 combinazioni
- **orari-colonna**: OK in 2/2 combinazioni
- **orari-dati**: OK in 1/1 combinazioni
- **orari-errore-validazione**: OK in 2/2 combinazioni
- **orari-festivita**: OK in 1/1 combinazioni
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
- **orari-uscita**: OK in 2/2 combinazioni
- **orari-validazione-server**: OK in 1/1 combinazioni
- **reset-senza-token-vuoto**: OK in 2/2 combinazioni
- **shell-barra-alta**: OK in 36/36 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 36/36 combinazioni
- **shell-menu-utente**: OK in 2/2 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 60/60 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-segnaposto**: OK in 2/2 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-percorso-voce-attiva**: OK in 52/60 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **orari-non-configurato** | orari/non-configurato | telefono-390/chiaro | misurato `services.length=2 dopo clear (atteso 0) | pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  | timeInputs:6 | salvaVis:false` | atteso `clear-services azzera services nel Global` | evidenza: clear:{"cleared":true,"servicesBefore":2,"servicesAfter":2} services.length=2 | serviziHTML:(sezione servizi non trovata) | avvisi main: 0 | shot:orari-non-configurato-telefono-390-chiaro | alert:— | http://localhost:3100/app/hours
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/chiaro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/scuro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/sistema-chiaro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-menu | telefono-390/sistema-scuro | misurato `crumbs=Menù›Piatti; active=` | atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` | evidenza: /app/menu
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/chiaro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/scuro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/sistema-chiaro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations
- **shell-percorso-voce-attiva** | shell/segnaposto-reservations | telefono-390/sistema-scuro | misurato `crumbs=Prenotazioni›Elenco; active=` | atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` | evidenza: /app/reservations

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
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
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
| AMBIENTE | OK (4/4) |
| C1 | OK (108/108) |
| C2 | OK (126/126) |
| C2-mouse | OK (42/42) |
| C3 | OK (168/168) |
| C3-cambio-sistema | OK (4/4) |
| C3-no-lampo | OK (48/48) |
| C9 | OK (10/10) |
| orari-annulla | OK (1/1) |
| orari-barra-misure | OK (2/2) |
| orari-barre-agganciate | OK (2/2) |
| orari-campi-ora | OK (1/1) |
| orari-chiusure-foglio | OK (2/2) |
| orari-colonna | OK (2/2) |
| orari-console | NON PROVATO (0/1) |
| orari-dati | OK (1/1) |
| orari-errore-caricamento | NON PROVATO (0/1) |
| orari-errore-server | NON PROVATO (0/1) |
| orari-errore-validazione | OK (2/2) |
| orari-festivita | OK (1/1) |
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
| orari-uscita | OK (2/2) |
| orari-validazione-server | OK (1/1) |
| shell-admin-link | NON PROVATO (0/8) |
| verify-link-valido | NON PROVATO (0/9) |

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
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| orari-errore-server | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200) |
| orari-non-configurato | orari/non-configurato | telefono-390/chiaro | FALLITO | services.length=2 dopo clear (atteso 0) \| pagina:Apri o chiudi il menu Orari Orari Orari di vietnamonamour.com: ristorante e B&B. Servizi del ristorante Orario di inizio e fine di Pranzo e  \| timeInputs:6 \| salvaVis:false | clear-services azzera services nel Global | clear:{"cleared":true,"servicesBefore":2,"servicesAfter":2} services.length=2 \| serviziHTML:(sezione servizi non trovata) \| avvisi main: 0 \| shot:orari-non-configurato-telefono-390-chiaro \| alert:— \| http://localhost:3100/app/hours |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/chiaro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/scuro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/sistema-chiaro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/sistema-scuro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/chiaro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/scuro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/sistema-chiaro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/sistema-scuro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
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
- Regressione shell 8.2 (L2) nella stessa esecuzione locale-prod
- shell-menu trigger telefono-390: mountEvents=0 remounts=0 postHydration=0 (observe 2800ms, hydration 1200ms)
- WebKit 26.0 su http://localhost:3100 (diagnosi login prod): URL finale=http://localhost:3100/app/login; payload-token: presente secure=true httpOnly=true sameSite=Lax; Set-Cookie login: (nessun Set-Cookie catturato sulla risposta login)
- Tempo massimo ambiente scaduto (12 min, configurabile con UI_VERIFY_TIMEOUT_MS o UI_VERIFY_TIMEOUT_<AMBIENTE>_MS): esecuzione interrotta.
