# VC1 — cablaggio controlli Menù nel lanciatore (2026-10-17)

**Istanza**: VC1, prima della chat I1 (6.6).  
**Lanciatore**: `3.3.0` · **Commit**: `1969b79ccd3a` · **Browser**: Chromium 140.0.7339.186 (Playwright).

## Cosa è stato eseguito

- `pnpm lint` — OK (solo warning preesistenti).
- `pnpm typecheck` — OK.
- `pnpm ui:verify locale-prod --livello 1 --schermata shell --controlli controlli-8.2.json`
- `pnpm ui:verify locale-prod --livello 1 --schermata home,navigazione,piatti --controlli controlli-6.6.json`

Rapporti automatici completi (con screenshot): `docs/design/verifica/esiti/2026-10-17-locale-prod/`.

## Controlli già coperti (prima di VC1)

- Comuni C1–C3, C9, AMBIENTE sulla shell (modello Orari/8.2).
- Shell: barra, sticky, passaggio 768, menu utente, tema, segnaposto `/app/reservations`, percorso voce attiva (parziale).

## Controlli aggiunti in VC1

| Area | File principali | Note |
|---|---|---|
| Modulo Menù | `scripts/ui-verify/lib/run-menu.mjs` | home, navigazione, piatti, comuni 6.6 |
| Lettura `lib/` | `lib-readers.mjs`, `menu-nav-expectations.ts` | voci abilitate, briciole, `HOME_SECTION_CARDS` |
| Payload prova | `menu-payload.ts`, `lib/menu-payload.mjs` | `verify-ui-*` (count/create/delete) |
| Shell v4 | `engine.mjs`, `run.mjs` | `home-testi` da JSON+lib, `home-righe-di-stato`, `shell-menu-voci` dinamico, `shell-segnaposto` solo percorsi JSON |
| Indice rapporto | `controlli-index.mjs`, `report.mjs` | pacchetto `menu`, profilo `telefono-390-basso` |

## Esiti attesi sul codice di oggi (pre-I1 / pre-I2)

### FALLITO atteso fino a I1 (shell 8.2, L1)

| Id | Misurato | Atteso |
|---|---|---|
| **home-testi** | h1 `Area App`, desc `Scegli una sezione.` | h1 `Oggi`, desc `Situazione di oggi e accesso alle sezioni.` (schede da `HOME_SECTION_CARDS` in lib) |
| **home-righe-di-stato** | nessuna riga sulla scheda Menù | riga di stato presente sulla scheda Menù |

Dopo I1 questi controlli devono diventare **OK** senza modificare il JSON.

### NON PROVATO (motivo)

| Id / gruppo | Evidenza |
|---|---|
| **home-riga-menu-*** (4 controlli) | schermata non ancora implementata (home integrazione Menù, chat I1) |
| **piatti-*** (L1, esclusi rinviati 6.5) | schermata non ancora implementata (`/app/menu` è segnaposto `SectionPlaceholder`) |
| **piatti-ricompila**, **piatti-disabilitato-ovunque**, **RICOMPILA-PRESENTE** | rinviato alla 6.5 |
| **piatti-console**, **home-riga-menu-stati**, **piatti-stati-ui** (simulazioni) | server dev `APP_MENU_DEV_SIMULATE_*` — cablaggio registrato; esecuzione completa in locale-dev post-I1/I2 |
| **nav-pannello-telefono** | livello 2 oppure «voci non ancora tutte accese» (oggi < 8 voci Menù) |

### OK su navigazione (stato attuale, voci abilitate in lib)

- **nav-voci-menu**, **nav-icone**, **nav-voce-attiva**, **nav-briciole**, **nav-titoli-pagina**, **nav-casi-unit** — eseguiti su percorsi esistenti; casi con voce non accesa saltati (non FALLITO).
- **NO-OVERRIDE** — grep su cartelle esistenti (corretto in VC1: `grep` senza path mancanti).
- **RICOMPILA-ASSENTE** — OK su segnaposto Piatti (nessun pulsante visibile).

## Controlli dubbi

1. **RICOMPILA-ASSENTE**: il JSON chiede assenza anche negli avvisi di salvataggio; VC1 verifica il segnaposto e la presenza delle stringhe nel codice con bandiera spenta — non ancora il flusso salvataggio Piatti.
2. **nav-pannello-telefono**: misura altezza pannello registrata come preliminare; il caso `telefono-390-basso` (scroll con header/footer fissi) va rifinito quando tutte le voci Menù sono accese.
3. **Flussi Piatti** (modulo, elimina, filtri, …): id registrati come NON PROVATO fino a I2; implementazione flussi nel lanciatore è debito esplicito post-I2 (stesso modello `run-orari.mjs`).

## Debito lanciatore (post VC1)

- Implementare i flussi `piatti-*` e `home-riga-menu-*` quando le schermate esistono.
- Simulazioni `APP_MENU_DEV_SIMULATE_*` su server dev porta 3200 (modello Orari).
- `piatti-console` su locale-dev con interazioni complete.

## Anomalie ambiente

- Prima esecuzione: Playwright Chromium non installato — risolto con `pnpm exec playwright install chromium`.
