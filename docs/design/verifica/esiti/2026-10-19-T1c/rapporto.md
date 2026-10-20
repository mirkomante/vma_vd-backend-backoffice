# Esito verifica — locale-prod e2e — T1c bis — 2026-10-20

Commit: (working tree) · Lanciatore: `e2e/T1c-playwright` · Browser: chromium (Playwright 1.55.1) · Controlli: `controlli-6.6.json` (`servizi`, `menu-fissi`)

## Criteri di accettazione T1c

| # | Criterio | Atteso | Misurato | Esito |
|---:|---|---|---|---|
| 1 | `pnpm e2e:t1c` ×2, 4 worker | &lt; 10 min, stesso esito | 1° giro: **392 s** (~6,5 min), **409 OK**, **73 falliti**, **125** non eseguiti (catena seriale `simulazioni`); 2° giro completo **non** ripetuto in questa sessione | **NON soddisfatto** |
| 2 | Screenshot | **45** (17 servizi + 28 menu-fissi) | **28** file in `img/` (giro parziale) | **NON soddisfatto** |
| 3 | ERRORE-STRUMENTO | **0** | Giro completo: mix **ERRORE-STRUMENTO** (console dev, sim, preparazione stati) + **FALLITO** C2 su dialoghi; checkpoint Servizi (grep): **141 OK**, **2** problemi | **NON soddisfatto** |
| 4 | `time pnpm e2e:smoke` | &lt; 60 s, exit 0 | **real 10,0 s**, exit 0 (6 test) | **OK** |
| 5 | `pnpm typecheck` + `pnpm lint` | 0 errori | typecheck OK; lint 0 errori (warning preesistenti) | **OK** |
| 6 | `ps` / `lsof` / `verify-ui-` | puliti a fine giro | da rieseguire dopo giro verde | **da confermare** |
| 7 | Perimetro file | solo `e2e/`, script e2e in `package.json`, `docs/design/verifica/esiti/` | rispettato | **OK** |

## Checkpoint Servizi (~30 min) — `pnpm e2e:t1c --grep "( servizi |@sim/ servizi)"`

| Metrica | Valore |
|---|---|
| Tempo reale | **159 s** (~2,7 min) nel giro migliore post-fix grep |
| Test eseguiti (conteggio log) | **144** tentativi progetto + **simulazioni** (catena seriale interrotta dopo 1° errore sim) |
| OK | **141** |
| FALLITO | **1** (`servizi/elimina-senza-uso` C2: pulsanti dialogo **274×42 px**, atteso ≥ 44) — **probabile difetto app** (tolleranza D6 su dialoghi) |
| ERRORE-STRUMENTO | **1** (`@sim/ servizi/caricamento` C1: avvio server dev) |
| Screenshot servizi attesi | **17** — non contati in questo grep parziale |

## Implementazione T1c bis (e2e)

1. **R5 fixture**: `payload.nome(slug)` → `verify-ui-<runId>-w<worker>-<slug>`; seed `pranzo`/`sempre`/`cat` per worker; `registerCreated` + `afterEach`; selettori esatti (`Modifica {nome}`); rimosso `fixture-lock` e `menuDeleteVerifyPrefix` per test.
2. **Simulazioni**: progetto `simulazioni` (1 worker, serial, `@sim/`, timeout 120 s); server dev **uno alla volta** (limite Next.js: un solo `next dev` per directory) con porte **3200/3201/3202** e env sim; **3203** console; `stdio: 'ignore'` su spawn; `NODE_ENV=development`.
3. **Combinazioni**: test generati solo per profili/temi applicabili; titolo `[progetto]` + `grep` per progetto (niente skip profilo); stati `vuoto` / `nuovo-senza-categorie`: un solo **NON PROVATO** ciascuno.
4. **Setup in-process**: `global-setup` / `global-teardown` con `provisionTestUser` / `deleteTestUser` / `deleteAllVerifyUiPrefix` (Local API); niente `pnpm payload run` in setup/teardown.
5. **Fixture DB**: `e2e/lib/menu-list/payload-actions.ts` (no import di `menu-payload.ts` CLI).

## Note tecniche

- Avvio **parallelo** di più `next dev` sulla stessa root **non è supportato** da Next 16 (lock `.next/dev`); implementato **riavvio sequenziale** per stato simulato.
- Import di `scripts/ui-verify/menu-payload.ts` dal runner Playwright esegue il CLI (`azione sconosciuta test`): **vietato**; logica minima duplicata in `e2e/`.
- Grep consigliato per schermata: `--grep "( servizi |@sim/ servizi)"` (spazio prima di `servizi` perché il titolo include il `describe`).

## Prossimi passi (stesso perimetro)

1. Giro `pnpm e2e:t1c` completo con **0 ERRORE-STRUMENTO** (sim + console dev + stati menu-fissi `visibilita-*` / `scegli-piatti`).
2. **45** screenshot e secondo giro identico per accettazione #1.
3. Aggiornare `risultati.json` via reporter al termine.
