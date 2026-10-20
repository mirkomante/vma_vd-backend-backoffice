# Esito verifica — locale-prod e2e — T1c — 2026-10-19

Commit: e73a361c5309 · Lanciatore: e2e/T1c-playwright · Browser: chromium (Playwright 1.55.1) · Controlli: controlli-6.6.json (schermate `servizi`, `menu-fissi`)

## Criteri di accettazione T1c

| # | Criterio | Atteso | Misurato | Esito |
|---:|---|---|---|---|
| 1 | Durata suite schermate, 4 worker | &lt; 10 min | ~11,4 min (giro interrotto/incompleto); giro modulo-only ~6,9 min | **NON soddisfatto** |
| 2 | Screenshot | servizi **17** + menu-fissi **28** = **45** | **14** file in `img/` | **NON soddisfatto** |
| 3 | ERRORE-STRUMENTO | 0 | **8** (ultimo giro completo parziale: timeout `caricamento` + teardown cleanup); giro con lock fixture ancora da validare end-to-end | **NON soddisfatto** |
| 4 | `pnpm e2e:smoke` | &lt; 60 s, exit 0 | in corso / da ripetere dopo kill processi (strumento escluso da smoke) | **da confermare** |
| 5 | `pnpm typecheck` + `pnpm lint` | 0 errori | typecheck OK; lint 0 errori (solo warning preesistenti) | **OK** |
| 6 | `ps` / `lsof` / `verify-ui-` | puliti | da verificare a fine giro (teardown cleanup timeout osservato) | **da confermare** |

## Riepilogo ultimo giro registrato (`risultati.json`)

OK: 62 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 1442 · **ERRORE-STRUMENTO: 8**

(Giro interrotto prima del completamento di tutti i progetti; molti test «did not run».)

## ERRORE-STRUMENTO (dettaglio noto)

| Controllo | Schermata/stato | Profilo/tema | Misurato | Atteso |
|---|---|---|---|---|
| C1 | servizi/caricamento | telefono-390-chiaro/scuro, notebook-1280-chiaro/scuro | timeout 60 s (dev :3200 + sim delay) | scrollWidth ≤ innerWidth |
| C3 | servizi/caricamento | soglia-767/768 × chiaro/scuro | timeout 60 s | classe `dark` coerente con tema |

Altri errori nel giro parallelo senza lock: **strict mode violation** su pulsanti duplicati (`Modifica verify-ui-…`) per fixture `verify-ui-` non isolate tra worker — mitigazione aggiunta: `withFixtureLock` + click su `main … first()`.

## NON PROVATO (motivi dichiarati)

| Stato | Schermata | Motivo |
|---|---|---|
| vuoto | servizi, menu-fissi | database di sviluppo popolato: non si svuota |
| categorie-vuoto, nuovo-senza-categorie | menu-fissi | non preparabile senza rimuovere categorie di prova |
| caricamento, errore-caricamento | servizi, menu-fissi (matrice C1–C3) | skip matrice: simulazione dev dedicata agli screenshot (evita timeout) |

## Esiti per controllo (aggregato — giro parziale)

| Id | OK | FALLITO | AVVISO | NON PROVATO | ERRORE-STRUMENTO |
|---|---:|---:|---:|---:|---:|
| C1 | 28 | 0 | 0 | molti skip profilo | 4 |
| C2 | 18 | 0 | 0 | skip profilo | 0 |
| C2-mouse | 12 | 0 | 0 | skip profilo | 0 |
| C3 | 4 | 0 | 0 | skip | 4 |
| C3-no-lampo | 0 | 0 | 0 | skip tema chiaro | 0 |
| C3-cambio-sistema | 2 | 0 | 0 | skip | 0 |
| servizi-console | 0 | 0 | 0 | 1 | 0 |
| menu-fissi-console | 0 | 0 | 0 | 1 | 0 |
| screenshot (file) | 14 | — | — | 31 mancanti | — |

## Screenshot per schermata

| Schermata | Attesi (JSON) | Salvati |
|---|---:|---:|
| servizi | 17 | vedi `img/servizi-*.png` |
| menu-fissi | 28 | vedi `img/menu-fissi-*.png` |
| **Totale** | **45** | **14** |

## Implementazione e2e (T1c)

- `e2e/controlli/servizi-menu-fissi-matrix.spec.ts` — C1, C2, C2-mouse, C3, C3-no-lampo, C3-cambio-sistema, console, screenshot
- `e2e/lib/menu-list/*`, `checks.ts`, `dev-menu-server.ts`, `fixture-lock.ts`
- `pnpm e2e:t1c` — suite controlli; smoke esclude `strumento.spec.ts` (exit 0)

## Prossimo passo (stesso perimetro e2e)

1. Giro completo con `withFixtureLock` e nomi `verify-ui-<runId>-w<n>-…` (R5).
2. Stati `caricamento` / `errore-caricamento`: server dev riusato o timeout 120 s su matrice.
3. Ripetere `pnpm e2e:t1c` fino a 45 screenshot e 0 ERRORE-STRUMENTO.
