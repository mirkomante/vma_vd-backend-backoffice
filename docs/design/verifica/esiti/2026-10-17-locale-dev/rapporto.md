# Esito verifica — locale-dev — 2026-10-17
Commit: 3076b1ca4de1 · Lanciatore: 3.4.1 (L2) · Browser: Chromium 140.0.7339.186; WebKit 26.0 · Controlli: controlli-6.6.json v1 · Durata: 51 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 8 · FALLITO: 1 · AVVISO: 0 · NON PROVATO: 3 · Controlli distinti nel JSON corrente: 6

## Pacchetto: menu
Righe: 12 · OK: 8 · FALLITO: 1

### FALLITO (menu)
- **piatti-stati-ui** | piatti | telefono-390/chiaro | misurato `vuoto: DB con piatti (count>0), stato vuoto non provato` | atteso `skeleton, errore caricamento, vuoto se possibile` | evidenza: localhost:3200

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **CONSOLE**: OK in 4/4 combinazioni
- **home-riga-menu-stati**: OK in 1/1 combinazioni
- **piatti-console**: OK in 2/2 combinazioni
- **webkit-giro-essenziale**: OK in 1/1 combinazioni

### FALLITO (tutte le righe, dettaglio)
- **piatti-stati-ui** | piatti | telefono-390/chiaro | misurato `vuoto: DB con piatti (count>0), stato vuoto non provato` | atteso `skeleton, errore caricamento, vuoto se possibile` | evidenza: localhost:3200

### AVVISO
- (nessuno)

### NON PROVATO
- **piatti-elimina-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-elimina-registro** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| CONSOLE | OK (4/4) |
| piatti-console | OK (2/2) |
| piatti-elimina-permessi | NON PROVATO (0/1) |
| piatti-elimina-registro | NON PROVATO (0/1) |
| piatti-persistenza | NON PROVATO (0/1) |
| webkit-giro-essenziale | OK (1/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| piatti-stati-ui | piatti | telefono-390/chiaro | FALLITO | vuoto: DB con piatti (count>0), stato vuoto non provato | skeleton, errore caricamento, vuoto se possibile | localhost:3200 |
| piatti-elimina-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-elimina-registro | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- piatti-elimina-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-elimina-registro: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-persistenza: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
