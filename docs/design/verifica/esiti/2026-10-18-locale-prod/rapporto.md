# Esito verifica — locale-prod — 2026-10-18
Commit: 8c95dab5efd0 · Lanciatore: 3.5.0 · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 18 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 1784 · FALLITO: 39 · AVVISO: 3 · NON PROVATO: 211 · Controlli distinti nel JSON corrente: 1

## Pacchetto: accesso
Righe: 26 · OK: 26 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 46 · OK: 46 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 1915 · OK: 1694 · FALLITO: 39

### FALLITO (menu)
- **bevande-elimina-registro-permessi** | bevande | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **bevande-modulo-inglese** | bevande | telefono-390/chiaro | misurato `badge Presente` | atteso `inglese` | evidenza: /app/menu/drinks
- **bevande-persistenza** | bevande | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/drinks
- **bevande-tassonomie** | bevande | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/drinks
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **distillati-elimina-registro-permessi** | distillati | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **distillati-modulo-inglese** | distillati | telefono-390/chiaro | misurato `badge Presente | read en` | atteso `inglese` | evidenza: /app/menu/spirits
- **distillati-persistenza** | distillati | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/spirits
- **distillati-tassonomie** | distillati | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/spirits
- **vini-elimina-registro-permessi** | vini | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume Non indicata | volume 75 cl | volume 150 cl` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-modulo-inglese** | vini | telefono-390/chiaro | misurato `badge Presente` | atteso `inglese` | evidenza: /app/menu/wines
- **vini-origine-cascata** | vini | telefono-390/chiaro | misurato `regioni Italia assenti | locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })
    - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden ` | atteso `origine §7` | evidenza: /app/menu/wines
- **vini-origine-fuori-filtro** | vini | telefono-390/chiaro | misurato `paese salvato non visibile` | atteso `paese disabilitato in elenco` | evidenza: /app/menu/wines
- **vini-persistenza** | vini | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/wines
- **vini-tassonomie** | vini | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/wines

## Pacchetto: completo
Righe: 50 · OK: 18 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 18/18 combinazioni
- **bevande-azioni-pagina**: OK in 2/2 combinazioni
- **bevande-colonne-fisse**: OK in 1/1 combinazioni
- **bevande-disponibilita**: OK in 1/1 combinazioni
- **bevande-elimina**: OK in 1/1 combinazioni
- **bevande-filtri-ricerca**: OK in 1/1 combinazioni
- **bevande-formati-server**: OK in 1/1 combinazioni
- **bevande-modulo-campi**: OK in 2/2 combinazioni
- **bevande-modulo-footer**: OK in 1/1 combinazioni
- **bevande-modulo-validazione**: OK in 1/1 combinazioni
- **bevande-nomi-accessibili**: OK in 1/1 combinazioni
- **bevande-paese-facoltativo**: OK in 1/1 combinazioni
- **bevande-testi**: OK in 1/1 combinazioni
- **C3-cambio-sistema**: OK in 8/8 combinazioni
- **C9**: OK in 18/18 combinazioni
- **distillati-azioni-pagina**: OK in 2/2 combinazioni
- **distillati-capacita-non-gestita**: OK in 1/1 combinazioni
- **distillati-colonne-fisse**: OK in 1/1 combinazioni
- **distillati-disponibilita**: OK in 1/1 combinazioni
- **distillati-elimina**: OK in 1/1 combinazioni
- **distillati-filtri-ricerca**: OK in 1/1 combinazioni
- **distillati-formati-server**: OK in 1/1 combinazioni
- **distillati-modulo-campi**: OK in 2/2 combinazioni
- **distillati-modulo-footer**: OK in 1/1 combinazioni
- **distillati-modulo-validazione**: OK in 1/1 combinazioni
- **distillati-nomi-accessibili**: OK in 1/1 combinazioni
- **distillati-testi**: OK in 1/1 combinazioni
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
- **vini-filtri-ricerca**: OK in 1/1 combinazioni
- **vini-formati-server**: OK in 1/1 combinazioni
- **vini-modulo-anno**: OK in 1/1 combinazioni
- **vini-modulo-campi**: OK in 2/2 combinazioni
- **vini-modulo-footer**: OK in 1/1 combinazioni
- **vini-modulo-validazione**: OK in 1/1 combinazioni
- **vini-nomi-accessibili**: OK in 1/1 combinazioni
- **vini-origine-opzioni-query**: OK in 1/1 combinazioni
- **vini-testi**: OK in 1/1 combinazioni
- **C2**: OK in 432/483 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 800/847 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 356/376 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **vini-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **distillati-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **bevande-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 39/103 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **bevande-elimina-registro-permessi** | bevande | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **bevande-modulo-inglese** | bevande | telefono-390/chiaro | misurato `badge Presente` | atteso `inglese` | evidenza: /app/menu/drinks
- **bevande-persistenza** | bevande | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/drinks
- **bevande-tassonomie** | bevande | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/drinks
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | bevande/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | distillati/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/scuro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **C2** | vini/elimina | telefono-390/chiaro | misurato `Indietro 274x42; Elimina 274x42` | atteso `nessun elemento sotto 44 px` | evidenza: elimina
- **distillati-elimina-registro-permessi** | distillati | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **distillati-modulo-inglese** | distillati | telefono-390/chiaro | misurato `badge Presente | read en` | atteso `inglese` | evidenza: /app/menu/spirits
- **distillati-persistenza** | distillati | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/spirits
- **distillati-tassonomie** | distillati | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/spirits
- **vini-elimina-registro-permessi** | vini | telefono-390/chiaro | misurato `registro delete manager; norole: NON PROVATO (schema Users)` | atteso `registro e permessi staff` | evidenza: payload
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume Non indicata | volume 75 cl | volume 150 cl` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-modulo-inglese** | vini | telefono-390/chiaro | misurato `badge Presente` | atteso `inglese` | evidenza: /app/menu/wines
- **vini-origine-cascata** | vini | telefono-390/chiaro | misurato `regioni Italia assenti | locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })
    - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden ` | atteso `origine §7` | evidenza: /app/menu/wines
- **vini-origine-fuori-filtro** | vini | telefono-390/chiaro | misurato `paese salvato non visibile` | atteso `paese disabilitato in elenco` | evidenza: /app/menu/wines
- **vini-persistenza** | vini | telefono-390/chiaro | misurato `create read` | atteso `persistenza` | evidenza: /app/menu/wines
- **vini-tassonomie** | vini | telefono-390/chiaro | misurato `tipologie vuote` | atteso `tassonomie` | evidenza: /app/menu/wines

### AVVISO
- **vini-colonna-elenco** | vini | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/wines
- **distillati-colonna-elenco** | distillati | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/spirits
- **bevande-colonna-elenco** | bevande | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/drinks

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
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C3** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | vini/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 90 record` | atteso `C2-mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C3** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | distillati/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 38 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C3** | bevande/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | bevande/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2-mouse` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C3** | bevande/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **C2-mouse** | bevande/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 13 record` | atteso `C2-mouse` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **piatti-righe-azioni** | piatti | telefono-390/chiaro | misurato `misura non acquisita: btnSize riga azioni` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu
- **C2** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **C2** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `tocco ≥44px` | evidenza: vuoto
- **C3** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C3** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `classe tema` | evidenza: vuoto
- **C2-mouse** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `altezza mouse` | evidenza: vuoto
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **vini-righe-azioni** | vini | telefono-390/chiaro | misurato `misura non acquisita: btnSize` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/wines
- **vini-coerenza-geografica** | vini | telefono-390/chiaro | misurato `—` | atteso `locale-dev only` | evidenza: ambiente
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **distillati-righe-azioni** | distillati | telefono-390/chiaro | misurato `misura non acquisita: btnSize` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/spirits
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **bevande-righe-azioni** | bevande | telefono-390/chiaro | misurato `misura non acquisita: btnSize` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/drinks
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **bevande-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **C1** | piatti/elenco | telefono-390/chiaro | misurato `tempo: elenco` | atteso `scroll orizzontale` | evidenza: elenco
- **C1** | piatti/elenco | notebook-1280/chiaro | misurato `tempo: elenco` | atteso `scroll orizzontale` | evidenza: elenco
- **C1** | piatti/elenco | telefono-390/scuro | misurato `tempo: elenco` | atteso `scroll orizzontale` | evidenza: elenco
- **C1** | piatti/elenco | notebook-1280/scuro | misurato `tempo: elenco` | atteso `scroll orizzontale` | evidenza: elenco
- **C1** | piatti/filtri | telefono-390/chiaro | misurato `tempo: filtri` | atteso `scroll orizzontale` | evidenza: filtri
- **C1** | piatti/filtri | notebook-1280/chiaro | misurato `tempo: filtri` | atteso `scroll orizzontale` | evidenza: filtri
- **C1** | piatti/filtri | telefono-390/scuro | misurato `tempo: filtri` | atteso `scroll orizzontale` | evidenza: filtri
- **C1** | piatti/filtri | notebook-1280/scuro | misurato `tempo: filtri` | atteso `scroll orizzontale` | evidenza: filtri
- **C1** | piatti/filtri-attivi | telefono-390/chiaro | misurato `tempo: filtri-attivi` | atteso `scroll orizzontale` | evidenza: filtri-attivi
- **C1** | piatti/filtri-attivi | notebook-1280/chiaro | misurato `tempo: filtri-attivi` | atteso `scroll orizzontale` | evidenza: filtri-attivi
- **C1** | piatti/filtri-attivi | telefono-390/scuro | misurato `tempo: filtri-attivi` | atteso `scroll orizzontale` | evidenza: filtri-attivi
- **C1** | piatti/filtri-attivi | notebook-1280/scuro | misurato `tempo: filtri-attivi` | atteso `scroll orizzontale` | evidenza: filtri-attivi
- **C1** | piatti/modulo | telefono-390/chiaro | misurato `tempo: modulo` | atteso `scroll orizzontale` | evidenza: modulo
- **C1** | piatti/modulo | notebook-1280/chiaro | misurato `tempo: modulo` | atteso `scroll orizzontale` | evidenza: modulo
- **C1** | piatti/modulo | telefono-390/scuro | misurato `tempo: modulo` | atteso `scroll orizzontale` | evidenza: modulo
- **C1** | piatti/modulo | notebook-1280/scuro | misurato `tempo: modulo` | atteso `scroll orizzontale` | evidenza: modulo
- **C1** | piatti/modulo-allergeni | telefono-390/chiaro | misurato `tempo: modulo-allergeni` | atteso `scroll orizzontale` | evidenza: modulo-allergeni
- **C1** | piatti/modulo-allergeni | notebook-1280/chiaro | misurato `tempo: modulo-allergeni` | atteso `scroll orizzontale` | evidenza: modulo-allergeni
- **C1** | piatti/modulo-allergeni | telefono-390/scuro | misurato `tempo: modulo-allergeni` | atteso `scroll orizzontale` | evidenza: modulo-allergeni
- **C1** | piatti/modulo-allergeni | notebook-1280/scuro | misurato `tempo: modulo-allergeni` | atteso `scroll orizzontale` | evidenza: modulo-allergeni
- **C1** | piatti/modulo-inglese-aperto | telefono-390/chiaro | misurato `tempo: modulo-inglese-aperto` | atteso `scroll orizzontale` | evidenza: modulo-inglese-aperto
- **C1** | piatti/modulo-inglese-aperto | notebook-1280/chiaro | misurato `tempo: modulo-inglese-aperto` | atteso `scroll orizzontale` | evidenza: modulo-inglese-aperto
- **C1** | piatti/modulo-inglese-aperto | telefono-390/scuro | misurato `tempo: modulo-inglese-aperto` | atteso `scroll orizzontale` | evidenza: modulo-inglese-aperto
- **C1** | piatti/modulo-inglese-aperto | notebook-1280/scuro | misurato `tempo: modulo-inglese-aperto` | atteso `scroll orizzontale` | evidenza: modulo-inglese-aperto
- **C1** | piatti/nuovo | telefono-390/chiaro | misurato `tempo: nuovo` | atteso `scroll orizzontale` | evidenza: nuovo
- **C1** | piatti/nuovo | notebook-1280/chiaro | misurato `tempo: nuovo` | atteso `scroll orizzontale` | evidenza: nuovo
- **C1** | piatti/nuovo | telefono-390/scuro | misurato `tempo: nuovo` | atteso `scroll orizzontale` | evidenza: nuovo
- **C1** | piatti/nuovo | notebook-1280/scuro | misurato `tempo: nuovo` | atteso `scroll orizzontale` | evidenza: nuovo
- **C1** | piatti/nuovo-errori | telefono-390/chiaro | misurato `tempo: nuovo-errori` | atteso `scroll orizzontale` | evidenza: nuovo-errori
- **C1** | piatti/nuovo-errori | notebook-1280/chiaro | misurato `tempo: nuovo-errori` | atteso `scroll orizzontale` | evidenza: nuovo-errori
- **C1** | piatti/nuovo-errori | telefono-390/scuro | misurato `tempo: nuovo-errori` | atteso `scroll orizzontale` | evidenza: nuovo-errori
- **C1** | piatti/nuovo-errori | notebook-1280/scuro | misurato `tempo: nuovo-errori` | atteso `scroll orizzontale` | evidenza: nuovo-errori
- **C1** | piatti/elimina-libero | telefono-390/chiaro | misurato `tempo: elimina-libero` | atteso `scroll orizzontale` | evidenza: elimina-libero
- **C1** | piatti/elimina-libero | notebook-1280/chiaro | misurato `tempo: elimina-libero` | atteso `scroll orizzontale` | evidenza: elimina-libero
- **C1** | piatti/elimina-libero | telefono-390/scuro | misurato `tempo: elimina-libero` | atteso `scroll orizzontale` | evidenza: elimina-libero
- **C1** | piatti/elimina-libero | notebook-1280/scuro | misurato `tempo: elimina-libero` | atteso `scroll orizzontale` | evidenza: elimina-libero
- **C1** | piatti/elimina-bloccato | telefono-390/chiaro | misurato `tempo: elimina-bloccato` | atteso `scroll orizzontale` | evidenza: elimina-bloccato
- **C1** | piatti/elimina-bloccato | notebook-1280/chiaro | misurato `tempo: elimina-bloccato` | atteso `scroll orizzontale` | evidenza: elimina-bloccato
- **C1** | piatti/elimina-bloccato | telefono-390/scuro | misurato `tempo: elimina-bloccato` | atteso `scroll orizzontale` | evidenza: elimina-bloccato
- **C1** | piatti/elimina-bloccato | notebook-1280/scuro | misurato `tempo: elimina-bloccato` | atteso `scroll orizzontale` | evidenza: elimina-bloccato
- **C1** | piatti/errore-azione | telefono-390/chiaro | misurato `tempo: errore-azione` | atteso `scroll orizzontale` | evidenza: errore-azione
- **C1** | piatti/errore-azione | notebook-1280/chiaro | misurato `tempo: errore-azione` | atteso `scroll orizzontale` | evidenza: errore-azione
- **C1** | piatti/errore-azione | telefono-390/scuro | misurato `tempo: errore-azione` | atteso `scroll orizzontale` | evidenza: errore-azione
- **C1** | piatti/errore-azione | notebook-1280/scuro | misurato `tempo: errore-azione` | atteso `scroll orizzontale` | evidenza: errore-azione
- **C1** | piatti/nessun-risultato | telefono-390/chiaro | misurato `tempo: nessun-risultato` | atteso `scroll orizzontale` | evidenza: nessun-risultato
- **C1** | piatti/nessun-risultato | notebook-1280/chiaro | misurato `tempo: nessun-risultato` | atteso `scroll orizzontale` | evidenza: nessun-risultato
- **C1** | piatti/nessun-risultato | telefono-390/scuro | misurato `tempo: nessun-risultato` | atteso `scroll orizzontale` | evidenza: nessun-risultato
- **C1** | piatti/nessun-risultato | notebook-1280/scuro | misurato `tempo: nessun-risultato` | atteso `scroll orizzontale` | evidenza: nessun-risultato
- **C1** | piatti/caricamento | telefono-390/chiaro | misurato `tempo: caricamento` | atteso `scroll orizzontale` | evidenza: caricamento
- **C1** | piatti/caricamento | notebook-1280/chiaro | misurato `tempo: caricamento` | atteso `scroll orizzontale` | evidenza: caricamento
- **C1** | piatti/caricamento | telefono-390/scuro | misurato `tempo: caricamento` | atteso `scroll orizzontale` | evidenza: caricamento
- **C1** | piatti/caricamento | notebook-1280/scuro | misurato `tempo: caricamento` | atteso `scroll orizzontale` | evidenza: caricamento
- **C1** | piatti/errore-caricamento | telefono-390/chiaro | misurato `tempo: errore-caricamento` | atteso `scroll orizzontale` | evidenza: errore-caricamento
- **C1** | piatti/errore-caricamento | notebook-1280/chiaro | misurato `tempo: errore-caricamento` | atteso `scroll orizzontale` | evidenza: errore-caricamento
- **C1** | piatti/errore-caricamento | telefono-390/scuro | misurato `tempo: errore-caricamento` | atteso `scroll orizzontale` | evidenza: errore-caricamento
- **C1** | piatti/errore-caricamento | notebook-1280/scuro | misurato `tempo: errore-caricamento` | atteso `scroll orizzontale` | evidenza: errore-caricamento
- **C1** | piatti/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/chiaro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C1** | piatti/vuoto | telefono-390/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C1** | piatti/vuoto | notebook-1280/scuro | misurato `stato vuoto: DB con 44 piatti` | atteso `scroll orizzontale` | evidenza: vuoto
- **C1** | piatti/piu-di-100 | telefono-390/chiaro | misurato `tempo: piu-di-100` | atteso `scroll orizzontale` | evidenza: piu-di-100
- **C1** | piatti/piu-di-100 | notebook-1280/chiaro | misurato `tempo: piu-di-100` | atteso `scroll orizzontale` | evidenza: piu-di-100
- **C1** | piatti/piu-di-100 | telefono-390/scuro | misurato `tempo: piu-di-100` | atteso `scroll orizzontale` | evidenza: piu-di-100
- **C1** | piatti/piu-di-100 | notebook-1280/scuro | misurato `tempo: piu-di-100` | atteso `scroll orizzontale` | evidenza: piu-di-100


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| piatti-testi | OK (1/1) |

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
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
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
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C3 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| C2 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C3 | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2-mouse | vini/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 90 record | C2-mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C3 | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C3 | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2-mouse | distillati/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 38 record | C2-mouse | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/elimina | telefono-390/scuro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C3 | bevande/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C2-mouse | bevande/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2-mouse | vuoto |
| C2 | bevande/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C3 | bevande/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| C2-mouse | bevande/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 13 record | C2-mouse | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| piatti-righe-azioni | piatti | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize riga azioni | tre icone, switch disabilitato su disabled | /app/menu |
| C2 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| C2 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | tocco ≥44px | vuoto |
| C3 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C3 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | classe tema | vuoto |
| C2-mouse | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | altezza mouse | vuoto |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| vini-colonna-elenco | vini | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/wines |
| vini-righe-azioni | vini | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize | tre icone, switch disabilitato su disabled | /app/menu/wines |
| vini-elimina-registro-permessi | vini | telefono-390/chiaro | FALLITO | registro delete manager; norole: NON PROVATO (schema Users) | registro e permessi staff | payload |
| vini-modulo-inglese | vini | telefono-390/chiaro | FALLITO | badge Presente | inglese | /app/menu/wines |
| vini-formati-ui | vini | telefono-390/chiaro | FALLITO | volume Non indicata \| volume 75 cl \| volume 150 cl | capacità/grado | /app/menu/wines |
| vini-origine-cascata | vini | telefono-390/chiaro | FALLITO | regioni Italia assenti \| locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })     - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:…>…</div>   - attempting click action     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action     - waiting 20ms     2 × waiting for element to be visible, enabled and stable       - element is not visible     - retrying click action       - waiting 100ms     58 × waiting for element to be visible, enabled and stable        - element is not visible      - retrying click action        - waiting 500ms  | origine §7 | /app/menu/wines |
| vini-origine-fuori-filtro | vini | telefono-390/chiaro | FALLITO | paese salvato non visibile | paese disabilitato in elenco | /app/menu/wines |
| vini-coerenza-geografica | vini | telefono-390/chiaro | NON PROVATO | — | locale-dev only | ambiente |
| vini-tassonomie | vini | telefono-390/chiaro | FALLITO | tipologie vuote | tassonomie | /app/menu/wines |
| vini-persistenza | vini | telefono-390/chiaro | FALLITO | create read | persistenza | /app/menu/wines |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| distillati-colonna-elenco | distillati | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/spirits |
| distillati-righe-azioni | distillati | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize | tre icone, switch disabilitato su disabled | /app/menu/spirits |
| distillati-elimina-registro-permessi | distillati | telefono-390/chiaro | FALLITO | registro delete manager; norole: NON PROVATO (schema Users) | registro e permessi staff | payload |
| distillati-modulo-inglese | distillati | telefono-390/chiaro | FALLITO | badge Presente \| read en | inglese | /app/menu/spirits |
| distillati-tassonomie | distillati | telefono-390/chiaro | FALLITO | tipologie vuote | tassonomie | /app/menu/spirits |
| distillati-persistenza | distillati | telefono-390/chiaro | FALLITO | create read | persistenza | /app/menu/spirits |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| bevande-colonna-elenco | bevande | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/drinks |
| bevande-righe-azioni | bevande | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize | tre icone, switch disabilitato su disabled | /app/menu/drinks |
| bevande-elimina-registro-permessi | bevande | telefono-390/chiaro | FALLITO | registro delete manager; norole: NON PROVATO (schema Users) | registro e permessi staff | payload |
| bevande-modulo-inglese | bevande | telefono-390/chiaro | FALLITO | badge Presente | inglese | /app/menu/drinks |
| bevande-tassonomie | bevande | telefono-390/chiaro | FALLITO | tipologie vuote | tassonomie | /app/menu/drinks |
| bevande-persistenza | bevande | telefono-390/chiaro | FALLITO | create read | persistenza | /app/menu/drinks |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | Indietro 274x42; Elimina 274x42 | nessun elemento sotto 44 px | elimina |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| bevande-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| C1 | piatti/elenco | telefono-390/chiaro | NON PROVATO | tempo: elenco | scroll orizzontale | elenco |
| C1 | piatti/elenco | notebook-1280/chiaro | NON PROVATO | tempo: elenco | scroll orizzontale | elenco |
| C1 | piatti/elenco | telefono-390/scuro | NON PROVATO | tempo: elenco | scroll orizzontale | elenco |
| C1 | piatti/elenco | notebook-1280/scuro | NON PROVATO | tempo: elenco | scroll orizzontale | elenco |
| C1 | piatti/filtri | telefono-390/chiaro | NON PROVATO | tempo: filtri | scroll orizzontale | filtri |
| C1 | piatti/filtri | notebook-1280/chiaro | NON PROVATO | tempo: filtri | scroll orizzontale | filtri |
| C1 | piatti/filtri | telefono-390/scuro | NON PROVATO | tempo: filtri | scroll orizzontale | filtri |
| C1 | piatti/filtri | notebook-1280/scuro | NON PROVATO | tempo: filtri | scroll orizzontale | filtri |
| C1 | piatti/filtri-attivi | telefono-390/chiaro | NON PROVATO | tempo: filtri-attivi | scroll orizzontale | filtri-attivi |
| C1 | piatti/filtri-attivi | notebook-1280/chiaro | NON PROVATO | tempo: filtri-attivi | scroll orizzontale | filtri-attivi |
| C1 | piatti/filtri-attivi | telefono-390/scuro | NON PROVATO | tempo: filtri-attivi | scroll orizzontale | filtri-attivi |
| C1 | piatti/filtri-attivi | notebook-1280/scuro | NON PROVATO | tempo: filtri-attivi | scroll orizzontale | filtri-attivi |
| C1 | piatti/modulo | telefono-390/chiaro | NON PROVATO | tempo: modulo | scroll orizzontale | modulo |
| C1 | piatti/modulo | notebook-1280/chiaro | NON PROVATO | tempo: modulo | scroll orizzontale | modulo |
| C1 | piatti/modulo | telefono-390/scuro | NON PROVATO | tempo: modulo | scroll orizzontale | modulo |
| C1 | piatti/modulo | notebook-1280/scuro | NON PROVATO | tempo: modulo | scroll orizzontale | modulo |
| C1 | piatti/modulo-allergeni | telefono-390/chiaro | NON PROVATO | tempo: modulo-allergeni | scroll orizzontale | modulo-allergeni |
| C1 | piatti/modulo-allergeni | notebook-1280/chiaro | NON PROVATO | tempo: modulo-allergeni | scroll orizzontale | modulo-allergeni |
| C1 | piatti/modulo-allergeni | telefono-390/scuro | NON PROVATO | tempo: modulo-allergeni | scroll orizzontale | modulo-allergeni |
| C1 | piatti/modulo-allergeni | notebook-1280/scuro | NON PROVATO | tempo: modulo-allergeni | scroll orizzontale | modulo-allergeni |
| C1 | piatti/modulo-inglese-aperto | telefono-390/chiaro | NON PROVATO | tempo: modulo-inglese-aperto | scroll orizzontale | modulo-inglese-aperto |
| C1 | piatti/modulo-inglese-aperto | notebook-1280/chiaro | NON PROVATO | tempo: modulo-inglese-aperto | scroll orizzontale | modulo-inglese-aperto |
| C1 | piatti/modulo-inglese-aperto | telefono-390/scuro | NON PROVATO | tempo: modulo-inglese-aperto | scroll orizzontale | modulo-inglese-aperto |
| C1 | piatti/modulo-inglese-aperto | notebook-1280/scuro | NON PROVATO | tempo: modulo-inglese-aperto | scroll orizzontale | modulo-inglese-aperto |
| C1 | piatti/nuovo | telefono-390/chiaro | NON PROVATO | tempo: nuovo | scroll orizzontale | nuovo |
| C1 | piatti/nuovo | notebook-1280/chiaro | NON PROVATO | tempo: nuovo | scroll orizzontale | nuovo |
| C1 | piatti/nuovo | telefono-390/scuro | NON PROVATO | tempo: nuovo | scroll orizzontale | nuovo |
| C1 | piatti/nuovo | notebook-1280/scuro | NON PROVATO | tempo: nuovo | scroll orizzontale | nuovo |
| C1 | piatti/nuovo-errori | telefono-390/chiaro | NON PROVATO | tempo: nuovo-errori | scroll orizzontale | nuovo-errori |
| C1 | piatti/nuovo-errori | notebook-1280/chiaro | NON PROVATO | tempo: nuovo-errori | scroll orizzontale | nuovo-errori |
| C1 | piatti/nuovo-errori | telefono-390/scuro | NON PROVATO | tempo: nuovo-errori | scroll orizzontale | nuovo-errori |
| C1 | piatti/nuovo-errori | notebook-1280/scuro | NON PROVATO | tempo: nuovo-errori | scroll orizzontale | nuovo-errori |
| C1 | piatti/elimina-libero | telefono-390/chiaro | NON PROVATO | tempo: elimina-libero | scroll orizzontale | elimina-libero |
| C1 | piatti/elimina-libero | notebook-1280/chiaro | NON PROVATO | tempo: elimina-libero | scroll orizzontale | elimina-libero |
| C1 | piatti/elimina-libero | telefono-390/scuro | NON PROVATO | tempo: elimina-libero | scroll orizzontale | elimina-libero |
| C1 | piatti/elimina-libero | notebook-1280/scuro | NON PROVATO | tempo: elimina-libero | scroll orizzontale | elimina-libero |
| C1 | piatti/elimina-bloccato | telefono-390/chiaro | NON PROVATO | tempo: elimina-bloccato | scroll orizzontale | elimina-bloccato |
| C1 | piatti/elimina-bloccato | notebook-1280/chiaro | NON PROVATO | tempo: elimina-bloccato | scroll orizzontale | elimina-bloccato |
| C1 | piatti/elimina-bloccato | telefono-390/scuro | NON PROVATO | tempo: elimina-bloccato | scroll orizzontale | elimina-bloccato |
| C1 | piatti/elimina-bloccato | notebook-1280/scuro | NON PROVATO | tempo: elimina-bloccato | scroll orizzontale | elimina-bloccato |
| C1 | piatti/errore-azione | telefono-390/chiaro | NON PROVATO | tempo: errore-azione | scroll orizzontale | errore-azione |
| C1 | piatti/errore-azione | notebook-1280/chiaro | NON PROVATO | tempo: errore-azione | scroll orizzontale | errore-azione |
| C1 | piatti/errore-azione | telefono-390/scuro | NON PROVATO | tempo: errore-azione | scroll orizzontale | errore-azione |
| C1 | piatti/errore-azione | notebook-1280/scuro | NON PROVATO | tempo: errore-azione | scroll orizzontale | errore-azione |
| C1 | piatti/nessun-risultato | telefono-390/chiaro | NON PROVATO | tempo: nessun-risultato | scroll orizzontale | nessun-risultato |
| C1 | piatti/nessun-risultato | notebook-1280/chiaro | NON PROVATO | tempo: nessun-risultato | scroll orizzontale | nessun-risultato |
| C1 | piatti/nessun-risultato | telefono-390/scuro | NON PROVATO | tempo: nessun-risultato | scroll orizzontale | nessun-risultato |
| C1 | piatti/nessun-risultato | notebook-1280/scuro | NON PROVATO | tempo: nessun-risultato | scroll orizzontale | nessun-risultato |
| C1 | piatti/caricamento | telefono-390/chiaro | NON PROVATO | tempo: caricamento | scroll orizzontale | caricamento |
| C1 | piatti/caricamento | notebook-1280/chiaro | NON PROVATO | tempo: caricamento | scroll orizzontale | caricamento |
| C1 | piatti/caricamento | telefono-390/scuro | NON PROVATO | tempo: caricamento | scroll orizzontale | caricamento |
| C1 | piatti/caricamento | notebook-1280/scuro | NON PROVATO | tempo: caricamento | scroll orizzontale | caricamento |
| C1 | piatti/errore-caricamento | telefono-390/chiaro | NON PROVATO | tempo: errore-caricamento | scroll orizzontale | errore-caricamento |
| C1 | piatti/errore-caricamento | notebook-1280/chiaro | NON PROVATO | tempo: errore-caricamento | scroll orizzontale | errore-caricamento |
| C1 | piatti/errore-caricamento | telefono-390/scuro | NON PROVATO | tempo: errore-caricamento | scroll orizzontale | errore-caricamento |
| C1 | piatti/errore-caricamento | notebook-1280/scuro | NON PROVATO | tempo: errore-caricamento | scroll orizzontale | errore-caricamento |
| C1 | piatti/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C1 | piatti/vuoto | notebook-1280/chiaro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C1 | piatti/vuoto | telefono-390/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C1 | piatti/vuoto | notebook-1280/scuro | NON PROVATO | stato vuoto: DB con 44 piatti | scroll orizzontale | vuoto |
| C1 | piatti/piu-di-100 | telefono-390/chiaro | NON PROVATO | tempo: piu-di-100 | scroll orizzontale | piu-di-100 |
| C1 | piatti/piu-di-100 | notebook-1280/chiaro | NON PROVATO | tempo: piu-di-100 | scroll orizzontale | piu-di-100 |
| C1 | piatti/piu-di-100 | telefono-390/scuro | NON PROVATO | tempo: piu-di-100 | scroll orizzontale | piu-di-100 |
| C1 | piatti/piu-di-100 | notebook-1280/scuro | NON PROVATO | tempo: piu-di-100 | scroll orizzontale | piu-di-100 |

## Non provato (e perché)
- (nessuno)

## Anomalie dell'ambiente
- (nessuna)
