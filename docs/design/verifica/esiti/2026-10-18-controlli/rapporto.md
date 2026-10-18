# VC4 — cablaggio controlli Servizi e Menù fissi (pre-I4)

**Data**: 2026-10-18 · **Istanza**: VC4 (prima della chat I4, sottofase 6.6)  
**Commit app (riferimento)**: `384f28c` · **Lanciatore**: `3.6.0` (`scripts/ui-verify/**`)  
**Controlli**: `controlli-6.6.json` v1 · **Browser prove C2**: Chromium (Playwright)  
**Validazione codice**: `pnpm lint` OK (solo warning preesistenti) · `pnpm typecheck` OK · `node scripts/ui-verify/verify-controlli-wire.mjs` OK (vini, distillati, bevande, piatti, servizi, menu-fissi)

## Riepilogo

| Esito | Conteggio (ambito VC4) |
|---|---|
| OK | Cablaggio tipi/id; prove C2 parziali (vedi sotto) |
| FALLITO | 2 prove C2 residue (`vini-persistenza`, `vini-formati-ui`) |
| AVVISO | — |
| NON PROVATO | Tutti i controlli **servizi** e **menu-fissi** in esecuzione mirata (schermata non implementata); comuni `RICOMPILA-PRESENTE` come da JSON |

**Percorso esiti prove runtime**: `docs/design/verifica/esiti/2026-10-18-locale-prod/` (merge `--solo`).

---

## A. Controlli già coperti dal lanciatore (tipi generici)

Per **servizi** e **menu-fissi** il lanciatore riconosce già i tipi del README §6 tramite `HANDLED_CONTROL_TYPES` e la matrice C1/C2/C3 (come Piatti/Catalogo): `scroll-orizzontale`, `tocco-minimo`, `altezza-mouse`, `tema-classe`, `testo`, `attributi`, `misura`, `presenza`, `assenza`, `flusso`, `reindirizzamento`, `console-pulita`.

**Comuni** (letti da `controlli-6.6.json`): `NO-OVERRIDE`, `RICOMPILA-ASSENTE`, `RICOMPILA-PRESENTE` — runner in `run-menu.mjs` / `run-piatti.mjs` (rinviato 6.5).

---

## B. Controlli aggiunti in VC4 (runner dedicati)

| Area | File | Cosa |
|---|---|---|
| Servizi + Menù fissi | `lib/menu-list-config.mjs`, `lib/menu-screen-copy.mjs`, `lib/menu-list-ui-helpers.mjs`, `lib/run-menu-list.mjs`, `lib/run-menu-list-flows.mjs` | Rilevamento schermata (`h1` + assenza segnaposto), `NON PROVATO` se non implementata; flussi chiave **menu-fissi** (schede come percorsi, modulo categoria vuoto, validazione modulo, vista «Scegli piatti», frecce Sposta su/giù, elimina con cascade giorni speciali, avvisi visibilità parziali); stub/debito per il resto |
| Cablaggio | `lib/controlli-handlers.mjs`, `verify-controlli-wire.mjs`, `run.mjs`, `lib/controlli-index.mjs` | Audit id `servizi-*` / `menu-fissi-*`; perimetro `menuScreensInScope` |
| Dati prova | `menu-payload.ts` (+ `lib/menu-payload.mjs`) | `create-menu-service`, `create-special-day-for-menu` |
| Catalogo C2 | `lib/run-catalog-flows.mjs`, `lib/catalog-ui-helpers.mjs` | `distillati-paese-fuori-filtro`, `bevande-paese-fuori-filtro`; `resolveCatalogCountryName` condiviso; fix seed EN bevande (nome+descrizione); prova modulo solo descrizione EN |

### Tipi di controllo che **mancavano** prima di VC4 (ora implementati nel lanciatore)

- **Schede come percorsi** (`menu-fissi-schede-percorsi`): `href`, `aria-current`, back browser, deep link `/app/menu/fixed/categories`.
- **Vista «Scegli piatti»** nello stesso foglio (`menu-fissi-composizione`).
- **Frecce «Sposta su» / «Sposta giù»** (`menu-fissi-ordine-piatti`).
- **Conferme eliminazione con cascade** (servizi/menù fissi: flussi `*-elimina-usato` / `*-elimina-senza-uso`; giorni speciali via Local API).
- **Campo categoria vuoto** (`menu-fissi-categoria-modulo`, `menu-fissi-modulo-validazione` con «Scegli una categoria»).
- **Avvisi visibilità** (`menu-fissi-visibilita-categoria` — dipende da categorie seed).
- **Paese fuori filtro** distillati/bevande (`distillati-paese-fuori-filtro`, `bevande-paese-fuori-filtro`).

---

## C. Controlli dubbi

| Id | Motivo |
|---|---|
| `menu-fissi-visibilita-categoria` | Richiede categorie `verify-ui-pranzo` / `verify-ui-sempre` nel DB; senza seed I4 il flusio può fallire per dati assenti, non per UI. |
| `vini-origine-cascata` | Dopo fix tastiera su denominazione «Collio» la prova è **OK**; resta sensibile all’ordine opzioni in listbox molto lunghe. |
| `bevande-modulo-inglese` (solo descrizione EN dal modulo) | Salvataggio fallisce con avviso generico «Operazione non riuscita», non con messaggio esplicito sul **Nome** — da classificare in design (app vs validazione Payload). |

---

## D. NON PROVATO — servizi e menu-fissi (VC4, senza I4)

Esecuzione: `pnpm ui:verify locale-prod --controlli controlli-6.6.json --schermata servizi,menu-fissi --solo servizi-testi,menu-fissi-schede-percorsi`.

| Id (esempio) | Evidenza |
|---|---|
| `servizi-testi` | schermata non ancora implementata |
| `menu-fissi-schede-percorsi` | schermata non ancora implementata |
| Tutti gli altri id delle due schermate (23 + 32) | stessa evidenza se lanciati senza pagina reale |

**Comuni**: `RICOMPILA-PRESENTE` → **NON PROVATO** «rinviato alla 6.5» (come da JSON).

---

## C2. Correzioni difetti V3 bis — esito prove brevi (`locale-prod`, `telefono-390`, chiaro)

| # | Controllo | Esito | Valore misurato (sintesi) |
|---|---|---|---|
| 1 | `*-persistenza` (vini) | **FALLITO** | `#wine-field-type` non raggiungibile / foglio nuovo: timeout scroll su tipologia dopo nome+prezzo; API non verificata in questo giro |
| 2 | `vini-formati-ui` | **FALLITO** | Capacità listbox **7 voci**: `Non indicata \| 25 cl \| 33 cl \| 37,5 cl \| 50 cl \| 75 cl \| 150 cl` (attese presenti); riga `verify-ui-grade-fmt` non visibile dopo ricerca `verify-ui-grade-fmt` (timeout pulsante Modifica) |
| 3 | `vini-origine-cascata` | **OK** | UI regioni (12): include **Friuli Venezia Giulia**; sample collection: Campania, Friuli, Lombardia, …; denominazione Collio selezionabile da tastiera |
| 4 | `bevande-modulo-inglese` | **OK** | Badge Manca/Presente; API `locale=en` con nome+desc; modulo solo descrizione EN → «Operazione non riuscita» (nessun errore campo Nome in UI) |
| 5 | `distillati-paese-fuori-filtro` | **OK** | `paese API=Vietnam`; trigger `#spirit-field-country` = **«Vietnam»** (parsing oggetto localizzato) |
| 5b | `bevande-paese-fuori-filtro` | **NON PROVATO** in questo giro | Runner cablato come distillati; da ripetere in passo V con `--solo bevande-paese-fuori-filtro` |

---

## Debito (completamento passo V, dopo I4)

Flussi **servizi** ancora marcati debito nel runner quando la schermata sarà pronta: `servizi-disponibilita`, `servizi-elimina-usato`, `servizi-persistenza`, `servizi-modulo-inglese`, `servizi-colonna-elenco` / misure, `servizi-stati-ui`, permessi/registro cascade, ecc.

Flussi **menu-fissi**: `menu-fissi-persistenza`, `menu-fissi-doppioni`, `menu-fissi-porzione-traduzione`, `menu-fissi-servizi-piatti`, `menu-fissi-categorie-elenco`, permessi categorie, `menu-fissi-stati-ui`, console `locale-dev`.

**C2 residuo**: hardening `vini-persistenza` (tipologia/paese/prezzo con chiusura listbox); `vini-formati-ui` (raggiungere riga SQL in elenco >100); esecuzione `bevande-paese-fuori-filtro`.

---

## Comandi eseguiti

```bash
pnpm lint && pnpm typecheck
node scripts/ui-verify/verify-controlli-wire.mjs
node scripts/ui-verify/verify-controlli-wire.mjs servizi menu-fissi
pnpm ui:verify locale-prod --controlli controlli-6.6.json --schermata servizi,menu-fissi --solo servizi-testi,menu-fissi-schede-percorsi --livello 1
# Prove C2: --solo vini-persistenza, vini-formati-ui, vini-origine-cascata, bevande-modulo-inglese, distillati-paese-fuori-filtro
```
