# Esito verifica — locale-prod — 2026-10-17
Commit: dadc3898ded2 · Lanciatore: 3.3.0 (L2) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 1 min 32 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 445 · FALLITO: 1 · AVVISO: 0 · NON PROVATO: 42 · Controlli distinti nel JSON corrente: 22

## Pacchetto: accesso
Righe: 18 · OK: 18 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 401 · OK: 398 · FALLITO: 1

### FALLITO (shell)
- **shell-menu-voci** | shell/home | notebook-1280/chiaro | misurato `{"groups":["Menù","Orari","Prenotazioni"],"itemsByGroup":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":4}` | atteso `{"groups":["Menù","Orari","Prenotazioni"],"items":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":3}` | evidenza: /app

## Pacchetto: menu
Righe: 23 · OK: 17 · FALLITO: 0

### FALLITO (menu)
- (nessuno)

## Pacchetto: completo
Righe: 46 · OK: 12 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **C3-cambio-sistema**: OK in 6/6 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-riga-menu-altezza**: OK in 2/2 combinazioni
- **home-riga-menu-casi**: OK in 1/1 combinazioni
- **home-riga-menu-testo**: OK in 4/4 combinazioni
- **nav-briciole**: OK in 2/2 combinazioni
- **nav-casi-unit**: OK in 1/1 combinazioni
- **nav-icone**: OK in 2/2 combinazioni
- **nav-titoli-pagina**: OK in 1/1 combinazioni
- **nav-voce-attiva**: OK in 2/2 combinazioni
- **nav-voci-menu**: OK in 2/2 combinazioni
- **shell-barra-alta**: OK in 36/36 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 36/36 combinazioni
- **shell-nomi-accessibili**: OK in 60/60 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 60/60 combinazioni
- **shell-segnaposto**: OK in 1/1 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **AMBIENTE**: OK in 12/13 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 24/25 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 60/61 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 12/13 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 60/61 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C9**: OK in 12/13 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-colonne**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-larghezza**: OK in 8/9 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-righe-di-stato**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-testi**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-menu-utente**: OK in 2/4 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **shell-menu-voci** | shell/home | notebook-1280/chiaro | misurato `{"groups":["Menù","Orari","Prenotazioni"],"itemsByGroup":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":4}` | atteso `{"groups":["Menù","Orari","Prenotazioni"],"items":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":3}` | evidenza: /app

### AVVISO
- (nessuno)

### NON PROVATO
- **AMBIENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C1** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C2** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C2-mouse** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C3** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C9** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-colonne** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-larghezza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-righe-di-stato** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-testi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
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
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **shell-menu-utente** | shell/home (icone Admin) | telefono-390/chiaro | misurato `voce «Vai all'Admin» assente con utente manager` | atteso `due icone svg (pannello + freccia esterna) se presente` | evidenza: A24; utente di prova senza canAccessAdminPanel
- **shell-menu-utente** | shell/home (icone Admin) | notebook-1280/chiaro | misurato `voce «Vai all'Admin» assente con utente manager` | atteso `due icone svg (pannello + freccia esterna) se presente` | evidenza: A24; utente di prova senza canAccessAdminPanel
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **nav-pannello-telefono** | navigazione | telefono-390/chiaro | misurato `—` | atteso `altezza pannello con 8 voci Menù` | evidenza: voci non ancora tutte accese
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **NO-OVERRIDE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **RICOMPILA-ASSENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **RICOMPILA-PRESENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | NON PROVATO (12/13) |
| C1 | NON PROVATO (24/25) |
| C2 | NON PROVATO (60/61) |
| C2-mouse | NON PROVATO (12/13) |
| C3 | NON PROVATO (60/61) |
| C3-cambio-sistema | OK (6/6) |
| C3-no-lampo | NON PROVATO (0/1) |
| C9 | NON PROVATO (12/13) |
| NO-OVERRIDE | NON PROVATO (0/1) |
| RICOMPILA-ASSENTE | NON PROVATO (0/1) |
| RICOMPILA-PRESENTE | NON PROVATO (0/1) |
| home-riga-menu-altezza | OK (2/2) |
| home-riga-menu-casi | OK (1/1) |
| home-riga-menu-stati | NON PROVATO (0/1) |
| home-riga-menu-testo | OK (4/4) |
| nav-briciole | OK (2/2) |
| nav-casi-unit | OK (1/1) |
| nav-icone | OK (2/2) |
| nav-pannello-telefono | NON PROVATO (0/1) |
| nav-titoli-pagina | OK (1/1) |
| nav-voce-attiva | OK (2/2) |
| nav-voci-menu | OK (2/2) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| AMBIENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C1 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C2 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C2-mouse | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C3 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C9 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-colonne | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-larghezza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-righe-di-stato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-testi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| shell-admin-link | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
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
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| shell-menu-utente | shell/home (icone Admin) | telefono-390/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| shell-menu-voci | shell/home | notebook-1280/chiaro | FALLITO | {"groups":["Menù","Orari","Prenotazioni"],"itemsByGroup":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":4} | {"groups":["Menù","Orari","Prenotazioni"],"items":{"Menù":["Piatti"],"Orari":["Orari"],"Prenotazioni":["Elenco"]},"navLinks":3} | /app |
| shell-menu-utente | shell/home (icone Admin) | notebook-1280/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| nav-pannello-telefono | navigazione | telefono-390/chiaro | NON PROVATO | — | altezza pannello con 8 voci Menù | voci non ancora tutte accese |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| NO-OVERRIDE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| RICOMPILA-ASSENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| RICOMPILA-PRESENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- C3-no-lampo: controllo non eseguito dal lanciatore in questa esecuzione
- NO-OVERRIDE: controllo non eseguito dal lanciatore in questa esecuzione
- RICOMPILA-ASSENTE: controllo non eseguito dal lanciatore in questa esecuzione
- RICOMPILA-PRESENTE: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-stati: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
