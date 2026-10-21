# Passo 28b (V6b) — nuclei Giorni speciali e Messaggio globale

Commit: `bfe2006` · Database: `vma_vd_dev` · Browser: Chromium (Playwright 1.55.1)  
Comando giro ufficiale:  
`PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=2026-10-20-V6b pnpm e2e e2e/controlli/giorni-speciali.spec.ts e2e/controlli/messaggio-globale.spec.ts e2e/controlli/dev-server.spec.ts`

## Primo atto (server di sviluppo :3200)

Due tentativi con `test.setTimeout(240_000)` sul test provvisorio (`/app/menu/message` dopo `loginAppOnBase`): **entrambi falliti** (timeout 240 s o `Server non raggiungibile: http://localhost:3200/app/login` dopo 240 s di `waitForUrl`). Correzioni minime all’helper (`NODE_ENV: 'development'`, drain pipe stderr, `waitForUrl` su `/app/login`, `freePorts` prima dell’avvio): il server **non** diventa raggiungibile entro 240 s mentre il giro e2e tiene `pnpm start` sulla 3100. Test provvisorio rimosso.

## Esiti reali (dieci controlli)

| Controllo | Esito | Secondi |
|---|---|---:|
| giorni-speciali-testi | OK | ~1 (giro ufficiale) |
| giorni-speciali-nomi-accessibili | OK | 0.8 |
| giorni-speciali-modulo-validazione | OK | ~1 (giro ufficiale) |
| giorni-speciali-console | ERRORE-STRUMENTO | 241.3 |
| messaggio-globale-testi | OK | ~1 (misura dopo correzione test; giro ufficiale FALLITO per assenza messaggio salvato) |
| messaggio-globale-nomi-accessibili | OK | 0.5 |
| messaggio-globale-console | NON PROVATO | — |
| messaggio-globale-file-riceve-messaggio | NON PROVATO | — |
| messaggio-globale-pubblicazione | NON PROVATO | — |
| messaggio-globale-permessi | OK | — |

### Dettaglio fallimenti / strumento

**giorni-speciali-console** — ERRORE-STRUMENTO  
- Misurato: `Server non raggiungibile: http://localhost:3200/app/login` (241 s)  
- Atteso: server dev raggiungibile, poi flusso console a 390 e 1280 px senza errori/warning/4xx/5xx  
- Evidenza: `withMenuDevServer` → `startMenuDevServer` → `waitForUrl`; stderr child `[e2e-dev:3200]` con stack Next troncato  
- Gravità proposta: — (strumento, non app)

**messaggio-globale-testi** (solo nel giro ufficiale) — FALLITO test  
- Misurato: pulsante «Togli il messaggio» assente (nessun messaggio salvato)  
- Atteso: testi e pulsanti come da controllo  
- Correzione: seed `verify-ui-testi` con `withMenuGeneralBackup`; misura successiva OK  
- Gravità proposta: — (difetto del test, non P app)

**messaggio-globale-console / file-riceve-messaggio / pubblicazione** — NON PROVATO  
- Motivo: `describe` seriale su `:3200`; il primo test (`giorni-speciali-console`) non avvia il server → i successivi non eseguiti (policy §6, livello debito V6)

**messaggio-globale-permessi** — OK con evidenza `verify:menu-6_1` (test Playwright `skip` con nota)

### verify:menu-6_1 (`/tmp/verify-menu-6_1-v6b.log`, exit 0)

- `OK: managerApp update menu-general`
- `OK: admin update menu-general`
- `OK: super-admin update menu-general`
- `OK: noRole update menu-general negata (403)`

### Controllo NO-OVERRIDE (R12)

`pnpm ui:check` OK; nessun `overrideAccess: true` in `app/(app)/app/menu/message` né nelle route menù toccate dal grep del passo.

## Regola 4 («può fallire»)

- **giorni-speciali-modulo-validazione**: atteso «Scegli una data sbagliata.» → test **FALLITO**; ripristinato `SPECIAL_DAYS_ERROR_DATE` → OK.
- **Console dev**: non provata (server :3200 non raggiungibile).

## Limiti righe

- Motore e2e (senza `controlli/` e `smoke/`): **3302** / 3345  
- Spec `controlli/` + `smoke/`: **1429** / 1500  

## Criteri di accettazione (28b)

(a) Dieci controlli con esito misurato o NON PROVATO motivato — **sì**  
(b) Zero ERRORE-STRUMENTO sul nucleo — **no** (uno su `giorni-speciali-console`; altri tre dev NON PROVATO per serial)  
(c) Ambiente pulito a fine passo — da verificare dopo teardown (porte, `verify-ui-`, Global ripristinato dai test con backup)

## File toccati

Nuovi: `e2e/controlli/dev-server.spec.ts`, `e2e/lib/global-message/backup.ts`, `e2e/lib/global-message/mirror-file.ts`, `docs/design/verifica/esiti/2026-10-20-V6b/`  
Modificati: `e2e/controlli/giorni-speciali.spec.ts`, `messaggio-globale.spec.ts`, `wire-registry.json`, `e2e/lib/checks.ts`, `e2e/lib/dev-menu-server.ts`, `docs/piano-sviluppo/CHANGELOG.md`

Durata passo (agente, inclusi tentativi dev e giro ufficiale ~4,2 min): **~95 minuti** · ERRORE-STRUMENTO sul nucleo: **1** (`giorni-speciali-console`)
