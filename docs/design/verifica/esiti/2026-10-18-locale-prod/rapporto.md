# Esito verifica — locale-prod — 2026-10-18
Commit: f0bdd6b0d4ba · Lanciatore: 3.6.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 5 min 56 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 457 · FALLITO: 12 · AVVISO: 4 · NON PROVATO: 116 · Controlli distinti nel JSON corrente: 34

## Pacchetto: accesso
Righe: 47 · OK: 47 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 28 · OK: 28 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 428 · OK: 352 · FALLITO: 12

### FALLITO (menu)
- **bevande-paese-fuori-filtro** | bevande | telefono-390/chiaro | misurato `paese API=n/a; trigger="Facoltativo"; sottotitolo=; record senza paese in API` | atteso `nome paese salvato nel trigger (atteso: paese salvato)` | evidenza: /app/menu/drinks
- **bevande-persistenza** | bevande | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/drinks
- **bevande-righe-azioni** | bevande | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/drinks
- **distillati-persistenza** | distillati | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/spirits
- **distillati-righe-azioni** | distillati | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/spirits
- **menu-fissi-ordine-piatti** | menu-fissi | telefono-390/chiaro | misurato `piatto non trovato` | atteso `frecce 44px` | evidenza: /app/menu/fixed
- **menu-fissi-visibilita-categoria** | menu-fissi | telefono-390/chiaro | misurato `Nuovo menù fisso

Il menù compare nel menù pubblico dopo la ricompilazione.

Nome
Descrizione
Prezzo (€)
Categoria
verify-ui-pranzo
Visibilità
Solo pranzo

Quando compare nel menù pubblico. Vale insieme alla visibilità d` | atteso `avvisi visibilità` | evidenza: /app/menu/fixed
- **servizi-elimina-cascade-registro-permessi** | servizi | telefono-390/chiaro | misurato `menu ancora con servizio; log=null; super: skip delete duplicato; norole: NON PROVATO (menu payload ensure-norole-user: $ cross-env NODE_OPTIONS=--no-deprecation paylo)` | atteso `cascade+registro` | evidenza: payload
- **servizi-righe-azioni** | servizi | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `righe azioni` | evidenza: /app/menu/services
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume opzioni (7): Non indicata | 25 cl | 33 cl | 37,5 cl | 50 cl | 75 cl | 150 cl; atteso: Non indicata | 25 cl | 33 cl | 37,5 cl | 50 cl | 75 cl | 150 cl; grado UI=; locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Modifica verify-ui-grade-fmt/i }).first() to be visible
` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-persistenza** | vini | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/wines
- **vini-righe-azioni** | vini | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/wines

## Pacchetto: completo
Righe: 86 · OK: 30 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 30/30 combinazioni
- **bevande-azioni-pagina**: OK in 2/2 combinazioni
- **bevande-colonne-fisse**: OK in 1/1 combinazioni
- **bevande-disponibilita**: OK in 1/1 combinazioni
- **bevande-elimina**: OK in 1/1 combinazioni
- **bevande-elimina-registro-permessi**: OK in 1/1 combinazioni
- **bevande-filtri-ricerca**: OK in 1/1 combinazioni
- **bevande-formati-server**: OK in 1/1 combinazioni
- **bevande-modulo-campi**: OK in 2/2 combinazioni
- **bevande-modulo-footer**: OK in 1/1 combinazioni
- **bevande-modulo-inglese**: OK in 1/1 combinazioni
- **bevande-modulo-validazione**: OK in 1/1 combinazioni
- **bevande-nomi-accessibili**: OK in 1/1 combinazioni
- **bevande-paese-facoltativo**: OK in 1/1 combinazioni
- **bevande-tassonomie**: OK in 1/1 combinazioni
- **bevande-testi**: OK in 1/1 combinazioni
- **C2-mouse**: OK in 26/26 combinazioni
- **C3-cambio-sistema**: OK in 17/17 combinazioni
- **C9**: OK in 30/30 combinazioni
- **distillati-azioni-pagina**: OK in 2/2 combinazioni
- **distillati-capacita-non-gestita**: OK in 1/1 combinazioni
- **distillati-colonne-fisse**: OK in 1/1 combinazioni
- **distillati-disponibilita**: OK in 1/1 combinazioni
- **distillati-elimina**: OK in 1/1 combinazioni
- **distillati-elimina-registro-permessi**: OK in 1/1 combinazioni
- **distillati-filtri-ricerca**: OK in 1/1 combinazioni
- **distillati-formati-server**: OK in 1/1 combinazioni
- **distillati-modulo-campi**: OK in 2/2 combinazioni
- **distillati-modulo-footer**: OK in 1/1 combinazioni
- **distillati-modulo-inglese**: OK in 1/1 combinazioni
- **distillati-modulo-validazione**: OK in 1/1 combinazioni
- **distillati-nomi-accessibili**: OK in 1/1 combinazioni
- **distillati-paese-fuori-filtro**: OK in 1/1 combinazioni
- **distillati-tassonomie**: OK in 1/1 combinazioni
- **distillati-testi**: OK in 1/1 combinazioni
- **home-colonne**: OK in 2/2 combinazioni
- **home-larghezza**: OK in 4/4 combinazioni
- **home-righe-di-stato**: OK in 2/2 combinazioni
- **home-testi**: OK in 2/2 combinazioni
- **menu-fissi-categoria-modulo**: OK in 1/1 combinazioni
- **menu-fissi-composizione**: OK in 1/1 combinazioni
- **menu-fissi-modulo-validazione**: OK in 1/1 combinazioni
- **menu-fissi-schede-percorsi**: OK in 1/1 combinazioni
- **NO-OVERRIDE**: OK in 11/11 combinazioni
- **piatti-modulo-inglese**: OK in 1/1 combinazioni
- **servizi-azioni-pagina**: OK in 2/2 combinazioni
- **servizi-colonne-fisse**: OK in 1/1 combinazioni
- **servizi-disponibilita**: OK in 1/1 combinazioni
- **servizi-elimina-senza-uso**: OK in 1/1 combinazioni
- **servizi-elimina-usato**: OK in 1/1 combinazioni
- **servizi-modulo-campi**: OK in 2/2 combinazioni
- **servizi-modulo-footer**: OK in 1/1 combinazioni
- **servizi-modulo-inglese**: OK in 1/1 combinazioni
- **servizi-modulo-validazione**: OK in 1/1 combinazioni
- **servizi-nomi-accessibili**: OK in 1/1 combinazioni
- **servizi-ordine**: OK in 1/1 combinazioni
- **servizi-persistenza**: OK in 1/1 combinazioni
- **servizi-senza-ricerca-filtri**: OK in 1/1 combinazioni
- **servizi-testi**: OK in 1/1 combinazioni
- **vini-azioni-pagina**: OK in 2/2 combinazioni
- **vini-colonne-fisse**: OK in 1/1 combinazioni
- **vini-disponibilita**: OK in 1/1 combinazioni
- **vini-elimina**: OK in 1/1 combinazioni
- **vini-elimina-registro-permessi**: OK in 1/1 combinazioni
- **vini-filtri-origine**: OK in 1/1 combinazioni
- **vini-filtri-ricerca**: OK in 1/1 combinazioni
- **vini-formati-server**: OK in 1/1 combinazioni
- **vini-modulo-anno**: OK in 1/1 combinazioni
- **vini-modulo-campi**: OK in 2/2 combinazioni
- **vini-modulo-footer**: OK in 1/1 combinazioni
- **vini-modulo-inglese**: OK in 1/1 combinazioni
- **vini-modulo-validazione**: OK in 1/1 combinazioni
- **vini-nomi-accessibili**: OK in 1/1 combinazioni
- **vini-origine-cascata**: OK in 1/1 combinazioni
- **vini-origine-fuori-filtro**: OK in 1/1 combinazioni
- **vini-origine-opzioni-query**: OK in 1/1 combinazioni
- **vini-tassonomie**: OK in 1/1 combinazioni
- **vini-testi**: OK in 1/1 combinazioni
- **C3**: OK in 96/99 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **servizi-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 84/87 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 64/67 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **distillati-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **bevande-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **vini-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **bevande-paese-fuori-filtro** | bevande | telefono-390/chiaro | misurato `paese API=n/a; trigger="Facoltativo"; sottotitolo=; record senza paese in API` | atteso `nome paese salvato nel trigger (atteso: paese salvato)` | evidenza: /app/menu/drinks
- **bevande-persistenza** | bevande | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/drinks
- **bevande-righe-azioni** | bevande | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/drinks
- **distillati-persistenza** | distillati | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/spirits
- **distillati-righe-azioni** | distillati | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/spirits
- **menu-fissi-ordine-piatti** | menu-fissi | telefono-390/chiaro | misurato `piatto non trovato` | atteso `frecce 44px` | evidenza: /app/menu/fixed
- **menu-fissi-visibilita-categoria** | menu-fissi | telefono-390/chiaro | misurato `Nuovo menù fisso

Il menù compare nel menù pubblico dopo la ricompilazione.

Nome
Descrizione
Prezzo (€)
Categoria
verify-ui-pranzo
Visibilità
Solo pranzo

Quando compare nel menù pubblico. Vale insieme alla visibilità d` | atteso `avvisi visibilità` | evidenza: /app/menu/fixed
- **servizi-elimina-cascade-registro-permessi** | servizi | telefono-390/chiaro | misurato `menu ancora con servizio; log=null; super: skip delete duplicato; norole: NON PROVATO (menu payload ensure-norole-user: $ cross-env NODE_OPTIONS=--no-deprecation paylo)` | atteso `cascade+registro` | evidenza: payload
- **servizi-righe-azioni** | servizi | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `righe azioni` | evidenza: /app/menu/services
- **vini-formati-ui** | vini | telefono-390/chiaro | misurato `volume opzioni (7): Non indicata | 25 cl | 33 cl | 37,5 cl | 50 cl | 75 cl | 150 cl; atteso: Non indicata | 25 cl | 33 cl | 37,5 cl | 50 cl | 75 cl | 150 cl; grado UI=; locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Modifica verify-ui-grade-fmt/i }).first() to be visible
` | atteso `capacità/grado` | evidenza: /app/menu/wines
- **vini-persistenza** | vini | telefono-390/chiaro | misurato `create non verificato; page.waitForFunction: Timeout 15000ms exceeded.` | atteso `persistenza` | evidenza: /app/menu/wines
- **vini-righe-azioni** | vini | telefono-390/chiaro | misurato `switch attivo su disabled` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu/wines

### AVVISO
- **servizi-colonna-elenco** | servizi | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout` | evidenza: /app/menu/services
- **distillati-colonna-elenco** | distillati | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/spirits
- **bevande-colonna-elenco** | bevande | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout colonna/schede` | evidenza: /app/menu/drinks
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
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **RICOMPILA-ASSENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **servizi-ricompila** | servizi | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
- **servizi-accesso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-confronto-visivo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stato-vuoto** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **menu-fissi-accesso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-azioni-pagina** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-categorie-elenco** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-categorie-niente-eliminazione** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-colonna-elenco** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-colonne-fisse** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-confronto-visivo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-disponibilita** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-doppioni** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-cascade-registro-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-senza-uso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-usato** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-modulo-campi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-nessuna-categoria** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-nomi-accessibili** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-ordine-liste** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-porzione-traduzione** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-ricompila** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-righe-azioni** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-servizi-piatti** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-stato-vuoto** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-tassonomie** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-testi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C1** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C1` | evidenza: vuoto
- **C2** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C2` | evidenza: vuoto
- **C3** | distillati/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 38 record` | atteso `C3` | evidenza: vuoto
- **distillati-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **distillati-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **C1** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C1` | evidenza: vuoto
- **C2** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C2` | evidenza: vuoto
- **C3** | bevande/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 13 record` | atteso `C3` | evidenza: vuoto
- **bevande-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-formati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **bevande-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **vini-coerenza-geografica** | vini | telefono-390/chiaro | misurato `—` | atteso `locale-dev only` | evidenza: ambiente
- **C1** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C1` | evidenza: vuoto
- **C2** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C2` | evidenza: vuoto
- **C3** | vini/vuoto | telefono-390/chiaro | misurato `stato vuoto: DB con 90 record` | atteso `C3` | evidenza: vuoto
- **vini-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **vini-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (30/30) |
| C1 | NON PROVATO (84/87) |
| C2 | NON PROVATO (64/67) |
| C2-mouse | OK (26/26) |
| C3 | NON PROVATO (96/99) |
| C9 | OK (30/30) |
| NO-OVERRIDE | OK (11/11) |
| RICOMPILA-ASSENTE | NON PROVATO (0/1) |
| vini-azioni-pagina | OK (2/2) |
| vini-coerenza-geografica | NON PROVATO (0/1) |
| vini-colonna-elenco | AVVISO (3/4) |
| vini-colonne-fisse | OK (1/1) |
| vini-console | NON PROVATO (0/1) |
| vini-disponibilita | OK (1/1) |
| vini-elimina | OK (1/1) |
| vini-elimina-registro-permessi | OK (1/1) |
| vini-filtri-origine | OK (1/1) |
| vini-filtri-ricerca | OK (1/1) |
| vini-formati-server | OK (1/1) |
| vini-formati-ui | FALLITO (0/1) |
| vini-modulo-anno | OK (1/1) |
| vini-modulo-campi | OK (2/2) |
| vini-modulo-footer | OK (1/1) |
| vini-modulo-inglese | OK (1/1) |
| vini-modulo-validazione | OK (1/1) |
| vini-nomi-accessibili | OK (1/1) |
| vini-origine-cascata | OK (1/1) |
| vini-origine-fuori-filtro | OK (1/1) |
| vini-origine-opzioni-query | OK (1/1) |
| vini-persistenza | FALLITO (0/1) |
| vini-righe-azioni | FALLITO (0/1) |
| vini-stati-ui | NON PROVATO (0/1) |
| vini-tassonomie | OK (1/1) |
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
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| RICOMPILA-ASSENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| servizi-colonna-elenco | servizi | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout | /app/menu/services |
| servizi-righe-azioni | servizi | telefono-390/chiaro | FALLITO | switch attivo su disabled | righe azioni | /app/menu/services |
| servizi-elimina-cascade-registro-permessi | servizi | telefono-390/chiaro | FALLITO | menu ancora con servizio; log=null; super: skip delete duplicato; norole: NON PROVATO (menu payload ensure-norole-user: $ cross-env NODE_OPTIONS=--no-deprecation paylo) | cascade+registro | payload |
| servizi-ricompila | servizi | telefono-390/chiaro | NON PROVATO | — | — | rinviato alla 6.5 |
| servizi-accesso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-confronto-visivo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stato-vuoto | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| menu-fissi-ordine-piatti | menu-fissi | telefono-390/chiaro | FALLITO | piatto non trovato | frecce 44px | /app/menu/fixed |
| menu-fissi-visibilita-categoria | menu-fissi | telefono-390/chiaro | FALLITO | Nuovo menù fisso  Il menù compare nel menù pubblico dopo la ricompilazione.  Nome Descrizione Prezzo (€) Categoria verify-ui-pranzo Visibilità Solo pranzo  Quando compare nel menù pubblico. Vale insieme alla visibilità d | avvisi visibilità | /app/menu/fixed |
| menu-fissi-accesso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-azioni-pagina | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-categorie-elenco | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-categorie-niente-eliminazione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-colonna-elenco | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-colonne-fisse | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-confronto-visivo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-disponibilita | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-doppioni | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-cascade-registro-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-senza-uso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-usato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-modulo-campi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-nessuna-categoria | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-ordine-liste | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-porzione-traduzione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-ricompila | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-righe-azioni | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-servizi-piatti | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-stato-vuoto | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-tassonomie | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-testi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| distillati-colonna-elenco | distillati | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/spirits |
| distillati-righe-azioni | distillati | telefono-390/chiaro | FALLITO | switch attivo su disabled | tre icone, switch disabilitato su disabled | /app/menu/spirits |
| distillati-persistenza | distillati | telefono-390/chiaro | FALLITO | create non verificato; page.waitForFunction: Timeout 15000ms exceeded. | persistenza | /app/menu/spirits |
| C1 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C1 | vuoto |
| C2 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C2 | vuoto |
| C3 | distillati/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 38 record | C3 | vuoto |
| distillati-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| distillati-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| bevande-colonna-elenco | bevande | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/drinks |
| bevande-righe-azioni | bevande | telefono-390/chiaro | FALLITO | switch attivo su disabled | tre icone, switch disabilitato su disabled | /app/menu/drinks |
| bevande-paese-fuori-filtro | bevande | telefono-390/chiaro | FALLITO | paese API=n/a; trigger="Facoltativo"; sottotitolo=; record senza paese in API | nome paese salvato nel trigger (atteso: paese salvato) | /app/menu/drinks |
| bevande-persistenza | bevande | telefono-390/chiaro | FALLITO | create non verificato; page.waitForFunction: Timeout 15000ms exceeded. | persistenza | /app/menu/drinks |
| C1 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C1 | vuoto |
| C2 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C2 | vuoto |
| C3 | bevande/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 13 record | C3 | vuoto |
| bevande-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-formati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| bevande-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| vini-colonna-elenco | vini | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout colonna/schede | /app/menu/wines |
| vini-righe-azioni | vini | telefono-390/chiaro | FALLITO | switch attivo su disabled | tre icone, switch disabilitato su disabled | /app/menu/wines |
| vini-formati-ui | vini | telefono-390/chiaro | FALLITO | volume opzioni (7): Non indicata \| 25 cl \| 33 cl \| 37,5 cl \| 50 cl \| 75 cl \| 150 cl; atteso: Non indicata \| 25 cl \| 33 cl \| 37,5 cl \| 50 cl \| 75 cl \| 150 cl; grado UI=; locator.waitFor: Timeout 20000ms exceeded. Call log:   - waiting for getByRole('button', { name: /Modifica verify-ui-grade-fmt/i }).first() to be visible  | capacità/grado | /app/menu/wines |
| vini-coerenza-geografica | vini | telefono-390/chiaro | NON PROVATO | — | locale-dev only | ambiente |
| vini-persistenza | vini | telefono-390/chiaro | FALLITO | create non verificato; page.waitForFunction: Timeout 15000ms exceeded. | persistenza | /app/menu/wines |
| C1 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C1 | vuoto |
| C2 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C2 | vuoto |
| C3 | vini/vuoto | telefono-390/chiaro | NON PROVATO | stato vuoto: DB con 90 record | C3 | vuoto |
| vini-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| vini-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- vini-console: controllo non eseguito dal lanciatore in questa esecuzione
- vini-stati-ui: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
