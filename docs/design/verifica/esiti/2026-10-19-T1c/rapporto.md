# Esito verifica — locale-prod e2e — T1d (chiusura T1c) — 2026-10-20

Commit: (working tree) · Lanciatore: `e2e/T1c-playwright` · Browser: chromium (Playwright 1.55.1) · Controlli: `controlli-6.6.json` (`servizi`, `menu-fissi`)

## Criteri di accettazione T1c

| # | Criterio | Atteso | Misurato | Esito |
|---:|---|---|---|---|
| 1 | `pnpm e2e:t1c` ×2, 4 worker | &lt; 10 min, stesso esito | Giro completo **non** eseguito in questa sessione; checkpoint Servizi (grep): **~64 s**, **162 OK**, **1 FALLITO**, **39** non eseguiti (catena seriale `simulazioni` dopo fallimento) | **NON soddisfatto** |
| 2 | Screenshot | **45** (17 servizi + 28 menu-fissi) | Non conteggiati (giro non completato) | **NON soddisfatto** |
| 3 | ERRORE-STRUMENTO | **0** | Checkpoint Servizi: **0** ERRORE-STRUMENTO nel grep; **1 FALLITO** (`@sim/ servizi/errore-caricamento` C1: testo «Impossibile caricare» non visibile entro 15 s) — **probabile difetto app o sim non attiva su server dev isolato** | **NON soddisfatto** |
| 4 | `time pnpm e2e:smoke` | &lt; 60 s, exit 0 | **real 8,75 s**, exit 0 (6 test) | **OK** |
| 5 | `pnpm typecheck` + `pnpm lint` | 0 errori | typecheck OK dopo rimozione `globalSetupTimeout`; lint con errori/warning preesistenti fuori `e2e/` | **parziale** (typecheck e2e+root OK) |
| 6 | `ps` / `lsof` / `verify-ui-` | puliti a fine giro | Da rieseguire dopo giro verde | **da confermare** |
| 7 | Perimetro file | solo `e2e/`, script e2e in `package.json`, `docs/design/verifica/esiti/` | rispettato (aggiunto `e2e/.gitignore` per `.sim-isolates/`) | **OK** |

## Checkpoint Servizi — `pnpm e2e:t1c --grep "( servizi |@sim/ servizi)"`

| Metrica | Valore |
|---|---|
| Tempo reale (miglior giro) | **63,8–64,3 s** |
| Test eseguiti (pass + fail) | **163** (162 OK + 1 FALLITO) |
| OK | **162** |
| FALLITO | **1** (`@sim/ servizi/errore-caricamento` C1 telefono-390-chiaro: timeout su «Impossibile caricare») — **da classificare** (sim `APP_MENU_DEV_SIMULATE_LOAD_ERROR` su `next dev` webpack in worktree) |
| ERRORE-STRUMENTO | **0** |
| Screenshot servizi attesi | **17** — non contati in questo grep |
| NON PROVATO atteso | `servizi/vuoto` (1 test dedicato) |

## Modifiche e2e (T1d)

1. **R5**: `payload.nome(slug)`; seed `pranzo`/`sempre`/`cat` per worker; `assertPrepared` al posto di `test.skip` su fixture; matrice senza test generati per stati `NON PROVATO`; selettori esatti in `ui-helpers`.
2. **Simulazioni**: progetto `simulazioni` seriale; `test.beforeAll` → `startSimDevServers()`; quattro `next dev --webpack` (3200 root, 3201–3203 in `e2e/.sim-isolates/` via git worktree + `node_modules` clonato senza `@playwright`); avvio sequenziale; `playwright.config` ignora `**/.sim-isolates/**`.
3. **Combinazioni**: niente loop C1–C3 per stati `vuoto` / `nuovo-senza-categorie` (solo test NON PROVATO dedicato); screenshot solo da `screenshotPlan` applicabile.
4. **Setup in-process**: `global-setup` / `global-teardown` con Local API (invariato); smoke **8,75 s**.
5. **Note Next 16**: un solo `next dev` per directory → worktree per porte 3201–3203; `next start` + `NODE_ENV=development` **non** attiva l’errore di lettura simulato (solo ritardo parziale).

## Prossimi passi

1. Verificare in dev che `APP_MENU_DEV_SIMULATE_LOAD_ERROR=1` esponga «Impossibile caricare i servizi» su `/app/menu/services` (se no → **difetto app**).
2. Giro `pnpm e2e:t1c` completo ×2, 45 screenshot, pulizia porte e `verify-ui-`.
3. Aggiornare `risultati.json` via reporter a giro verde.
