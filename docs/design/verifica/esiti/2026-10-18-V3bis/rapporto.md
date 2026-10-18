# V3 bis — rilancio mirato post-F3 e VC-tempi

**Data**: 2026-10-18 · **Ambiente**: `locale-prod` · **Commit codice app**: `54ed0d69cf90` (esiti V3 bis iniziali) · **Lanciatore**: 3.5.0 (L1) + fix catalogo V3 bis seconda passata (`scripts/ui-verify/**`)  
**Browser**: Chromium 140.0.7339.186 · **Controlli**: `controlli-6.6.json` v1  
**Precondizioni**: F3 in `8336553`; VC-tempi in `1d1bc00`.

## Seconda passata (fix lanciatore + `--solo` / `--stati`)

**Comandi** (profilo `telefono-390`, tema `chiaro`; build riusata; giri sequenziali):

1. Flussi vini / distillati / bevande (`vini-origine-*`, `*-persistenza`, `*-modulo-inglese`, `*-elimina-registro-permessi`, `vini-formati-ui`)
2. `C2 --stati elimina` su vini, distillati, bevande; `C2 --stati elimina-libero` su piatti

**Durata** (seconda passata): ~25–30 min complessivi (vini flussi ~9 min; C2 quattro schermate ~5 min; distillati/bevande ~3 min ciascuno).

**Fix lanciatore applicati** (commit dedicato):

- Attesa animazioni su dialog/foglio (`waitForAnimationsSettled`); C2 misura `Indietro`/`Elimina` dopo settle.
- Merge esiti: `--solo C2 --stati` non cancella più tutte le righe C2 (solo schermata+stato del giro).
- `*-modulo-inglese`: badge da trigger + API `locale=en`; `descriptionEn` in `create-catalog-items` (bevande: anche `volume`/`abv` in payload).
- `*-elimina-registro-permessi`: record distinti per ruolo (manager/admin/super).
- `vini-origine-fuori-filtro`: prove manuali distillati/bevande in `anomalie` / report; parsing paese API; `catch` su prove extra e sul flusso principale.
- Persistenza: select via `#wine-field-type` / `#spirit-field-type` / `#drink-field-*`; `catch` per registrare FALLITO senza abortire il pacchetto.
- `vini-formati-ui`: ricerca riga + reload elenco dopo seed SQL.

## Riepilogo esiti (controlli V3 bis, ultima misura utile in `risultati.json`)

| Esito | Conteggio (seconda passata) |
|---|---|
| OK | 9 |
| FALLITO | 7 |
| NON PROVATO | 1 (id assente dal JSON) |

Dettaglio grezzo: `esiti/2026-10-18-locale-prod/risultati.json` (merge parziali: preferire righe con `schermata` ≠ `—`).

## Tabella classificazione

| Controllo | Misurato (sintesi) | Atteso | Classificazione |
|---|---|---|---|
| **C2** `vini/elimina` | Indietro **288×44**; Elimina **288×44** | ≥ 44 px | **Corretto** (ex difetto lanciatore: misura a 42 px prima delle animazioni) |
| **C2** `distillati/elimina` | 288×44 / 288×44 | ≥ 44 px | **Corretto** |
| **C2** `bevande/elimina` | 288×44 / 288×44 | ≥ 44 px | **Corretto** |
| **C2** `piatti/elimina-libero` | 288×44 / 288×44 | ≥ 44 px | **Corretto** (non più “controllo dubbio” vs catalogo) |
| `vini-tassonomie` | 5 tipologie da listbox | tassonomie | **Corretto** |
| `distillati-tassonomie` | 7 tipologie | tassonomie | **Corretto** |
| `bevande-tassonomie` | 3 tipologie | tassonomie | **Corretto** |
| `vini-modulo-inglese` | Badge Manca/Presente; API `desc` IT/EN | inglese | **Corretto** |
| `distillati-modulo-inglese` | idem | inglese | **Corretto** |
| `*-elimina-registro-permessi` (vini/distillati/bevande) | Registro OK; norole NON PROVATO (script ruoli) | permessi staff | **Corretto** |
| `vini-origine-fuori-filtro` | Giro automatico: confronto API/trigger inaffidabile (`[object Object]`, riga non verificata); **prova mirata dual-wine** sotto | Nome paese salvato nel trigger | **Difetto lanciatore** (prova mirata: app OK se si apre la riga corretta) |
| `vini-origine-cascata` | Regioni UI incl. Friuli; falli su match collection / click denominazione | Cascata Paese→Regione→Denominazione | **Controllo dubbio** / possibile **difetto app** (opzioni presenti, selezione fragile) |
| `vini-formati-ui` | Listbox capacità **7 voci** attese presenti; edit riga SQL `verify-ui-grade-fmt` spesso **non raggiungibile** in elenco (riga nascosta / >100 vini) | Capacità server + grado 12,8% | **Difetto lanciatore** (residuo: apertura riga in elenco) |
| `vini-persistenza` | Salvataggio UI non confermato / `API found=false` quando select Paese/Tipologia interferiscono con overlay | Create + read API | **Difetto lanciatore** (in miglioramento; select per id DOM) |
| `distillati-persistenza` | Timeout su `#spirit-field-type` / Paese con listbox aperta | persistenza | **Difetto lanciatore** |
| `bevande-persistenza` | Timeout su `#drink-field-type` o capacità | persistenza | **Difetto lanciatore** |
| `bevande-modulo-inglese` | `create-catalog-items` → «Il seguente campo non è valido: **Nome**» | inglese | **Difetto lanciatore** / da incrociare con validazione collection `drinks` |
| `distillati-origine-fuori-filtro` | — | — | **NON PROVATO** (id non in `controlli-6.6.json`) |

### Prove extra paese fuori filtro (distillati / bevande)

Eseguite dal flusso `vini-origine-fuori-filtro` (`proveCountryOffFilterExtra`): screenshot `distillati-modulo-paese-fuori-filtro-telefono-390-chiaro` (e analogo bevande quando il giro completa). Esito sintetico da rileggere in `risultati.json` → `anomalie` con prefisso `[prova-extra …]` quando presenti.

## Prova mirata P1 — due vini, paesi disabilitati (2026-10-18)

**Metodo**: script ad hoc `scripts/ui-verify/probe-p1-vini-dual-country.mjs` su `locale-prod` (`telefono-390`, chiaro), ~40 s. Nessun altro controllo `ui:verify`. Dati grezzi: `p1-prova-dual-country.json`.

**Setup Local API**

| Vino | id vino | Paese X/Y | id paese | `enabled` paese (prima del test) |
|---|---|---|---|---|
| `verify-ui-vini-off-a` | 4852 | **Filippine** (X) | 1 | `true` → disabilitato per il test |
| `verify-ui-vini-off-b` | 4853 | **Vietnam** (Y) | 13 | `true` → disabilitato per il test |

Subito prima dell’UI (API `find-catalog-item`, `depth: 1`): vino A → paese id **1**, nome localizzato `{ it: "Filippine" }`; vino B → id **13**, `{ it: "Vietnam" }`. Ripristino in `finally`: paesi riabilitati, prefisso `verify-ui-` cancellato.

**Per ciascun vino** (ricerca per nome, pulsante **Modifica &lt;nome&gt;** sulla riga, non altro record):

| | Vino A | Vino B |
|---|---|---|
| Campo Nome | `verify-ui-vini-off-a` | `verify-ui-vini-off-b` |
| Sottotitolo foglio | `verify-ui-vini-off-a` | `verify-ui-vini-off-b` |
| Titolo foglio | Modifica vino | Modifica vino |
| Righe in elenco (filtro attivo) | 2 | 2 |
| Trigger `#wine-field-country` | **Filippine** | **Vietnam** |
| id nel DOM sul trigger | non esposto (`valueId` assente sugli attributi) | idem |
| Screenshot campo Paese | `img/p1-prova-vini-off-a-paese-trigger-telefono-390-chiaro.png` | `img/p1-prova-vini-off-b-paese-trigger-telefono-390-chiaro.png` |
| Opzioni listbox (nomi) | Filippine, Francia, Giappone, … (11 voci; **Filippine** inclusa) | Francia, …, **Vietnam** (11 voci; **Vietnam** in fondo) |
| Opzione selezionata nel menu | **Filippine** | **Vietnam** |

**Conclusione (una riga per vino)**

- **A**: il trigger mostra il paese salvato (**Filippine**); sottotitolo = nome vino corretto; elenco con 2 righe filtrate.
- **B**: il trigger mostra il paese salvato (**Vietnam**); sottotitolo = nome vino corretto; elenco con 2 righe filtrate.

**Interpretazione**: il caso «API=Filippine, trigger=Vietnam» del giro `vini-origine-fuori-filtro` **non** si riproduce quando il modulo del vino giusto è aperto e il paese API è letto con `locale=all` (nome oggetto, non stringa). Probabile **difetto del lanciatore** (parsing paese, assenza scroll fino a Paese, screenshot pagina intera senza sezione Origine, o riga/modulo non allineati). L’app mostra il nome del paese salvato nel trigger anche con paese **disabilitato** in tassonomia.

## Sintesi per la chat di design

1. **C2 elimina**: con attesa animazioni, **tutte e quattro** le schermate rispettano **44 px** di altezza sui pulsanti del dialogo — il gap 42 px della prima passata era **difetto del lanciatore**, non dell’app.
2. **Modulo inglese e permessi delete**: **OK** su vini e distillati; bevande modulo ancora **FALLITO** per seed Payload.
3. **P1 paese fuori filtro (vini)**: prova mirata dual-wine → trigger **corretto** (Filippine / Vietnam) aprendo la riga giusta; il FALLITO del controllo automatico va riclassificato come **difetto lanciatore** (lettura API e/o apertura modulo), non regressione F3 sul campo Paese in questa prova.
4. **Persistenza catalogo**: migliorati i selettori, ma distillati/bevande/vini restano **FALLITO** per timeout UI — ulteriore hardening del lanciatore (scroll foglio, chiusura listbox, elenco >100 righe).
5. Esiti e screenshot aggiornati in `2026-10-18-locale-prod/`.
