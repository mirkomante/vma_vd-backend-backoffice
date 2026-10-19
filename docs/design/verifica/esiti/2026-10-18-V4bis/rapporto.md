# V4 bis — agente di verifica (post F-SEL / F-TAB) — riepilogo

**Istanza**: V4 bis · **Commit**: `e0e85da7cf3adcdcf575840e87f899852c206d8e` · **Lanciatore**: 3.7.0  
**Browser**: Chromium 140.0.7339.186 (Playwright) · **Controlli**: `controlli-6.6.json` v1

## Precondizioni

| Voce | Esito |
|---|---|
| F-SEL / F-TAB in `git log -- components/app` | OK (`ed64db5`, `6ae1f34`) |
| Porte 3000/3100/3200 libere a inizio | OK |
| Lock `.next/ui-verify.lock` | assente |

## A — Payload persistente (daemon TCP :31997)

| Modalità | Creazione media (3 campioni) | Lettura media | Atteso |
|---|---:|---:|---|
| Legacy (`pnpm payload run` per op.) | **1956 ms** | **1962 ms** | &lt; 1000 ms |
| Daemon + client leggero | **874 ms** | **132 ms** | &lt; 1000 ms |

Implementazione: `menu-payload.ts` (`__daemon__`, `dispatchMenuPayloadAction`, `assertDevDatabaseFromEnv`), `menu-payload-client.mjs`, `lib/menu-payload.mjs` (`stopMenuPayloadSession` nel `finally` di `run.mjs`).

## B — Correzioni lanciatore (V4)

| # | Voce | Esito implementazione |
|---|---|---|
| 1 | `servizi-righe-azioni`: switch **attivo** su riga disabilitata | OK — misura `switchDisabled=false`, badge «Disabilitato» |
| 2 | `servizi-elimina-cascade-registro-permessi`: elimina UI + depth 0 + registro | OK — `prima menu.services=[587]; dopo=[]; svcGone=true; log=nome=verify-ui-serv-perm; riferimenti=1` |
| 3 | `menu-fissi-ordine-piatti`: fixture p1–p4, frecce, salva, Togli | OK (giro dedicato ~50 s) |
| 4 | `menu-fissi-visibilita-categoria`: tutti i passi | OK — testi avvisi letti (pranzo / sempre / cena / verify-ui-sempre) |
| 5 | Timeout matrice menu-fissi | `prepareMenuListState` + matrice C1/C2 come catalogo in `run-menu-list.mjs` |

## C — Giri eseguiti

| Giro | Comando / ambito | Durata | Esito esecuzione |
|---|---|---:|---|
| 1 | `locale-prod` L2 `--schermata servizi` | ~21 min (interrotto) | Flussi servizi completati; matrice L2 C1/C2 **incompleta** |
| 2 | `locale-prod` L1 `--solo menu-fissi-ordine-piatti,menu-fissi-visibilita-categoria` | ~50 s | OK |
| 3 | `locale-prod` L1 `--solo menu-fissi-schede-percorsi` (merge precedente) | (in `risultati.json`) | OK `documentReloaded=false` |
| 4 | `locale-dev` L2 console servizi + menu-fissi | ~15 s (merge) | **OK** `servizi-console`, `menu-fissi-console` |
| 5 | L1 regressione navigazione / home / piatti / shell 8.2 | **non completati** | avvio `ui:verify` senza output &gt; 4 min (anomalia ambiente) |

## D — Tabella controlli servizi e menù fissi (ultimo esito locale-prod salvo console su locale-dev)

Legenda classificazione **FALLITO**: **L** = difetto lanciatore; **P** = probabile difetto app (da design); **A** = anomalia esecuzione.

### Servizi

| Controllo | Esito | Misurato (estratto) | Atteso (estratto) | Class. |
|---|---|---|---|---|
| servizi-testi | OK | ok | testi §6 | — |
| servizi-senza-ricerca-filtri | OK | search=false; filtri=false | nessuna ricerca/filtri | — |
| servizi-colonna-elenco | OK | layout per profilo | layout §9 | — |
| servizi-colonne-fisse | OK | 4 colonne | colonne fisse | — |
| servizi-azioni-pagina | OK | h/w/inline | azioni pagina | — |
| servizi-righe-azioni | OK | switchDisabled=false; badgeDisabilitato=true | interruttore attivo su riga disabilitata | — |
| servizi-disponibilita | OK | ok | toast + API disabled | — |
| servizi-elimina-usato | OK | dlg 4 menù fissi | cascade menù | — |
| servizi-elimina-senza-uso | OK | solo «Non si può annullare» | elimina libero | — |
| servizi-elimina-cascade-registro-permessi | OK | dopo=[]; log riferimenti=1 | cascade depth0 + registro | — (norole: **NON PROVATO**) |
| servizi-modulo-* | OK | campi, footer 44px, inglese | attributi modulo | — |
| servizi-modulo-validazione | OK | validazione vuoto | due obbligatori | — |
| servizi-persistenza | OK | ok | persistenza | — |
| servizi-ordine | OK | ordine alfabetico verify-ui | ordine nome | — |
| servizi-nomi-accessibili | OK | nessuna stringa inglese | italiano | — |
| servizi-ricompila | NON PROVATO | rinviato 6.5 | — | — |
| servizi-confronto-visivo | NON PROVATO | C10 / non in giro | screenshot | — |
| servizi-console | OK (locale-dev) | err:0 warn:0 | console pulita | — |
| servizi-stati-ui | NON PROVATO | solo locale-dev | simulazioni | — |
| servizi-accesso / stato-vuoto | NON PROVATO | stato_prova JSON | — | — |
| C1/C2/C3 matrice L2 servizi | NON PROVATO | giro interrotto ~21 min | matrice L2 | **A** |

### Menù fissi

| Controllo | Esito | Misurato (estratto) | Atteso (estratto) | Class. |
|---|---|---|---|---|
| menu-fissi-schede-percorsi | OK | documentReloaded=**false** | Link Next senza reload | — |
| menu-fissi-ordine-piatti | OK | frecce + Togli verify-ui-p1 | frecce 44px, ordine, Togli | — |
| menu-fissi-visibilita-categoria | OK | avvisi pranzo/cena/sempre | tutti i passi §6 | — |
| menu-fissi-modulo-validazione | OK | quattro errori | validazione | — |
| menu-fissi-composizione | OK | Scegli piatti | vista scelta | — |
| menu-fissi-categoria-modulo | OK | Campo obbligatorio nome | modulo categoria | — |
| menu-fissi-console | OK (locale-dev) | err:0 warn:0 | console pulita | — |
| menu-fissi-testi … ordine-liste (maggior parte L1/L2) | NON PROVATO | giro L2 menu-fissi non consolidato | perimetro L2 | **A** |
| menu-fissi-confronto-visivo | NON PROVATO | agente V | C10 | — |
| menu-fissi-nessuna-categoria / stato-vuoto / accesso | NON PROVATO | stato_prova | — | — |
| C1/C2/C3 matrice L2 menu-fissi | NON PROVATO | non eseguita a gruppi | matrice + screenshot | **A** |

## Anomalie

- Giro L2 servizi **fermato** oltre budget 15 min durante matrice C1/C2 (payload già su daemon; `delete-prefix` a ogni stato resta costoso).
- Secondi avvii `ui:verify` a volte **senza output** per minuti (probabile attesa `next dev` / Playwright); console locale-dev risulta comunque in `esiti/2026-10-18-locale-dev/`.
- `ensure-norole-user`: **NON PROVATO** (`appRole` invalido) — coperto da `verify-roles-8_3`, non conta come FALLITO cascade.

## Pulizia

`delete-prefix verify-ui-`, `stopMenuPayloadSession`, porte 3000/3100/3200/31997 verificate libere a fine sessione.

Percorsi: `docs/design/verifica/esiti/2026-10-18-locale-prod/`, `docs/design/verifica/esiti/2026-10-18-locale-dev/`, questo file.
