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

## Smoke online (`scripts/online-smoke.mjs`, 58 righe)

- **Positivo** (`BASE_URL` Cloud Run): 7/7 OK (on1–on6, on-menu-1).
- **Negativo** (`BASE_URL=http://127.0.0.1:9`): `TypeError: fetch failed` (bad port), exit 1, nessuna riga OK.

## Chiusura

`pnpm typecheck` 0 errori (dopo rimozione temp); `pnpm lint` 0 errori; `pnpm ui:check` ok; `pnpm e2e:wire` ok; `count-verify-ui` → 0; porte 3000–3203, 3002, 31997 libere; dev fermo.
