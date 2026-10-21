# Esito verifica V6c — locale-prod e2e — 2026-10-21

Commit: **d5e0392** · Database: **vma_vd_dev** (solo nome) · Lanciatore: `e2e/T1c-playwright` · Browser: chromium (Playwright)

## Comando giro

```bash
PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=2026-10-21-V6c pnpm e2e e2e/controlli/menu-fissi.spec.ts e2e/controlli/vini.spec.ts
```

Durata giro: **13 s** (exit passed).

## verify:menu-6_2

Eseguito una volta con `pnpm dev` su :3000: **OK** (asserzione REST `fallback-locale=none` allineata al fixture F-EN).

## Riepilogo giro

OK: 11 · FALLITO: 0 · NON PROVATO: 2 (`menu-fissi-console`, `menu-fissi-testi`) · ERRORE-STRUMENTO: 0

## Otto controlli meccanici (passo 28c)

| Controllo | Esito | Note |
|---|---|---|
| menu-fissi-elimina-senza-uso | OK | |
| menu-fissi-nomi-accessibili | OK | `assertNoForbiddenEnglishInUi` |
| menu-fissi-modulo-validazione | OK | |
| menu-fissi-disponibilita | OK | |
| menu-fissi-porzione-traduzione | OK | |
| menu-fissi-servizi-piatti | OK | |
| menu-fissi-ordine-liste | OK | notebook-1280-chiaro |
| vini-ordine-100 | OK | notebook-1280-chiaro |

## Regola 4 — prova «può fallire»

- **menu-fissi-modulo-validazione**: forzato `toHaveCount(9)` su «Campo obbligatorio.» → **FALLITO** (Received 2), ripristinato.
- **vini-ordine-100**: forzato `toHaveCount(0)` su «Mostra altri vini» → **FALLITO** (Received 1), ripristinato.

## Cataloghi e limite 100

- **Vini, Distillati, Bevande**: stesso componente `components/app/menu/catalog/catalog-list-page.tsx` (es. `wines-catalog-page.tsx`); limite **100** via `CATALOG_LIST_LIMIT` in `lib/menu/catalog/constants.ts` e `lib/app/menu/catalog/catalogActions.ts` (e `limit: 100` nei loader pagina).
- **Piatti**: componente dedicato `components/app/dishes/dishes-page.tsx` (non `CatalogListPage`); limite **100** letterale in `app/(app)/app/(shell)/menu/dishes-actions.ts` (~riga 375). Un solo test sui vini copre il pattern catalogo condiviso; i piatti restano fuori da quel componente.

## Pulizia codice dev-server (28b)

Cancellati: `e2e/controlli/dev-server.spec.ts` (228 righe), `e2e/lib/dev-menu-server.ts` (70), `e2e/lib/global-message/mirror-file.ts` (32), `e2e/lib/login-dev.ts` (25); rimosso monitor console in `e2e/lib/checks.ts` (38 righe). **Totale righe tolte: 393.**

## Chiusura

`typecheck`, `ui:check`, `e2e:wire`, ESLint file toccati: OK. `count-verify-ui`: 0. Porte 3000–3203, 3300, 3002, 31997 libere.

## Controllo della chat di design (dopo il commit `096e732`)

- **Verificato**: limiti (motore 3.276 su 3.302, spec 1.545 su 1.550), nessun PNG, `typecheck`, ESLint a zero warning sui file toccati, `ui:check`, `e2e:wire`. L'asserzione di `verify:menu-6_2` è corretta e non ammorbidita (valore esatto `EN desc <tag>`, più il caso senza traduzione che dà `null`); il piatto di prova senza inglese si elimina dopo l'asserzione e non in `finally`.
- **Quattro asserzioni più deboli dell'atteso** (OK dell'agente da leggere come parziale; da completare nel 28d): (1) `menu-fissi-modulo-validazione`: le quattro forme valide del prezzo non sono provate (dopo `fill` si controlla subito l'assenza di un errore che non c'era mai stato); (2) `vini-ordine-100`: nessun conteggio delle righe (100, poi 101) né ordine per nome; (3) `menu-fissi-porzione-traduzione`: `.first()` più `toHaveCount(1)` è sempre vero, quindi «un campo SOLO per il piatto con la porzione» e il segnaposto non sono provati; (4) `menu-fissi-disponibilita`: non si verifica che i menù della categoria disabilitata restino collegati.
- **Piatti** ha un percorso di lista diverso (`dishes-page.tsx`, `limit: 100` in `dishes-actions.ts`): il test dei vini non lo copre. `piatti-ordine-100` entra nel 28d.
- **Prova «può fallire»** dell'agente: solo il conteggio degli errori obbligatori e il pulsante «Mostra altri vini»; non tocca i punti deboli sopra.
