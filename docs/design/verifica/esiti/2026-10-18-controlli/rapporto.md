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

1. **C10 / screenshot e contesto touch**: `touch-context.mjs` + `installPointerCoarseForTouchProfiles` in `newPage` (`run.mjs`) — `matchMedia(pointer: coarse)` coerente con C2 sugli screenshot a profilo tocco.
2. **C2-mouse senza textarea**: selettore in `checkAltezzaMouse` (`engine.mjs`) — `textarea` esclusa come da JSON.
3. **Controlli Piatti A3/A4**: vedi tabella sopra.

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

- `lib/touch-context.mjs`, `lib/controlli-handlers.mjs`, `lib/catalog-config.mjs`, `lib/catalog-ui-helpers.mjs`, `lib/run-catalog.mjs`
- `lib/run-menu.mjs`, `lib/run-piatti.mjs`, `lib/engine.mjs`, `lib/controlli-index.mjs`, `lib/menu-payload.mjs`
- `menu-payload.ts`, `run.mjs`, `verify-controlli-wire.mjs`
