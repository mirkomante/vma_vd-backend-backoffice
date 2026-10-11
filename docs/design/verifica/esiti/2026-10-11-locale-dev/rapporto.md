# Esito verifica — locale-dev — 2026-10-11
Commit: 60356e92b7cd · Lanciatore: 3.1.0 (L1) · Browser: — · Controlli: controlli-8.5.json v3 · Durata: 4 min 9 s

## Riepilogo
OK: 0 · FALLITO: 3 · AVVISO: 0 · NON PROVATO: 22 · Controlli distinti nel JSON: 24

## Esiti compatti

### OK (raggruppati)
- (nessuno)

### FALLITO
- **orari-console** (2 combinazioni): es. `err:2 warn:0 http:0` · atteso `zero error/warning/pageerror` · /app/hours · telefono-390/chiaro/Chromium 140.0.7339.186; /app/hours · notebook-1280/chiaro/Chromium 140.0.7339.186
- **orari-errore-server** (1 combinazioni): es. `Server non raggiungibile: http://localhost:3200` · atteso `flusso simulazione` · — · —

### AVVISO
- (nessuno)

### NON PROVATO
- **orari-annulla** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-barra-misure** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-campi-ora** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-chiusure-foglio** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-colonna** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-dati** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-errore-caricamento** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-errore-validazione** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-festivita** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-giorni-riposo** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-giorno-selezionato** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-intestazione-anno** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-modificato-barra** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-nomi-accessibili** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-non-configurato** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-permessi** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-salvataggio-in-corso** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-salvataggio-ok** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-stato-iniziale** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-testi** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **orari-validazione-server** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **webkit-giro-essenziale** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione

## Tabella controlli distinti (JSON)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| orari-annulla | NON PROVATO (0/1) |
| orari-barra-misure | NON PROVATO (0/1) |
| orari-campi-ora | NON PROVATO (0/1) |
| orari-chiusure-foglio | NON PROVATO (0/1) |
| orari-colonna | NON PROVATO (0/1) |
| orari-console | FALLITO (0/2) |
| orari-dati | NON PROVATO (0/1) |
| orari-errore-caricamento | NON PROVATO (0/1) |
| orari-errore-server | FALLITO (0/1) |
| orari-errore-validazione | NON PROVATO (0/1) |
| orari-festivita | NON PROVATO (0/1) |
| orari-giorni-riposo | NON PROVATO (0/1) |
| orari-giorno-selezionato | NON PROVATO (0/1) |
| orari-intestazione-anno | NON PROVATO (0/1) |
| orari-modificato-barra | NON PROVATO (0/1) |
| orari-nomi-accessibili | NON PROVATO (0/1) |
| orari-non-configurato | NON PROVATO (0/1) |
| orari-permessi | NON PROVATO (0/1) |
| orari-salvataggio-in-corso | NON PROVATO (0/1) |
| orari-salvataggio-ok | NON PROVATO (0/1) |
| orari-stato-iniziale | NON PROVATO (0/1) |
| orari-testi | NON PROVATO (0/1) |
| orari-validazione-server | NON PROVATO (0/1) |
| webkit-giro-essenziale | NON PROVATO (0/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| orari-console | /app/hours | telefono-390/chiaro/Chromium 140.0.7339.186 | FALLITO | err:2 warn:0 http:0 | zero error/warning/pageerror | Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 6ac4dbfd95da6d03f5b08c6e \| Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 6ac4dbfd95da6d03f5b08c6e |
| orari-console | /app/hours | notebook-1280/chiaro/Chromium 140.0.7339.186 | FALLITO | err:2 warn:0 http:0 | zero error/warning/pageerror | Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 6ac4dbfd95da6d03f5b08c6e \| Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 6ac4dbfd95da6d03f5b08c6e |
| orari-errore-server | — | — | FALLITO | Server non raggiungibile: http://localhost:3200 | flusso simulazione | 3200 |
| orari-annulla | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-barra-misure | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-campi-ora | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-chiusure-foglio | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-colonna | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-dati | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-errore-caricamento | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-errore-validazione | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-festivita | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-giorni-riposo | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-giorno-selezionato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-intestazione-anno | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-modificato-barra | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-nomi-accessibili | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-non-configurato | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-permessi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-salvataggio-in-corso | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-salvataggio-ok | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-stato-iniziale | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-testi | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| orari-validazione-server | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| webkit-giro-essenziale | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- orari-annulla: controllo non eseguito dal lanciatore in questa esecuzione
- orari-barra-misure: controllo non eseguito dal lanciatore in questa esecuzione
- orari-campi-ora: controllo non eseguito dal lanciatore in questa esecuzione
- orari-chiusure-foglio: controllo non eseguito dal lanciatore in questa esecuzione
- orari-colonna: controllo non eseguito dal lanciatore in questa esecuzione
- orari-dati: controllo non eseguito dal lanciatore in questa esecuzione
- orari-errore-caricamento: controllo non eseguito dal lanciatore in questa esecuzione
- orari-errore-validazione: controllo non eseguito dal lanciatore in questa esecuzione
- orari-festivita: controllo non eseguito dal lanciatore in questa esecuzione
- orari-giorni-riposo: controllo non eseguito dal lanciatore in questa esecuzione
- orari-giorno-selezionato: controllo non eseguito dal lanciatore in questa esecuzione
- orari-intestazione-anno: controllo non eseguito dal lanciatore in questa esecuzione
- orari-modificato-barra: controllo non eseguito dal lanciatore in questa esecuzione
- orari-nomi-accessibili: controllo non eseguito dal lanciatore in questa esecuzione
- orari-non-configurato: controllo non eseguito dal lanciatore in questa esecuzione
- orari-permessi: controllo non eseguito dal lanciatore in questa esecuzione
- orari-salvataggio-in-corso: controllo non eseguito dal lanciatore in questa esecuzione
- orari-salvataggio-ok: controllo non eseguito dal lanciatore in questa esecuzione
- orari-stato-iniziale: controllo non eseguito dal lanciatore in questa esecuzione
- orari-testi: controllo non eseguito dal lanciatore in questa esecuzione
- orari-validazione-server: controllo non eseguito dal lanciatore in questa esecuzione
- webkit-giro-essenziale: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- (nessuna)
