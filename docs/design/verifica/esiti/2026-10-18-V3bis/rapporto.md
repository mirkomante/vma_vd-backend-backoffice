# V3 bis — rilancio mirato post-F3 e VC-tempi

**Data**: 2026-10-18 · **Ambiente**: `locale-prod` · **Commit**: `4437057201b51085c31836bb8099212456b34cc5`  
**Lanciatore**: 3.5.0 (L1) · **Browser**: Chromium 140.0.7339.186 · **Controlli**: `controlli-6.6.json` v1  
**Precondizioni**: F3 in `8336553` (components/lib/app); VC-tempi in `1d1bc00` (scripts/ui-verify).

**Comandi** (profilo `telefono-390`, tema `chiaro`; build riusata dopo il primo giro; nessun giro concorrente):

1. `--solo vini-origine-fuori-filtro,vini-origine-cascata,vini-tassonomie,vini-persistenza,vini-formati-ui,vini-modulo-inglese,vini-elimina-registro-permessi,C2`
2. `--solo distillati-tassonomie,distillati-persistenza,distillati-modulo-inglese,distillati-elimina-registro-permessi,C2`
3. `--solo bevande-tassonomie,bevande-persistenza,bevande-modulo-inglese,bevande-elimina-registro-permessi,bevande-paese-facoltativo,C2`
4. `--solo C2 --schermata piatti,vini,distillati` (confronto altezze dialogo elimina; bevande/C2 già misurato al giro 3)

**Durata complessiva**: circa 30 min (primo giro con build ~5 min; giri successivi 3–7 min; merge `--solo C2` sovrascrive solo le righe C2 per schermata).

## Riepilogo (solo controlli V3 bis)

| Esito | Conteggio |
|---|---|
| OK | 4 |
| FALLITO | 15 |
| AVVISO | 0 |
| NON PROVATO | 1 |

Dettaglio completo: `esiti/2026-10-18-locale-prod/rapporto-v3bis.md` e `risultati.json`.

## Sintesi per la chat di design

- **P1 (`vini-origine-fuori-filtro`)**: dopo F3 il paese salvato resta **non visibile** nel foglio (stesso messaggio di V3) → da rivalutare come difetto app o setup del flusso.
- **C2 dialogo elimina**: Vini, Distillati e Bevande misurano **Indietro 274×42 px** e **Elimina 274×42 px**; Piatti (`elimina-libero`) **nessun elemento** sotto 44 px con lo stesso algoritmo → **controllo dubbio** (stesso `MenuDeleteDialog`).
- **Tassonomie**: OK su tutte e tre le schermate (opzioni lette dopo apertura listbox).
- **Persistenza / modulo inglese / formati UI**: ancora FALLITO con messaggi che puntano al flusso del lanciatore (salvataggio non letto da API, badge «Presente», listbox capacità vuota).
- **`*-elimina-registro-permessi`**: esito lanciatore ancora **FALLITO** con `registro delete manager` + norole **NON PROVATO** (coperto da `verify-roles-8_3.ts`) → classificazione **difetto del lanciatore** (esito complessivo e/o registro).
- **`distillati-origine-fuori-filtro`**: **NON PROVATO** — id assente da `controlli-6.6.json`.
