# V2 bis — verifica L2 Piatti (dopo F2)

**Commit:** `3076b1c` (invariato rispetto all’avvio; modifiche solo al lanciatore `3.4.1` e agli esiti)  
**Browser:** Chromium 140.0.7339.186 (locale-prod); Chromium + WebKit 26.0 (locale-dev)  
**Controlli:** `controlli-6.6.json` v1 (menu) + regressione `controlli-8.2.json` v4 (shell)  
**Esiti dettagliati:** [`2026-10-17-locale-prod/`](../2026-10-17-locale-prod/rapporto.md) · [`2026-10-17-locale-dev/`](../2026-10-17-locale-dev/rapporto.md)

## Comandi eseguiti

1. `pnpm ui:verify locale-dev --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~51 s)
2. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~22 min, riesecuzione completa dopo fix `piatti-tassonomie`)
3. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-8.2.json --schermata shell` (~2,5 min)

**Nota operativa:** la seconda esecuzione su `locale-prod` con solo `controlli-8.2.json` ha aggiunto righe `NON PROVATO` spurie per controlli menu non previsti in quel JSON; la terza esecuzione (6.6) ha sostituito il pacchetto `menu` ed è quella di riferimento per Piatti.

## Riepilogo numerico (locale-prod, pacchetto menu + comuni, ultima run 6.6)

OK: 650 · FALLITO: 13 · AVVISO: 10 · NON PROVATO: 82 (include righe shell/accesso ereditate e controlli fuori perimetro dev)

---

## Rilievi P1–P6 (giudizio su misure post-F2; P/A li assegna la chat di design)

| Id | Esito V2 bis | Evidenza sintetica |
|---|---|---|
| **P1** Margine doppio / pulsante «Nuovo piatto» | **FALLITO** (residuo layout) | `shell-margine-contenuto` su `/app` (home): **16 px** a 390 (atteso 16) — OK. Su `/app/menu` il margine shell **non è più misurato** (fix lanciatore). `piatti-azioni-pagina` telefono-390: larghezza pulsante **326 px**, colonna **358 px** (atteso larghezza colonna 358 px ±2). |
| **P2** Scheda mobile nome/prezzo/«Terminato» | **FALLITO** | `piatti-colonna-elenco` telefono-390: **nameW=20 px** (atteso ~137 px; JSON: FALLITO se &lt;100 px). Layout ancora affiancato, non come riferimento D13. |
| **P3** Aree di tocco modulo (trigger inglese, checkbox) | **FALLITO** | **C2** su stati modulo: elemento «Traduzione inglese (facoltat» **358×38 px** e tre controlli **16×16 px** (8 combinazioni stato/tema fallite su `modulo-allergeni`, `nuovo`, `nuovo-errori`, `errore-azione`). |
| **P4** Categoria: nome vs identificativo | **Non valutabile in questo giro** | `piatti-tassonomie` **FALLITO** con **0 opzioni** lette dal combobox dopo il click (API: 6 categorie con nome). Probabile difetto del lanciatore (timing/listbox) o UI non aperta; **controllo dubbio** finché non si rilegge il menu aperto. |
| **P5** Campo allergeni | **FALLITO** (tocco + visivo) | Stessi **C2** su `modulo-allergeni` (sopra). Screenshot `piatti-modulo-allergeni-*` in `img/` per C10. |
| **P6** Icone, tipografia gruppi, footer foglio | **Per C10** | `piatti-confronto-visivo`: **72/76** screenshot (mancano 4 stati `vuoto` — DB popolato). **76** file `piatti-*.png` in `img/`. Giudizio visivo alla chat di design. |

---

## Difetti del lanciatore (V2 bis) — esito correzione

| # | Richiesta | Esito |
|---|---|---|
| 1 | `piatti-terminato` + foglio Filtri | **OK** — flusso completato (`piatti-terminato` OK). |
| 2 | Misurati/attesi su FALLITO e AVVISO | **OK** — esempi: `piatti-modulo-inglese` `locale=en: name=null desc=null` vs atteso `verify-ui-noen`/`Desc IT`; `piatti-ordine-100` righe e banner; `piatti-azioni-pagina` larghezza/altezza/colonna. |
| 3 | `piatti-azioni-pagina` vs colonna | **OK** (misura); esito app ancora **FALLITO** per P1. |
| 4 | `shell-margine-contenuto` non su `/app/menu` | **OK** — 0 righe con evidenza `/app/menu`. |
| 5 | Stati pesanti C1/C2 senza abortire | **OK** — `caricamento`, `errore-caricamento`, `vuoto`, `piu-di-100` eseguiti (timeout 4 min/stato); `vuoto` → NON PROVATO per combinazione se DB con piatti. |
| 6 | `piatti-elimina-concorrenza` | **Implementato** — esito **FALLITO** app: dopo API menù fisso compare finestra «Non si può eliminare…» invece di «Operazione non riuscita» (atteso §9 22c). |
| 7 | `piatti-confronto-visivo` matrice completa | **AVVISO** — 72/76 (vuoto saltato: DB con piatti). |

Correzione aggiuntiva in sessione: `piatti-tassonomie` non chiude più il foglio con Escape (evitato `piatti-flow-runtime`); prima run interrotta a `modulo-footer` per timeout su foglio chiuso.

---

## NON PROVATO (motivo)

| Controllo / ambito | Motivo |
|---|---|
| `online-senza-credenziali` (`on1`–`on6`, `AMBIENTE` online) | Riservato a **V6**; non eseguito su dominio pubblico (policy). |
| `piatti-stato-vuoto` | DB di sviluppo con piatti; `stato_prova` JSON. |
| Stati `vuoto` (C1/C2 e screenshot) | DB con N piatti (es. 44–145): non svuotabile dal lanciatore. |
| `nav-pannello-telefono` | NON PROVATO: «voci non ancora tutte accese» (flag navigazione / 6.6). |
| `piatti-accesso` | NON PROVATO: impossibile utente senza ruolo Menù (JSON). |
| `piatti-ricompila`, `piatti-disabilitato-ovunque` | Rinviati alla 6.5 (JSON). |
| `piatti-elimina-registro`, `piatti-persistenza`, `piatti-elimina-permessi` | Ambiente `locale-dev` nella run dev; su prod eseguiti dove previsto — vedi tabella prod (alcuni OK). |
| `piatti-console`, `CONSOLE` piatti | Solo **locale-dev** (run dev: CONSOLE 4/4 OK, `piatti-console` 2/2 OK). |

---

## FALLITI principali (misurato → atteso)

- **piatti-azioni-pagina** (390/chiaro): larghezza **326 px**, colonna **358 px**, altezza **44 px** → larghezza colonna **358 px** (±2), altezza ≥44 px.
- **piatti-colonna-elenco** (390/chiaro): **nameW=20 px** → nome scheda ≥100 px (FALLITO per illeggibilità).
- **piatti-modulo-inglese**: `locale=en` **name=null desc=null** → `verify-ui-noen` / `Desc IT` (fallback italiano).
- **piatti-tassonomie**: opzioni UI **[]**, API 6 nomi → opzioni coincidenti con collection (creazioni API rifiutate: OK `access_denied`).
- **piatti-ordine-100**: banner «Mostrati 100 piatti su **145**», righe **100** → «Mostrati 100 piatti su **101**» (DB non isolato: restano piatti non `verify-ui-`).
- **piatti-elimina-concorrenza**: dialogo blocco eliminazione → «Operazione non riuscita» + piatto invariato.
- **C2** (×8 combinazioni piatti): elementi sotto 44 px come sopra → elenco vuoto.

---

## Regressione shell (8.2)

Eseguita su `locale-prod` dopo build. `shell-margine-contenuto` su home/segnaposto: **OK** a 16/24 px dove applicabile; **nessuna** misura su `/app/menu`. Dettaglio in rapporto `locale-prod` pacchetto `shell`.

---

## Pulizia

`delete-prefix verify-ui-` eseguito a fine sessione (`deleted: 0` — nessun residuo). Utente di prova rimosso dal `finally` del lanciatore.

## File attesi in git (oltre esiti)

`scripts/ui-verify/lib/engine.mjs`, `run.mjs`, `run-menu.mjs`, `run-piatti.mjs`; sotto `docs/design/verifica/esiti/2026-10-17-*` rapporti, `risultati.json`, `img/`.
