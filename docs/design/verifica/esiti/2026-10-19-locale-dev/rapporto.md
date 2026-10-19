# Esito verifica — locale-dev — 2026-10-19

Commit: `ff68c7591cd9` · Lanciatore: 3.9.0 (L2) · Browser: Chromium · Controlli: `controlli-6.6.json` v1  
Modalità: `UI_VERIFY_MENU_PAYLOAD_LEGACY=1`

## Riepilogo (servizi + menu-fissi, perimetro A3)

OK: 4 · FALLITO: 0 · AVVISO: 0 · NON PROVATO: 2

## Esiti

| Id | Esito | Misurato | Atteso |
|---|---|---|---|
| servizi-console | OK | err:0 warn:0 http:0 (390 + 1280) | zero error/warning/pageerror |
| menu-fissi-console | OK | err:0 warn:0 http:0 (390 + 1280) | zero error/warning/pageerror |
| servizi-stati-ui | NON PROVATO | crash `browserContext.addCookies: Cookie should have a url or a domain/path pair` (`run.mjs:236`) | skeleton, errore caricamento, errore azione simulati |
| menu-fissi-stati-ui | NON PROVATO | stesso errore cookie su `newPage` | come sopra per menù fissi |

Durata giri: ~66 s (servizi-console) + ~66 s (menu-fissi-console); stati-ui ~13 s ciascuno (errore).

Percorso machine-readable: `risultati.json`
