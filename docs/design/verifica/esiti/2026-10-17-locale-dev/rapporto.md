# Esito verifica — locale-dev — 2026-10-17
Commit: dadc3898ded2 · Lanciatore: 3.3.0 (L2) · Browser: Chromium 140.0.7339.186; WebKit 26.0 · Controlli: controlli-6.6.json v1 · Durata: 22 s

## Riepilogo (tutti i pacchetti in cartella)
OK: 4 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 5 · Controlli distinti nel JSON corrente: 5

## Pacchetto: menu
Righe: 9 · OK: 4 · FALLITO: 0

### FALLITO (menu)
- (nessuno)

## Esiti compatti (esecuzione corrente)

### OK (raggruppati)
- **CONSOLE**: OK in 2/2 combinazioni
- **home-riga-menu-stati**: OK in 1/1 combinazioni
- **webkit-giro-essenziale**: OK in 1/1 combinazioni

### FALLITO (tutte le righe, dettaglio)
- (nessuno)

### AVVISO
- (nessuno)

### NON PROVATO
- **piatti-stati-ui** | piatti | — | misurato `—` | atteso `simulazione APP_MENU_DEV_SIMULATE_*` | evidenza: schermata Piatti non in perimetro o non implementata nel lanciatore
- **piatti-console** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-elimina-permessi** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-elimina-registro** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione
- **piatti-persistenza** | — | — | misurato `—` | atteso `—` | evidenza: controllo non eseguito dal lanciatore in questa esecuzione


## Tabella controlli distinti (JSON corrente)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| piatti-console | NON PROVATO (0/1) |
| piatti-elimina-permessi | NON PROVATO (0/1) |
| piatti-elimina-registro | NON PROVATO (0/1) |
| piatti-persistenza | NON PROVATO (0/1) |
| webkit-giro-essenziale | OK (1/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| piatti-stati-ui | piatti | — | NON PROVATO | — | simulazione APP_MENU_DEV_SIMULATE_* | schermata Piatti non in perimetro o non implementata nel lanciatore |
| piatti-console | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-elimina-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-elimina-registro | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| piatti-persistenza | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- piatti-console: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-elimina-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-elimina-registro: controllo non eseguito dal lanciatore in questa esecuzione
- piatti-persistenza: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
