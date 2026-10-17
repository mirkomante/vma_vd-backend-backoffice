# V2 ter — verifica L2 Piatti (dopo F2)

**Commit:** `c7b24ba` (invariato; modifiche solo al lanciatore e agli esiti)  
**Browser:** Chromium 140.0.7339.186 (`locale-prod`); Chromium + WebKit 26.0 (`locale-dev`)  
**Controlli:** `controlli-6.6.json` v1 (piatti, home, navigazione) + regressione `controlli-8.2.json` v4 (shell)  
**Esiti:** [`2026-10-17-locale-prod/`](../2026-10-17-locale-prod/rapporto.md) · [`2026-10-17-locale-dev/`](../2026-10-17-locale-dev/rapporto.md)

## Comandi eseguiti

1. `pnpm ui:verify locale-dev --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~50 s)
2. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~22 min, run completa con budget 25 min)
3. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-8.2.json --schermata shell` (~2,7 min)

**Anomalia risolta in sessione:** il budget predefinito `locale-prod` (12 min) interrompeva il giro prima di `piatti-confronto-visivo` e della matrice C1/C2; portato a **25 min** in `scripts/ui-verify/lib/cli.mjs`.

## Riepilogo numerico (locale-prod, pacchetto menu, ultima run 6.6)

OK: 202 · FALLITO: 11 · AVVISO: 9 · NON PROVATO: (vedi rapporto prod)  
Regressione shell: **387/387 OK**, `shell-margine-contenuto` senza misure su `/app/menu`.

---

## Rilievi P1–P6 (giudizio su misure post-F2)

| Id | Esito V2 ter | Misurato | Atteso (sintesi) |
|---|---|---|---|
| **P1** Margine / «Nuovo piatto» | **Non corretto** | `piatti-azioni-pagina` telefono-390: larghezza **326 px**, colonna **358 px**, altezza **44 px** | Pulsante largo **358 px** (±2). `shell-margine-contenuto` su home: OK 16/24 px; su `/app/menu` non misurato (lanciatore). |
| **P2** Scheda mobile nome/prezzo | **Non corretto** | `piatti-colonna-elenco` telefono-390: **nameW=20 px**, colW=358 px | Nome scheda ≥ **100 px** (avviso se ≠137±10). |
| **P3** Aree di tocco modulo | **Non corretto** | **C2** ×8 (modulo, modulo-allergeni, nuovo, nuovo-errori, errore-azione × chiaro/scuro): trigger «Traduzione inglese…» **358×38 px**; tre controlli **16×16 px** | Elenco vuoto (≥44 px). |
| **P4** Categoria: nome vs id | **Non corretto** (parziale) | `piatti-tassonomie`: modulo — opzioni **Dolci, Involtini, Primi…** (6); menu filtro aperto — **Tutte le categorie** + nomi; trigger filtro chiuso — **«all» / «all»**; API creazioni **rifiutate** (`access_denied`) | Nomi in Select; trigger **«Tutte le categorie»** e **«Tutti»**; opzioni = collection. |
| **P5** Allergeni | **Non corretto** | Stessi **C2** su `modulo-allergeni` (sopra) + screenshot in `img/` | Pulsanti allergeni ≥44 px e resa come riferimento (C10). |
| **P6** Icone, tipografia, footer | **Non valutabile** (C10) | `piatti-confronto-visivo`: **72/76** screenshot; **76** file `piatti-*.png` in `img/` | Giudizio visivo alla chat di design sui PNG. |

---

## Difetti del lanciatore (V2 ter) — esito correzione

| # | Richiesta | Esito |
|---|---|---|
| 1 | `piatti-colonna-elenco` soglia 100 px | **OK** — FALLITO con `nameW=20px (soglia minima 100)`. |
| 2 | `piatti-tassonomie` attesa opzioni + report | **OK** — legge listbox modulo e filtro; riporta UI/API/creazioni; FALLITO per trigger «all» (app). |
| 3 | `piatti-modulo-inglese` lettura per id / locale it | **OK** — `locale=en name="verify-ui-noen" desc="Desc IT"`. |
| 4 | `piatti-ordine-100` totale 101 | **OK** — `totale API=101`, banner «Mostrati 100 piatti su 101». |
| 5 | `piatti-stati-ui` senza «vuoto» | **OK** su `locale-dev` (`piatti-stati-ui` OK); su prod solo simulazioni in dev (vedi sotto). |
| 6 | `piatti-elimina-concorrenza` doppia aspettativa | **OK** — blocco o «Operazione non riuscita», piatto resta. |
| — | Budget `locale-prod` per L2 Piatti | **OK** — 25 min; run completa matrice + confronto visivo. |

---

## NON PROVATO (motivo)

| Controllo / ambito | Motivo |
|---|---|
| `online-senza-credenziali` (`on1`–`on6`) | Riservato a **V6**; non eseguito su dominio pubblico. |
| `piatti-stato-vuoto` | DB con piatti; `stato_prova` JSON. |
| Stati `vuoto` (C1/C2 e screenshot) | DB con 44+ piatti: non svuotabile dal lanciatore. |
| `piatti-stati-ui` su `locale-prod` | Eseguito solo in `locale-dev` (simulazioni dev server). |
| `nav-pannello-telefono` | Voci menù non tutte accese (6.6). |
| `piatti-accesso` | Nessun utente di prova senza ruolo Menù (JSON). |
| `piatti-ricompila`, `piatti-disabilitato-ovunque` | Rinviati 6.5 (JSON). |
| `piatti-console`, `CONSOLE` piatti | Solo **locale-dev** (CONSOLE 4/4 OK, `piatti-console` 2/2 OK). |
| `shell-menu-utente` icone Admin | Utente manager senza Admin (L3 / A24). |

---

## FALLITI principali (misurato → atteso)

- **piatti-azioni-pagina** (390/chiaro): **326 px** → colonna **358 px** (±2).
- **piatti-colonna-elenco** (390/chiaro): **nameW=20 px** → ≥ **100 px**.
- **piatti-tassonomie**: trigger filtro **«all» / «all»** → **«Tutte le categorie»** / **«Tutti»** (opzioni menu aperto con nomi OK).
- **C2** (×8): elementi **358×38** e **16×16** → elenco vuoto.

## AVVISO

- **piatti-confronto-visivo**: **72/76** (mancano 4 stati `vuoto`).
- **C2-mouse** (×8): altezza **64 px** su stati modulo a 1280 (textarea descrizione).

---

## Screenshot confronto visivo (C10)

**76** file `piatti-*.png` in `docs/design/verifica/esiti/2026-10-17-locale-prod/img/` (72 catturati nel controllo, 4 stati `vuoto` saltati).

---

## Pulizia

Utente `verify-ui-*` rimosso dal `finally` del lanciatore; `menuDeleteVerifyPrefix` a fine flussi.  
**Git atteso:** `scripts/ui-verify/**`, `docs/design/verifica/esiti/**` (nessun `app/`, `lib/`, controlli JSON).
