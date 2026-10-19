# Esito T0 — scheletro e2e Playwright — 2026-10-19

Commit di riferimento: working tree post-T0 (spike `060fe0c` + scheletro). Lanciatore: `e2e/T0-playwright` (`node e2e/scripts/playwright-cli.mjs`). Browser: Chromium 140 (Playwright 1.55.1).

## Spike (Opzione A — GO)

- **Scelta**: Local API Payload (`getPayload`) nello stesso processo del worker Playwright, con fixture `payloadWorker` (scope worker) e `payload.destroy()` a fine worker.
- **Tempo**: creazione/lettura/cancellazione piatto ~0,5 s nel worker; nessun `Pulling schema` nei log worker con `PAYLOAD_DISABLE_PUSH=1`.
- **tsx**: risoluzione `tsx/esm` tramite `createRequire` sul package `payload` (non percorsi pnpm store). Impostazione `NODE_OPTIONS` in `e2e/lib/tsx-loader.ts` + avvio CLI in `e2e/scripts/playwright-cli.mjs` con `node --import <tsx>`.

## Schema DB (push)

- **Trovato**: in `payload.config.ts`, `push` era `process.env.NODE_ENV !== 'production'` → in dev ogni `getPayload` poteva eseguire push interattivo («Pulling schema from database…»).
- **Soluzione**: `push` solo se `NODE_ENV !== 'production'` **e** `PAYLOAD_DISABLE_PUSH !== '1'`. Tutti i percorsi e2e impostano `PAYLOAD_DISABLE_PUSH=1` (CLI, webServer, fixture, `payload run` in setup/teardown).

## Misure accettazione T0

| # | Prova | Esito | Misura |
|---|--------|--------|--------|
| 1 | `pnpm e2e:smoke` &lt; 60 s (build riusata) | **OK** | `real 19,72 s` (ultimo giro completo); build riusata (`e2e-build.json` hash ok). Exit code Playwright **1** per 2 prove strumento volute (non difetti app). |
| 2 | Test bloccato → ERRORE-STRUMENTO «tempo», giro continua | **OK** | `strumento: blocco ucciso al timeout` → `ERRORE-STRUMENTO`, misurato `tempo`, 3 s; altri 6 test eseguiti. |
| 3 | Zero record `verify-ui-fix-*` dopo eccezione | **OK** | Fixture `afterEach` + `global-teardown` (`cleanup-verify-ui-menu-fixtures.ts`); restano solo seed L1 `verify-ui-pranzo` / `verify-ui-sempre` (2 categorie, by design). |
| 4 | `risultati.json`, `rapporto.md`, `e2e-progress.log` | **OK** | `docs/design/verifica/esiti/2026-10-19-T0/` + `.next/e2e-progress.log`; ERRORE-STRUMENTO in sezione dedicata (2). |
| 5 | Secondo avvio rifiutato con PID | **OK** | Messaggio: `giro e2e già in corso (PID 21109, …)`. |
| 6 | `pnpm typecheck` + `pnpm lint` intero repo | **OK** | typecheck 0 errori; lint 0 errori (warning preesistenti). |
| 7 | Nessuna modifica a `app/`, `components/`, `lib/`, `collections/`, `scripts/ui-verify` | **OK** | `git diff` vuoto su quei percorsi. |
| 8 | R1 nessuna sync vietata in `e2e/` | **OK** | Test `forbidden-sync-scan.spec.ts`. |
| 9 | Porta 3100 libera e nessun node residuo del giro | **OK** | `lsof -i :3100` vuoto post-teardown; teardown termina server avviato in setup (PID in `e2e-run.json`). |

## `pnpm e2e:wire`

**OK** — 192 id in `controlli-6.6.json`, coperti da `e2e/controlli/wire-registry.json` (`__default__`: T0 scheletro).

## Note operative

- Setup: utente via `pnpm payload run scripts/ui-verify/provision-user.ts` (async, no `spawnSync` in `e2e/`); login una volta → `.next/e2e-storage-state.json`.
- Lock: `.next/e2e.lock` (PID). Se un giro viene killato senza teardown, rimuovere lock solo se il PID non è vivo.
- `eslint.config.mjs`: override `react-hooks/rules-of-hooks` off per `e2e/**` (fixture Playwright).

## Riepilogo esiti smoke (ultimo giro)

OK: 6 · FALLITO: 0 · ERRORE-STRUMENTO: 2 (blocco + eccezione fixture) · vedi `risultati.json`.
