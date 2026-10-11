# Esito verifica — locale-prod — 2026-10-11
Commit: a6d9b3c8e8e1 · Lanciatore: 2.2.0 · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.2.json v2 · Durata: 5 min 30 s

## Riepilogo
OK: 2680 · FALLITO: 1 · AVVISO: 0 · NON PROVATO: 2 · Controlli distinti nel JSON: 48

## Esiti compatti

### OK (raggruppati)
- **acc-avvisi**: OK in 160/160 combinazioni
- **acc-centratura**: OK in 160/160 combinazioni
- **acc-collegamenti-sottolineati**: OK in 160/160 combinazioni
- **acc-colonna**: OK in 120/120 combinazioni
- **acc-fuori-shell**: OK in 160/160 combinazioni
- **acc-icona**: OK in 160/160 combinazioni
- **acc-margine**: OK in 80/80 combinazioni
- **acc-padding-scheda**: OK in 160/160 combinazioni
- **acc-spazi-16**: OK in 160/160 combinazioni
- **AMBIENTE**: OK in 1/1 combinazioni
- **avviso-forgot-inviata**: OK in 16/16 combinazioni
- **avviso-login-password-aggiornata**: OK in 16/16 combinazioni
- **avviso-login-rifiutato**: OK in 16/16 combinazioni
- **avviso-reset-link-scaduto**: OK in 16/16 combinazioni
- **avviso-reset-senza-token**: OK in 16/16 combinazioni
- **avviso-verify-senza-token**: OK in 16/16 combinazioni
- **avviso-verify-token-non-valido**: OK in 16/16 combinazioni
- **C1**: OK in 152/152 combinazioni
- **C2**: OK in 160/160 combinazioni
- **C2-mouse**: OK in 56/56 combinazioni
- **C3**: OK in 240/240 combinazioni
- **C3-cambio-sistema**: OK in 1/1 combinazioni
- **C3-no-lampo**: OK in 80/80 combinazioni
- **C9**: OK in 1/1 combinazioni
- **forgot-testi**: OK in 16/16 combinazioni
- **forgot-titolo-documento**: OK in 32/32 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-colonne**: OK in 5/5 combinazioni
- **home-nessuna-riga-di-stato**: OK in 5/5 combinazioni
- **home-testi**: OK in 5/5 combinazioni
- **login-campi**: OK in 16/16 combinazioni
- **login-gerarchia**: OK in 16/16 combinazioni
- **login-link-destinazioni**: OK in 16/16 combinazioni
- **login-testi**: OK in 16/16 combinazioni
- **login-titolo-documento**: OK in 48/48 combinazioni
- **reset-campi**: OK in 32/32 combinazioni
- **reset-senza-token-vuoto**: OK in 1/1 combinazioni
- **reset-testi**: OK in 32/32 combinazioni
- **shell-barra-alta**: OK in 48/48 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 48/48 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 80/80 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 80/80 combinazioni
- **shell-segnaposto**: OK in 3/3 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **verify-testi**: OK in 32/32 combinazioni
- **shell-menu-utente**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO
- **shell-menu-utente** (1 combinazioni): es. `menu non apribile: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM
Call log:
  - attempting scroll into view action
    - waiting for element to be stable
    - element is not stabl` · atteso `Tema+Esci, no Admin` · shell/home · telefono-390/chiaro

### AVVISO
- (nessuno)

### NON PROVATO
- **verify-link-valido** (—, —): misurato `—` · atteso `—` · facoltativo: token reale monouso non ottenuto
- **shell-admin-link** (—, —): misurato `—` · atteso `—` · NON PROVABILE con utente solo App (adminRole none)

## Tabella controlli distinti (JSON)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (1/1) |
| C1 | OK (152/152) |
| C2 | OK (160/160) |
| C2-mouse | OK (56/56) |
| C3 | OK (240/240) |
| C3-cambio-sistema | OK (1/1) |
| C3-no-lampo | OK (80/80) |
| C9 | OK (1/1) |
| acc-avvisi | OK (160/160) |
| acc-centratura | OK (160/160) |
| acc-collegamenti-sottolineati | OK (160/160) |
| acc-colonna | OK (120/120) |
| acc-fuori-shell | OK (160/160) |
| acc-icona | OK (160/160) |
| acc-margine | OK (80/80) |
| acc-padding-scheda | OK (160/160) |
| acc-spazi-16 | OK (160/160) |
| forgot-testi | OK (16/16) |
| forgot-titolo-documento | OK (32/32) |
| g1 | OK (1/1) |
| g2 | OK (3/3) |
| home-colonne | OK (5/5) |
| home-nessuna-riga-di-stato | OK (5/5) |
| home-testi | OK (5/5) |
| login-campi | OK (16/16) |
| login-gerarchia | OK (16/16) |
| login-link-destinazioni | OK (16/16) |
| login-testi | OK (16/16) |
| login-titolo-documento | OK (48/48) |
| reset-campi | OK (32/32) |
| reset-senza-token-vuoto | OK (1/1) |
| reset-testi | OK (32/32) |
| shell-admin-link | NON PROVATO (0/1) |
| shell-barra-alta | OK (48/48) |
| shell-blocco-in-cima | OK (1/1) |
| shell-blocco-utente | OK (1/1) |
| shell-margine-contenuto | OK (48/48) |
| shell-menu-utente | FALLITO (1/2) |
| shell-menu-voci | OK (1/1) |
| shell-nomi-accessibili | OK (80/80) |
| shell-passaggio-768 | OK (8/8) |
| shell-percorso-voce-attiva | OK (80/80) |
| shell-segnaposto | OK (3/3) |
| shell-sticky | OK (8/8) |
| shell-tema-scelta | OK (1/1) |
| shell-uscita | OK (1/1) |
| verify-link-valido | NON PROVATO (0/1) |
| verify-testi | OK (32/32) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| shell-menu-utente | shell/home | telefono-390/chiaro | FALLITO | menu non apribile: locator.scrollIntoViewIfNeeded: Element is not attached to the DOM Call log:   - attempting scroll into view action     - waiting for element to be stable     - element is not stable   - retrying scroll into view action     - waiting for element to be stable  | Tema+Esci, no Admin | /app |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)

## Anomalie dell'ambiente
- WebKit 26.0 su http://localhost:3100 (diagnosi login prod): URL finale=http://localhost:3100/app/login; payload-token: presente secure=true httpOnly=true sameSite=Lax; Set-Cookie login: (nessun Set-Cookie catturato sulla risposta login)
