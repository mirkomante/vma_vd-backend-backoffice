# Esito verifica — locale-dev — 2026-10-11
Commit: b567624420e0 · Lanciatore: 3.1.4 (L2) · Browser: Chromium 140.0.7339.186; WebKit 26.0 · Controlli: controlli-8.5.json v3 · Durata: 2 min 48 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 389 · FALLITO: 8 · AVVISO: 0 · NON PROVATO: 1 · Controlli distinti nel JSON corrente: 5

## Pacchetto: shell
Righe: 392 · OK: 384 · FALLITO: 8

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
Righe: 6 · OK: 5 · FALLITO: 0

### FALLITO (orari)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **C1**: OK in 24/24 combinazioni
- **C2**: OK in 60/60 combinazioni
- **C2-mouse**: OK in 12/12 combinazioni
- **C3**: OK in 60/60 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-colonne**: OK in 5/5 combinazioni
- **home-nessuna-riga-di-stato**: OK in 5/5 combinazioni
- **home-testi**: OK in 5/5 combinazioni
- **orari-console**: OK in 2/2 combinazioni
- **orari-errore-caricamento**: OK in 1/1 combinazioni
- **orari-errore-server**: OK in 1/1 combinazioni
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
- **shell-uscita**: OK in 1/1 combinazioni
- **webkit-giro-essenziale**: OK in 1/1 combinazioni
- **shell-percorso-voce-attiva**: OK in 52/60 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
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
- **orari-dati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| orari-console | OK (2/2) |
| orari-dati | NON PROVATO (0/1) |
| orari-errore-caricamento | OK (1/1) |
| orari-errore-server | OK (1/1) |
| webkit-giro-essenziale | OK (1/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/chiaro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/scuro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/sistema-chiaro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | telefono-390/sistema-scuro | FALLITO | crumbs=Menù›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/chiaro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/scuro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/sistema-chiaro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | telefono-390/sistema-scuro | FALLITO | crumbs=Prenotazioni›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| orari-dati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-dati: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- locale-dev L2: regressione shell 8.2 (stesso rapporto)
- shell-menu trigger telefono-390: mountEvents=0 remounts=0 postHydration=0 (observe 2800ms, hydration 1200ms)
- WebKit 26.0 su http://localhost:3000 (diagnosi login prod): URL finale=http://localhost:3000/app; payload-token: presente secure=false httpOnly=true sameSite=Lax; Set-Cookie login: (nessun Set-Cookie catturato sulla risposta login)
