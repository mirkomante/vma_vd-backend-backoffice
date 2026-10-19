# VC-parallelo bis — lanciatore `scripts/ui-verify/**`

**Data**: 2026-10-19 · **Istanza**: VC-parallelo bis · **Lanciatore**: 3.9.0  
**Commit**: working tree locale · **Browser**: Chromium (Playwright)

## Intervento richiesto (timeout universale, passo nel battito, daemon)

### 1. Timeout 60s su tutti i pacchetti

- `runTimedControl` / `runBoundedState` + `runWithStateTimeout` (ritorno del risultato della `fn` corretto).
- **Accesso/login**: ogni cella `access/<schermata>/<stato>/<profilo>/<tema>` con `runTimedControl`; scatto → NON PROVATO `tempo: …` su C1/C2/C3/C2-mouse/C3-no-lampo della cella, giro continua.
- **C3-cambio-sistema**, **reset-senza-token-vuoto**, **AMBIENTE**: stesso schema.
- **Shell / menu / matrice**: già su `runBoundedState` (stesso limite `UI_VERIFY_STATE_TIMEOUT_MS`, default 60s).

### 2. Passo corrente nel battito (30s)

- `formatLine()` in `progress.mjs` appende `| passo: <etichetta>` quando `logHandlerStep` è attivo.
- **C3-cambio-sistema** (strumentato in `checkTemaCambioSistema`): passi osservati in giro di prova `servizi` L2 — cookie system → emulateMedia light → **goto /app/login domcontentloaded** → evaluate dark → emulateMedia dark → reload domcontentloaded → evaluate finale; **completato in ~8s** (non più blocco su `networkidle` del reload/goto, prima causa probabile del fermo >3 min con battito fermo su «C3-cambio-sistema»).

### 3. Daemon menu-payload :31997

| Osservazione | Dettaglio |
|---|---|
| Processo avviato | `pnpm payload run scripts/ui-verify/menu-payload.ts -- __daemon__` (log: `spawn __daemon__ pid=…`) |
| Prontezza | `waitMenuPayloadDaemonReady()` asincrono (no `spawnSync sleep` che bloccava timer/Playwright); **~2s** tipici fino a `in ascolto su :31997` |
| Operazioni singole | Con daemon attivo le azioni passano da `menu-payload-client.mjs` (non un nuovo `payload run` per azione) |
| Legacy / fallimento | `UI_VERIFY_MENU_PAYLOAD_LEGACY=1` → ogni azione è ancora `payload run` one-shot |
| Errore esplicito | Dopo **20s** (`UI_VERIFY_MENU_PAYLOAD_READY_MS`) messaggio con pid, listener, stderr/stdout del figlio |
| Residuo noto | Doppio `spawn` mentre un figlio è ancora in boot può far terminare il secondo con exit 1 — mitigato non rispawnare se `daemonChild` ancora vivo |

## Prove rapide (questo intervento)

| Prova | Esito | Note |
|---|---|---|
| L2 `servizi` + `controlli-6.6.json` (smoke post-fix) | **PARZIALE** | C3-cambio-sistema OK in log con passi; daemon warmup ~2s; run interrotto da errore doppio spawn su `menuPayloadRun` (da ritestare dopo fix spawn) |
| L1 `navigazione` (giro precedente) | **OK** | ~14s dopo `domcontentloaded` su nav-flows |

## File toccati

`lib/progress.mjs`, `lib/state-run.mjs`, `lib/timeouts.mjs`, `lib/menu-payload.mjs`, `lib/engine.mjs` (`checkTemaCambioSistema`), `run.mjs`, `run-menu-list.mjs` (await cleanup), `menu-payload.ts` (`__shutdown__`).

Avanzamento: `tail -f .next/ui-verify-progress.log`
