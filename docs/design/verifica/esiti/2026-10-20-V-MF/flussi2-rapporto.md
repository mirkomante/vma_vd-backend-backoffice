# V-MF — rilancio flussi con `PAYLOAD_DISABLE_PUSH=1` — 2026-10-20

**Comando**: `PAYLOAD_DISABLE_PUSH=1 pnpm ui:verify locale-prod --livello 1 --controlli controlli-6.6.json --schermata menu-fissi --profili telefono-390,notebook-1280 --temi chiaro --solo` (9 id)  
**Durata**: 45,5 s · **Exit**: 1 · **Log**: `flussi2-run.log`

## Errore (identico al primo giro)

```
Error: menu-payload daemon exit 1 prima di :31997; cmd=; stderr=$ cross-env NODE_OPTIONS=--no-deprecation payload run scripts/ui-verify/menu-payload.ts -- __daemon__
```

`PAYLOAD_DISABLE_PUSH=1` **non** ha sbloccato il giro: il daemon di provision/warmup era già in ascolto; la seconda `waitMenuPayloadDaemonReady` dopo `prod-server` ha tentato un nuovo spawn.

## stderr completo del daemon

Il messaggio del lanciatore tronca stderr a 350 caratteri. Riproduzione manuale (primo `__daemon__` su :31997, secondo avvio immediato):

```
$ cross-env NODE_OPTIONS=--no-deprecation payload run scripts/ui-verify/menu-payload.ts -- __daemon__
listen EADDRINUSE: address already in use 127.0.0.1:31997
[ELIFECYCLE] Command failed with exit code 1.
```

## Nove controlli

Tutti **ERRORE-STRUMENTO** (nessun flusso eseguito). Dettaglio in `flussi2-risultati.json`.
