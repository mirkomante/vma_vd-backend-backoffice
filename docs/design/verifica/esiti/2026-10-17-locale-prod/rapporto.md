# Esito verifica — locale-prod — 2026-10-17
Commit: 1a422dab7629 · Lanciatore: 3.4.0 (L2) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.2.json v4 · Durata: 2 min 20 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 582 · FALLITO: 11 · AVVISO: 19 · NON PROVATO: 64 · Controlli distinti nel JSON corrente: 29

## Pacchetto: accesso
Righe: 34 · OK: 34 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 401 · OK: 387 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 169 · OK: 140 · FALLITO: 11

### FALLITO (menu)
- **C2** | piatti/modulo-allergeni | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/modulo-allergeni | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/nuovo | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo-errori | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **C2** | piatti/nuovo-errori | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **piatti-azioni-pagina** | piatti/elenco | telefono-390/chiaro | misurato `{"h":44,"w":326,"inline":false,"mainW":390}` | atteso `pulsante full-width ≥44px` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `fallback en name` | atteso `traduzione` | evidenza: /app/menu
- **piatti-ordine-100** | piatti/piu-di-100 | notebook-1280/chiaro | misurato `banner 100/101` | atteso `limit 100` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `categorie UI` | atteso `tassonomie read-only` | evidenza: /app/menu
- **piatti-terminato** | piatti | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('combobox', { name: 'Stato' })
` | atteso `flusso senza eccezione` | evidenza: /app/menu

## Pacchetto: completo
Righe: 72 · OK: 21 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **C3-cambio-sistema**: OK in 13/13 combinazioni
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
- **piatti-confronto-visivo**: OK in 1/1 combinazioni
- **piatti-disabilita**: OK in 1/1 combinazioni
- **piatti-elimina-bloccato**: OK in 1/1 combinazioni
- **piatti-elimina-libero**: OK in 1/1 combinazioni
- **piatti-elimina-permessi**: OK in 1/1 combinazioni
- **piatti-elimina-registro**: OK in 1/1 combinazioni
- **piatti-filtri-ricerca**: OK in 1/1 combinazioni
- **piatti-modulo-campi**: OK in 2/2 combinazioni
- **piatti-modulo-footer**: OK in 1/1 combinazioni
- **piatti-modulo-validazione**: OK in 1/1 combinazioni
- **piatti-nomi-accessibili**: OK in 1/1 combinazioni
- **piatti-persistenza**: OK in 1/1 combinazioni
- **piatti-righe-azioni**: OK in 1/1 combinazioni
- **piatti-testi**: OK in 1/1 combinazioni
- **RICOMPILA-ASSENTE**: OK in 1/1 combinazioni
- **shell-barra-alta**: OK in 36/36 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 60/60 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 60/60 combinazioni
- **shell-segnaposto**: OK in 1/1 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **AMBIENTE**: OK in 21/22 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 63/64 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 74/81 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 25/32 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 99/100 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C9**: OK in 21/22 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-colonne**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-larghezza**: OK in 8/9 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-righe-di-stato**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-testi**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **piatti-colonna-elenco**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **piatti-azioni-pagina**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-margine-contenuto**: OK in 24/36 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-menu-utente**: OK in 2/4 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **C2** | piatti/modulo-allergeni | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/modulo-allergeni | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/nuovo | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo-errori | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **C2** | piatti/nuovo-errori | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **piatti-azioni-pagina** | piatti/elenco | telefono-390/chiaro | misurato `{"h":44,"w":326,"inline":false,"mainW":390}` | atteso `pulsante full-width ≥44px` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `fallback en name` | atteso `traduzione` | evidenza: /app/menu
- **piatti-ordine-100** | piatti/piu-di-100 | notebook-1280/chiaro | misurato `banner 100/101` | atteso `limit 100` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `categorie UI` | atteso `tassonomie read-only` | evidenza: /app/menu
- **piatti-terminato** | piatti | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('combobox', { name: 'Stato' })
` | atteso `flusso senza eccezione` | evidenza: /app/menu

### AVVISO
- **piatti-colonna-elenco** | piatti/elenco | telefono-390/chiaro | misurato `{"tableVisible":false,"card":true,"colW":358,"nameW":20}` | atteso `layout colonna/schede` | evidenza: /app/menu
- **C2-mouse** | piatti/modulo-allergeni | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: modulo-allergeni
- **C2-mouse** | piatti/modulo-allergeni | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: modulo-allergeni
- **C2-mouse** | piatti/nuovo | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo
- **C2-mouse** | piatti/nuovo | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo
- **C2-mouse** | piatti/nuovo-errori | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo-errori
- **C2-mouse** | piatti/nuovo-errori | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo-errori
- **shell-margine-contenuto** | shell/segnaposto-menu | telefono-390/chiaro | misurato `32 px` | atteso `16 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | notebook-1280/chiaro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | soglia-768/chiaro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | telefono-390/scuro | misurato `32 px` | atteso `16 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | notebook-1280/scuro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | soglia-768/scuro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | telefono-390/sistema-chiaro | misurato `32 px` | atteso `16 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | notebook-1280/sistema-chiaro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | soglia-768/sistema-chiaro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | telefono-390/sistema-scuro | misurato `32 px` | atteso `16 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | notebook-1280/sistema-scuro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu
- **shell-margine-contenuto** | shell/segnaposto-menu | soglia-768/sistema-scuro | misurato `40 px` | atteso `24 px` | evidenza: /app/menu

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
- **nav-pannello-telefono** | navigazione | telefono-390/chiaro | misurato `—` | atteso `altezza pannello con 8 voci Menù` | evidenza: voci non ancora tutte accese
- **piatti-elimina-concorrenza** | piatti | telefono-390/chiaro | misurato `—` | atteso `race menu fisso` | evidenza: non implementato in questa passata V2
- **piatti-accesso** | piatti | telefono-390/chiaro | misurato `—` | atteso `stesso esito di /app/hours per utente senza ruolo` | evidenza: impossibile creare utente senza ruoli (validazione Users); controllo dubbio se la guardia è solo canAccessAppArea
- **piatti-ricompila** | piatti | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
- **piatti-disabilitato-ovunque** | piatti | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **NO-OVERRIDE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **RICOMPILA-PRESENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **shell-menu-utente** | shell/home (icone Admin) | telefono-390/chiaro | misurato `voce «Vai all'Admin» assente con utente manager` | atteso `due icone svg (pannello + freccia esterna) se presente` | evidenza: A24; utente di prova senza canAccessAdminPanel
- **shell-menu-utente** | shell/home (icone Admin) | notebook-1280/chiaro | misurato `voce «Vai all'Admin» assente con utente manager` | atteso `due icone svg (pannello + freccia esterna) se presente` | evidenza: A24; utente di prova senza canAccessAdminPanel


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | NON PROVATO (21/22) |
| C1 | NON PROVATO (63/64) |
| C2 | FALLITO (74/81) |
| C2-mouse | AVVISO (25/32) |
| C3 | NON PROVATO (99/100) |
| C3-cambio-sistema | OK (13/13) |
| C3-no-lampo | NON PROVATO (0/1) |
| C9 | NON PROVATO (21/22) |
| g1 | OK (1/1) |
| g2 | OK (3/3) |
| home-colonne | NON PROVATO (5/6) |
| home-larghezza | NON PROVATO (8/9) |
| home-righe-di-stato | NON PROVATO (5/6) |
| home-testi | NON PROVATO (5/6) |
| shell-admin-link | NON PROVATO (0/19) |
| shell-barra-alta | OK (36/36) |
| shell-blocco-in-cima | OK (1/1) |
| shell-blocco-utente | OK (1/1) |
| shell-margine-contenuto | AVVISO (24/36) |
| shell-menu-utente | NON PROVATO (2/4) |
| shell-menu-voci | OK (1/1) |
| shell-nomi-accessibili | OK (60/60) |
| shell-passaggio-768 | OK (8/8) |
| shell-percorso-voce-attiva | OK (60/60) |
| shell-segnaposto | OK (1/1) |
| shell-sticky | OK (8/8) |
| shell-tema-scelta | OK (1/1) |
| shell-uscita | OK (1/1) |
| verify-link-valido | NON PROVATO (0/22) |

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
| nav-pannello-telefono | navigazione | telefono-390/chiaro | NON PROVATO | — | altezza pannello con 8 voci Menù | voci non ancora tutte accese |
| piatti-colonna-elenco | piatti/elenco | telefono-390/chiaro | AVVISO | {"tableVisible":false,"card":true,"colW":358,"nameW":20} | layout colonna/schede | /app/menu |
| piatti-azioni-pagina | piatti/elenco | telefono-390/chiaro | FALLITO | {"h":44,"w":326,"inline":false,"mainW":390} | pulsante full-width ≥44px | /app/menu |
| piatti-terminato | piatti | telefono-390/chiaro | FALLITO | locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('combobox', { name: 'Stato' })  | flusso senza eccezione | /app/menu |
| piatti-elimina-concorrenza | piatti | telefono-390/chiaro | NON PROVATO | — | race menu fisso | non implementato in questa passata V2 |
| piatti-modulo-inglese | piatti | telefono-390/chiaro | FALLITO | fallback en name | traduzione | /app/menu |
| piatti-tassonomie | piatti | telefono-390/chiaro | FALLITO | categorie UI | tassonomie read-only | /app/menu |
| piatti-ordine-100 | piatti/piu-di-100 | notebook-1280/chiaro | FALLITO | banner 100/101 | limit 100 | /app/menu |
| piatti-accesso | piatti | telefono-390/chiaro | NON PROVATO | — | stesso esito di /app/hours per utente senza ruolo | impossibile creare utente senza ruoli (validazione Users); controllo dubbio se la guardia è solo canAccessAppArea |
| piatti-ricompila | piatti | telefono-390/chiaro | NON PROVATO | — | — | rinviato alla 6.5 |
| piatti-disabilitato-ovunque | piatti | telefono-390/chiaro | NON PROVATO | — | — | rinviato alla 6.5 |
| C2 | piatti/modulo-allergeni | telefono-390/chiaro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | modulo-allergeni |
| C2-mouse | piatti/modulo-allergeni | notebook-1280/chiaro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | modulo-allergeni |
| C2 | piatti/modulo-allergeni | telefono-390/scuro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | modulo-allergeni |
| C2-mouse | piatti/modulo-allergeni | notebook-1280/scuro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | modulo-allergeni |
| C2 | piatti/nuovo | telefono-390/chiaro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | nuovo |
| C2-mouse | piatti/nuovo | notebook-1280/chiaro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | nuovo |
| C2 | piatti/nuovo | telefono-390/scuro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | nuovo |
| C2-mouse | piatti/nuovo | notebook-1280/scuro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | nuovo |
| C2 | piatti/nuovo-errori | telefono-390/chiaro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | nuovo-errori |
| C2-mouse | piatti/nuovo-errori | notebook-1280/chiaro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | nuovo-errori |
| C2 | piatti/nuovo-errori | telefono-390/scuro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | nuovo-errori |
| C2-mouse | piatti/nuovo-errori | notebook-1280/scuro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | nuovo-errori |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| NO-OVERRIDE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| RICOMPILA-PRESENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| shell-menu-utente | shell/home (icone Admin) | telefono-390/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| shell-menu-utente | shell/home (icone Admin) | notebook-1280/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| shell-margine-contenuto | shell/segnaposto-menu | telefono-390/chiaro | AVVISO | 32 px | 16 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | notebook-1280/chiaro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | soglia-768/chiaro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | telefono-390/scuro | AVVISO | 32 px | 16 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | notebook-1280/scuro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | soglia-768/scuro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | telefono-390/sistema-chiaro | AVVISO | 32 px | 16 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | notebook-1280/sistema-chiaro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | soglia-768/sistema-chiaro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | telefono-390/sistema-scuro | AVVISO | 32 px | 16 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | notebook-1280/sistema-scuro | AVVISO | 40 px | 24 px | /app/menu |
| shell-margine-contenuto | shell/segnaposto-menu | soglia-768/sistema-scuro | AVVISO | 40 px | 24 px | /app/menu |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)

## Anomalie dell'ambiente
- shell-menu trigger telefono-390: mountEvents=0 remounts=0 postHydration=0 (observe 2800ms, hydration 1200ms)
- shell-percorso-voce-attiva diagnostica (Piatti @1280px): attributi={"data-slot":"sidebar-menu-button","data-sidebar":"menu-button","data-size":"default","data-active":"","class":"peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 pointer-coarse:h-11 text-sm","href":"/app/menu"}; outerHTML=<a data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="default" data-active="" class="peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 [&amp;&gt;span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 pointer-coarse:h-11 text-sm" href="/app/menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed lucide-fork-knife-crossed" aria-hidden="true"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path><path d="m2.1 21.8 6.4-6.3"></path><path d="m19 5-7 7"></path></svg><span>Piatti</span></a>
- WebKit 26.0 su http://localhost:3100 (diagnosi login prod): URL finale=http://localhost:3100/app/login; payload-token: presente secure=true httpOnly=true sameSite=Lax; Set-Cookie login: (nessun Set-Cookie catturato sulla risposta login)
