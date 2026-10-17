# Esito verifica — locale-prod — 2026-10-17
Commit: 3076b1ca4de1 · Lanciatore: 3.4.1 (L2) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 21 min 47 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 650 · FALLITO: 13 · AVVISO: 10 · NON PROVATO: 82 · Controlli distinti nel JSON corrente: 49

## Pacchetto: accesso
Righe: 40 · OK: 40 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 389 · OK: 387 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 245 · OK: 199 · FALLITO: 13

### FALLITO (menu)
- **C2** | piatti/errore-azione | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: errore-azione
- **C2** | piatti/errore-azione | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: errore-azione
- **C2** | piatti/modulo-allergeni | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/modulo-allergeni | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/nuovo | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo-errori | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **C2** | piatti/nuovo-errori | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **piatti-azioni-pagina** | piatti/elenco | telefono-390/chiaro | misurato `larghezza=326px, colonna=358px, altezza=44px` | atteso `larghezza colonna 358px (±2), altezza ≥44px` | evidenza: /app/menu
- **piatti-elimina-concorrenza** | piatti | telefono-390/chiaro | misurato `titolo mancante (letto: Non si può eliminare verify-ui-corsa

È usato in 1 menù fisso: verify-ui-menu-co…) | descrizione errore mancante` | atteso `«Operazione non riuscita» + testo errore; piatto non eliminato; nessun registro delete` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `locale=en: name=null desc=null; atteso name="verify-ui-noen" desc="Desc IT"` | atteso `Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione` | evidenza: /app/menu
- **piatti-ordine-100** | piatti/piu-di-100 | notebook-1280/chiaro | misurato `righe tabella=100; banner100/101=false; sottoBanner=true; estratto=Mostrati 100 piatti su 145; banner: atteso «Mostrati 100 piatti su 101»` | atteso `Mostrati 100 piatti su 101; Restringi l’elenco con la ricerca o i filtri per trovare gli altri.; 100 righe in tabella` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `categorie UI (0): ; categorie API (6): Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci; crea categoria: ok=false motivo=access_denied; crea allergene: ok=false motivo=access_denied; categorie UI mancanti: Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci (opzioni=[]; API=[Specialità vegeteriane, Specialità pesce, Specialità carn` | atteso `opzioni = collection; creazioni category/allergen rifiutate (overrideAccess false)` | evidenza: /app/menu

## Pacchetto: completo
Righe: 81 · OK: 24 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **C3-cambio-sistema**: OK in 16/16 combinazioni
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
- **piatti-terminato**: OK in 1/1 combinazioni
- **piatti-testi**: OK in 1/1 combinazioni
- **RICOMPILA-ASSENTE**: OK in 1/1 combinazioni
- **shell-barra-alta**: OK in 36/36 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 24/24 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 60/60 combinazioni
- **shell-passaggio-768**: OK in 8/8 combinazioni
- **shell-percorso-voce-attiva**: OK in 60/60 combinazioni
- **shell-segnaposto**: OK in 1/1 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-tema-scelta**: OK in 1/1 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **AMBIENTE**: OK in 24/25 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C1**: OK in 84/89 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2**: OK in 82/93 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C2-mouse**: OK in 34/45 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C3**: OK in 120/125 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **C9**: OK in 24/25 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-colonne**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-larghezza**: OK in 8/9 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-righe-di-stato**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-testi**: OK in 5/6 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-menu-utente**: OK in 2/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **piatti-colonna-elenco**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **piatti-azioni-pagina**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **C2** | piatti/errore-azione | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: errore-azione
- **C2** | piatti/errore-azione | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: errore-azione
- **C2** | piatti/modulo-allergeni | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/modulo-allergeni | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: modulo-allergeni
- **C2** | piatti/nuovo | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo
- **C2** | piatti/nuovo-errori | telefono-390/chiaro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **C2** | piatti/nuovo-errori | telefono-390/scuro | misurato `Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16` | atteso `nessun elemento sotto 44 px` | evidenza: nuovo-errori
- **piatti-azioni-pagina** | piatti/elenco | telefono-390/chiaro | misurato `larghezza=326px, colonna=358px, altezza=44px` | atteso `larghezza colonna 358px (±2), altezza ≥44px` | evidenza: /app/menu
- **piatti-elimina-concorrenza** | piatti | telefono-390/chiaro | misurato `titolo mancante (letto: Non si può eliminare verify-ui-corsa

È usato in 1 menù fisso: verify-ui-menu-co…) | descrizione errore mancante` | atteso `«Operazione non riuscita» + testo errore; piatto non eliminato; nessun registro delete` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `locale=en: name=null desc=null; atteso name="verify-ui-noen" desc="Desc IT"` | atteso `Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione` | evidenza: /app/menu
- **piatti-ordine-100** | piatti/piu-di-100 | notebook-1280/chiaro | misurato `righe tabella=100; banner100/101=false; sottoBanner=true; estratto=Mostrati 100 piatti su 145; banner: atteso «Mostrati 100 piatti su 101»` | atteso `Mostrati 100 piatti su 101; Restringi l’elenco con la ricerca o i filtri per trovare gli altri.; 100 righe in tabella` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `categorie UI (0): ; categorie API (6): Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci; crea categoria: ok=false motivo=access_denied; crea allergene: ok=false motivo=access_denied; categorie UI mancanti: Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci (opzioni=[]; API=[Specialità vegeteriane, Specialità pesce, Specialità carn` | atteso `opzioni = collection; creazioni category/allergen rifiutate (overrideAccess false)` | evidenza: /app/menu

### AVVISO
- **piatti-colonna-elenco** | piatti/elenco | telefono-390/chiaro | misurato `{"tableVisible":false,"card":true,"colW":358,"nameW":20}` | atteso `layout colonna/schede` | evidenza: /app/menu
- **piatti-confronto-visivo** | piatti | telefono-390/chiaro | misurato `screenshot=72/76; saltati: vuoto/telefono-390/chiaro: DB con 44 piatti; vuoto/telefono-390/scuro: DB con 44 piatti; vuoto/notebook-1280/chiaro: DB con 44 piatti; vuoto/notebook-1280/scuro: DB con 44 piatti` | atteso `19 stati × 2 profili × 2 temi (sezione immagini JSON)` | evidenza: img/
- **C2-mouse** | piatti/modulo-allergeni | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: modulo-allergeni
- **C2-mouse** | piatti/modulo-allergeni | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: modulo-allergeni
- **C2-mouse** | piatti/nuovo | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo
- **C2-mouse** | piatti/nuovo | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo
- **C2-mouse** | piatti/nuovo-errori | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo-errori
- **C2-mouse** | piatti/nuovo-errori | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: nuovo-errori
- **C2-mouse** | piatti/errore-azione | notebook-1280/chiaro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: errore-azione
- **C2-mouse** | piatti/errore-azione | notebook-1280/scuro | misurato `fuori intervallo: 64 px` | atteso `altezze in [28, 48] px (no collegamenti di testo)` | evidenza: errore-azione

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
- **nav-pannello-telefono** | navigazione | telefono-390/chiaro | misurato `—` | atteso `altezza pannello con 8 voci Menù` | evidenza: voci non ancora tutte accese
- **piatti-accesso** | piatti | telefono-390/chiaro | misurato `—` | atteso `stesso esito di /app/hours per utente senza ruolo` | evidenza: impossibile creare utente senza ruoli (validazione Users); controllo dubbio se la guardia è solo canAccessAppArea
- **piatti-stato-vuoto** | piatti | telefono-390/chiaro | misurato `database con 44 piatti (il lanciatore non svuota il DB)` | atteso `«Nessun piatto nel menù.» con pulsante Nuovo piatto` | evidenza: stato_prova JSON: giudizio nel confronto visivo
- **piatti-ricompila** | piatti | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
- **piatti-disabilitato-ovunque** | piatti | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
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
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **NO-OVERRIDE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **RICOMPILA-PRESENTE** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **home-riga-menu-stati** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | NON PROVATO (24/25) |
| C1 | NON PROVATO (84/89) |
| C2 | FALLITO (82/93) |
| C2-mouse | AVVISO (34/45) |
| C3 | NON PROVATO (120/125) |
| C3-cambio-sistema | OK (16/16) |
| C3-no-lampo | NON PROVATO (0/1) |
| C9 | NON PROVATO (24/25) |
| NO-OVERRIDE | NON PROVATO (0/1) |
| RICOMPILA-ASSENTE | OK (1/1) |
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
| piatti-accesso | NON PROVATO (0/1) |
| piatti-azioni-pagina | FALLITO (1/2) |
| piatti-colonna-elenco | AVVISO (1/2) |
| piatti-confronto-visivo | AVVISO (0/1) |
| piatti-console | NON PROVATO (0/1) |
| piatti-disabilita | OK (1/1) |
| piatti-disabilitato-ovunque | NON PROVATO (0/1) |
| piatti-elimina-bloccato | OK (1/1) |
| piatti-elimina-concorrenza | FALLITO (0/1) |
| piatti-elimina-libero | OK (1/1) |
| piatti-elimina-permessi | OK (1/1) |
| piatti-elimina-registro | OK (1/1) |
| piatti-filtri-ricerca | OK (1/1) |
| piatti-modulo-campi | OK (2/2) |
| piatti-modulo-footer | OK (1/1) |
| piatti-modulo-inglese | FALLITO (0/1) |
| piatti-modulo-validazione | OK (1/1) |
| piatti-nomi-accessibili | OK (1/1) |
| piatti-ordine-100 | FALLITO (0/1) |
| piatti-persistenza | OK (1/1) |
| piatti-ricompila | NON PROVATO (0/1) |
| piatti-righe-azioni | OK (1/1) |
| piatti-stati-ui | NON PROVATO (0/1) |
| piatti-stato-vuoto | NON PROVATO (0/1) |
| piatti-tassonomie | FALLITO (0/1) |
| piatti-terminato | OK (1/1) |
| piatti-testi | OK (1/1) |

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
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| shell-menu-utente | shell/home (icone Admin) | telefono-390/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| shell-menu-utente | shell/home (icone Admin) | notebook-1280/chiaro | NON PROVATO | voce «Vai all'Admin» assente con utente manager | due icone svg (pannello + freccia esterna) se presente | A24; utente di prova senza canAccessAdminPanel |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| nav-pannello-telefono | navigazione | telefono-390/chiaro | NON PROVATO | — | altezza pannello con 8 voci Menù | voci non ancora tutte accese |
| piatti-colonna-elenco | piatti/elenco | telefono-390/chiaro | AVVISO | {"tableVisible":false,"card":true,"colW":358,"nameW":20} | layout colonna/schede | /app/menu |
| piatti-azioni-pagina | piatti/elenco | telefono-390/chiaro | FALLITO | larghezza=326px, colonna=358px, altezza=44px | larghezza colonna 358px (±2), altezza ≥44px | /app/menu |
| piatti-elimina-concorrenza | piatti | telefono-390/chiaro | FALLITO | titolo mancante (letto: Non si può eliminare verify-ui-corsa  È usato in 1 menù fisso: verify-ui-menu-co…) \| descrizione errore mancante | «Operazione non riuscita» + testo errore; piatto non eliminato; nessun registro delete | /app/menu |
| piatti-modulo-inglese | piatti | telefono-390/chiaro | FALLITO | locale=en: name=null desc=null; atteso name="verify-ui-noen" desc="Desc IT" | Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione | /app/menu |
| piatti-tassonomie | piatti | telefono-390/chiaro | FALLITO | categorie UI (0): ; categorie API (6): Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci; crea categoria: ok=false motivo=access_denied; crea allergene: ok=false motivo=access_denied; categorie UI mancanti: Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci (opzioni=[]; API=[Specialità vegeteriane, Specialità pesce, Specialità carne, Primi, Involtini, Dolci]) | opzioni = collection; creazioni category/allergen rifiutate (overrideAccess false) | /app/menu |
| piatti-ordine-100 | piatti/piu-di-100 | notebook-1280/chiaro | FALLITO | righe tabella=100; banner100/101=false; sottoBanner=true; estratto=Mostrati 100 piatti su 145; banner: atteso «Mostrati 100 piatti su 101» | Mostrati 100 piatti su 101; Restringi l’elenco con la ricerca o i filtri per trovare gli altri.; 100 righe in tabella | /app/menu |
| piatti-accesso | piatti | telefono-390/chiaro | NON PROVATO | — | stesso esito di /app/hours per utente senza ruolo | impossibile creare utente senza ruoli (validazione Users); controllo dubbio se la guardia è solo canAccessAppArea |
| piatti-confronto-visivo | piatti | telefono-390/chiaro | AVVISO | screenshot=72/76; saltati: vuoto/telefono-390/chiaro: DB con 44 piatti; vuoto/telefono-390/scuro: DB con 44 piatti; vuoto/notebook-1280/chiaro: DB con 44 piatti; vuoto/notebook-1280/scuro: DB con 44 piatti | 19 stati × 2 profili × 2 temi (sezione immagini JSON) | img/ |
| piatti-stato-vuoto | piatti | telefono-390/chiaro | NON PROVATO | database con 44 piatti (il lanciatore non svuota il DB) | «Nessun piatto nel menù.» con pulsante Nuovo piatto | stato_prova JSON: giudizio nel confronto visivo |
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
| C2 | piatti/errore-azione | telefono-390/chiaro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | errore-azione |
| C2-mouse | piatti/errore-azione | notebook-1280/chiaro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | errore-azione |
| C2 | piatti/errore-azione | telefono-390/scuro | FALLITO | Traduzione inglese (facoltat 358x38; base-ui-_r_91_ 16x16; base-ui-_r_94_ 16x16; base-ui-_r_97_ 16x16 | nessun elemento sotto 44 px | errore-azione |
| C2-mouse | piatti/errore-azione | notebook-1280/scuro | AVVISO | fuori intervallo: 64 px | altezze in [28, 48] px (no collegamenti di testo) | errore-azione |
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
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| NO-OVERRIDE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| RICOMPILA-PRESENTE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| home-riga-menu-stati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- C3-no-lampo: controllo non eseguito dal lanciatore in questa esecuzione
- NO-OVERRIDE: controllo non eseguito dal lanciatore in questa esecuzione
- RICOMPILA-PRESENTE: controllo non eseguito dal lanciatore in questa esecuzione
- home-riga-menu-stati: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-console: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-stati-ui: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
