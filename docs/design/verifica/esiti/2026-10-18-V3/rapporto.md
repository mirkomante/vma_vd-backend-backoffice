# Riepilogo verifica V3 — I3 (Vini, Distillati, Bevande)

**HEAD**: `853fbe1` (I3: `7bdfa5b`, `97a48b5`). **Lanciatore**: 3.4.1. **Browser prod**: Chromium 140.0.7339.186.

Esiti dettagliati: [locale-prod](../2026-10-18-locale-prod/rapporto.md), [locale-dev](../2026-10-18-locale-dev/rapporto.md).

## Note esecuzione

- Catalogo L2 su **locale-prod** in passate separate (timeout 25 min default insufficiente per 3 schermate): usare `UI_VERIFY_TIMEOUT_LOCALE_PROD_MS=3600000`.
- Fix lanciatore: merge esiti tra giri (`prepareMenuPackageRerun`), `prepareCatalogBulk101` import, `modulo-inglese`, dedupe placeholder in `report.write`.

## vini

Screenshot `vini-*`: **80** PNG in `2026-10-18-locale-prod/img/`.

**locale-dev** `vini-console`: OK (err:0 warn:0, err:0 warn:0).

### FALLITO
- **C2**: FALLITO — misurato: Indietro 274x42; Elimina 274x42; atteso: nessun elemento sotto 44 px; classificazione: controllo dubbio (pulsanti dialogo elimina nel foglio C2 stato elimina)
- **vini-elimina-registro-permessi**: FALLITO — misurato: registro delete manager; norole: NON PROVATO (schema Users); atteso: registro e permessi staff; classificazione: difetto del lanciatore (norole NON PROVATO: manca utente staff di prova nel payload)
- **vini-formati-ui**: FALLITO — misurato: volume Non indicata | volume 75 cl | volume 150 cl; atteso: capacità/grado; classificazione: da classificare in design
- **vini-modulo-inglese**: FALLITO — misurato: badge Presente; atteso: inglese; classificazione: difetto dell'app (badge «Presente» non visibile nel foglio)
- **vini-origine-cascata**: FALLITO — misurato: regioni Italia assenti | locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: 'Friuli Venezia Giulia', exact: true })
    - locator resolved to <div role="option" tabindex="-1" aria-selected="false" data-slot="select-item" class="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:…>…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    58 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms
; atteso: origine §7; classificazione: da classificare in design
- **vini-origine-fuori-filtro**: FALLITO — misurato: paese salvato non visibile; atteso: paese disabilitato in elenco; classificazione: da classificare in design
- **vini-persistenza**: FALLITO — misurato: create read; atteso: persistenza; classificazione: da classificare in design
- **vini-tassonomie**: FALLITO — misurato: tipologie vuote; atteso: tassonomie; classificazione: da classificare in design

### AVVISO
- **vini-colonna-elenco**: AVVISO — misurato: {"tableVisible":false,"colW":358,"nameW":178}; atteso: layout colonna/schede
- **vini-confronto-visivo**: AVVISO — misurato: screenshot=80/84; saltati=vuoto: DB=90; vuoto: DB=90; vuoto: DB=90; vuoto: DB=90; atteso: 21 stati × profili × temi

### NON PROVATO
- **C1**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: scroll orizzontale; motivo: vuoto
- **C2-mouse**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: altezza mouse; motivo: vuoto
- **C3**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: classe tema; motivo: vuoto
- **RICOMPILA-PRESENTE**: NON PROVATO — misurato: —; atteso: pulsante Ricompila presente; motivo: rinviato alla 6.5
- **vini-accesso**: NON PROVATO — misurato: —; atteso: guardia 8.3; motivo: verify-roles-8_3.ts / stato_prova JSON
- **vini-coerenza-geografica**: NON PROVATO — misurato: —; atteso: locale-dev only; motivo: ambiente
- **vini-ricompila**: NON PROVATO — misurato: —; atteso: rinviato 6.5; motivo: stato_prova JSON
- **vini-righe-azioni**: NON PROVATO — misurato: misura non acquisita: btnSize; atteso: tre icone, switch disabilitato su disabled; motivo: /app/menu/wines
- **vini-stato-vuoto**: NON PROVATO — misurato: DB con 90 record; atteso: elenco vuoto; motivo: giudizio C10 / confronto visivo
- **vini-coerenza-geografica**: NON PROVATO — solo locale-dev per simulazione geografia (su prod: ambiente)

### OK
- **AMBIENTE**: OK (16/16 combinazioni)
- **C3-cambio-sistema**: OK (8/8 combinazioni)
- **C9**: OK (16/16 combinazioni)
- **NO-OVERRIDE**: OK (6/6 combinazioni)
- **RICOMPILA-ASSENTE**: OK (1/1 combinazioni)
- **vini-azioni-pagina**: OK (2/2 combinazioni)
- **vini-colonne-fisse**: OK (1/1 combinazioni)
- **vini-disponibilita**: OK (1/1 combinazioni)
- **vini-elimina**: OK (1/1 combinazioni)
- **vini-filtri-origine**: OK (1/1 combinazioni)
- **vini-filtri-ricerca**: OK (1/1 combinazioni)
- **vini-formati-server**: OK (1/1 combinazioni)
- **vini-modulo-anno**: OK (1/1 combinazioni)
- **vini-modulo-campi**: OK (2/2 combinazioni)
- **vini-modulo-footer**: OK (1/1 combinazioni)
- **vini-modulo-validazione**: OK (1/1 combinazioni)
- **vini-nomi-accessibili**: OK (1/1 combinazioni)
- **vini-ordine-100**: OK (1/1 combinazioni)
- **vini-origine-opzioni-query**: OK (1/1 combinazioni)
- **vini-testi**: OK (1/1 combinazioni)

## distillati

Screenshot `distillati-*`: **60** PNG in `2026-10-18-locale-prod/img/`.

**locale-dev** `distillati-console`: OK (err:0 warn:0, err:0 warn:0).

### FALLITO
- **C2**: FALLITO — misurato: Indietro 274x42; Elimina 274x42; atteso: nessun elemento sotto 44 px; classificazione: controllo dubbio (pulsanti dialogo elimina nel foglio C2 stato elimina)
- **distillati-elimina-registro-permessi**: FALLITO — misurato: registro delete manager; norole: NON PROVATO (schema Users); atteso: registro e permessi staff; classificazione: difetto del lanciatore (norole NON PROVATO: manca utente staff di prova nel payload)
- **distillati-modulo-inglese**: FALLITO — misurato: badge Presente; atteso: inglese; classificazione: difetto dell'app (badge «Presente» non visibile nel foglio)
- **distillati-persistenza**: FALLITO — misurato: create read; atteso: persistenza; classificazione: da classificare in design
- **distillati-tassonomie**: FALLITO — misurato: tipologie vuote; atteso: tassonomie; classificazione: da classificare in design

### AVVISO
- **distillati-colonna-elenco**: AVVISO — misurato: {"tableVisible":false,"colW":358,"nameW":178}; atteso: layout colonna/schede
- **distillati-confronto-visivo**: AVVISO — misurato: screenshot=60/64; saltati=vuoto: DB=38; vuoto: DB=38; vuoto: DB=38; vuoto: DB=38; atteso: 16 stati × profili × temi

### NON PROVATO
- **C1**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: scroll orizzontale; motivo: vuoto
- **C2-mouse**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: altezza mouse; motivo: vuoto
- **C3**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: classe tema; motivo: vuoto
- **RICOMPILA-PRESENTE**: NON PROVATO — misurato: —; atteso: pulsante Ricompila presente; motivo: rinviato alla 6.5
- **distillati-accesso**: NON PROVATO — misurato: —; atteso: guardia 8.3; motivo: verify-roles-8_3.ts / stato_prova JSON
- **distillati-ricompila**: NON PROVATO — misurato: —; atteso: rinviato 6.5; motivo: stato_prova JSON
- **distillati-righe-azioni**: NON PROVATO — misurato: misura non acquisita: btnSize; atteso: tre icone, switch disabilitato su disabled; motivo: /app/menu/spirits
- **distillati-stato-vuoto**: NON PROVATO — misurato: DB con 38 record; atteso: elenco vuoto; motivo: giudizio C10 / confronto visivo

### OK
- **AMBIENTE**: OK (16/16 combinazioni)
- **C3-cambio-sistema**: OK (8/8 combinazioni)
- **C9**: OK (16/16 combinazioni)
- **NO-OVERRIDE**: OK (6/6 combinazioni)
- **RICOMPILA-ASSENTE**: OK (1/1 combinazioni)
- **distillati-azioni-pagina**: OK (2/2 combinazioni)
- **distillati-capacita-non-gestita**: OK (1/1 combinazioni)
- **distillati-colonne-fisse**: OK (1/1 combinazioni)
- **distillati-disponibilita**: OK (1/1 combinazioni)
- **distillati-elimina**: OK (1/1 combinazioni)
- **distillati-filtri-ricerca**: OK (1/1 combinazioni)
- **distillati-formati-server**: OK (1/1 combinazioni)
- **distillati-modulo-campi**: OK (2/2 combinazioni)
- **distillati-modulo-footer**: OK (1/1 combinazioni)
- **distillati-modulo-validazione**: OK (1/1 combinazioni)
- **distillati-nomi-accessibili**: OK (1/1 combinazioni)
- **distillati-ordine-100**: OK (1/1 combinazioni)
- **distillati-testi**: OK (1/1 combinazioni)

## bevande

Screenshot `bevande-*`: **60** PNG in `2026-10-18-locale-prod/img/`.

**locale-dev** `bevande-console`: OK (err:0 warn:0, err:0 warn:0).

### FALLITO
- **C2**: FALLITO — misurato: Indietro 274x42; Elimina 274x42; atteso: nessun elemento sotto 44 px; classificazione: controllo dubbio (pulsanti dialogo elimina nel foglio C2 stato elimina)
- **bevande-elimina-registro-permessi**: FALLITO — misurato: registro delete manager; norole: NON PROVATO (schema Users); atteso: registro e permessi staff; classificazione: difetto del lanciatore (norole NON PROVATO: manca utente staff di prova nel payload)
- **bevande-modulo-inglese**: FALLITO — misurato: badge Presente; atteso: inglese; classificazione: difetto dell'app (badge «Presente» non visibile nel foglio)
- **bevande-persistenza**: FALLITO — misurato: create read; atteso: persistenza; classificazione: da classificare in design
- **bevande-tassonomie**: FALLITO — misurato: tipologie vuote; atteso: tassonomie; classificazione: da classificare in design

### AVVISO
- **bevande-colonna-elenco**: AVVISO — misurato: {"tableVisible":false,"colW":358,"nameW":178}; atteso: layout colonna/schede
- **bevande-confronto-visivo**: AVVISO — misurato: screenshot=60/64; saltati=vuoto: DB=13; vuoto: DB=13; vuoto: DB=13; vuoto: DB=13; atteso: 16 stati × profili × temi

### NON PROVATO
- **C1**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: scroll orizzontale; motivo: vuoto
- **C2-mouse**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: altezza mouse; motivo: vuoto
- **C3**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: classe tema; motivo: vuoto
- **RICOMPILA-PRESENTE**: NON PROVATO — misurato: —; atteso: pulsante Ricompila presente; motivo: rinviato alla 6.5
- **bevande-accesso**: NON PROVATO — misurato: —; atteso: guardia 8.3; motivo: verify-roles-8_3.ts / stato_prova JSON
- **bevande-ricompila**: NON PROVATO — misurato: —; atteso: rinviato 6.5; motivo: stato_prova JSON
- **bevande-righe-azioni**: NON PROVATO — misurato: misura non acquisita: btnSize; atteso: tre icone, switch disabilitato su disabled; motivo: /app/menu/drinks
- **bevande-stato-vuoto**: NON PROVATO — misurato: DB con 13 record; atteso: elenco vuoto; motivo: giudizio C10 / confronto visivo

### OK
- **AMBIENTE**: OK (16/16 combinazioni)
- **C3-cambio-sistema**: OK (8/8 combinazioni)
- **C9**: OK (16/16 combinazioni)
- **NO-OVERRIDE**: OK (6/6 combinazioni)
- **RICOMPILA-ASSENTE**: OK (1/1 combinazioni)
- **bevande-azioni-pagina**: OK (2/2 combinazioni)
- **bevande-colonne-fisse**: OK (1/1 combinazioni)
- **bevande-disponibilita**: OK (1/1 combinazioni)
- **bevande-elimina**: OK (1/1 combinazioni)
- **bevande-filtri-ricerca**: OK (1/1 combinazioni)
- **bevande-formati-server**: OK (1/1 combinazioni)
- **bevande-modulo-campi**: OK (2/2 combinazioni)
- **bevande-modulo-footer**: OK (1/1 combinazioni)
- **bevande-modulo-validazione**: OK (1/1 combinazioni)
- **bevande-nomi-accessibili**: OK (1/1 combinazioni)
- **bevande-ordine-100**: OK (1/1 combinazioni)
- **bevande-paese-facoltativo**: OK (1/1 combinazioni)
- **bevande-testi**: OK (1/1 combinazioni)

## piatti

Screenshot `piatti-*`: **2** PNG in `2026-10-18-locale-prod/img/`.

### FALLITO
- **C2**: FALLITO — misurato: Indietro 274x42; Elimina 274x42; atteso: nessun elemento sotto 44 px; classificazione: controllo dubbio (pulsanti dialogo elimina nel foglio C2 stato elimina)

### NON PROVATO
- **C1**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: scroll orizzontale; motivo: vuoto
- **C2-mouse**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: altezza mouse; motivo: vuoto
- **C3**: NON PROVATO — misurato: stato vuoto: DB con 44 piatti; atteso: classe tema; motivo: vuoto
- **RICOMPILA-PRESENTE**: NON PROVATO — misurato: —; atteso: pulsante Ricompila presente; motivo: rinviato alla 6.5
- **piatti-righe-azioni**: NON PROVATO — misurato: misura non acquisita: btnSize riga azioni; atteso: tre icone, switch disabilitato su disabled; motivo: /app/menu

### OK
- **AMBIENTE**: OK (16/16 combinazioni)
- **C3-cambio-sistema**: OK (8/8 combinazioni)
- **C9**: OK (16/16 combinazioni)
- **NO-OVERRIDE**: OK (6/6 combinazioni)
- **RICOMPILA-ASSENTE**: OK (1/1 combinazioni)
- **piatti-allergeni-selezione**: OK (2/2 combinazioni)
- **piatti-azioni-pagina**: OK (2/2 combinazioni)
- **piatti-casella-misure**: OK (2/2 combinazioni)
- **piatti-colonna-elenco**: OK (2/2 combinazioni)
- **piatti-disabilita**: OK (1/1 combinazioni)
- **piatti-elimina-bloccato**: OK (1/1 combinazioni)
- **piatti-elimina-libero**: OK (1/1 combinazioni)
- **piatti-elimina-permessi**: OK (1/1 combinazioni)
- **piatti-elimina-registro**: OK (1/1 combinazioni)
- **piatti-filtri-ricerca**: OK (1/1 combinazioni)
- **piatti-modulo-campi**: OK (2/2 combinazioni)
- **piatti-modulo-footer**: OK (1/1 combinazioni)
- **piatti-modulo-inglese**: OK (1/1 combinazioni)
- **piatti-modulo-validazione**: OK (1/1 combinazioni)
- **piatti-nomi-accessibili**: OK (1/1 combinazioni)
- **piatti-persistenza**: OK (1/1 combinazioni)
- **piatti-tassonomie**: OK (1/1 combinazioni)
- **piatti-terminato**: OK (1/1 combinazioni)
- **piatti-testi**: OK (1/1 combinazioni)

## home

Screenshot `home-*`: **0** PNG in `2026-10-18-locale-prod/img/`.

### OK
- **home-riga-menu-altezza**: OK (2/2 combinazioni)
- **home-riga-menu-casi**: OK (1/1 combinazioni)
- **home-riga-menu-testo**: OK (4/4 combinazioni)

## navigazione

Screenshot `navigazione-*`: **0** PNG in `2026-10-18-locale-prod/img/`.

### OK
- **nav-briciole**: OK (2/2 combinazioni)
- **nav-casi-unit**: OK (1/1 combinazioni)
- **nav-icone**: OK (2/2 combinazioni)
- **nav-titoli-pagina**: OK (1/1 combinazioni)
- **nav-voce-attiva**: OK (2/2 combinazioni)
- **nav-voci-menu**: OK (2/2 combinazioni)

## shell

Screenshot `shell-*`: **15** PNG in `2026-10-18-locale-prod/img/`.

### OK
- (nessuno)

## Online (V6)

Tutti i controlli `on*` / `online-senza-credenziali`: **NON PROVATO** — non eseguiti in V3.
