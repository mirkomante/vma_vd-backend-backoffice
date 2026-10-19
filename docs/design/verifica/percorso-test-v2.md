# Percorso di test v2: la verifica dell'Area App con Playwright Test

Scritto il 2026-10-19, dopo V4 ter. Sostituisce, da qui in avanti, i passi di verifica costruiti sul lanciatore `scripts/ui-verify` (`ui:verify`), che resta in uso solo fino alla chiusura del passo 20g.

## 0. In una frase

La verifica resta **completa** (conformità alle demo e funzionamento) e i **178 controlli dei file JSON restano la fonte di verità**; cambia il motore che li esegue: non più uno script fatto in casa, ma **Playwright Test** (già nelle dipendenze del progetto), con tempi massimi imposti da fuori, dati di prova che si ripuliscono da soli e un rapporto che non confonde mai un errore dello strumento con un difetto dell'app.

## 1. Perché cambiamo (dati del 2026-10-19)

- Il lanciatore conta **17.179 righe in 40 moduli**, modificato da cinque chat diverse (VC1, VC3, VC4, VC-tempi, VC-parallelo) senza una prova del lanciatore stesso: ogni modifica ne ha rotto una parte.
- Nei giri L2 abbiamo avuto circa **70 FALLITO, di cui circa 8 erano difetti veri dell'app** (V3: 33 FALLITO e 1 difetto; V4: 4 e 0; V4 ter: 17 e 0). Il resto era lo strumento.
- **Quattro blocchi con la stessa firma**: il progress.log e il battito si fermano perché una chiamata **sincrona** senza tempo massimo tiene occupato il thread principale (`spawnSync` verso il client del daemon).
- Ogni operazione sui dati di prova era un processo Payload nuovo (circa 2 secondi), poi un daemon TCP con un client fragile.
- Fixture create a mano e pulizia incompleta: record residui che hanno bloccato il wipe con le chiavi esterne e falsato `verify:menu-6_3` e `verify:menu-6_4`.
- Un errore del lanciatore (`undefined`, selettore, fixture assente) veniva scritto come FALLITO.

## 2. Principi

1. **I controlli non cambiano**: `controlli-6.6.json`, `controlli-8.2.json` e `controlli-8.5.json` restano la fonte di verità. Un test per controllo, con lo stesso identificativo.
2. **Meno codice nostro, più codice di Playwright**: tempi massimi, parallelismo, rilancio dei soli falliti, tracce, fixture con ripristino, progetti per profilo e tema non si riscrivono.
3. **Un errore dello strumento non è un difetto dell'app**: ha un esito proprio (`ERRORE-STRUMENTO`) e non entra nei conteggi dei difetti.
4. **Il funzionamento si prova per intero**: il test compie l'azione dall'interfaccia e poi controlla il database; persistenza, cascata, permessi e formati restano nello stesso giro.
5. **Un solo cambiamento alla volta sul motore**, con una suite di fumo di 60 secondi che deve passare.

## 3. Architettura

```
e2e/
  playwright.config.ts      progetti per profilo e tema, timeout, webServer, reporter
  global-setup.ts           blocco (un solo giro), build riusata se il commit non è cambiato, utente di prova, login una volta
  global-teardown.ts        pulizia dei dati verify-ui-<giro> nell'ordine delle chiavi esterne, chiusura del blocco
  fixtures/                 payload (dati di prova), loggedPage (storageState), consoleWatcher, touch (misura del tocco)
  controlli/                un file per schermata; ogni test ha l'id del controllo del JSON
  reporter/                 scrive risultati.json e rapporto.md nel formato di docs/design/verifica/README.md §7
  smoke/                    la suite di fumo (60 secondi)
  README.md                 comandi
```

**Profili e temi** (progetti di Playwright): `telefono-390` (390×844, `isMobile`, `hasTouch`, scala 3), `notebook-1280`, e `soglia-767` e `soglia-768` per il passaggio schede/tabella; ognuno in chiaro e in scuro con `colorScheme`. WebKit solo nel V6.

**Server**: `webServer` di Playwright avvia `pnpm start` sulla porta 3100 (produzione locale) e **riusa** la build se `.next/BUILD_ID` corrisponde all'hash del codice (git HEAD più file non tracciati e modificati di `app/`, `components/`, `lib/`, `collections/`, `globals/`, `payload.config.ts`, `package.json`). Il server di sviluppo (porta 3200) serve solo ai controlli di console e alle simulazioni di errore.

**Login una volta**: `global-setup` crea l'utente di prova (con `scripts/ui-verify/provision-user.ts`, finché esiste), esegue il login e salva lo stato in `storageState`: nessun test rifà il login.

**Dati di prova** (la parte che ha fatto più danni): vedi §7. In breve, ogni test crea record con nome `verify-ui-<giro>-<worker>-<nome>`, la fixture li cancella in `afterEach` anche se il test fallisce, e `global-teardown` ripulisce comunque tutto il prefisso. Ordine di cancellazione: giorni speciali, menù fissi, categorie dei menù fissi, servizi, piatti e le altre collection. Protezione: `assertDevDatabaseFromEnv()` prima di qualunque scrittura.

**Tipi e build di produzione**: `e2e/` ha un suo `tsconfig.json` ed è **escluso** dal `tsconfig.json` della radice, così un errore nei test non può far fallire `next build` (è già successo con uno script). `pnpm typecheck` esegue anche `tsc --noEmit -p e2e/tsconfig.json`, quindi la regola «prima di ogni commit `typecheck` e `lint` sull'intero repo» copre anche i test. ESLint copre `e2e/`.

**Perimetro dell'agente di verifica**: la regola `.cursor/rules/ui/02-ui-verifica-agente.mdc` oggi gli consente di modificare solo `scripts/ui-verify/**` e lo script `ui:verify`. Il passo T0 la estende a `e2e/**`, agli script `e2e*` di `package.json` e al `tsconfig.json` (solo l'esclusione di `e2e`).

**Dal JSON ai test**: un registro collega ogni id di controllo alla sua funzione; uno script (`pnpm e2e:wire`) verifica che **ogni controllo del JSON abbia un test** o una motivazione di NON PROVATO (come già fa `verify-controlli-wire.mjs`).

**Test che modificano lo stato globale** (per esempio i conteggi della home: «N piatti terminati»): marcati `@esclusivo`, in un progetto a un solo worker, eseguiti per ultimi.

## 4. Regole anti-blocco (obbligatorie, valgono per ogni passo che tocca `e2e/`)

- **R1** Nessuna chiamata sincrona che possa bloccare: vietati `spawnSync`, `execSync`, `execFileSync`, `Atomics.wait`, `readSync` dentro `e2e/` (si controlla con una prova automatica nella suite di fumo). Gli script esterni (`pnpm build`) vivono in `global-setup` con un tempo massimo.
- **R2** Ogni attesa ha un tempo massimo: `timeout` del test 60 s (30 s per cella della matrice), `actionTimeout` 15 s, `navigationTimeout` 30 s, `globalTimeout` 25 min. Vietato `waitForTimeout` come attesa di uno stato (si usano le asserzioni con attesa automatica di `expect`) e vietato `networkidle` come unica condizione.
- **R3** Un test bloccato viene **ucciso e sostituito** dal runner; il giro continua. Un test fallito non ferma mai il giro (`maxFailures` spento tranne che nella suite di fumo).
- **R4** Un'eccezione che non nasce da un'asserzione (selettore non trovato dopo il tempo massimo, `undefined`, dati di prova non creati) è **ERRORE-STRUMENTO**, non FALLITO.
- **R5** Isolamento dei dati: nomi univoci per giro e per worker, creati dalla fixture e cancellati dalla fixture.
- **R6** Un avanzamento leggibile da fuori: il reporter scrive una riga per test in `.next/e2e-progress.log` (formato: ora, progetto, schermata, controllo, esito, secondi) e stampa lo stesso su stdout.
- **R7** Un solo giro alla volta: il blocco rifiuta un secondo avvio mostrando il PID del primo.
- **R8** La suite di fumo (§6, T0) deve passare in meno di 60 secondi dopo **ogni** modifica a `e2e/`.
- **R9** Una sola chat modifica `e2e/` alla volta. Nessuna chat modifica il vecchio lanciatore dopo il passo 20g.
- **R10** Un passo che supera il **doppio** della stima si ferma e riporta: non si estende.

## 5. Classificazione degli esiti

| Esito | Quando | Conta come difetto dell'app |
|---|---|---|
| **OK** | l'asserzione è soddisfatta | no |
| **FALLITO** | il valore misurato e quello atteso sono entrambi definiti e **diversi** | **sì** |
| **AVVISO** | scostamento entro la tolleranza del JSON, o stato non riproducibile | no, ma si legge |
| **NON PROVATO** | motivo scritto nel JSON o dichiarato (stato vuoto con database popolato, rinviato alla 6.5, online nel V6) | no |
| **ERRORE-STRUMENTO** | eccezione fuori da un'asserzione, tempo massimo, fixture non creata | **no**: è un difetto del test, va nel rapporto a parte e si corregge nei test |

Il rapporto riporta i quattro conteggi dell'app e, a parte, gli **ERRORE-STRUMENTO** con l'ultima riga di log e la traccia. **Una chiusura di passo con ERRORE-STRUMENTO non zero non è accettata.**

## 6. Fasi, criteri di accettazione e budget

### T0: spike e scheletro (stima 90 minuti, checkpoint dopo lo spike)

**Spike (15 minuti)**, in questo ordine, con esito GO o NO-GO scritto:
- **Opzione A**: la Local API di Payload dentro un test di Playwright (stesso processo): un test crea un piatto `verify-ui-spike`, lo rilegge con `depth`, lo cancella in `afterEach`; protetto da `assertDevDatabaseFromEnv`; meno di 15 secondi. Possibili ostacoli: alias dei percorsi, ESM/CJS, `server-only`.
- **Opzione B** (se A non va in 15 minuti): le stesse operazioni via **REST** di Payload con un utente di prova di ruolo admin (creato una volta in `global-setup`), usando la richiesta autenticata di Playwright (`request`). Veloce (millisecondi), niente processi, niente daemon, niente client sincrono.
Scelta A, altrimenti B, e si va avanti. **Il vecchio daemon non si riusa.**

**Accettazione di T0** (tutte misurabili):
1. `pnpm e2e:smoke` finisce in **meno di 60 secondi** (con la build riusata) e passa.
2. La suite di fumo prova: login una volta (`storageState`), apertura di `/app`, titolo, voci della barra laterale, **misura del tocco** a 390 px (nessun elemento interattivo sotto 44×44, con l'aiuto di `fixtures/touch`), console pulita, uno screenshot.
3. **Un test volutamente bloccato** (non risolve mai) viene ucciso al tempo massimo e il giro continua: nel rapporto è ERRORE-STRUMENTO «tempo».
4. **Una fixture ripulita dopo un errore**: un test crea `verify-ui-fix-<giro>` e poi lancia un'eccezione; a fine giro i record `verify-ui-` sono **zero**.
5. Il reporter scrive `risultati.json` e `rapporto.md` nel formato del README §7, con ERRORE-STRUMENTO separato, e `.next/e2e-progress.log`.
6. Un secondo avvio mentre uno è attivo viene rifiutato con il PID.
7. Nessuna chiamata sincrona vietata in `e2e/` (prova automatica nella suite di fumo).
8. `pnpm typecheck` e `pnpm lint` sull'**intero repo** passano (la build di Cloud Build controlla anche `e2e/`).
9. Nessuna modifica a `app/`, `components/`, `lib/`, `collections/` e al vecchio lanciatore.

### T1: controlli comuni C1–C3, console e screenshot di tutti gli stati (tre passi: T1a, T1b, T1c; stima 60 minuti l'uno)

T1a: home, navigazione, Piatti. T1b: Vini, Distillati, Bevande. T1c: Servizi, Menù fissi. Per ogni schermata e per **ogni stato** di `stati` e `stati_c1_c2` del JSON, in tutti i progetti: C1 (aspetto e testi), C2 (tocco), C2-mouse, C3 (nessun lampo, cambio di sistema), console pulita, **screenshot** `<schermata>-<stato>-<profilo>-<tema>.png`. La preparazione di uno stato (aprire un foglio, una conferma, un errore simulato) è una funzione del test con **un'asserzione di conferma** (per esempio l'elemento atteso è visibile): se non si può preparare, NON PROVATO con il motivo, mai silenzio.
**Accettazione**: la parte di suite della sua schermata finisce in **meno di 10 minuti** con 4 worker; numero di screenshot uguale all'atteso (calcolato dal JSON); **zero ERRORE-STRUMENTO**; i risultati di C2 coincidono con quelli già noti per Piatti (che servono da taratura: nessun FALLITO nuovo su Piatti).

### T2: i flussi per schermata (T2a Servizi e Menù fissi; T2b cataloghi; T2c Piatti e home; T2d Giorni speciali e Messaggio globale, dopo il passo 24; stima 90 minuti l'uno)

Ogni controllo di tipo `flusso`, `attributi`, `testo`, `misura` e `assenza` del JSON diventa un test che legge `passi` e `atteso` e **fa l'azione dall'interfaccia e poi controlla il database** (persistenza, cascata, registro, permessi, formati, ordine, traduzione inglese). Si portano, come riferimento e non come copia, le logiche già verificate nel vecchio lanciatore (fixture, selettori delle tendine con `items`, attese di animazione).
**Accettazione**: per ogni schermata, zero ERRORE-STRUMENTO, e i controlli noti come corretti (per esempio quelli di Servizi e Menù fissi OK in V4 bis) tornano OK; ogni FALLITO ha valori misurati e attesi leggibili.

### T3: confronto visivo (stima 60 minuti)
Gli screenshot si confrontano con i PNG di `docs/design/schermate/`. Predefinito: lo fa la chat di design (C10), come oggi. Alternativa, da decidere: uno script manda ogni coppia a un modello con una scheda di controllo fissa (struttura, testi, ordine, icone, aree di tocco) e riporta le differenze; richiede una chiave API e non è decisa.

### T4: pensionamento del vecchio lanciatore (stima 60 minuti)
Quando T1 e T2 eguagliano i controlli del vecchio lanciatore: `pnpm ui:verify` diventa un alias di `pnpm e2e`, si rimuove `scripts/ui-verify` (tranne ciò che serve, come `provision-user.ts`), si aggiornano `README.md` e `policy-test.md`.

## 7. Dati di prova: come si evitano i residui

- Nome: `verify-ui-<giro>-w<worker>-<nome>`. Il giro è un identificativo breve creato da `global-setup`.
- La fixture `payload` espone `crea(collection, dati)` e registra ogni record creato; in `afterEach` li cancella in ordine inverso di creazione e, se una cancellazione fallisce per una chiave esterna, ripete dopo aver cancellato i riferimenti.
- `global-teardown` cancella comunque tutti i record con il prefisso del giro (e, a richiesta, `verify-ui-` in generale) nell'ordine: giorni speciali, menù fissi, categorie dei menù fissi, servizi, vini, distillati, bevande, piatti, poi le tassonomie di prova.
- Ogni scrittura passa da `assertDevDatabaseFromEnv()`; i test non girano mai su produzione. I controlli online del V6 sono di sola lettura.

## 8. Definizione di «fatto» per la verifica della 6.6

1. T1 e T2 verdi su tutte le schermate della 6.6, con zero ERRORE-STRUMENTO.
2. Confronto visivo (C10) di tutti gli stati di riferimento, a 390 e 1280 px, in chiaro e scuro, senza P aperti.
3. Console pulita su sviluppo e produzione locale.
4. `verify:menu-6_2`, `6_3` e `6_4` verdi sul database di sviluppo ripristinato.
5. V6 (passo 28): la suite e2e completa più i controlli online senza credenziali, dopo il deploy.
6. L3: sessione reale su Cloud Run e giro su iPhone vero (passo 30).

## 9. Congelamento del vecchio motore

- Dopo il passo 20g (VC-sync) nessuno modifica `scripts/ui-verify` (regola R9), salvo un errore bloccante per la build di produzione.
- I controlli JSON restano modificabili dalla chat di design e valgono per entrambi i motori finché T4 non è chiuso.
- I giri L1 di Composer durante I5 e I6 usano il vecchio `ui:verify` finché T1 non è accettato; da lì, `pnpm e2e` per la sua schermata.

## 10. Come si segue un giro (per te)

- Avanzamento: `tail -f .next/e2e-progress.log`.
- Esito: `docs/design/verifica/esiti/<data>-e2e/rapporto.md` (ERRORE-STRUMENTO in una sezione a parte).
- Rilancio dei soli falliti: `pnpm e2e --last-failed`; un solo controllo: `pnpm e2e --grep "<id-del-controllo>"`.
- Tracce dei test falliti: report HTML di Playwright (`pnpm exec playwright show-report`).
- Se un giro non avanza da più di 90 secondi: è un difetto dello strumento da segnalare nel rapporto; il test bloccato viene comunque ucciso dal tempo massimo.
