# Passo 28 — V6a (backend + online, senza lanciatore)

- **Commit**: `3002839` — `git status` iniziale pulito.
- **DB**: `vma_vd_dev` (solo nome).
- **on4**: assenza di `<form>`, `<input>`, `<button>` valutata sull’intero markup HTML della pagina (approssimazione richiesta).

## Conteggi menù (Local API)

| Voce | Prima 6_4 | Dopo 6_4 / fine passo |
|------|-----------|------------------------|
| piatti | 44 | 44 |
| menù fissi | 0 | 0 |
| giorni speciali | 0 | 0 |
| vini | 90 | 90 |
| distillati | 38 | 38 |
| bevande | 13 | 13 |
| servizi | 3 | 3 |

## Diagnosi REST `fallback-locale` (piatto `verify-ui-v6a-*`, IT desc «Solo IT»)

| Parametro | name | description |
|-----------|------|-------------|
| nessuno | `verify-ui-v6a-…` | `Solo IT` |
| `fallback-locale=none` | null | null |
| `fallback-locale=null` | null | null |
| `fallback-locale=false` | null | null |

Payload: `createPayloadRequest.js` r.43–51 (`fallback-locale` da query); `sanitizeFallbackLocale.js` r.22–27 (`none`/`null`/`false` → `false`).

## Smoke online (`scripts/online-smoke.mjs`: 58 righe nella versione dell'agente, 81 dopo la correzione)

- **Positivo** (`BASE_URL` Cloud Run): 7/7 OK (on1–on6, on-menu-1).
- **Negativo** (`BASE_URL=http://127.0.0.1:9`): `TypeError: fetch failed` (bad port), exit 1, nessuna riga OK.

## Chiusura

`pnpm typecheck` 0 errori (dopo rimozione temp); `pnpm lint` 0 errori; `pnpm ui:check` ok; `pnpm e2e:wire` ok; `count-verify-ui` → 0; porte 3000–3203, 3002, 31997 libere; dev fermo.

## Controllo della chat di design (dopo il commit `f4a51dd`)

- **6_2, classe (iv) confermata dal codice**: `verify-menu-6_2.ts` scrive la descrizione inglese `EN desc <tag>` sullo stesso piatto (blocco F-EN, riga ~1632) e poi, più avanti (righe ~1791–1796), pretende che con `fallback-locale=none` sia vuota. La diagnosi REST mostra che l'app è corretta (piatto senza traduzione inglese: `null`; senza parametro ricade sull'italiano). Il blocco REST gira solo con `pnpm dev` acceso, quindi l'incoerenza non era mai emersa. Non è un difetto dell'app: **A**, controllo dubbio, da correggere in `scripts/verify-menu-6_2.ts` (fuori perimetro di V6a).
- **final-proofs**: le prove dev 1–2 sono OK con le variabili giuste; resta NON PROVATO lo standalone `:3002` (serve il bucket: passo 30).
- **Smoke, difetto trovato e corretto**: la versione dell'agente accettava come destinazione qualunque `Location` che finisse con `/app/login`, quindi anche `http://0.0.0.0:3000/app/login` risultava OK (provato contro un server finto: uscita 0). Corretto con il confronto esatto (`/app/login` oppure l'origine di `BASE_URL`), timeout di 15 s per richiesta ed errore per singolo controllo invece dell'interruzione. Provato contro un server finto in otto casi: tutto in regola, `Location` con `0.0.0.0`, rotta 404, cookie non scaduto, risposta che non arriva, server assente e `BASE_URL` mancante danno FALLITO o errore, mai OK.
- **Non rieseguito** contro il dominio pubblico dopo la correzione.
- **Durata dichiarata** (~2 minuti): misurata dai conteggi alla chiusura delle porte, non comprende la scrittura dello script.
