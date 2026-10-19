# Esito verifica — locale-prod — 2026-10-19
Commit: 83ee689704d4 · Lanciatore: 3.8.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: controlli-8.2.json v4 · Durata: 27 s

Avanzamento live: `tail -f .next/ui-verify-progress.log`

## Riepilogo (tutti i pacchetti in cartella)
OK: 166 · FALLITO: 0 · AVVISO: 1 · NON PROVATO: 18 · Controlli distinti nel JSON corrente: 6

## Pacchetto: accesso
Righe: 4 · OK: 4 · FALLITO: 0

### FALLITO (accesso)
- (nessuno)

## Pacchetto: menu
Righe: 174 · OK: 159 · FALLITO: 0

### FALLITO (menu)
- (nessuno)

## Pacchetto: completo
Righe: 7 · OK: 3 · FALLITO: 0

### FALLITO (completo)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **AMBIENTE**: OK in 3/3 combinazioni
- **C1**: OK in 40/40 combinazioni
- **C2**: OK in 20/20 combinazioni
- **C2-mouse**: OK in 20/20 combinazioni
- **C3**: OK in 40/40 combinazioni
- **C3-cambio-sistema**: OK in 1/1 combinazioni
- **C9**: OK in 3/3 combinazioni
- **home-riga-menu-casi**: OK in 1/1 combinazioni
- **home-riga-menu-testo**: OK in 4/4 combinazioni
- **nav-briciole**: OK in 2/2 combinazioni
- **nav-casi-unit**: OK in 1/1 combinazioni
- **nav-icone**: OK in 2/2 combinazioni
- **nav-titoli-pagina**: OK in 1/1 combinazioni
- **nav-voce-attiva**: OK in 2/2 combinazioni
- **nav-voci-menu**: OK in 2/2 combinazioni
- **NO-OVERRIDE**: OK in 3/3 combinazioni
- **servizi-azioni-pagina**: OK in 2/2 combinazioni
- **servizi-colonne-fisse**: OK in 1/1 combinazioni
- **servizi-disponibilita**: OK in 1/1 combinazioni
- **servizi-elimina-cascade-registro-permessi**: OK in 1/1 combinazioni
- **servizi-elimina-senza-uso**: OK in 1/1 combinazioni
- **servizi-elimina-usato**: OK in 1/1 combinazioni
- **servizi-modulo-campi**: OK in 2/2 combinazioni
- **servizi-modulo-footer**: OK in 1/1 combinazioni
- **servizi-modulo-inglese**: OK in 1/1 combinazioni
- **servizi-modulo-validazione**: OK in 1/1 combinazioni
- **servizi-nomi-accessibili**: OK in 1/1 combinazioni
- **servizi-ordine**: OK in 1/1 combinazioni
- **servizi-persistenza**: OK in 1/1 combinazioni
- **servizi-righe-azioni**: OK in 1/1 combinazioni
- **servizi-senza-ricerca-filtri**: OK in 1/1 combinazioni
- **servizi-testi**: OK in 1/1 combinazioni
- **servizi-colonna-elenco**: OK in 3/4 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO (tutte le righe, dettaglio)
- (nessuno)

### AVVISO
- **servizi-colonna-elenco** | servizi | telefono-390/chiaro | misurato `{"tableVisible":false,"colW":358,"nameW":178}` | atteso `layout` | evidenza: /app/menu/services

### NON PROVATO
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **shell-admin-link** | — | — | misurato `—` | atteso `—` | evidenza: NON PROVABILE con utente solo App (adminRole none)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **servizi-ricompila** | servizi | telefono-390/chiaro | misurato `—` | atteso `—` | evidenza: rinviato alla 6.5
- **C3-no-lampo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-accesso** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-confronto-visivo** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stati-ui** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **servizi-stato-vuoto** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **nav-pannello-telefono** | navigazione | telefono-390/chiaro | misurato `—` | atteso `altezza pannello con 8 voci Menù` | evidenza: voci non ancora tutte accese
- **verify-link-valido** | — | — | misurato `—` | atteso `—` | evidenza: facoltativo: token reale monouso non ottenuto
- **RICOMPILA-ASSENTE** | comuni | — | misurato `—` | atteso `assente in UI con bandiera spenta` | evidenza: eseguito con schermata piatti (runRicompilaAssenteCheck)
- **RICOMPILA-PRESENTE** | comuni | — | misurato `—` | atteso `pulsante Ricompila presente` | evidenza: rinviato alla 6.5
- **nav-pannello-telefono** | navigazione | — | misurato `—` | atteso `misura pannello telefono` | evidenza: solo livello 2


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (3/3) |
| C1 | OK (40/40) |
| C2 | OK (20/20) |
| C2-mouse | OK (20/20) |
| C3 | OK (40/40) |
| C9 | OK (3/3) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| servizi-colonna-elenco | servizi | telefono-390/chiaro | AVVISO | {"tableVisible":false,"colW":358,"nameW":178} | layout | /app/menu/services |
| servizi-ricompila | servizi | telefono-390/chiaro | NON PROVATO | — | — | rinviato alla 6.5 |
| C3-no-lampo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-accesso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-confronto-visivo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stati-ui | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| servizi-stato-vuoto | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| nav-pannello-telefono | navigazione | telefono-390/chiaro | NON PROVATO | — | altezza pannello con 8 voci Menù | voci non ancora tutte accese |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| RICOMPILA-ASSENTE | comuni | — | NON PROVATO | — | assente in UI con bandiera spenta | eseguito con schermata piatti (runRicompilaAssenteCheck) |
| RICOMPILA-PRESENTE | comuni | — | NON PROVATO | — | pulsante Ricompila presente | rinviato alla 6.5 |
| nav-pannello-telefono | navigazione | — | NON PROVATO | — | misura pannello telefono | solo livello 2 |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto

## Anomalie dell'ambiente
- (nessuna)
