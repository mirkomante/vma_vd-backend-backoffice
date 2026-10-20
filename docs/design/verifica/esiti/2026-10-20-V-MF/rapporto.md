# V-MF — Menù fissi dopo F4 e F-TOCCO — 2026-10-20

**Commit**: `5615003b2a8f` (working tree) · **Istanza**: V-MF · **Tetto**: 30 min (giro unico, non rilanciato)

## Comandi e tempi

| Passo | Comando | Durata | Exit |
|---|---|---:|---:|
| 1 C2 e2e | `E2E_ESITI=2026-10-20-V-MF pnpm exec node e2e/scripts/playwright-cli.mjs --workers=4 --grep "menu-fissi/(elenco\|categorie).+C2"` | **27,2 s** | 0 |
| 2 flussi | `pnpm ui:verify locale-prod --livello 1 --controlli controlli-6.6.json --schermata menu-fissi --profili telefono-390,notebook-1280 --temi chiaro --solo` (9 id) | **43,3 s** | 1 |

Artefatti: `c2-e2e-risultati.json`, `c2-e2e-rapporto.md`, `flussi-risultati.json`.

## C2 schede (elenco + categorie, telefono-390 chiaro/scuro)

| Stato | Profilo/tema | Esito | Misurato | Atteso |
|---|---|---|---|---|
| elenco | telefono-390-chiaro | **OK** | nessun elemento sotto 44 px | nessun elemento in elenco (min 44 px) |
| elenco | telefono-390-scuro | **OK** | nessun elemento sotto 44 px | nessun elemento in elenco (min 44 px) |
| categorie | telefono-390-chiaro | **OK** | nessun elemento sotto 44 px | nessun elemento in elenco (min 44 px) |
| categorie | telefono-390-scuro | **OK** | nessun elemento sotto 44 px | nessun elemento in elenco (min 44 px) |

*(Il `--grep` ha eseguito anche 4 test C2-mouse su notebook-1280: tutti OK; fuori perimetro richiesto ma senza FALLITO.)*

Elementi sotto 44 px sui quattro C2 a 390 px: **nessuno** (evidenza: `misurato: conforme` / lista vuota negli assert).

## Nove controlli flusso (`ui:verify --solo`)

| Id | Esito | Misurato | Atteso |
|---|---|---|---|
| menu-fissi-colonna-elenco | **ERRORE-STRUMENTO** | giro interrotto: `menu-payload` daemon exit 1 su :31997 (seconda spawn dopo prod-server) | layout per profilo (JSON §9 p.3) |
| menu-fissi-porzione-traduzione | **ERRORE-STRUMENTO** | non eseguito (crash prima dei flussi) | porzione + traduzione EN (JSON §9 p.10) |
| menu-fissi-servizi-piatti | **ERRORE-STRUMENTO** | non eseguito | servizi M2M + stati piatti (JSON §9 p.14) |
| menu-fissi-elimina-usato | **ERRORE-STRUMENTO** | non eseguito | dialogo cascade + elimina (JSON §9 p.15) |
| menu-fissi-elimina-senza-uso | **ERRORE-STRUMENTO** | non eseguito | dialogo senza cascade (JSON §9 p.15) |
| menu-fissi-elimina-cascade-registro-permessi | **ERRORE-STRUMENTO** | non eseguito | cascade DB + activity log + ruoli (ADR-115) |
| menu-fissi-persistenza | **ERRORE-STRUMENTO** | non eseguito | create/update + permessi (JSON §9 p.16) |
| menu-fissi-ordine-liste | **ERRORE-STRUMENTO** | non eseguito | ordinamento liste (JSON §9 p.18) |
| menu-fissi-nomi-accessibili | **ERRORE-STRUMENTO** | non eseguito | nomi accessibili IT (JSON §6, T1) |

Log: `Error: menu-payload daemon exit 1 prima di :31997` in `scripts/ui-verify/lib/menu-payload.mjs` dopo build e avvio `next start` (~30 s dall’avvio). Prima spawn daemon OK in provision-user; fallita la seconda in fase fixture.

## Ambiente finale

| Verifica | Atteso | Misurato | Esito |
|---|---|---|---|
| `lsof` porte 3100–3203 | nessun listener | nessun listener | OK |
| `lsof` :31997 | nessun listener | nessun listener | OK |
| `git worktree list` | solo repo principale | solo working tree principale | OK |
| `pnpm payload run e2e/scripts/count-verify-ui.ts` | `{"total":0}` | `{"total":0}` dopo `delete-prefix verify-ui-` (era 1 residuo utente/fixture) | OK |

## Criteri di accettazione V-MF

| # | Criterio | Esito |
|---:|---|---|
| **(a)** | Ogni controllo dei nove con esito OK / FALLITO / NON PROVATO (motivo), misurato e atteso valorizzati | **NON soddisfatto** — nessun controllo eseguito; solo **ERRORE-STRUMENTO** (non conta tra OK/FALLITO/NON PROVATO) |
| **(b)** | C2 Menù fissi schede `elenco`/`categorie` a 390 px senza FALLITO | **Soddisfatto** — 4/4 OK, nessun elemento &lt; 44 px |
| **(c)** | Ambiente pulito (porte + `verify-ui-` a zero) | **Soddisfatto** |

## Note

- Nessun commit git (per istruzione V-MF).
- Non è stato rilanciato `ui:verify` (giro unico; errore strumento non corretto in questa chat).
