# V4 — agente di verifica (post-I4) — locale-prod

**Istanza**: V4 · **Commit inizio**: `6a0b2bc` (working tree pulito) · **Lanciatore**: 3.6.0 + `run-menu-list-supplementary-flows.mjs`  
**Browser**: Chromium (Playwright) · **Controlli**: `controlli-6.6.json` v1

## A / A2 — debiti lanciatore (VC4 → V4)

| Voce | Stato |
|---|---|
| `menu-fissi-schede-percorsi`: `Promise.all([waitForURL, click])` prima di `goBack` | **Implementato ed eseguito** — ultimo giro **OK**; `documentReloaded=true` (navigazione full page: rilievo **A** «meglio Link di Next») |
| `delete-prefix`: special-days, menu-services, fixed-menus, categorie, piatti (+ catalogo) | **Implementato**; bug loop raccolta ID fixture **corretto** (bloccava payload >2 min) |
| Fixture `verify-ui-p1…p4`, `verify-ui-pranzo/sempre`, servizi a/b dopo pulizia | **`ensure-menu-list-fixtures`** in `menu-payload.ts` |
| Flussi servizi in debito VC4 | **Implementati** in `run-menu-list-supplementary-flows.mjs`; giro **servizi** L2 completato (vedi sotto) |
| Flussi menu-fissi in debito VC4 | **Implementati**; giro L2 **interrotto** (~80 s, `TimeoutError` Playwright su preparazione stati/screenshot) — molti controlli restano **NON PROVATO** nel merge `risultati.json` |

## B — esecuzioni

| Comando | Esito esecuzione |
|---|---|
| `pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata servizi` | Completato (~3,5 min) |
| `pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata menu-fissi` | **Interrotto** (timeout ~80 s) — solo `--solo menu-fissi-schede-percorsi` OK |
| `pnpm ui:verify locale-dev --livello 2 --schermata servizi` / `menu-fissi` | **Non completato** (lock / errore avvio dev) |
| L1 `navigazione,home,piatti` / shell 8.2 | Non consolidati in questo file (vedi `rapporto.md` pacchetti) |
| B2 `--solo bevande-modulo-inglese`, `piatti-modulo-inglese` | **OK** (valori in `risultati.json`) |

## Servizi — ultimo esito per controllo (locale-prod)

- **OK**: testi, senza-ricerca-filtri, modulo-validazione, nomi-accessibili, colonna/colonne/azioni pagina, disponibilità, elimina-usato/senza-uso, modulo-campi/footer/inglese, ordine, persistenza, …
- **FALLITO**: `servizi-righe-azioni` — misurato `switch attivo su disabled` · atteso interruttore disabilitato su riga `disabled`
- **FALLITO**: `servizi-elimina-cascade-registro-permessi` — cascade/registro non verificati (admin elimina prima del log manager; `ensure-norole-user` fallisce in payload)
- **NON PROVATO**: accesso, stato-vuoto, confronto-visivo, ricompila (6.5), **console** (locale-dev), **stati-ui** (simulazioni dev)

## Menù fissi — evidenze parziali

- **OK**: schede-percorsi (`documentReloaded=true`), categoria-modulo, modulo-validazione, composizione, elimina-usato/senza-uso, …
- **FALLITO**: `menu-fissi-ordine-piatti` — `piatto non trovato` (regex «Sposta su» nel foglio)
- **FALLITO**: `menu-fissi-visibilita-categoria` — avvisi non letti dopo scelta `verify-ui-pranzo`
- **NON PROVATO**: maggior parte controlli supplementari + matrice L2 per timeout giro

## B2 — modulo inglese

| Controllo | Esito | Misurato (estratto) |
|---|---|---|
| `bevande-modulo-inglese` | OK | badge Manca/Presente; API `locale=en`; solo descrizione EN nel modulo |
| `piatti-modulo-inglese` | OK | badge Manca/Presente; `locale=en` ricade su IT se vuoto |

## C — online

Tutti i controlli `online-senza-credenziali`: **NON PROVATO** — motivo: **si provano in V6** (dopo deploy).

## Anomalie ambiente / esecuzione

- Processo `next start` residuo **PID 61203** su porta 3100 segnalato in più giri.
- Primo giro servizi bloccato da `delete-prefix` (loop infinito raccolta ID) — **corretto** in sessione.
- Giro menu-fissi L2: **TimeoutError** costante ~80 s (non `UI_VERIFY_*`); da ripetere con isolamento stato/screenshot.

## Pulizia

`delete-prefix verify-ui-` eseguito a fine sessione (`deleted: 0`). Utente di prova gestito dal lanciatore (`try/finally`).

Percorso esiti canonico: `docs/design/verifica/esiti/2026-10-18-locale-prod/` (`rapporto.md`, `risultati.json`, `img/`).
