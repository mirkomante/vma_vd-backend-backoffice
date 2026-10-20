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
| `verify:menu-6_2` | FALLITO | `Verifica 6.2 non riuscita: REST fallback-locale=none: description doveva essere vuota` | **causa non determinata** (correzione della chat di design). Dopo l'ultimo OK noto (F-EN, 18/10) `collections/`, hook e dipendenze non sono cambiati; il blocco REST gira solo con `pnpm dev` acceso, quindi potrebbe non essere mai stato esercitato prima (non verificato). Asserzione in `verify-menu-6_2.ts` ~1794–1796 (fixture IT «Solo IT»). Da diagnosticare in V6 con una `curl` su `/api/dishes/<id>?locale=en&fallback-locale=none&depth=0` |
| `verify:menu-6_3` | OK | — | il FALLITO della prima sessione (menù fissi 1→3) non è stato riprodotto: causa non determinata |
| `verify:menu-6_4` | FALLITO | `Error: Conteggio dishes cambiato: 9 → 44` | (i) precondizione, **dimostrata dal log**: `import contenuto prima wipe` = `5e7e8e70…`, `dopo reimport` = `d2cd0cc6…`, diverse; `verify-menu-6_4.ts` ~473 lancia «Impronta contenuto roundtrip» e il `finally` lo sostituisce con il conteggio (~1015–1016). Stesso schema del 18/10 (47→12) |
| `verify:menu-availability-final-proofs` | **NON PROVATO** (ambiente) | `FINAL_PROOF\|1 dev lingua step1 ?locale=en\|FAIL undefined` | il dev è stato avviato con le variabili di 6_4 per l'indicazione del prompt, non con quelle di `final-proofs` (`/tmp/vma-final-dev-*`): il FAIL non è evidenza. `ECONNREFUSED` su :3002 = standalone assente |

**Criteri**: (a) tutti i verify misurati; (b) 0 ERRORE-STRUMENTO sui passi verify; (c) post-commit atteso: porte libere, `count-verify-ui` 0.

## Note e debiti (correzione della chat di design, dopo il controllo del commit `78dba31`)

- **Da fare in V6** (backend, non UI): `verify:menu-6_4` una seconda volta a database allineato allo snapshot; diagnosi di 6_2 con `curl`; `final-proofs` con il dev avviato con le sue variabili.
- **Non spiegato**: la prima sessione di I6 lasciò 25 piatti dopo 6_4, questa 44, a parità di snapshot.
- **Difetto dello script** (`scripts/`, fuori perimetro qui): in 6_4 il `finally` sostituisce il primo errore con il conteggio finale; è lo stesso schema del 18/10 e di oggi.
- **Terminale di Cursor**: `PLAYWRIGHT_BROWSERS_PATH` punta a una cache vuota; probabile causa del «Chromium assente» del lanciatore (non provata). Per i giri di V6 va impostata su `$HOME/Library/Caches/ms-playwright`.
- **Checklist**: dopo il controllo del commit tre righe sono passate da OK a NON PROVATO (Giorni speciali §9.6 e §9.12, Messaggio globale §9.5: la voce non è coperta per intero); totali 3 OK / 0 FALLITO / 164 NON PROVATO su 167.
