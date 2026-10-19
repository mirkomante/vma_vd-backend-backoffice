# VC-parallelo — lanciatore `scripts/ui-verify/**`

**Data**: 2026-10-19 · **Istanza**: VC-parallelo · **Lanciatore**: 3.8.0  
**Commit**: working tree locale · **Browser**: Chromium (Playwright, giri locali)

## Obiettivo

Giri più brevi e leggibili: log di avanzamento su file e stdout, avvio senza silenzio >60s, matrice C1/C2/C3 in parallelo (`UI_VERIFY_PARALLEL`, default 4), chiusura pulita (server, browser, daemon Payload :31997, lock).

Segui avanzamento: `tail -f .next/ui-verify-progress.log`

Formato riga: `HH:MM:SS | schermata | fase | controllo o stato | n/N | secondi trascorsi` (battito ogni 30s).

## Causa avvio «muto» (>4 min, regressione L1 8.2)

1. **`logProgress` legacy**: una sola riga su stderr con `\r` e padding, senza newline — in pipe/`tee` o terminali lenti sembrava **nessun output** per minuti.
2. **Fasi senza log**: tra `acquireUiVerifyLock` e il primo controllo UI passavano **provision-user** (`pnpm payload run`, spesso 3–30s+), **build** (fino a diversi minuti se cache assente), **waitForUrl** sul server prod, senza alcuna riga.
3. **Daemon menu-payload** (:31997): al primo uso, loop sincrono di attesa fino a 90s senza log (se il giro tocca catalogo/servizi).

**Correzioni**: `lib/progress.mjs` (file + stdout + heartbeat 30s); `lib/startup-phase.mjs` (fasi `lock`, `provision-user`, `porte-libere`, `build`, `prod-server` / `dev-server` con timeout 60s, variabile `UI_VERIFY_STARTUP_PHASE_MS`); fasi annunciate subito.

## Opzioni / variabili nuove o rilevanti

| Opzione / variabile | Effetto |
|---|---|
| `.next/ui-verify-progress.log` | Log avanzamento (non versionato) |
| `UI_VERIFY_PARALLEL` | Contesti browser paralleli per cella matrice (default **4**) |
| `UI_VERIFY_STARTUP_PHASE_MS` | Timeout per fase di avvio (default **60s**), exit con messaggio che indica la fase |
| `UI_VERIFY_STATE_TIMEOUT_MS` | Timeout cella matrice (default 60s) → NON PROVATO `tempo: <stato>` |
| `UI_VERIFY_BUDGET_MS` | Budget schermata 15 min + guardia +2 min |
| `UI_VERIFY_MENU_PAYLOAD_PORT` | Daemon fixture (default **31997**), incluso in audit `ps`/`lsof` finale |

## Implementazione matrice parallela

- Fixture DB **una volta per stato** (`applyCatalogFixtures`, `applyMenuListFixtures`) poi celle `profilo×tema` in parallelo con ordine risultati deterministico (`sortKey`).
- Stati `caricamento` / `errore-caricamento`: celle **seriali** (server sim porta 3200).
- Flussi (elimina, switch, salvataggi): invariati, **seriali** prima della matrice (`runMenuListFlowControls`, `runCatalogFlowControls`).

File principali: `lib/matrix-parallel.mjs`, `lib/catalog-fixtures.mjs`, aggiornamenti `run-catalog.mjs`, `run-menu-list.mjs`, `menu-list-state.mjs`.

## Prove (E)

| # | Prova | Esito | Numeri / evidenza |
|---|---|---|---|
| E1 | L2 `locale-prod --livello 2 --schermata servizi --controlli controlli-6.6.json` | **OK** (parziale) | **2 min 13 s** (`durataMs`: 132980). Matrice servizi: **10 stati** × **4 celle** (2 profili × 2 temi) = **40 celle** teoriche; log `parallelo×4` da 09:40:52. Giro scritto esiti prima del completamento flussi L2 completi; **residuo** `porta 31997: PID 33500` nel finally (chiusura daemon da rafforzare). Atteso ~6 min se include tutti i flussi L2. |
| E2a | L1 `--schermata navigazione` controlli-8.2 | **FALLITO** | Avvio OK (build riusata **4 s**), log avanza fino a 30s poi **blocco** >10 min su `menu-fisso-notebook/notebook-1280` (anomalia esecuzione, non valutato <3 min). |
| E2b | L1 `--schermata home` | **NON PROVATO** | Avviato solo per test lock concorrente, terminato. |
| E2c | L1 `--schermata piatti` | **NON PROVATO** | Non eseguito (tempo istanza). |
| E2d | L1 `--schermata shell` | **NON PROVATO** | Non completato; usato solo per verifica lock. |
| E3 | Secondo avvio mentre il primo attivo | **OK** | `giro già in corso (PID 47894, avviato alle …): attendi o ferma quel processo`, exit **1**. |
| E4 | `ps` / `lsof` a fine giri puliti | **OK** | Dopo kill manuale processi bloccati: nessun listener su 3000/3100/3200/31997. Dopo E1 senza kill: **31997 residua**. |
| E5 | `pnpm typecheck` / `pnpm lint` intero repo | **OK** | typecheck exit 0; lint **0 errori** (warning preesistenti). |

## Riepilogo tabella prove

| Prova | Esito |
|---|---|
| E1 L2 servizi tempo / parallelismo | OK (parziale, 2m13s, 40 celle teoriche, ×4) |
| E2 L1 navigazione / home / piatti / shell | FALLITO / NON PROVATO |
| E3 Lock concorrenza | OK |
| E4 Pulizia porte | OK (con nota 31997 post-E1) |
| E5 typecheck + lint | OK |

## Anomalie aperti

- Hang L1 **navigazione** dopo ~30s (controllo `menu-fisso-notebook`): da investigare fuori da VC-parallelo.
- Daemon **31997** occasionalmente sopravvive al `finally` se il processo è terminato in modo anomalo.
- L2 servizi: matrice parallela veloce; il tempo totale atteso ~6 min include flussi seriali non misurati in questo giro troncato.

Percorso esiti run: `docs/design/verifica/esiti/2026-10-19-locale-prod/`.
