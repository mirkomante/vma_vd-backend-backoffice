# Esito verifica — locale-prod — 2026-10-19
Commit: 5615003b2a8f · Lanciatore: 3.9.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-6.6.json v1 · Durata: 26 s

Avanzamento live: `tail -f .next/ui-verify-progress.log`

## Riepilogo (tutti i pacchetti in cartella)
OK: 696 · FALLITO: 13 · AVVISO: 1 · NON PROVATO: 73 · Controlli distinti nel JSON corrente: 9

## Pacchetto: accesso
Righe: 16 · OK: 16 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: shell
Righe: 58 · OK: 58 · FALLITO: 0

### FALLITO (shell)
- (nessuno)

## Pacchetto: menu
Righe: 667 · OK: 607 · FALLITO: 13

### FALLITO (menu)
- **home-riga-menu-casi** | home | telefono-390/chiaro | misurato `dopo creazione: «3 piatti terminati» atteso «NaN piatti terminati» | dopo p1 non terminato: «2 piatti terminati» atteso «NaN piatti terminati» | dopo p2/p3 disabilitati: «Nessun piatto terminato» atteso «undefined piatti terminati» | singolare: N=undefined (serve N=1 isolato)` | atteso `conteggio e singolare/plurale come da specifica` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | telefono-390/chiaro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | telefono-390/scuro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | notebook-1280/chiaro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | notebook-1280/scuro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **menu-fissi-ordine-piatti** | menu-fissi | telefono-390/chiaro | misurato `piatto rimosso dalla collection` | atteso `frecce 44px+ordine+Togli` | evidenza: /app/menu/fixed
- **piatti-disabilita** | piatti | telefono-390/chiaro | misurato `disabled API` | atteso `disabilita/abilita` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `locale=en: name=undefined desc=undefined; atteso name="verify-ui-noen" desc="Desc IT"` | atteso `Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione` | evidenza: /app/menu
- **piatti-persistenza** | piatti | telefono-390/chiaro | misurato `create read; norole create: NON PROVATO (schema Users)` | atteso `persistenza` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `eccezione lanciatore: Cannot read properties of undefined (reading 'map')` | atteso `opzioni = collection; creazioni rifiutate` | evidenza: /app/menu
- **piatti-terminato** | piatti | telefono-390/chiaro | misurato `soldOut API falso` | atteso `flusso §9 punto 5 (terminato + filtro Stato Terminati)` | evidenza: /app/menu
- **servizi-disponibilita** | servizi | telefono-390/chiaro | misurato `API disabled` | atteso `disponibilità` | evidenza: /app/menu/services
- **servizi-persistenza** | servizi | telefono-390/chiaro | misurato `create read; norole: coperto in elimina-cascade` | atteso `persistenza` | evidenza: /app/menu/services

## Pacchetto: completo
Righe: 42 · OK: 15 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 15/15 combinazioni
- **C1**: OK in 188/188 combinazioni
- **C2**: OK in 106/106 combinazioni
- **C2-mouse**: OK in 94/94 combinazioni
- **C3**: OK in 188/188 combinazioni
- **C3-cambio-sistema**: OK in 1/1 combinazioni
- **C9**: OK in 15/15 combinazioni
- **home-colonne**: OK in 2/2 combinazioni
- **home-larghezza**: OK in 4/4 combinazioni
- **home-righe-di-stato**: OK in 2/2 combinazioni
- **home-testi**: OK in 2/2 combinazioni
- **menu-fissi-azioni-pagina**: OK in 2/2 combinazioni
- **menu-fissi-categoria-modulo**: OK in 1/1 combinazioni
- **menu-fissi-categorie-elenco**: OK in 1/1 combinazioni
- **menu-fissi-categorie-niente-eliminazione**: OK in 1/1 combinazioni
- **menu-fissi-colonne-fisse**: OK in 1/1 combinazioni
- **menu-fissi-composizione**: OK in 1/1 combinazioni
- **menu-fissi-disponibilita**: OK in 1/1 combinazioni
- **menu-fissi-doppioni**: OK in 1/1 combinazioni
- **menu-fissi-modulo-campi**: OK in 1/1 combinazioni
- **menu-fissi-modulo-validazione**: OK in 1/1 combinazioni
- **menu-fissi-righe-azioni**: OK in 1/1 combinazioni
- **menu-fissi-schede-percorsi**: OK in 1/1 combinazioni
- **menu-fissi-tassonomie**: OK in 1/1 combinazioni
- **menu-fissi-testi**: OK in 1/1 combinazioni
- **menu-fissi-visibilita-categoria**: OK in 1/1 combinazioni
- **nav-briciole**: OK in 2/2 combinazioni
- **nav-casi-unit**: OK in 1/1 combinazioni
- **nav-icone**: OK in 2/2 combinazioni
- **nav-titoli-pagina**: OK in 1/1 combinazioni
- **nav-voce-attiva**: OK in 2/2 combinazioni
- **nav-voci-menu**: OK in 2/2 combinazioni
- **NO-OVERRIDE**: OK in 14/14 combinazioni
- **piatti-allergeni-selezione**: OK in 2/2 combinazioni
- **piatti-azioni-pagina**: OK in 2/2 combinazioni
- **piatti-casella-misure**: OK in 2/2 combinazioni
- **piatti-colonna-elenco**: OK in 2/2 combinazioni
- **piatti-elimina-bloccato**: OK in 1/1 combinazioni
- **piatti-elimina-libero**: OK in 1/1 combinazioni
- **piatti-elimina-permessi**: OK in 1/1 combinazioni
- **piatti-filtri-ricerca**: OK in 1/1 combinazioni
- **piatti-modulo-campi**: OK in 2/2 combinazioni
- **piatti-modulo-footer**: OK in 1/1 combinazioni
- **piatti-modulo-validazione**: OK in 1/1 combinazioni
- **piatti-nomi-accessibili**: OK in 1/1 combinazioni
- **piatti-testi**: OK in 1/1 combinazioni
- **servizi-azioni-pagina**: OK in 2/2 combinazioni
- **servizi-colonne-fisse**: OK in 1/1 combinazioni
- **servizi-elimina-cascade-registro-permessi**: OK in 1/1 combinazioni
- **servizi-elimina-senza-uso**: OK in 1/1 combinazioni
- **servizi-elimina-usato**: OK in 1/1 combinazioni
- **servizi-modulo-campi**: OK in 2/2 combinazioni
- **servizi-modulo-footer**: OK in 1/1 combinazioni
- **servizi-modulo-inglese**: OK in 1/1 combinazioni
- **servizi-modulo-validazione**: OK in 1/1 combinazioni
- **servizi-nomi-accessibili**: OK in 1/1 combinazioni
- **servizi-ordine**: OK in 1/1 combinazioni
- **servizi-righe-azioni**: OK in 1/1 combinazioni
- **servizi-senza-ricerca-filtri**: OK in 1/1 combinazioni
- **servizi-testi**: OK in 1/1 combinazioni
- **RICOMPILA-ASSENTE**: OK in 1/9 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **servizi-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **home-riga-menu-altezza**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- **home-riga-menu-casi** | home | telefono-390/chiaro | misurato `dopo creazione: «3 piatti terminati» atteso «NaN piatti terminati» | dopo p1 non terminato: «2 piatti terminati» atteso «NaN piatti terminati» | dopo p2/p3 disabilitati: «Nessun piatto terminato» atteso «undefined piatti terminati» | singolare: N=undefined (serve N=1 isolato)` | atteso `conteggio e singolare/plurale come da specifica` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | telefono-390/chiaro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | telefono-390/scuro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | notebook-1280/chiaro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **home-riga-menu-testo** | home/iniziale | notebook-1280/scuro | misurato `scheda=Menù; riga=Nessun piatto terminato; count API=undefined` | atteso `Menù; «undefined piatti terminati» (N=undefined)` | evidenza: /app
- **menu-fissi-ordine-piatti** | menu-fissi | telefono-390/chiaro | misurato `piatto rimosso dalla collection` | atteso `frecce 44px+ordine+Togli` | evidenza: /app/menu/fixed
- **piatti-disabilita** | piatti | telefono-390/chiaro | misurato `disabled API` | atteso `disabilita/abilita` | evidenza: /app/menu
- **piatti-modulo-inglese** | piatti | telefono-390/chiaro | misurato `locale=en: name=undefined desc=undefined; atteso name="verify-ui-noen" desc="Desc IT"` | atteso `Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione` | evidenza: /app/menu
- **piatti-persistenza** | piatti | telefono-390/chiaro | misurato `create read; norole create: NON PROVATO (schema Users)` | atteso `persistenza` | evidenza: /app/menu
- **piatti-tassonomie** | piatti | telefono-390/chiaro | misurato `eccezione lanciatore: Cannot read properties of undefined (reading 'map')` | atteso `opzioni = collection; creazioni rifiutate` | evidenza: /app/menu
- **piatti-terminato** | piatti | telefono-390/chiaro | misurato `soldOut API falso` | atteso `flusso §9 punto 5 (terminato + filtro Stato Terminati)` | evidenza: /app/menu
- **servizi-disponibilita** | servizi | telefono-390/chiaro | misurato `API disabled` | atteso `disponibilità` | evidenza: /app/menu/services
- **servizi-persistenza** | servizi | telefono-390/chiaro | misurato `create read; norole: coperto in elimina-cascade` | atteso `persistenza` | evidenza: /app/menu/services

### AVVISO
- **servizi-colonna-elenco** | servizi | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout` | evidenza: /app/menu/services

### NON PROVATO
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
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
- **servizi-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stato-vuoto** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-confronto-visivo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **menu-fissi-accesso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-confronto-visivo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-ricompila** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-stato-vuoto** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-nessuna-categoria** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **home-riga-menu-testo** | home | telefono-390/chiaro | misurato `tempo: home` | atteso `—` | evidenza: home
- **home-riga-menu-casi** | home | telefono-390/chiaro | misurato `tempo: home` | atteso `—` | evidenza: home
- **home-riga-menu-stati** | home | telefono-390/chiaro | misurato `tempo: home` | atteso `—` | evidenza: home
- **home-riga-menu-altezza** | home | telefono-390/chiaro | misurato `tempo: home` | atteso `—` | evidenza: home
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **piatti-righe-azioni** | piatti | telefono-390/chiaro | misurato `misura non acquisita: btnSize riga azioni` | atteso `tre icone, switch disabilitato su disabled` | evidenza: /app/menu
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-elimina-registro** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **menu-fissi-colonna-elenco** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-cascade-registro-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-senza-uso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-elimina-usato** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-nomi-accessibili** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-ordine-liste** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-porzione-traduzione** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **menu-fissi-servizi-piatti** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| menu-fissi-colonna-elenco | NON PROVATO (0/1) |
| menu-fissi-elimina-cascade-registro-permessi | NON PROVATO (0/1) |
| menu-fissi-elimina-senza-uso | NON PROVATO (0/1) |
| menu-fissi-elimina-usato | NON PROVATO (0/1) |
| menu-fissi-nomi-accessibili | NON PROVATO (0/1) |
| menu-fissi-ordine-liste | NON PROVATO (0/1) |
| menu-fissi-persistenza | NON PROVATO (0/1) |
| menu-fissi-porzione-traduzione | NON PROVATO (0/1) |
| menu-fissi-servizi-piatti | NON PROVATO (0/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| servizi-ricompila | servizi | telefono-390/chiaro | NON PROVATO | — | — | rinviato alla 6.5 |
| servizi-accesso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stato-vuoto | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| servizi-colonna-elenco | servizi | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout | /app/menu/services |
| servizi-disponibilita | servizi | telefono-390/chiaro | FALLITO | API disabled | disponibilità | /app/menu/services |
| servizi-persistenza | servizi | telefono-390/chiaro | FALLITO | create read; norole: coperto in elimina-cascade | persistenza | /app/menu/services |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-confronto-visivo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| menu-fissi-accesso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-confronto-visivo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-ricompila | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-stato-vuoto | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-ordine-piatti | menu-fissi | telefono-390/chiaro | FALLITO | piatto rimosso dalla collection | frecce 44px+ordine+Togli | /app/menu/fixed |
| menu-fissi-nessuna-categoria | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| home-riga-menu-testo | home/iniziale | telefono-390/chiaro | FALLITO | scheda=Menù; riga=Nessun piatto terminato; count API=undefined | Menù; «undefined piatti terminati» (N=undefined) | /app |
| home-riga-menu-testo | home/iniziale | telefono-390/scuro | FALLITO | scheda=Menù; riga=Nessun piatto terminato; count API=undefined | Menù; «undefined piatti terminati» (N=undefined) | /app |
| home-riga-menu-testo | home/iniziale | notebook-1280/chiaro | FALLITO | scheda=Menù; riga=Nessun piatto terminato; count API=undefined | Menù; «undefined piatti terminati» (N=undefined) | /app |
| home-riga-menu-testo | home/iniziale | notebook-1280/scuro | FALLITO | scheda=Menù; riga=Nessun piatto terminato; count API=undefined | Menù; «undefined piatti terminati» (N=undefined) | /app |
| home-riga-menu-casi | home | telefono-390/chiaro | FALLITO | dopo creazione: «3 piatti terminati» atteso «NaN piatti terminati» \| dopo p1 non terminato: «2 piatti terminati» atteso «NaN piatti terminati» \| dopo p2/p3 disabilitati: «Nessun piatto terminato» atteso «undefined piatti terminati» \| singolare: N=undefined (serve N=1 isolato) | conteggio e singolare/plurale come da specifica | /app |
| home-riga-menu-testo | home | telefono-390/chiaro | NON PROVATO | tempo: home | — | home |
| home-riga-menu-casi | home | telefono-390/chiaro | NON PROVATO | tempo: home | — | home |
| home-riga-menu-stati | home | telefono-390/chiaro | NON PROVATO | tempo: home | — | home |
| home-riga-menu-altezza | home | telefono-390/chiaro | NON PROVATO | tempo: home | — | home |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| piatti-righe-azioni | piatti | telefono-390/chiaro | NON PROVATO | misura non acquisita: btnSize riga azioni | tre icone, switch disabilitato su disabled | /app/menu |
| piatti-terminato | piatti | telefono-390/chiaro | FALLITO | soldOut API falso | flusso §9 punto 5 (terminato + filtro Stato Terminati) | /app/menu |
| piatti-disabilita | piatti | telefono-390/chiaro | FALLITO | disabled API | disabilita/abilita | /app/menu |
| piatti-modulo-inglese | piatti | telefono-390/chiaro | FALLITO | locale=en: name=undefined desc=undefined; atteso name="verify-ui-noen" desc="Desc IT" | Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione | /app/menu |
| piatti-tassonomie | piatti | telefono-390/chiaro | FALLITO | eccezione lanciatore: Cannot read properties of undefined (reading 'map') | opzioni = collection; creazioni rifiutate | /app/menu |
| piatti-persistenza | piatti | telefono-390/chiaro | FALLITO | create read; norole create: NON PROVATO (schema Users) | persistenza | /app/menu |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-elimina-registro | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| menu-fissi-colonna-elenco | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-cascade-registro-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-senza-uso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-elimina-usato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-ordine-liste | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-porzione-traduzione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| menu-fissi-servizi-piatti | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- menu-fissi-colonna-elenco: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-elimina-cascade-registro-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-elimina-senza-uso: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-elimina-usato: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-nomi-accessibili: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-ordine-liste: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-persistenza: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-porzione-traduzione: controllo non eseguito dal lanciatore in questa esecuzione
- menu-fissi-servizi-piatti: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
