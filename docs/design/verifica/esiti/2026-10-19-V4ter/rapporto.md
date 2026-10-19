# V4 ter — agente di verifica Area App (6.6 Servizi / Menù fissi)

**Istanza**: V4 ter (dopo V4 bis e VC-parallelo) · **Data**: 2026-10-19  
**Commit**: `7c20dae6286582a31f45d0fa563abb6cf2d39673` · **Lanciatore**: 3.9.0  
**Browser**: Chromium 140.0.7339.186 (Playwright, installato in sessione) · **Controlli**: `controlli-6.6.json` v1

## 0 — Precondizioni

| Voce | Esito | Dettaglio |
|---|---|---|
| `git log --oneline` include VC-parallelo su `scripts/ui-verify` | OK | `f5e8b0d`, `a35f8fe` |
| `git status` (solo lettura) | OK | working tree pulito a inizio; a fine sessione solo `docs/design/verifica/esiti/**` |
| Porte 3000/3100/3200/31997 a inizio | Parziale | Residuo `next-server` su **3100** e lock `.next/ui-verify.lock` da giro precedente — puliti prima dei tentativi |
| Guardiano `watch.sh` / `uiv-watch.sh` | Anomalia | `watch.sh 150 kill` e `/tmp/uiv-watch.sh` attivi in sessione: un giro A0 ha ricevuto **SIGTERM** durante `prod-server`; guardiani poi disattivati |

## A0 — Prova di sanità (3.9.0)

**Comando**: `pnpm ui:verify locale-prod --livello 1 --schermata navigazione --controlli controlli-6.6.json`

| Tentativo | Durata | Esito |
|---|---:|---|
| 1 (sandbox) | ~12 s | **FALLITO** lanciatore: `TypeError` in `isOrphanMenuPayloadDaemonPid` (`processCommand` → `undefined.includes`) |
| 2 | ~18 s | **FALLITO** esecuzione: **SIGTERM** in avvio `prod-server` (probabile guardiano) |
| 3 | ~14 s | **FALLITO** ambiente: Playwright Chromium headless shell non installato |
| 4 (post `playwright install`, no watch) | ~15 s scrittura esiti + **>10 min** blocco | **FERMATO** (criterio >5 min senza avanzamento `progress.log`) |

**Ultima riga `progress.log` (blocco)**:

`13:24:17 | passo | navigazione | nav-flows readBreadcrumbs | — | 20s`

**Passo bloccato**: fase `navigazione` / `notebook-1280` dopo `nav-flows` (processo `run.mjs` a 0% CPU, daemon `:31997` in ascolto, nessuna nuova riga di avanzamento).

**Decisione policy**: i giri **A1–A4 non sono stati eseguiti** (lanciatore da stabilizzare prima di un nuovo ciclo completo).

**Nota**: il file `esiti/2026-10-19-locale-prod/risultati.json` contiene ancora dati di un **giro L2 servizi interrotto in precedenza** (matrice parziale + flussi); non costituiscono esito valido di V4 ter.

## Giri pianificati (A1–A4) — tempi

| # | Giro | Durata | Esito sessione V4 ter |
|---|---|---:|---|
| A1 | `locale-prod` L2 `--schermata servizi` | — | **NON PROVATO** (blocco A0) |
| A2 | `locale-prod` L2 `--schermata menu-fissi` | — | **NON PROVATO** (blocco A0) |
| A3 | `locale-dev` CONSOLE + `servizi-stati-ui` / `menu-fissi-stati-ui` | — | **NON PROVATO** (blocco A0) |
| A4 | L1 regressione `navigazione`, `home`, `piatti`, `shell` | — | **NON PROVATO** (blocco A0) |

## B — Screenshot (`docs/design/verifica/esiti/2026-10-19-locale-prod/img/`)

| Schermata | Attesi (stati `stati_c1_c2` × 390/1280 × chiaro/scuro) | Presenti | Mancanti |
|---|---:|---:|---|
| **servizi** | 40 | **0** | 40 — giro L2 A1 non eseguito |
| **menu-fissi** | 72 | **0** | 72 — giro L2 A2 non eseguito |

Stati esclusi per policy (C): `vuoto`, `*-accesso`, `*-ricompila`, `online` — non conteggiati negli attesi sopra.

## C — Esclusioni policy (motivo)

| Ambito | Controlli | Esito |
|---|---|---|
| Stato vuoto | `servizi-stato-vuoto`, `menu-fissi-stato-vuoto` | **NON PROVATO** — database popolato (`stato_prova` JSON) |
| Accesso | `servizi-accesso`, `menu-fissi-accesso` | **NON PROVATO** — coperto da `verify-roles-8_3` |
| Ricompila | `servizi-ricompila`, `menu-fissi-ricompila` | **NON PROVATO** — rinviato alla 6.5 |
| Online | controlli `on1`–`on6` | **NON PROVATO** — fuori perimetro V4 ter (V6) |

## D — Tabella controlli **servizi** (esito V4 ter)

Legenda classificazione **FALLITO**: **L** = lanciatore/ambiente · **P** = probabile app · **A** = anomalia esecuzione.

| Controllo | Esito | Misurato | Atteso | Class. |
|---|---|---|---|---|
| servizi-testi | NON PROVATO | giro A1 non eseguito | testi §6 (`h1` «Servizi», colonne Nome/Prezzo/Disponibile, ecc.) | **A** |
| servizi-senza-ricerca-filtri | NON PROVATO | giro A1 non eseguito | nessuna ricerca/filtri/elenco parziale | **A** |
| servizi-colonna-elenco | NON PROVATO | giro A1 non eseguito | layout schede 390 / tabella 1280 per profilo (`controlli-6.6.json`) | **A** |
| servizi-colonne-fisse | NON PROVATO | giro A1 non eseguito | Prezzo/Disponibile/azioni 7 rem / 7 rem / 6 rem su 1280 | **A** |
| servizi-azioni-pagina | NON PROVATO | giro A1 non eseguito | CTA «Nuovo servizio» 358×≥44 px (390) / inline a destra (1280) | **A** |
| servizi-righe-azioni | NON PROVATO | giro A1 non eseguito | interruttore attivo su riga disabilitata; aria-label italiani | **A** |
| servizi-disponibilita | NON PROVATO | giro A1 non eseguito | toast disabilita/abilita + badge «Disabilitato» | **A** |
| servizi-elimina-usato | NON PROVATO | giro A1 non eseguito | cascade 1→4 menù fissi + eliminazione | **A** |
| servizi-elimina-senza-uso | NON PROVATO | giro A1 non eseguito | dialogo solo «Non si può annullare.» | **A** |
| servizi-elimina-cascade-registro-permessi | NON PROVATO | giro A1 non eseguito | depth 0 cascade + registro `delete` con `riferimenti=N` | **A** |
| servizi-modulo-campi | NON PROVATO | giro A1 non eseguito | campi e pulsanti modulo §6 | **A** |
| servizi-modulo-validazione | NON PROVATO | giro A1 non eseguito | due obbligatori + prezzi validi | **A** |
| servizi-modulo-inglese | NON PROVATO | giro A1 non eseguito | badge Manca/Presente + fallback locale en | **A** |
| servizi-modulo-footer | NON PROVATO | giro A1 non eseguito | footer 44 px, max 90% viewport | **A** |
| servizi-persistenza | NON PROVATO | giro A1 non eseguito | Local API manager/admin/super-admin; norole rifiutato | **A** |
| servizi-ordine | NON PROVATO | giro A1 non eseguito | ordinamento alfabetico italiano | **A** |
| servizi-stati-ui | NON PROVATO | giro A3 non eseguito | skeleton / errore caricamento / errore azione simulati | **A** |
| servizi-stato-vuoto | NON PROVATO | database con dati | «Nessun servizio.» (`stato_prova`) | — |
| servizi-nomi-accessibili | NON PROVATO | giro A1 non eseguito | nessuna stringa inglese in pagina/aria-label | **A** |
| servizi-accesso | NON PROVATO | nessun utente idoneo in `ui:verify` | stesso esito guardia `/app/hours` (8.3) | — |
| servizi-console | NON PROVATO | giro A3 non eseguito | 0 error/warning/pageerror su `locale-dev` | **A** |
| servizi-ricompila | NON PROVATO | bandiera 6.5 | pulsante «Ricompila il menù pubblico» | — |
| servizi-confronto-visivo | NON PROVATO | 0 file in `img/` | screenshot stati riferimento 390/1280 chiaro/scuro | **A** |
| **C1** (matrice L2) | NON PROVATO | giro A1 non eseguito | `scrollWidth <= innerWidth` su ogni stato `stati_c1_c2` × profili × temi L2 | **A** |
| **C2** (matrice L2) | NON PROVATO | giro A1 non eseguito | elenco vuoto `misura-tocco.md` | **A** |
| **C2-mouse** | NON PROVATO | giro A1 non eseguito | altezze mouse nell'intervallo | **A** |
| **C3** (matrice L2) | NON PROVATO | giro A1 non eseguito | classe `dark` coerente con tema | **A** |
| **C3-no-lampo** | NON PROVATO | giro A1 non eseguito | nessuna mutazione tema post `DOMContentLoaded` | **A** |
| **C3-cambio-sistema** | NON PROVATO | giro A1 non eseguito | cookie system + `prefers-color-scheme` | **A** |

## D — Tabella controlli **menu-fissi** (esito V4 ter)

| Controllo | Esito | Misurato | Atteso | Class. |
|---|---|---|---|---|
| menu-fissi-testi | NON PROVATO | giro A2 non eseguito | testi §6 (schede Menù/Categorie, conteggi, ecc.) | **A** |
| menu-fissi-schede-percorsi | NON PROVATO | giro A2 non eseguito | `documentReloaded=false` su cambio scheda | **A** |
| menu-fissi-colonna-elenco | NON PROVATO | giro A2 non eseguito | layout elenco per profilo | **A** |
| menu-fissi-colonne-fisse | NON PROVATO | giro A2 non eseguito | colonne fisse tabella 1280 | **A** |
| menu-fissi-azioni-pagina | NON PROVATO | giro A2 non eseguito | azioni pagina 390/1280 | **A** |
| menu-fissi-righe-azioni | NON PROVATO | giro A2 non eseguito | azioni riga + tocco 44 px | **A** |
| menu-fissi-disponibilita | NON PROVATO | giro A2 non eseguito | flusso disponibilità menù | **A** |
| menu-fissi-categorie-elenco | NON PROVATO | giro A2 non eseguito | elenco categorie scheda Categorie | **A** |
| menu-fissi-categoria-modulo | NON PROVATO | giro A2 non eseguito | modulo categoria + validazione nome | **A** |
| menu-fissi-categorie-niente-eliminazione | NON PROVATO | giro A2 non eseguito | assenza cestino su categorie | **A** |
| menu-fissi-modulo-campi | NON PROVATO | giro A2 non eseguito | campi modulo menù fisso | **A** |
| menu-fissi-modulo-validazione | NON PROVATO | giro A2 non eseguito | quattro errori modulo vuoto | **A** |
| menu-fissi-composizione | NON PROVATO | giro A2 non eseguito | vista «Scegli piatti» | **A** |
| menu-fissi-ordine-piatti | NON PROVATO | giro A2 non eseguito | frecce ordine + «Togli» | **A** |
| menu-fissi-doppioni | NON PROVATO | giro A2 non eseguito | regola doppioni piatti | **A** |
| menu-fissi-porzione-traduzione | NON PROVATO | giro A2 non eseguito | porzioni in traduzione inglese | **A** |
| menu-fissi-visibilita-categoria | NON PROVATO | giro A2 non eseguito | avvisi pranzo/cena/sempre | **A** |
| menu-fissi-nessuna-categoria | NON PROVATO | `stato_prova` / A2 non eseguito | stato senza categorie | **A** |
| menu-fissi-servizi-piatti | NON PROVATO | giro A2 non eseguito | sezioni piatti/servizi modulo | **A** |
| menu-fissi-tassonomie | NON PROVATO | giro A2 non eseguito | tassonomie collegate | **A** |
| menu-fissi-elimina-usato | NON PROVATO | giro A2 non eseguito | elimina con giorni speciali | **A** |
| menu-fissi-elimina-senza-uso | NON PROVATO | giro A2 non eseguito | dialogo elimina libero | **A** |
| menu-fissi-elimina-cascade-registro-permessi | NON PROVATO | giro A2 non eseguito | cascade + registro | **A** |
| menu-fissi-persistenza | NON PROVATO | giro A2 non eseguito | Local API ruoli | **A** |
| menu-fissi-ordine-liste | NON PROVATO | giro A2 non eseguito | ordine liste per categoria | **A** |
| menu-fissi-stati-ui | NON PROVATO | giro A3 non eseguito | simulazioni caricamento/errore | **A** |
| menu-fissi-stato-vuoto | NON PROVATO | database popolato | stato vuoto (`stato_prova`) | — |
| menu-fissi-nomi-accessibili | NON PROVATO | giro A2 non eseguito | italiano in UI/accessibilità | **A** |
| menu-fissi-accesso | NON PROVATO | coperto 8.3 | guardia sezione Menù | — |
| menu-fissi-console | NON PROVATO | giro A3 non eseguito | console pulita `locale-dev` | **A** |
| menu-fissi-ricompila | NON PROVATO | rinviato 6.5 | pulsante Ricompila | — |
| menu-fissi-confronto-visivo | NON PROVATO | 0 screenshot | PNG per C10 | **A** |
| **C1–C3** matrice L2 | NON PROVATO | giro A2 non eseguito | come `stati_c1_c2` × profili/temi L2 | **A** |

## Riepilogo esiti V4 ter (servizi + menu-fissi + matrice)

| Esito | Conteggio controlli distinti (servizi + menu-fissi + matrice) |
|---|---:|
| OK | 0 |
| FALLITO | 1 (prova di sanità A0 — blocco lanciatore/ambiente) |
| AVVISO | 0 |
| NON PROVATO | 55 |

## Pulizia fine sessione

| Voce | Esito |
|---|---|
| Processi `run.mjs` / Playwright / server 3100–3200 | OK — terminati |
| Daemon menu-payload `:31997` | OK — nessun listener |
| `menu-payload delete-prefix verify-ui-` | OK (`deleted: 0`) |
| Utente `verify-ui-*@test.local` | OK — nessun processo verify attivo; utente non ricreato dopo kill A0 |
| `git status` | Solo modifiche in `docs/design/verifica/esiti/**` |

## Anomalie ambiente / lanciatore (da correggere prima del prossimo giro)

1. **A0**: blocco >10 min dopo ultimo passo `nav-flows readBreadcrumbs` (secondo spawn daemon post-scrittura esiti).
2. **`isOrphanMenuPayloadDaemonPid`**: crash se `ps` non restituisce stdout (sandbox / race).
3. **Guardiani `watch.sh`**: rischio SIGTERM su fasi senza battito (`build` / `prod-server`).
4. **Playwright**: browser non presenti fino a `pnpm exec playwright install chromium webkit` in questa macchina.

Percorsi esiti: `esiti/2026-10-19-locale-prod/`, `esiti/2026-10-19-locale-dev/`, questo file.
