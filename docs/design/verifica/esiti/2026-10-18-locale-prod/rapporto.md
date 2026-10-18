# Esito verifica — locale-prod — 2026-10-18
Commit: b6eb1d4fd64b · Lanciatore: 3.4.1 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 2 min 57 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 2378 · FALLITO: 26 · AVVISO: 1 · NON PROVATO: 225 · Controlli distinti nel JSON corrente: 76

## Pacchetto: accesso
Righe: 26 · OK: 26 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 58 · OK: 58 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 2496 · OK: 2276 · FALLITO: 26

### FALLITO (menu)
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **vini-elimina-registro-permessi** | vini | telefono-390/chiaro | misurato `admin: not_found; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **vini-formati-server** | vini | telefono-390/chiaro | misurato `{"probe":{"results":[{"label":"year-99","rejected":true,"message":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV.","expected":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV."},{"label":"volume-70","rejected":true,"message":"La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl.","expected":"La capacità deve essere una tra: 25 cl, 33 ` | atteso `validazione formati Local API` | evidenza: payload
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume Non indicata | volume 75 cl | volume 150 cl | grado 12,8% | abv API dopo save` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-modulo-inglese** | vini | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Modifica verify-ui-vini-noen' })
` | atteso `inglese` | evidenza: /app/menu/wines
- **vini-origine-cascata** | vini | telefono-390/chiaro | misurato `regioni Italia assenti | locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })
    - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 t` | atteso `origine §7` | evidenza: /app/menu/wines

## Pacchetto: completo
Righe: 50 · OK: 18 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 18/18 combinazioni
- **C3-cambio-sistema**: OK in 8/8 combinazioni
- **C9**: OK in 18/18 combinazioni
- **home-colonne**: OK in 2/2 combinazioni
- **home-larghezza**: OK in 4/4 combinazioni
- **home-riga-menu-altezza**: OK in 2/2 combinazioni
- **home-riga-menu-casi**: OK in 1/1 combinazioni
- **home-riga-menu-testo**: OK in 4/4 combinazioni
- **home-righe-di-stato**: OK in 2/2 combinazioni
- **home-testi**: OK in 2/2 combinazioni
- **nav-briciole**: OK in 2/2 combinazioni
- **nav-casi-unit**: OK in 1/1 combinazioni
- **nav-icone**: OK in 2/2 combinazioni
- **nav-titoli-pagina**: OK in 1/1 combinazioni
- **nav-voce-attiva**: OK in 2/2 combinazioni
- **nav-voci-menu**: OK in 2/2 combinazioni
- **NO-OVERRIDE**: OK in 8/8 combinazioni
- **piatti-allergeni-selezione**: OK in 2/2 combinazioni
- **piatti-azioni-pagina**: OK in 2/2 combinazioni
- **piatti-casella-misure**: OK in 2/2 combinazioni
- **piatti-colonna-elenco**: OK in 2/2 combinazioni
- **piatti-disabilita**: OK in 1/1 combinazioni
- **piatti-elimina-bloccato**: OK in 1/1 combinazioni
- **piatti-elimina-libero**: OK in 1/1 combinazioni
- **piatti-elimina-permessi**: OK in 1/1 combinazioni
- **piatti-elimina-registro**: OK in 1/1 combinazioni
- **piatti-filtri-ricerca**: OK in 1/1 combinazioni
- **piatti-modulo-campi**: OK in 2/2 combinazioni
- **piatti-modulo-footer**: OK in 1/1 combinazioni
- **piatti-modulo-inglese**: OK in 1/1 combinazioni
- **piatti-modulo-validazione**: OK in 1/1 combinazioni
- **piatti-nomi-accessibili**: OK in 1/1 combinazioni
- **piatti-persistenza**: OK in 1/1 combinazioni
- **piatti-tassonomie**: OK in 1/1 combinazioni
- **piatti-terminato**: OK in 1/1 combinazioni
- **piatti-testi**: OK in 1/1 combinazioni
- **RICOMPILA-ASSENTE**: OK in 1/1 combinazioni
- **vini-azioni-pagina**: OK in 2/2 combinazioni
- **vini-colonne-fisse**: OK in 1/1 combinazioni
- **vini-disponibilita**: OK in 1/1 combinazioni
- **vini-elimina**: OK in 1/1 combinazioni
- **vini-filtri-origine**: OK in 1/1 combinazioni
- **vini-modulo-anno**: OK in 1/1 combinazioni
- **vini-modulo-campi**: OK in 2/2 combinazioni
- **vini-modulo-footer**: OK in 1/1 combinazioni
- **vini-modulo-validazione**: OK in 1/1 combinazioni
- **vini-testi**: OK in 1/1 combinazioni
- **C1**: OK in 756/800 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 391/436 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 756/800 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 356/376 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **vini-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **vini-elimina-registro-permessi** | vini | telefono-390/chiaro | misurato `admin: not_found; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **vini-formati-server** | vini | telefono-390/chiaro | misurato `{"probe":{"results":[{"label":"year-99","rejected":true,"message":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV.","expected":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV."},{"label":"volume-70","rejected":true,"message":"La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl.","expected":"La capacità deve essere una tra: 25 cl, 33 ` | atteso `validazione formati Local API` | evidenza: payload
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume Non indicata | volume 75 cl | volume 150 cl | grado 12,8% | abv API dopo save` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-modulo-inglese** | vini | telefono-390/chiaro | misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Modifica verify-ui-vini-noen' })
` | atteso `inglese` | evidenza: /app/menu/wines
- **vini-origine-cascata** | vini | telefono-390/chiaro | misurato `regioni Italia assenti | locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })
    - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 t` | atteso `origine §7` | evidenza: /app/menu/wines

### AVVISO
- **vini-colonna-elenco** | vini | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/wines

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
- **C1** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C1** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C1** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C1** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C1** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C1** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C1** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C1** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C1** | bevande/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C3** | bevande/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | bevande/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2-mouse` | evidenza: vuoto
- **C1** | bevande/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C1** | bevande/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C3** | bevande/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | bevande/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C2-mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **piatti-righe-azioni** | piatti | telefono-390/chiaro | misurato `misura non acquisita: btnSize riga azioni` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu
- **C1** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C1** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C1** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C1** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C1** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **vini-righe-azioni** | vini | telefono-390/chiaro | misurato `misura non acquisita: btnSize` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/wines
- **bevande-azioni-pagina** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-colonna-elenco** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-colonne-fisse** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-disponibilita** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-elimina** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-elimina-registro-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-filtri-ricerca** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-formati-server** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-modulo-campi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-modulo-footer** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-modulo-inglese** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-modulo-validazione** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-nomi-accessibili** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-paese-facoltativo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-righe-azioni** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-tassonomie** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-testi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-azioni-pagina** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-capacita-non-gestita** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-colonna-elenco** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-colonne-fisse** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-disponibilita** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-elimina** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-elimina-registro-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-filtri-ricerca** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-formati-server** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-modulo-campi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-modulo-footer** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-modulo-inglese** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-modulo-validazione** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-nomi-accessibili** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-righe-azioni** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-tassonomie** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-testi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-coerenza-geografica** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-filtri-ricerca** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-nomi-accessibili** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-origine-fuori-filtro** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-origine-opzioni-query** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-tassonomie** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (18/18) |
| C1 | NON PROVATO (756/800) |
| C2 | FALLITO (391/436) |
| C2-mouse | NON PROVATO (356/376) |
| C3 | NON PROVATO (756/800) |
| C9 | OK (18/18) |
| NO-OVERRIDE | OK (8/8) |
| RICOMPILA-ASSENTE | OK (1/1) |
| bevande-azioni-pagina | NON PROVATO (0/1) |
| bevande-colonna-elenco | NON PROVATO (0/1) |
| bevande-colonne-fisse | NON PROVATO (0/1) |
| bevande-console | NON PROVATO (0/1) |
| bevande-disponibilita | NON PROVATO (0/1) |
| bevande-elimina | NON PROVATO (0/1) |
| bevande-elimina-registro-permessi | NON PROVATO (0/1) |
| bevande-filtri-ricerca | NON PROVATO (0/1) |
| bevande-formati-server | NON PROVATO (0/1) |
| bevande-formati-ui | NON PROVATO (0/1) |
| bevande-modulo-campi | NON PROVATO (0/1) |
| bevande-modulo-footer | NON PROVATO (0/1) |
| bevande-modulo-inglese | NON PROVATO (0/1) |
| bevande-modulo-validazione | NON PROVATO (0/1) |
| bevande-nomi-accessibili | NON PROVATO (0/1) |
| bevande-paese-facoltativo | NON PROVATO (0/1) |
| bevande-persistenza | NON PROVATO (0/1) |
| bevande-righe-azioni | NON PROVATO (0/1) |
| bevande-stati-ui | NON PROVATO (0/1) |
| bevande-tassonomie | NON PROVATO (0/1) |
| bevande-testi | NON PROVATO (0/1) |
| distillati-azioni-pagina | NON PROVATO (0/1) |
| distillati-capacita-non-gestita | NON PROVATO (0/1) |
| distillati-colonna-elenco | NON PROVATO (0/1) |
| distillati-colonne-fisse | NON PROVATO (0/1) |
| distillati-console | NON PROVATO (0/1) |
| distillati-disponibilita | NON PROVATO (0/1) |
| distillati-elimina | NON PROVATO (0/1) |
| distillati-elimina-registro-permessi | NON PROVATO (0/1) |
| distillati-filtri-ricerca | NON PROVATO (0/1) |
| distillati-formati-server | NON PROVATO (0/1) |
| distillati-formati-ui | NON PROVATO (0/1) |
| distillati-modulo-campi | NON PROVATO (0/1) |
| distillati-modulo-footer | NON PROVATO (0/1) |
| distillati-modulo-inglese | NON PROVATO (0/1) |
| distillati-modulo-validazione | NON PROVATO (0/1) |
| distillati-nomi-accessibili | NON PROVATO (0/1) |
| distillati-persistenza | NON PROVATO (0/1) |
| distillati-righe-azioni | NON PROVATO (0/1) |
| distillati-stati-ui | NON PROVATO (0/1) |
| distillati-tassonomie | NON PROVATO (0/1) |
| distillati-testi | NON PROVATO (0/1) |
| vini-azioni-pagina | OK (2/2) |
| vini-coerenza-geografica | NON PROVATO (0/1) |
| vini-colonna-elenco | AVVISO (3/4) |
| vini-colonne-fisse | OK (1/1) |
| vini-console | NON PROVATO (0/1) |
| vini-disponibilita | OK (1/1) |
| vini-elimina | OK (1/1) |
| vini-elimina-registro-permessi | FALLITO (0/1) |
| vini-filtri-origine | OK (1/1) |
| vini-filtri-ricerca | NON PROVATO (0/1) |
| vini-formati-server | FALLITO (0/1) |
| vini-formati-ui | FALLITO (0/1) |
| vini-modulo-anno | OK (1/1) |
| vini-modulo-campi | OK (2/2) |
| vini-modulo-footer | OK (1/1) |
| vini-modulo-inglese | FALLITO (0/1) |
| vini-modulo-validazione | OK (1/1) |
| vini-nomi-accessibili | NON PROVATO (0/1) |
| vini-origine-cascata | FALLITO (0/1) |
| vini-origine-fuori-filtro | NON PROVATO (0/1) |
| vini-origine-opzioni-query | NON PROVATO (0/1) |
| vini-persistenza | NON PROVATO (0/1) |
| vini-righe-azioni | NON PROVATO (0/1) |
| vini-stati-ui | NON PROVATO (0/1) |
| vini-tassonomie | NON PROVATO (0/1) |
| vini-testi | OK (1/1) |

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
| C1 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C1 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C1 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C1 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C1 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C1 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C1 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C1 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C1 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C1 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C1 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C1 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C3 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C1 | bevande/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C3 | bevande/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C2-mouse | bevande/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2-mouse | vuoto |
| C1 | bevande/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C2 | bevande/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C1 | bevande/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C3 | bevande/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C2-mouse | bevande/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 13 record | C2-mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| piatti-righe-azioni | piatti | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize riga azioni | tre icone, switch disabilitato su disabled | /app/menu |
| C1 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C1 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C1 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C1 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| vini-colonna-elenco | vini | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/wines |
| vini-righe-azioni | vini | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize | tre icone, switch disabilitato su disabled | /app/menu/wines |
| vini-elimina-registro-permessi | vini | telefono-390/chiaro | FALLITO | admin: not_found; norole: NON PROVATO (schema Users) | registro e permessi staff | payload |
| vini-modulo-inglese | vini | telefono-390/chiaro | FALLITO | locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('button', { name: 'Modifica verify-ui-vini-noen' })  | inglese | /app/menu/wines |
| vini-formati-ui | vini | telefono-390/chiaro | FALLITO | volume Non indicata \| volume 75 cl \| volume 150 cl \| grado 12,8% \| abv API dopo save | capacità/grado | /app/menu/wines |
| vini-formati-server | vini | telefono-390/chiaro | FALLITO | {"probe":{"results":[{"label":"year-99","rejected":true,"message":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV.","expected":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV."},{"label":"volume-70","rejected":true,"message":"La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl.","expected":"La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl."},{"label":"abv-128","rejected":true,"message":"Il grado deve andare da 5% a 20% a passi di 0,5 (per esempio 13% o 13,5%).","expected":"Il grado deve andare da 5% a 20% a passi di 0,5 (per esempio 13% o 13,5%)."}],"canonicalOk":true,"yearMsg":"L'anno deve avere quattro cifre, tra 1900 e 2026, oppure essere NV."},"dis":{"ok":false,"reason":"not_found"},"gradeWine":{"ok":true,"id":4752,"name":"verify-ui-disabled-abv"}} | validazione formati Local API | payload |
| vini-origine-cascata | vini | telefono-390/chiaro | FALLITO | regioni Italia assenti \| locator.click: Target page, context or browser has been closed Call log:   - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })     - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:…>…</div>   - attempting click action     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action     - waiting 20ms     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action       - waiting 100ms     55 × waiting for element to be visible, enabled and stable        - element is not visible      - retrying click action        - waiting 500ms  | origine §7 | /app/menu/wines |
| bevande-azioni-pagina | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-colonna-elenco | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-colonne-fisse | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-disponibilita | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-elimina | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-elimina-registro-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-filtri-ricerca | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-formati-server | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-modulo-campi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-modulo-footer | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-modulo-inglese | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-modulo-validazione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-paese-facoltativo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-righe-azioni | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-tassonomie | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-testi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-azioni-pagina | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-capacita-non-gestita | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-colonna-elenco | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-colonne-fisse | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-disponibilita | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-elimina | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-elimina-registro-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-filtri-ricerca | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-formati-server | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-modulo-campi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-modulo-footer | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-modulo-inglese | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-modulo-validazione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-righe-azioni | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-tassonomie | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-testi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-coerenza-geografica | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-filtri-ricerca | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-origine-fuori-filtro | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-origine-opzioni-query | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-tassonomie | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- bevande-azioni-pagina: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-colonna-elenco: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-colonne-fisse: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-console: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-disponibilita: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-elimina: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-elimina-registro-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-filtri-ricerca: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-formati-server: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-formati-ui: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-modulo-campi: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-modulo-footer: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-modulo-inglese: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-modulo-validazione: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-nomi-accessibili: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-paese-facoltativo: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-persistenza: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-righe-azioni: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-stati-ui: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-tassonomie: controllo non eseguito dal lanciatore in questa esecuzione
- bevande-testi: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-azioni-pagina: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-capacita-non-gestita: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-colonna-elenco: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-colonne-fisse: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-console: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-disponibilita: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-elimina: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-elimina-registro-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-filtri-ricerca: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-formati-server: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-formati-ui: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-modulo-campi: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-modulo-footer: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-modulo-inglese: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-modulo-validazione: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-nomi-accessibili: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-persistenza: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-righe-azioni: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-stati-ui: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-tassonomie: controllo non eseguito dal lanciatore in questa esecuzione
- distillati-testi: controllo non eseguito dal lanciatore in questa esecuzione
- vini-coerenza-geografica: controllo non eseguito dal lanciatore in questa esecuzione
- vini-console: controllo non eseguito dal lanciatore in questa esecuzione
- vini-filtri-ricerca: controllo non eseguito dal lanciatore in questa esecuzione
- vini-nomi-accessibili: controllo non eseguito dal lanciatore in questa esecuzione
- vini-origine-fuori-filtro: controllo non eseguito dal lanciatore in questa esecuzione
- vini-origine-opzioni-query: controllo non eseguito dal lanciatore in questa esecuzione
- vini-persistenza: controllo non eseguito dal lanciatore in questa esecuzione
- vini-stati-ui: controllo non eseguito dal lanciatore in questa esecuzione
- vini-tassonomie: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- vini runCatalogFlowControlsFull: menu payload delete-prefix: $ cross-env NODE_OPTIONS=--no-deprecation payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-
Non Trovato

