# Esito verifica — locale-prod — 2026-10-17
Commit: 1969b79ccd3a · Lanciatore: 3.3.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 20 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 73 · FALLITO: 4 · AVVISO: 0 · NON PROVATO: 44 · Controlli distinti nel JSON corrente: 38

## Pacchetto: accesso
Righe: 4 · OK: 4 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 58 · OK: 54 · FALLITO: 4

### FALLITO (shell)
- **home-righe-di-stato** | shell/home | telefono-390/chiaro | misurato `nessuna riga sulla scheda Menù` | atteso `la scheda Menù ha la riga di stato` | evidenza: /app
- **home-righe-di-stato** | shell/home | notebook-1280/chiaro | misurato `nessuna riga sulla scheda Menù` | atteso `la scheda Menù ha la riga di stato` | evidenza: /app
- **home-testi** | shell/home | telefono-390/chiaro | misurato `{"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | atteso `{"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | evidenza: /app
- **home-testi** | shell/home | notebook-1280/chiaro | misurato `{"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | atteso `{"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | evidenza: /app

## Pacchetto: menu
Righe: 36 · OK: 11 · FALLITO: 0

### FALLITO (menu)
- (nessuno)

## Pacchetto: completo
Righe: 23 · OK: 4 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **nav-briciole**: OK in 2/2 combinazioni
- **nav-casi-unit**: OK in 1/1 combinazioni
- **nav-icone**: OK in 2/2 combinazioni
- **nav-titoli-pagina**: OK in 1/1 combinazioni
- **nav-voce-attiva**: OK in 2/2 combinazioni
- **nav-voci-menu**: OK in 2/2 combinazioni
- **RICOMPILA-ASSENTE**: OK in 1/1 combinazioni
- **AMBIENTE**: OK in 4/5 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 12/13 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 18/19 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 6/7 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 12/13 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C9**: OK in 4/5 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-colonne**: OK in 2/3 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-larghezza**: OK in 4/5 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **home-righe-di-stato** | shell/home | telefono-390/chiaro | misurato `nessuna riga sulla scheda Menù` | atteso `la scheda Menù ha la riga di stato` | evidenza: /app
- **home-righe-di-stato** | shell/home | notebook-1280/chiaro | misurato `nessuna riga sulla scheda Menù` | atteso `la scheda Menù ha la riga di stato` | evidenza: /app
- **home-testi** | shell/home | telefono-390/chiaro | misurato `{"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | atteso `{"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | evidenza: /app
- **home-testi** | shell/home | notebook-1280/chiaro | misurato `{"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | atteso `{"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]}` | evidenza: /app

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
- **piatti-testi** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-colonna-elenco** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-azioni-pagina** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-righe-azioni** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-terminato** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-disabilita** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-elimina-libero** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-elimina-registro** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-elimina-bloccato** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-elimina-permessi** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-modulo-campi** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-modulo-validazione** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-modulo-inglese** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-modulo-footer** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-tassonomie** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-persistenza** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-filtri-ricerca** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-stati-ui** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **piatti-nomi-accessibili** | piatti | — | misurato `—` | atteso `—` | evidenza: schermata non ancora implementata
- **NO-OVERRIDE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-altezza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-casi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-testo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | NON PROVATO (4/5) |
| C1 | NON PROVATO (12/13) |
| C2 | NON PROVATO (18/19) |
| C2-mouse | NON PROVATO (6/7) |
| C3 | NON PROVATO (12/13) |
| C9 | NON PROVATO (4/5) |
| NO-OVERRIDE | NON PROVATO (0/1) |
| RICOMPILA-ASSENTE | OK (1/1) |
| home-riga-menu-altezza | NON PROVATO (0/1) |
| home-riga-menu-casi | NON PROVATO (0/1) |
| home-riga-menu-stati | NON PROVATO (0/1) |
| home-riga-menu-testo | NON PROVATO (0/1) |
| nav-briciole | OK (2/2) |
| nav-casi-unit | OK (1/1) |
| nav-icone | OK (2/2) |
| nav-titoli-pagina | OK (1/1) |
| nav-voce-attiva | OK (2/2) |
| nav-voci-menu | OK (2/2) |
| piatti-azioni-pagina | NON PROVATO (0/1) |
| piatti-colonna-elenco | NON PROVATO (0/1) |
| piatti-console | NON PROVATO (0/1) |
| piatti-disabilita | NON PROVATO (0/1) |
| piatti-elimina-bloccato | NON PROVATO (0/1) |
| piatti-elimina-libero | NON PROVATO (0/1) |
| piatti-elimina-permessi | NON PROVATO (0/1) |
| piatti-elimina-registro | NON PROVATO (0/1) |
| piatti-filtri-ricerca | NON PROVATO (0/1) |
| piatti-modulo-campi | NON PROVATO (0/1) |
| piatti-modulo-footer | NON PROVATO (0/1) |
| piatti-modulo-inglese | NON PROVATO (0/1) |
| piatti-modulo-validazione | NON PROVATO (0/1) |
| piatti-nomi-accessibili | NON PROVATO (0/1) |
| piatti-persistenza | NON PROVATO (0/1) |
| piatti-righe-azioni | NON PROVATO (0/1) |
| piatti-stati-ui | NON PROVATO (0/1) |
| piatti-tassonomie | NON PROVATO (0/1) |
| piatti-terminato | NON PROVATO (0/1) |
| piatti-testi | NON PROVATO (0/1) |

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
| home-testi | shell/home | telefono-390/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]} | {"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]} | /app |
| home-righe-di-stato | shell/home | telefono-390/chiaro | FALLITO | nessuna riga sulla scheda Menù | la scheda Menù ha la riga di stato | /app |
| home-testi | shell/home | notebook-1280/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]} | {"h1":"Oggi","desc":"Situazione di oggi e accesso alle sezioni.","cards":[{"titolo":"Prenotazioni","desc":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","desc":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","desc":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}]} | /app |
| home-righe-di-stato | shell/home | notebook-1280/chiaro | FALLITO | nessuna riga sulla scheda Menù | la scheda Menù ha la riga di stato | /app |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| piatti-testi | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-colonna-elenco | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-azioni-pagina | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-righe-azioni | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-terminato | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-disabilita | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-elimina-libero | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-elimina-registro | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-elimina-bloccato | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-elimina-permessi | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-modulo-campi | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-modulo-validazione | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-modulo-inglese | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-modulo-footer | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-tassonomie | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-persistenza | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-filtri-ricerca | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-stati-ui | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| piatti-nomi-accessibili | piatti | — | NON PROVATO | — | — | schermata non ancora implementata |
| NO-OVERRIDE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-altezza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-casi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-testo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- NO-OVERRIDE: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-altezza: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-casi: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-stati: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-testo: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-console: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
