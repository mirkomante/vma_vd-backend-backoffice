# Esito verifica — locale-prod e2e — T1e — 2026-10-20

Commit: (working tree) · Lanciatore: `e2e/` Playwright Test · Browser: chromium (Playwright 1.55.1) · Controlli: `controlli-6.6.json` (Servizi, Menù fissi, Vini, Distillati, Bevande — screenshot + matrice C1–C3)

## Comandi eseguiti

- `pnpm typecheck` (root + `e2e/tsconfig.json`) — exit 0
- `pnpm lint` — 0 errori, 104 warning preesistenti fuori perimetro
- `time pnpm e2e:smoke` — **11,0 s**, 6 test, exit 0
- `pnpm e2e:t1c` (giro completo matrice + screenshot) — **6,0 min**, 412 passed, 120 failed (strumento), 28 skipped, exit 1
- `pnpm e2e:t1c --grep screenshot` (secondo giro dopo fix fixture catalogo e preparazioni) — 79 passed, 9 failed, exit 1
- `pnpm e2e:t1c --grep screenshot` (terzo giro stati ancora falliti) — 2 passed, 7 failed, exit 1
- Pulizia manuale residui: `pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-` → **0** record `verify-ui-` (il teardown del terzo giro non era ancora stato rieseguito con DB pulito)

## Modifiche e2e (T1e)

1. Rimossi worktree/simulazioni: eliminati `sim-worktree.ts`, `sim-dev-servers.ts`, `servizi-menu-fissi-simulazioni.spec.ts`, progetto `simulazioni`, `E2E_START_SIM_SERVERS`.
2. Stati simulati e console dev: **NON PROVATO** («le riprova V6 con un dev server alla volta»); matrice C1–C3 senza `caricamento` / `errore-caricamento` / `errore-azione`.
3. Screenshot: `screenshot-frame.ts` (scroll sezione foglio + `document.getAnimations()`), nomi `screenshotFileName` con varianti ref (`modulo-fondo`, …).
4. Server: `global-setup` libera porte **3100–3203** e avvia un solo `pnpm start`; rimosso `webServer` Playwright (evita race con `freeE2ePorts`).
5. Cataloghi: `e2e/lib/catalog/*`, `catalog-screenshots.spec.ts`; fix argomenti `create-catalog-items` (email duplicata → ERRORE-STRUMENTO massivo risolto).
6. Preparazioni: conferma eliminazione nel `alertdialog`; regex piatti «Aggiungi.*piatti»; asserzione visibilità categoria meno ambigua.

## Riepilogo screenshot (criterio 1)

| Schermata | Attesi (JSON, salvabili) | Salvati | NON PROVATI (motivo) | ERRORE-STRUMENTO (file mancanti) |
|---|---:|---:|---|---|
| servizi | 13 | **13** | 4 stati (sim ×3, vuoto) | — |
| menu-fissi | 22 | **18** | 6 stati (sim ×3, vuoto, categorie-vuoto, nuovo-senza-categorie) | 4 file (vedi sotto) |
| vini | 21 | **18** | 5 stati (sim ×3, vuoto, piu-di-100-vini) | 3 file |
| distillati | 16 | **16** | 5 stati (sim ×3, vuoto, piu-di-100-distillati) | — |
| bevande | 16 | **16** | 5 stati (sim ×3, vuoto, piu-di-100-bevande) | — |
| **Totale** | **88** | **81** | **25** (conteggio stati, non file) | **7** |

### Screenshot mancanti (ERRORE-STRUMENTO)

| File atteso | Causa |
|---|---|
| `menu-fissi-scegli-piatti-telefono-390-chiaro.png` | timeout 15 s: pulsante piatti non trovato (`/Aggiungi.*piatti/`) nel foglio |
| `menu-fissi-scegli-piatti-notebook-1280-chiaro.png` | idem |
| `menu-fissi-visibilita-categoria-telefono-390-chiaro.png` | strict mode / preparazione categoria+visibilità non stabilizzata |
| `menu-fissi-visibilita-avviso-telefono-390-chiaro.png` | timeout su testo avviso «non comparirà mai» |
| `vini-origine-senza-regioni-telefono-390-chiaro.png` | preparazione Paese=Giappone / asserzione non soddisfatta entro timeout |
| `vini-errore-geografia-telefono-390-chiaro.png` | salvataggio con Paese=Francia non produce messaggio atteso entro timeout |
| `vini-errore-anno-telefono-390-chiaro.png` | validazione anno 1899 / messaggio atteso non visibile entro timeout |

Cartella: `docs/design/verifica/esiti/2026-10-19-T1c/img/` (**81** PNG).

## Matrice C1–C3 (criterio 2)

Giro completo `pnpm e2e:t1c` (6 min):

| Metrica | Valore |
|---|---|
| Test passed | 412 |
| **FALLITO (app)** | **4** (tutti `menu-fissi` **C2** su stati `elenco` e `categorie`, telefono-390 chiaro/scuro — tocco sotto 44 px su elemento della pagina, non sui fogli) |
| ERRORE-STRUMENTO | 116 (prevalenza cataloghi con bug email duplicata nel primo giro; menu-fissi `scegli-piatti` / visibilità in parallelo) |
| Controlli **servizi** con esito OK (log `[e2e]` righe `servizi C*` + screenshot servizi) | **155** (stati simulati rimossi rispetto ai 162 del checkpoint T1d; **0 FALLITO** su servizi) |

## Ambiente (criterio 3)

| Verifica | Atteso | Misurato | Esito |
|---|---|---|---|
| `lsof` porte 3100–3203 | nessun listener | nessun listener dopo i giri | **OK** |
| `git worktree list` | solo repo principale | solo `/Users/mirko/.../vma_vd-backend-backoffice` | **OK** |
| `pnpm payload run e2e/scripts/count-verify-ui.ts` | 0 | **0** dopo `delete-prefix verify-ui-` | **OK** (dopo pulizia manuale; a fine giro automatico erano rimasti 38 record) |

## Criteri di accettazione T1e

| # | Criterio | Esito |
|---:|---|---|
| 1 | Screenshot stati con riferimento (salvabili) | **Parziale** — 81/88; fogli con scroll su `modulo-piatti` / `modulo-servizi` / `modulo-inglese-aperto` salvati |
| 2 | Controlli servizi OK senza nuovi FALLITO app su servizi | **OK** su servizi; **4 FALLITO** nuovi solo menu-fissi C2 elenco/categorie (tocco) |
| 3 | Ambiente pulito | **OK** dopo pulizia `verify-ui-`; teardown da verificare su prossimo giro verde |

## Stati NON PROVATI (screenshot e/o matrice)

| Schermata | Stato | Motivo |
|---|---|---|
| servizi, menu-fissi, vini, distillati, bevande | caricamento, errore-caricamento, errore-azione | le riprova V6 con un dev server alla volta |
| servizi, vini, distillati, bevande | vuoto | database popolato |
| menu-fissi | vuoto, categorie-vuoto, nuovo-senza-categorie | database popolato / categorie di prova presenti |
| vini | piu-di-100-vini | serve il bulk da 101, lo fa V6 |
| distillati | piu-di-100-distillati | idem |
| bevande | piu-di-100-bevande | idem |
| servizi, menu-fissi | *-console* | le riprova V6 con un dev server alla volta |

## Note

- F4: nessuna asserzione su titolo «Modifica … (nome)» nei test e2e; i fogli usano titolo + sottotitolo come da spec aggiornata.
- Prossimo passo suggerito: stabilizzare preparazione `scegli-piatti` e visibilità menù fisso; portare creazione cataloghi su Local API in-process (evitare `payload run` per worker) per i tre stati vini «difficili».
