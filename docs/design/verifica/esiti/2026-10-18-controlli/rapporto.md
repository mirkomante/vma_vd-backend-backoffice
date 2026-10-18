# Esito VC3 — cablaggio controlli 6.6 (Vini, Distillati, Bevande) — 2026-10-18

**Istanza**: VC3 (prima di I3). **Ambiente esecuzione controlli**: nessuno (solo validazione lanciatore).  
**Validazione codice**: `pnpm lint` OK (0 errori) · `pnpm typecheck` OK · `node scripts/ui-verify/verify-controlli-wire.mjs` OK.

## Riepilogo cablaggio

| Area | Esito |
|---|---|
| Schermate vini / distillati / bevande in `controlli-6.6.json` | OK — presenti (83 controlli dedicati + comuni) |
| Tipi di controllo riconosciuti dal lanciatore | OK — audit all’avvio su `controlli-6.6.json` |
| Schermate non implementate (I3) | NON PROVATO — evidenza «schermata non ancora implementata» |
| Comuni NO-OVERRIDE, RICOMPILA-* | OK — già in `runMenuComuniChecks` |
| Difetti lanciatore V2 quater | OK — correzioni applicate (vedi sotto) |

## A. Controlli già coperti (pattern Piatti / comuni)

- **C1, C2, C3, C2-mouse** su stati `stati_c1_c2` (matrice in `run-menu.mjs` / `run-catalog.mjs`).
- **AMBIENTE, C9, NO-OVERRIDE, RICOMPILA-ASSENTE, RICOMPILA-PRESENTE** (comuni).
- **Piatti**: flussi esistenti in `run-piatti.mjs` (invariati salvo due controlli nuovi).
- **Catalogo**: stessi tipi (`testo`, `misura`, `attributi`, `flusso`, `console-pulita`, `reindirizzamento`, `presenza`) con runner in `run-catalog.mjs`.

## B. Controlli / tipologie aggiunti in VC3

| Tipologia | Implementazione |
|---|---|
| Foglio filtri origine a cascata (paese → regione → denominazione) | `catalog-ui-helpers.mjs` (`applyOriginFilterCascade`, `openFiltersSheet`); flusso `vini-filtri-origine` in `run-catalog.mjs` |
| Select con voce per svuotare | `clearComboboxToEmptyOption` |
| Anno + casella «Senza annata (NV)» | `toggleWineNvCheckbox`, `readWineYearInput`; flusso `vini-modulo-anno` |
| Avviso «Mostra altri …» + 101 record | `prepareCatalogBulk101`, `runCatalogShowMoreFlow`, `showMoreButtonLabel`; flusso `*-ordine-100` registrato, esecuzione al passo V |
| Dati `verify-ui-…` wines/spirits/drinks | `menu-payload.ts` (`create-catalog-items`, `count-catalog`, `find-catalog-item`, `try-delete-catalog`, `find-catalog-delete-log`; `delete-prefix` esteso) |
| Schermate catalogo (vini, distillati, bevande) | `catalog-config.mjs`, `run-catalog.mjs`, integrazione in `run-menu.mjs` |
| Cablaggio id/tipi | `controlli-handlers.mjs`, `verify-controlli-wire.mjs`, audit in `run.mjs` |
| **Piatti** `piatti-casella-misure` | `run-piatti.mjs` (radice checkbox ≥44 px, box 16×16) |
| **Piatti** `piatti-allergeni-selezione` | `run-piatti.mjs` (2 allergeni + «Senza latticini», screenshot) |

### B2. Correzioni lanciatore (V2 quater)

1. **C10 / contesto touch (verifica numerica, stessa chat VC3)** — ambiente `locale-prod` (`http://localhost:3100`), stato Piatti `elenco`, profilo `telefono-390`, tema chiaro. Misura su `getBoundingClientRect().height` del pulsante «Nuovo piatto» (atteso **44 px CSS**; ≈132 px nel PNG a `deviceScaleFactor` 3). Script: `scripts/ui-verify/measure-touch-css.mjs`. Screenshot in questa cartella: `misura-touch-dopo-senza-override-piatti-elenco-telefono-390-chiaro.png`.

   | Configurazione | Altezza CSS «Nuovo piatto» | `matchMedia('(pointer: coarse)')` | `matchMedia('(hover: hover)')` | Nota |
   |---|---:|---|---|---|
   | **Prima** — profilo JSON (`isMobile: true`, `hasTouch: true`) + override JS `window.matchMedia` | **44** | true | false | L’override JS **non** è necessario per il CSS: le classi `pointer-coarse:*` seguono l’emulazione Playwright. |
   | **Dopo** — stesso profilo, **senza** override JS (`touch-context.mjs` rimosso da `run.mjs`) | **44** | true | false | Comportamento invariato; contesto touch reale = flag Playwright in `profileContextOptions`. |
   | Controllo negativo (solo override JS, **senza** `isMobile`/`hasTouch`) | **36** | true (forzato in JS) | true | Conferma che l’override **non** attiva `@media (pointer: coarse)` nei fogli Tailwind (~35 px del bug C10). |

2. **C2-mouse senza textarea**: selettore in `checkAltezzaMouse` (`engine.mjs`) — `textarea` esclusa come da JSON.
3. **Controlli Piatti A3/A4**: vedi tabella sopra.

**Regressione C2 (post-fix touch)** — `pnpm ui:verify locale-prod --livello 1 --schermata piatti --controlli controlli-6.6.json --profili telefono-390 --temi chiaro`: **C2** su `piatti/*` a `telefono-390/chiaro` → **15 OK**, **1 NON PROVATO** (`piatti/vuoto`, DB popolato). Esito completo in `docs/design/verifica/esiti/2026-10-17-locale-prod/risultati.json` (2 FALLITO su `piatti-allergeni-selezione`, non legati al touch).

## Controlli dubbi

- **`vini-filtri-origine` — rimozione etichetta paese**: il JSON chiede di togliere l’etichetta chip; il runner prova anche `clearComboboxToEmptyOption` con etichetta «—» (da confermare con la UI reale dopo I3).
- **`piatti-allergeni-selezione`**: assume pulsanti allergeni con `aria-pressed` nel foglio; se la UI usa solo classi CSS, il controllo andrà adattato al passo V (non modificato il JSON).

## NON PROVATO (atteso in VC3)

| Voce | Motivo |
|---|---|
| Tutti i controlli **vini**, **distillati**, **bevande** a runtime | **NON PROVATO** — schermata non ancora implementata (I3) |
| `*-confronto-visivo` (C10) | **NON PROVATO** — esecuzione al passo V dopo I3 |
| `*-ordine-100`, flussi payload/SQL pesanti | **NON PROVATO** — debito passo V (helper pronti) |
| `*-accesso`, `*-stato-vuoto`, `*-ricompila` | **NON PROVATO** — come da `stato_prova` / JSON |
| Esecuzione browser su Piatti (nuovi controlli casella/allergeni) | **NON PROVATO** in questa istanza (solo cablaggio; verifica al passo V su Piatti già implementato) |

## Debito (passo V, dopo I3)

Completare ed eseguire in `run-catalog.mjs` (policy-test.md §6):

- Flussi: disponibilità, elimina, modulo (validazione, inglese, footer, formati UI/server), origine cascata modulo, coerenza geografica, tassonomie, persistenza, filtri-ricerca, stati-ui, confronto visivo, console locale-dev.
- `vini-origine-opzioni-query` (osservazione richieste / fallback codice `lib/`).
- Bulk 101 + click «Mostra altri vini/distillati/bevande».
- `RICOMPILA-ASSENTE` su pagine catalogo quando le schermate esistono (oggi solo Piatti con flusso salvataggio).

## File toccati (solo `scripts/ui-verify/**` + questo rapporto)

- `lib/controlli-handlers.mjs`, `lib/catalog-config.mjs`, `lib/catalog-ui-helpers.mjs`, `lib/run-catalog.mjs`, `measure-touch-css.mjs`
- `lib/run-menu.mjs`, `lib/run-piatti.mjs`, `lib/engine.mjs`, `lib/controlli-index.mjs`, `lib/menu-payload.mjs`
- `menu-payload.ts`, `run.mjs`, `verify-controlli-wire.mjs`
