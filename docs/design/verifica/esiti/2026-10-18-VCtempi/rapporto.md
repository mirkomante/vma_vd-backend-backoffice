# VC-tempi — migliorie lanciatore `scripts/ui-verify/**`

**Data**: 2026-10-18 · **Lanciatore**: 3.5.0 · **Commit** (al momento dei test): working tree locale

## Obiettivo

Giri più veloci, mirati, con tempi massimi veri, build riusata, blocco concorrenza e esiti più leggibili (senza modificare i JSON dei controlli).

## Opzioni nuove

| Opzione / variabile | Effetto |
|---|---|
| `--solo <id,id,…>` | Esegue **solo** i controlli indicati (qualsiasi livello). Profili/temi default L1 (`telefono-390`, `notebook-1280`, `chiaro`, `scuro`) salvo `--profili` / `--temi`. Le righe dei controlli non eseguiti restano dall’ultimo `risultati.json` (merge). |
| `UI_VERIFY_BUDGET_MS` | Budget per schermata (default **15 min**). Timer di guardia = budget + **2 min** (chiusura browser/server ed `process.exit` con esiti già scritti). |
| `UI_VERIFY_STATE_TIMEOUT_MS` | Timeout per ogni combinazione stato×profilo×tema della matrice C1/C2/C3 (default **60 s**). Scaduto → **NON PROVATO** con misurato `tempo: <stato>`. |
| `UI_VERIFY_FLOW_TIMEOUT_MS` | Timeout per controllo a flusso (default **90 s**). |
| (invariato) `UI_VERIFY_TIMEOUT_LOCALE_PROD_MS` | Budget ambiente `locale-prod` (default ripristinato a **25 min**, non più 45). |

Altri comportamenti: cache build in `.next/ui-verify-build.json` (HEAD + diff su `app/`, `components/`, `lib/`, `collections/`, `globals/`, `payload.config.ts`, `package.json`, `pnpm-lock.yaml` + file non tracciati); lock `.next/ui-verify.lock`; L2 con più `--schermata` rifiutato subito.

## Prove eseguite (F)

| # | Prova | Esito | Misura / evidenza |
|---|---|---|---|
| 1 | `--solo piatti-testi,piatti-azioni-pagina,piatti-colonna-elenco` su `locale-prod` | **OK** | **40,8 s** totali; log `build rifatta` (prima esecuzione senza cache). Atteso &lt; 4 min. |
| 2 | Stesso comando subito dopo | **OK** | **33,4 s**; log `build riusata (hash coincidente)`. Atteso &lt; 2 min. |
| 3 | L2 `--schermata piatti,vini` | **OK** | Messaggio `a livello 2 lancia una schermata per volta, oppure usa --solo`, exit **1**, nessuna esecuzione. |
| 4 | `UI_VERIFY_STATE_TIMEOUT_MS=1000` + `--solo C1 --schermata piatti --livello 2` | **OK** | Righe **NON PROVATO** con `misurato: tempo: <stato>` in `risultati.json` (es. `tempo: elenco`, `tempo: filtri`); giro prosegue. Durata ~342 s (stati lenti chiusi dopo fix `activeCtx`/`activeSim` su timeout). |
| 5 | `ps` / porte a fine giro (F2) | **OK** | Log `ps porte 3000/3100/3200: nessun listener residuo`. |
| 6 | Secondo avvio mentre il primo è vivo | **OK** | `giro già in corso (PID …)` exit **1**; nessun processo del secondo lancio rimasto (`pgrep` vuoto). |

## Esiti onesti (E)

- `*-elimina-registro-permessi`: parte norole **NON PROVATO** (`coperto da scripts/verify-roles-8_3.ts`); l’esito complessivo non fallisce solo per norole.
- `*-modulo-inglese`, `*-tassonomie`, `*-persistenza`, `vini-formati-ui`: misurato arricchito (opzioni Select dopo apertura listbox, valori letti, tipologia/paese in persistenza).

## Note

- `pnpm lint`: **0 errori** (solo warning preesistenti).
- Nessun commit git eseguito dall’agente.
