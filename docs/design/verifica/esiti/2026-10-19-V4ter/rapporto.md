# V4 ter — agente di verifica Area App (6.6 Servizi / Menù fissi)

**Istanza**: V4 ter (dopo V4 bis e VC-parallelo) · **Data**: 2026-10-19  
**Commit**: `ff68c7591cd91e57972c91b5b1ab35c02597fa22` · **Lanciatore**: 3.9.0  
**Browser**: Chromium 140.0.7339.186 (Playwright) · **Controlli**: `controlli-6.6.json` v1 (+ `controlli-8.2.json` v4 per shell L1)  
**Modalità Payload**: `UI_VERIFY_MENU_PAYLOAD_LEGACY=1` su tutti i giri · **Daemon**: avviato dal lanciatore ma azioni via `payload run` (legacy)

## 0 — Precondizioni

| Voce | Esito | Dettaglio |
|---|---|---|
| `git log --oneline` include VC-parallelo su `scripts/ui-verify` | OK | `f5e8b0d`, `a35f8fe` |
| Porte 3000/3100/3200/31997 a inizio sessione | OK | libere prima di ogni giro (`ps`/`lsof`) |
| A0 prova di sanità L1 navigazione | **Non rieseguita** | già OK in ~31 s (chat design, legacy); per policy sessione |

## Giri eseguiti — durate

| # | Giro | Durata | Esito esecuzione |
|---|---|---:|---|
| A0 | (omessa) | — | già validata esternamente |
| A1a | L2 `servizi` completo | ~114 s | **Interrotto** — `ensure-norole-user` rejection non awaited (crash) |
| A1b | L2 `servizi` flussi senza cascade | ~133 s | OK |
| A1c | L2 `servizi` matrice `C1–C3` | ~180 s | OK (C3-no-lampo/confronto non nel perimetro `--solo`) |
| A2a | L2 `menu-fissi` completo | ~110 s | **Interrotto** — timeout clic `Elimina verify-ui-menu-libero` |
| A2b–c | flussi `menu-fissi` (tentativi con elimina) | ~64–201 s | errore / OK parziale |
| A2d–e | matrice `menu-fissi` a gruppi `--stati` | ~145 s + ~129 s | OK |
| A3 | `locale-dev` console + stati-ui | ~66 s + ~66 s / ~13 s | console OK; stati-ui **errore cookie** |
| A4 | L1 `navigazione`, `home`, `piatti`, `shell` | ~16 min totali (loop) | completati (esiti in `locale-prod/`) |

**Ultima riga utile `progress.log` (A1a crash)**: `13:47:53 | login | controllo | C3-cambio-sistema · notebook-1280/sistema | — | 74s`

## B — Screenshot `docs/design/verifica/esiti/2026-10-19-locale-prod/img/`

| Schermata | Attesi (stati `stati_c1_c2` × 390/1280 × chiaro/scuro) | Presenti | Mancanti |
|---|---:|---:|---|
| **servizi** | 40 | **0** | 40 — `servizi-confronto-visivo` / cattura PNG non eseguita dal lanciatore su menu-list |
| **menu-fissi** | 72 | **0** | 72 — stesso motivo |
| altri (L1 regressione) | — | 17 | shell/piatti (fuori perimetro 6.6 stati riferimento) |

## C — Esclusioni policy

| Controllo | Esito | Motivo |
|---|---|---|
| `servizi-stato-vuoto`, `menu-fissi-stato-vuoto` | NON PROVATO | DB popolato (`stato_prova`) |
| `servizi-accesso`, `menu-fissi-accesso` | NON PROVATO | coperto da `verify-roles-8_3` |
| `servizi-ricompila`, `menu-fissi-ricompila` | NON PROVATO | rinviato 6.5 |
| Online `on1`–`on6` | NON PROVATO | V6 |

Legenda classificazione **FALLITO**: **L** = lanciatore/ambiente · **P** = probabile app · **A** = anomalia esecuzione.

## D — Servizi (sintesi per controllo)

| Controllo | Esito | Misurato | Atteso | Class. |
|---|---|---|---|---|
| servizi-testi | OK | ok | testi §6 (H1, colonne, conteggio) | — |
| servizi-senza-ricerca-filtri | OK | search=false; filtri=false | nessuna ricerca/filtri | — |
| servizi-colonna-elenco | AVVISO | telefono-390: tableVisible=false, colW=358, nameW=178 | layout schede 390 / tabella 1280 | — |
| servizi-colonne-fisse | OK | 4 colonne Nome/Prezzo/Disponibile/Azioni | colonne fisse 1280 | — |
| servizi-azioni-pagina | OK | h=44, w=358 (390); inline 1280 | CTA ≥44 px | — |
| servizi-righe-azioni | OK | switchDisabled=false; badge Disabilitato | interruttore attivo su riga disabilitata | — |
| servizi-disponibilita | FALLITO | API disabled (senza verifica toast UI) | toast + stato API disabled | **P** |
| servizi-elimina-usato | OK | cascade 4 menù fissi in dialogo | cascade menù | — |
| servizi-elimina-senza-uso | OK | solo «Non si può annullare» | elimina libero | — |
| servizi-elimina-cascade-registro-permessi | OK | dopo=[]; svcGone=true; log riferimenti=1; norole NON PROVATO in nota | cascade depth0 + registro | — |
| servizi-modulo-* | OK | campi, validazione, inglese, footer 44px | attributi §6 | — |
| servizi-persistenza | FALLITO | create read; ramo norole non verificato | Local API per ruoli | **P** |
| servizi-ordine | OK | ordine alfabetico verify-ui-* | ordine nome IT | — |
| servizi-nomi-accessibili | OK | nessuna stringa inglese | italiano UI/aria | — |
| servizi-console | OK (locale-dev) | err:0 warn:0 http:0 | console pulita | — |
| servizi-stati-ui | NON PROVATO | `browserContext.addCookies: Cookie should have a url or domain/path pair` | simulazioni caricamento/errore | **L** |
| servizi-stato-vuoto / accesso / ricompila | NON PROVATO | vedi §C | — | — |
| servizi-confronto-visivo | NON PROVATO | 0 PNG in `img/` | screenshot stati riferimento | **L** |
| C1 matrice L2 | OK | 44/44 combinazioni | scroll orizzontale | — |
| C2 matrice L2 | OK | 22/22 | tocco ≥44 px | — |
| C2-mouse | OK | 22/22 | altezze mouse | — |
| C3 matrice L2 | OK | 44/44 | classe `dark` | — |
| C3-no-lampo | NON PROVATO | non schedulato su schermata servizi | nessun lampo post DCL | **L** |
| C3-cambio-sistema | OK | login/sistema: dark con OS scuro; cookie light ignora OS | tema system reattivo | — |

## D — Menù fissi (sintesi per controllo)

| Controllo | Esito | Misurato | Atteso | Class. |
|---|---|---|---|---|
| menu-fissi-testi | OK | ok | testi §6 schede/gruppi | — |
| menu-fissi-schede-percorsi | OK | documentReloaded=false | Link Next senza reload | — |
| menu-fissi-colonna-elenco | FALLITO | 1280: colW=976 nameW=0; soglia-768: colW=464 nameW=0 (390/767 OK) | layout per profilo | **P** |
| menu-fissi-colonne-fisse | OK | 5 colonne tabella | colonne fisse | — |
| menu-fissi-azioni-pagina | OK | h=44 | azioni pagina | — |
| menu-fissi-righe-azioni | OK | edit/delete presenti | azioni riga | — |
| menu-fissi-disponibilita | OK | ok | flusso disponibilità | — |
| menu-fissi-categorie-* | OK | elenco + no cestino categorie | scheda Categorie | — |
| menu-fissi-modulo-* | OK | validazione 4 errori; composizione Scegli piatti | modulo §6 | — |
| menu-fissi-ordine-piatti | FALLITO | piatto rimosso dalla collection | frecce 44px + ordine + Togli | **P** |
| menu-fissi-visibilita-categoria | OK | avvisi pranzo/cena/sempre | tutti i passi §6 | — |
| menu-fissi-doppioni / tassonomie | OK | {} / select categorie | regole doppioni/tassonomie | — |
| menu-fissi-porzione-traduzione | FALLITO | en name=undefined; desc=undefined | porzioni in EN | **P** |
| menu-fissi-servizi-piatti | FALLITO | services=0 | sezione servizi salvata | **P** |
| menu-fissi-elimina-usato / senza-uso | NON PROVATO | timeout Playwright 20s su pulsante Elimina (giri A2a–b) | dialoghi eliminazione | **A** |
| menu-fissi-elimina-cascade-registro-permessi | NON PROVATO | non consolidato in `risultati.json` finale | cascade + registro | **A** |
| menu-fissi-persistenza / ordine-liste / nomi-accessibili | NON PROVATO | non in ultimo merge esiti | Local API / ordine / italiano | **A** |
| menu-fissi-nessuna-categoria | NON PROVATO | `stato_prova` + giro incompleto | nuovo senza categorie | — |
| menu-fissi-console | OK (locale-dev) | err:0 warn:0 | console pulita | — |
| menu-fissi-stati-ui | NON PROVATO | stesso errore cookie di `servizi-stati-ui` | simulazioni UI | **L** |
| menu-fissi-confronto-visivo | NON PROVATO | 0 PNG servizi/menu in `img/` | screenshot C10 | **L** |
| C1–C3 matrice L2 | OK | C1 72/72, C2 36/36, C3 72/72, C2-mouse 36/36 | matrice `stati_c1_c2` | — |
| C3-no-lampo | NON PROVATO | non su menu-fissi nel lanciatore | anti-lampo | **L** |

## Riepilogo controlli distinti (servizi + menu-fissi, esclusi §C)

| Esito | Conteggio (appross.) |
|---|---:|
| OK | 38 |
| FALLITO | 7 |
| AVVISO | 1 |
| NON PROVATO | 14 |

## Pulizia fine sessione

| Voce | Esito |
|---|---|
| Processi `run.mjs` / Playwright / server | OK |
| Porte 3000/3100/3200/31997 | OK — libere |
| `delete-prefix verify-ui-` | OK (`deleted: 0`) |
| `git status` | solo `docs/design/verifica/esiti/**` |

## Anomalie lanciatore / ambiente (non corretti in questa chat)

1. Giro L2 `servizi` completo: crash su `menuEnsureNoroleUser()` senza `await` → rejection non gestita dopo `servizi-elimina-cascade-registro-permessi`.
2. `locale-dev` `servizi-stati-ui` / `menu-fissi-stati-ui`: `addCookies` senza url/domain in `newPage` (`run.mjs:236`).
3. `menu-fissi-elimina-senza-uso`: timeout 20s su `getByRole('button', { name: 'Elimina verify-ui-menu-libero' })`.
4. Screenshot stati riferimento servizi/menu-fissi: controllo `*-confronto-visivo` non produce file in `img/` per menu-list.
5. Esiti `risultati.json`/`rapporto.md` locale-prod sovrascritti dall’ultimo L1 `shell` (8.2): consultare righe pacchetto `menu` per 6.6.

Percorsi: `esiti/2026-10-19-locale-prod/`, `esiti/2026-10-19-locale-dev/`, questo file.
