# V2 quater — verifica L2 Piatti dopo F2

**Commit:** `22ad305`  
**Browser:** Chromium 140.0.7339.186 (`locale-prod`); Chromium + WebKit 26.0 (`locale-dev`)  
**Lanciatore:** 3.4.1 (L2) — correzione `prefer-const` in `scripts/ui-verify/menu-payload.ts` (riga 326)  
**Controlli:** `controlli-6.6.json` v1 (piatti, home, navigazione) + regressione `controlli-8.2.json` v4 (shell) + `controlli-8.5.json` (orari)  
**Esiti:** [`2026-10-17-locale-prod/`](../2026-10-17-locale-prod/rapporto.md) · [`2026-10-17-locale-dev/`](../2026-10-17-locale-dev/rapporto.md)

## Comandi eseguiti

1. `pnpm ui:verify locale-dev --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~58 s)
2. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione` (~26 min, run completa)
3. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-8.2.json --schermata shell` (~2,6 min)
4. `pnpm ui:verify locale-prod --livello 2 --controlli controlli-8.5.json --schermata orari` (~15 min)

**Precondizione F2:** `git log --oneline 3076b1c..HEAD -- app components lib` → `c9eda6e`, `a2e25d4`, `2b53c00`.

## Riepilogo automatico (locale-prod, cartella aggregata)

OK: 3153 · **FALLITO: 0** · AVVISO: 9 · NON PROVATO: 128  
Pacchetto **menu** (Piatti): 213/245 OK, 0 FALLITO · **shell**: 387/389 OK, 0 FALLITO · **orari**: 338/342 OK, 0 FALLITO  
**locale-dev:** CONSOLE 4/4 OK, `piatti-console` 2/2 OK, `piatti-stati-ui` OK, WebKit essenziale OK.

---

## Rilievi P1–P6 (giudizio su misure post-F2)

| Id | Esito V2 quater | Misurato | Atteso (sintesi) |
|---|---|---|---|
| **P1** Margine / «Nuovo piatto» | **Corretto** | `piatti-azioni-pagina` telefono-390/chiaro: **larghezza=358 px**, colonna=358 px, altezza=44 px | Pulsante largo **358 px** (±2), colonna 358 px. |
| **P2** Scheda mobile nome/prezzo | **Corretto** | `piatti-colonna-elenco` telefono-390/chiaro: **colW=358**, **nameW=140 px** | Nome scheda ≥ **100 px** (avviso se ≠137±10). |
| **P3** Aree di tocco modulo | **Corretto** (C2) | **C2** su `piatti/modulo`, `nuovo`, `modulo-allergeni`, `nuovo-errori`, `errore-azione` (telefono-390, chiaro/scuro): **nessun elemento** sotto 44 px. Trigger «Traduzione inglese…»: coperto da C2 (prima 358×38). **Casella:** il lanciatore **non** espone i due rettangoli; attestazione indiretta C2 OK; atteso post-F2 **radice 44×44 px**, **quadratino visivo 16×16 px** (D6, `checkbox.tsx`). | Elenco C2 vuoto; radice ≥44 px; box visivo 16 px. |
| **P4** Categoria / Select | **Corretto** | `piatti-tassonomie`: modulo — opzioni **Dolci, Involtini, Primi…** (6); filtro UI **«Tutte le categorie» / «Tutti»**; API creazioni rifiutate (`access_denied`) | Nomi in Select; trigger filtro con etichette umane. |
| **P5** Allergeni | **Corretto** (tocco) / **non valutabile** (C10) | **C2** `modulo-allergeni` telefono-390: elenco vuoto; `piatti-testi` OK | Pulsanti allergeni ≥44 px e resa come riferimento (giudizio visivo). |
| **P6** Icone, tipografia, footer | **Non valutabile** (C10) | `piatti-confronto-visivo`: **72/76** screenshot; `piatti-modulo-footer`: footerH=44, btnCount=2 (ordine non giudicato automaticamente) | PNG di riferimento in `docs/design/schermate/piatti/`. |

---

## Regressione shell e Orari (post-F2 su componenti condivisi)

- **Shell:** 387/387 righe eseguite senza FALLITO; `shell-margine-contenuto` OK 24/24.
- **Orari:** pacchetto orari 338/342 OK, 0 FALLITO (checkbox/collapsible condivisi: nessun nuovo FALLITO C2 in orari).

---

## NON PROVATO (motivo)

| Controllo / ambito | Motivo |
|---|---|
| `online-senza-credenziali` (`on1`–`on6`) | Riservato a **V6**; non eseguito su dominio pubblico (istruzione V2 quater). |
| `piatti-stato-vuoto` / stati `vuoto` (C1/C2/C3, screenshot) | DB con 44+ piatti; non svuotabile dal lanciatore. |
| `nav-pannello-telefono` | Voci menù non tutte accese (6.6). |
| `piatti-accesso` | Nessun utente di prova senza ruolo Menù (JSON). |
| `piatti-ricompila`, `piatti-disabilitato-ovunque` | Rinviati 6.5 (JSON). |
| `orari-console`, simulazioni errore Orari su prod | Solo **locale-dev** per CONSOLE/simulazioni. |
| `shell-menu-utente` icone Admin | Utente manager senza Admin (L3). |
| Misura esplicita **radice + quadratino** checkbox | Non implementata nel lanciatore (solo algoritmo C2). |

---

## AVVISO (non bloccanti)

- **piatti-confronto-visivo**: 72/76 (mancano 4 stati `vuoto`).
- **C2-mouse** (×8): altezza **64 px** su textarea descrizione a 1280 px (esclusione textarea già in JSON — comportamento noto, A1).

---

## Screenshot (C10)

**132** file PNG totali in `docs/design/verifica/esiti/2026-10-17-locale-prod/img/` (**76** `piatti-*`, **56** altri inclusi shell/home/orari di riferimento 390/1280 chiaro/scuro).

---

## Lanciatore

| Modifica | Esito |
|---|---|
| `menu-payload.ts:326` `prefer-const` | **OK** — `pnpm lint` 0 errori |

---

## Pulizia

- `menu-payload.ts delete-prefix verify-ui-`: **0** residui al termine.
- Utente di prova del giro: rimosso dal `finally` del lanciatore.
- Screenshot spurii di accesso (login/forgot/…) generati dal giro 8.5 L2: **rimossi** dalla cartella `img/`.

**Git atteso:** `scripts/ui-verify/menu-payload.ts`, `docs/design/verifica/esiti/**` (nessun `app/`, `lib/`, controlli JSON).
