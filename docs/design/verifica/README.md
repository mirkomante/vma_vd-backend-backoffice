# Verifica automatica dell'Area App su ambienti reali

**Stato**: procedura proposta il 2026-10-11, da validare sulla prima esecuzione.

Sostituisce gli screenshot fatti a mano: un agente (una chat pulita di Cursor con Composer) esegue i controlli, scrive un rapporto con gli esiti misurati e salva gli screenshot nel repo; la chat di design li legge e assegna i rilievi **P** e **A**; un'altra chat corregge. Il git lo fa Mirko a mano.

## 1. Chi fa che cosa

| Chi | Cosa |
|---|---|
| **Agente di verifica** (chat pulita di Cursor, regola `.cursor/rules/ui/02-ui-verifica-agente.mdc`) | Costruisce e lancia il lanciatore dei controlli, scrive rapporto e screenshot. **Non corregge l'app, non modifica i controlli.** |
| **Chat di design** | Possiede `controlli-*.json`, interpreta i rapporti, etichetta P e A, aggiorna le specifiche. Fa i controlli con sessione reale su Cloud Run (sezione 8). |
| **Chat di implementazione** (Composer) | Corregge i rilievi P. |
| **Mirko** | Git, deploy, un giro finale su iPhone vero. |

## 2. File di questa cartella

| File | Contenuto |
|---|---|
| `controlli-8.2.json` | I controlli della 8.2 (accesso, shell) come dati: profili di dispositivo, temi, stati, testi, misure, flussi |
| `misura-tocco.md` | L'algoritmo di misura delle aree di tocco (C2) |
| `prompt-agente-verifica.md` | Il messaggio con cui si apre la chat pulita dell'agente |
| `esiti/<data>-<ambiente>/` | Gli esiti (sezione 7). Li crea l'agente |

## 3. Prerequisiti (li prepara l'agente, una volta)

- **Playwright**: `@playwright/test` come devDependency (modifica `package.json` e `pnpm-lock.yaml`: è l'unica modifica fuori da `scripts/ui-verify/` e da `docs/design/verifica/esiti/`; si annota nel CHANGELOG) e i browser: `pnpm exec playwright install chromium webkit`.
- **Lanciatore**: `scripts/ui-verify/run.mjs` (Node ESM, nello stile di `scripts/ui-check.mjs`) e lo script `ui:verify` in `package.json`. Legge `controlli-8.2.json`. Deve passare `pnpm lint` e `pnpm typecheck`.
- **Utente di prova**: `verify-ui-<timestamp>@test.local`, `adminRole: none`, `appRole: manager`, `loginMethod: local`, email verificata, password generata a caso e **mai scritta in chat, nei file o nel rapporto**. La procedura è quella di `docs/piano-sviluppo/fase-8-shell-app.md` (8.3, controllo positivo con `curl`). Si elimina **sempre** alla fine, anche se i controlli falliscono (`try/finally`).
- **Mai**: `scripts/prod-db.sh`, credenziali di produzione, utenti di prova su Cloud SQL, il dominio di Cloud Run con una sessione.

## 4. Ambienti

| Ambiente | Come | Per che cosa |
|---|---|---|
| `locale-dev` | `pnpm dev` | Console senza avvisi di Base UI (in produzione non si stampano) |
| `locale-prod` | `pnpm build && pnpm start` | Misure, tema senza lampo, flussi: più vicino a Cloud Run |
| `online` | `BASE_URL=<dominio pubblico>` | Solo i controlli `online-senza-credenziali` del JSON, senza credenziali |

Le misure si fanno su `locale-prod`; la console su `locale-dev`. Un controllo si dichiara fatto solo sull'ambiente in cui ha senso.

## 5. Profili di dispositivo e temi

Definiti nel JSON (`profili`, `temi`). Punti fermi:
- I profili a tocco usano `isMobile: true` e `hasTouch: true`: senza, `pointer-coarse:` non si applica e si misurano 32 px (falso errore, già visto con Safari su Mac).
- `notebook-1280` è senza tocco, con il mouse.
- Si ripete il giro essenziale (login, home, menu aperto, menu utente) anche con il **WebKit** di Playwright: è un'approssimazione di Safari, non iOS.
- I temi sono quattro (`chiaro`, `scuro`, `sistema-chiaro`, `sistema-scuro`): si impostano con il cookie `app-theme` (`light`, `dark`, `system`) e con `colorScheme` del contesto.
- I controlli di ogni schermata (`C1`, `C2`, `C3`, testi, misure) si fanno **in ogni stato** elencato.

## 6. Tipi di controllo del JSON

| `tipo` | Che cosa si fa |
|---|---|
| `scroll-orizzontale` | `document.documentElement.scrollWidth <= innerWidth` in ogni stato |
| `tocco-minimo` | Algoritmo di `misura-tocco.md`; atteso: elenco vuoto |
| `altezza-mouse` | Altezza dei controlli con il mouse nell'intervallo; fuori = **avviso** |
| `tema-classe` | `<html>` ha la classe `dark` se e solo se il tema lo prevede |
| `tema-no-lampo` | Osservatore delle mutazioni di `<html>` installato prima della pagina: nessuna variazione dopo `DOMContentLoaded` |
| `tema-cambio-sistema` | Con «Sistema», il cambio di `prefers-color-scheme` a pagina aperta cambia il tema |
| `tema-persistenza` | Scelta dal menu utente, cookie, ricaricamento |
| `console-pulita` | Zero `error` e `warning` in console, zero `pageerror`, zero richieste fallite non attese |
| `testo` | I testi sono quelli attesi, **carattere per carattere** (apostrofi tipografici compresi). Le costanti di `lib/` (`testo_da`) si leggono dal codice, non si copiano |
| `attributi` | Nome, tipo, `autocomplete`, `required`, `minlength`, `href`, `action` come dichiarato |
| `presenza` / `assenza` / `conteggio` | Elementi che devono esserci, non esserci, o essere in un certo numero |
| `misura` | Misura geometrica con `tolleranza_px`; `gravita: avviso` se dichiarata |
| `reindirizzamento` | Dove porta un indirizzo (con o senza sessione): origine corretta, mai `0.0.0.0` |
| `flusso` | Sequenza di passi con esiti attesi (clic veri, non invii diretti dei moduli) |
| `comando` | Un comando e il suo codice di uscita |

Un controllo con `stato_prova` che dice «NON PROVABILE» o «facoltativo» si dichiara **NON PROVATO**, non si aggira.

## 7. Esito

Cartella: `docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/` con:
- `rapporto.md`: la tabella degli esiti (modello sotto);
- `risultati.json`: lo stesso, leggibile dalla macchina;
- `img/<schermata>-<stato>-<profilo>-<tema>.png`: uno screenshot per ogni stato nei profili `telefono-390` e `notebook-1280`, nei temi `chiaro` e `scuro`. Gli altri profili solo in caso di fallimento.

Si tiene **solo l'ultimo esito per ambiente** (gli altri si cancellano: la storia è in git).

**Modello del rapporto**

```
# Esito verifica — <ambiente> — <data>
Commit: <hash> · Lanciatore: <versione> · Browser: <nomi e versioni> · Controlli: controlli-8.2.json v1

## Riepilogo
OK: n · FALLITO: n · AVVISO: n · NON PROVATO: n

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|

## Non provato (e perché)
- <id>: <motivo>

## Anomalie dell'ambiente
- <cosa è andato storto nell'esecuzione, non nell'app>
```

Esiti ammessi: **OK**, **FALLITO**, **AVVISO** (solo dove il JSON dice `gravita: avviso`), **NON PROVATO**. L'agente **non assegna P e A**: li assegna la chat di design leggendo il rapporto.

## 8. Controlli con sessione reale su Cloud Run

Non li fa l'agente di verifica (niente credenziali di produzione). Li fa la chat di design con il browser di Mirko già collegato, o Mirko a mano: elenco in `controlli-8.2.json`, voce `online-con-sessione-reale`.

## 9. Cosa questa procedura non copre

- **Safari e iOS reali**: tastiera, campo ora nativo, comportamento al tocco vero → giro finale di Mirko su iPhone.
- **Utenti con accesso all'Admin**: il login locale dell'App li rifiuta (fase 8, 8.3) → controlli della sezione 8.
- **Verifica email riuscita**: serve un token vero e si consuma una volta sola → facoltativa.
- **Giudizio estetico**: l'agente misura, la chat di design guarda gli screenshot e giudica.

## 10. Regole d'oro

1. Si distingue sempre **verificato**, **fallito** e **non provato**. Mai «dovrebbe funzionare».
2. L'agente non cambia soglie, tolleranze o attesi per far passare un controllo. Se un controllo sembra sbagliato lo scrive nel rapporto («controllo dubbio») e lo lascia com'è.
3. L'agente non corregge l'app: riporta.
4. Ogni misura riporta il valore trovato, quello atteso e come è stato ottenuto.
5. Dopo ogni esecuzione: l'utente di prova non esiste più, i file temporanei sono spariti, `git status` mostra solo i file attesi.
