# Passo 26 bis (I6) — diagnosi verify e checklist §9

- **HEAD base**: `b674045`
- **Database**: `vma_vd_dev` (assertDevDatabaseFromEnv)
- **Dev server**: `pnpm dev` :3000 con variabili intestazione `verify-menu-6_4.ts` (trace/mirror in `/tmp/vma-verify-menu-6_4-*`)
- **L1 lanciatore**: non attivato — passo solo documentale (policy-test §4); Home e navigazione restano **ERRORE-STRUMENTO** del giro precedente; altre schermate **NON PROVATO**
- **Playwright**: `pnpm exec playwright --version` → 1.55.1; cache `~/Library/Caches/ms-playwright` → chromium-1193, chromium_headless_shell-1193, ffmpeg-1011, webkit-2203
- **E2E nucleo** (`E2E_ESITI=2026-10-20-I6-L1b`, `PLAYWRIGHT_BROWSERS_PATH` utente): **10 OK / 10 NON PROVATO**, 0 ERRORE-STRUMENTO — vedi `risultati.json`

## Conteggi collection (Local API)

| Momento | dishes | fixed-menus | special-days | wines | spirits | drinks | menu-services |
|---------|--------|-------------|--------------|-------|---------|--------|---------------|
| Prima `verify:menu-6_1` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Dopo `verify:menu-6_1` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Prima `verify:menu-6_2` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Dopo `verify:menu-6_2` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Prima `verify:menu-6_3` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Dopo `verify:menu-6_3` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Prima `verify:menu-6_4` | 9 | 0 | 0 | 90 | 38 | 13 | 3 |
| Dopo `verify:menu-6_4` (interrotto) | 44 | 0 | 0 | 90 | 38 | 13 | 3 |
| Dopo `final-proofs` | 44 | 0 | 0 | 90 | 38 | 13 | 3 |

## Verify — sintesi

Log: `verify-*.log` in questa cartella.

| Verify | Esito | Prima riga di errore | Classe |
|--------|-------|----------------------|--------|
| `verify:menu-6_1` | OK | — | — |
| `verify:menu-6_2` | FALLITO | `Verifica 6.2 non riuscita: REST fallback-locale=none: description doveva essere vuota` | (iii) REST dopo F-EN restituisce `description` non vuota con `fallback-locale=none` (fixture IT «Solo IT», `verify-menu-6_2.ts` ~1794–1796; Local API pre-F-EN OK) |
| `verify:menu-6_3` | OK | — | — |
| `verify:menu-6_4` | FALLITO | `Error: Conteggio dishes cambiato: 9 → 44` | (i) precondizione: DB non allineato al baseline del roundtrip (9 piatti residui); reimport snapshot porta 44 (`verify-menu-6_4.ts` ~1015–1016) |
| `verify:menu-availability-final-proofs` | dev **FAIL** / standalone **NON PROVATO** | `FINAL_PROOF\|1 dev lingua step1 ?locale=en\|FAIL undefined` | (i) dev avviato con mirror 6_4, non `/tmp/vma-final-dev-*` dell'intestazione dello script; `ECONNREFUSED` su :3002 = ambiente standalone assente |

**Criteri**: (a) tutti i verify misurati; (b) 0 ERRORE-STRUMENTO sui passi verify; (c) post-commit atteso: porte libere, `count-verify-ui` 0.
