# Esito verifica — locale-dev — 2026-10-11
Commit: 2be902544741 · Lanciatore: 3.1.3 (L2) · Browser: Chromium 140.0.7339.186; WebKit 26.0 · Controlli: controlli-8.5.json v3 · Durata: 3 min 57 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 507 · FALLITO: 2 · AVVISO: 4 · NON PROVATO: 1 · Controlli distinti nel JSON corrente: 5

## Pacchetto: shell
Righe: 508 · OK: 502 · FALLITO: 2

### FALLITO (shell)
- **runtime-shell** | shell/home | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })
` | atteso `iterazione completata` | evidenza: /app
- **shell-segnaposto** | shell/segnaposto-hours | telefono-390/chiaro | misurato `Orari / Orari di vietnamonamour.com: ristorante ` | atteso `Orari + descrizione segnaposto` | evidenza: /app/hours

## Pacchetto: orari
Righe: 6 · OK: 5 · FALLITO: 0

### FALLITO (orari)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **C1**: OK in 32/32 combinazioni
- **C2**: OK in 80/80 combinazioni
- **C2-mouse**: OK in 16/16 combinazioni
- **C3**: OK in 80/80 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-colonne**: OK in 5/5 combinazioni
- **home-nessuna-riga-di-stato**: OK in 5/5 combinazioni
- **home-testi**: OK in 5/5 combinazioni
- **orari-console**: OK in 2/2 combinazioni
- **orari-errore-caricamento**: OK in 1/1 combinazioni
- **orari-errore-server**: OK in 1/1 combinazioni
- **shell-barra-alta**: OK in 48/48 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-menu-utente**: OK in 2/2 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 79/79 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 79/79 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **webkit-giro-essenziale**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 44/48 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-segnaposto**: OK in 2/3 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **runtime-shell** | shell/home | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })
` | atteso `iterazione completata` | evidenza: /app
- **shell-segnaposto** | shell/segnaposto-hours | telefono-390/chiaro | misurato `Orari / Orari di vietnamonamour.com: ristorante ` | atteso `Orari + descrizione segnaposto` | evidenza: /app/hours

### AVVISO
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/chiaro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/scuro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/sistema-chiaro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours
- **shell-margine-contenuto** | shell/segnaposto-hours | notebook-1280/sistema-scuro | misurato `224 px` | atteso `24 px` | evidenza: /app/hours

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
| runtime-shell | shell/home | telefono-390/chiaro | FALLITO | locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })  | iterazione completata | /app |
| shell-segnaposto | shell/segnaposto-hours | telefono-390/chiaro | FALLITO | Orari / Orari di vietnamonamour.com: ristorante  | Orari + descrizione segnaposto | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/chiaro | AVVISO | 224 px | 24 px | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/scuro | AVVISO | 224 px | 24 px | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/sistema-chiaro | AVVISO | 224 px | 24 px | /app/hours |
| shell-margine-contenuto | shell/segnaposto-hours | notebook-1280/sistema-scuro | AVVISO | 224 px | 24 px | /app/hours |
| orari-dati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- orari-dati: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- locale-dev L2: regressione shell 8.2 (stesso rapporto)
- shell shell/home telefono-390/chiaro: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Apri o chiudi il menu' })

- WebKit 26.0 su http://localhost:3000 (diagnosi login prod): URL finale=http://localhost:3000/app; payload-token: presente secure=false httpOnly=true sameSite=Lax; Set-Cookie login: (nessun Set-Cookie catturato sulla risposta login)
