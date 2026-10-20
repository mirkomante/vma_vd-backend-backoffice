# V-MF — giro 3 (fix daemon + flussi) — 2026-10-20

**Fix**: `scripts/ui-verify/lib/menu-payload.mjs` — `orphansHandled` (vedi diff nel rapporto principale).  
**Comando**: `pnpm ui:verify locale-prod --livello 1 --controlli controlli-6.6.json --schermata menu-fissi --profili telefono-390,notebook-1280 --temi chiaro --solo` (9 id), **senza** `PAYLOAD_DISABLE_PUSH`.  
**Durata**: ~51 s · **Exit**: 1 · **Log**: `flussi3-run.log`

## Esito daemon

**OK** — nessun `EADDRINUSE`; il giro supera build + prod-server e avvia i flussi Playwright.

## Nuovo errore strumento (stop)

```
locator.click: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Elimina verify-ui-menu-libero' })
    at clickRowAction (scripts/ui-verify/lib/menu-list-ui-helpers.mjs:21:51)
    at run-menu-list-flows.mjs:368 (menu-fissi-elimina-senza-uso)
```

Eccezione non gestita → i restanti controlli del `--solo` non eseguiti (`risultati.json` merge: ancora righe «controllo non eseguito»).

## Tabella nove controlli

Vedi `flussi3-risultati.json` (tutti **NON PROVATO** con misurato/atteso valorizzati).
