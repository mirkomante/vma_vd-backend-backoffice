# V1 — verifica Menù home + navigazione (post I1) — 2026-10-17

**Istanza**: V1, dopo chat I1 (6.6).  
**Commit**: `dadc389` · **Lanciatore**: `3.3.0` · **Browser**: Chromium 140.0.7339.186; WebKit 26.0 (solo locale-dev).

Rapporti automatici completi: `2026-10-17-locale-prod/`, `2026-10-17-locale-dev/`.

## A — Controlli home implementati nel lanciatore (debito VC1)

| Id | Eseguito | Ambiente | Esito |
|---|---|---|---|
| `home-riga-menu-testo` | sì | locale-prod | OK (4 combinazioni profilo/tema) |
| `home-riga-menu-casi` | sì | locale-prod | OK |
| `home-riga-menu-altezza` | sì | locale-prod | OK (skeleton misurato su server :3200 con `APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS=2500`) |
| `home-riga-menu-stati` | sì | locale-dev (:3200) | OK |
| `nav-pannello-telefono` | no (non toccato) | — | NON PROVATO — «voci non ancora tutte accese» |

Correzioni lanciatore in questa sessione: `menu-payload.ts` con `await main()`; `replacePacchetto('menu')` una sola volta all’inizio di `runMenuChecks` (prima cancellava le righe home); filtro percorsi `CONSOLE` senza `null` da schermate con `percorso: null`.

## B — Comandi eseguiti

```bash
pnpm ui:verify locale-prod --livello 2 --controlli controlli-6.6.json --schermata home,navigazione
pnpm ui:verify locale-dev --livello 2 --controlli controlli-6.6.json --schermata home,navigazione
pnpm ui:verify locale-prod --livello 2 --controlli controlli-8.2.json --schermata shell
```

## C — online-senza-credenziali

NON PROVATO — si provano in V6, dopo il deploy.

## Regressione shell (8.2)

- **FALLITO**: `shell-menu-voci` | notebook-1280/chiaro | misurato `navLinks:4` | atteso `navLinks:3` (dettaglio in `2026-10-17-locale-prod/rapporto.md`).

## Controlli dubbi

1. **`home-riga-menu-stati`**: il JSON cita Skeleton con `aria-busy`; in UI lo skeleton usa `aria-hidden` sul wrapper — il lanciatore rileva `[data-slot=skeleton]` / `animate-pulse`.
2. **`shell-menu-voci`**: il conteggio `navLinks` potrebbe includere un collegamento extra oltre alle tre voci abilitate (da valutare in design).

## Pulizia

Utente `verify-ui-*@test.local` eliminato dal lanciatore; `delete-prefix verify-ui-` sui piatti: 0 residui.
