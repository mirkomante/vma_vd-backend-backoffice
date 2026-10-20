# Policy dei test dell'Area App (versione 2)

**Stato**: **approvata** da Mirko con il commit che la introduce (2026-10-20). Sostituisce la versione 1 (in vigore, provvisoria, dal 2026-10-11). La **numerazione delle sezioni 2, 4, 5, 6, 7 e 9 è quella della v1**: il piano, il CHANGELOG e le decisioni la citano una trentina di volte (per esempio «policy-test §5: un FALLITO è un rilievo P»), e la v2 non deve far puntare quei riferimenti a un altro testo. Regola operativa per chi implementa: `.cursor/rules/ui/03-ui-test-policy.mdc`. Controlli statici: `scripts/ui-check.mjs` (R11–R14, sezione 10).

## 0. Principio guida

**Il rigore di un test è proporzionato a quanto costa l'errore che previene e a come l'app viene usata.** Il costo del test (tempo dell'agente, manutenzione dello strumento) non supera mai il valore di ciò che protegge.

**Profilo dell'applicazione**: backoffice interno, usato da telefono (390 px) e da notebook (1280 px), con i ruoli admin e super-admin. Quello che si salva alimenta il menù pubblicato sul sito.

| Cosa può andare storto | Costo dell'errore | Rigore del test |
|---|---|---|
| Dati persi o corrotti, cancellazioni a cascata, permessi, pubblicazione sul sito | **Alto** | Prova di funzionamento: azione dall'interfaccia, poi controllo del database. **Sta nel nucleo di L1** (sezione 3), non solo in L2 |
| Flusso che non si completa, console con errori, tocco o scorrimento rotti | **Medio** | Nucleo di L1 su ogni schermata |
| Differenze estetiche dalla demo | **Basso** a livello di singolo difetto, **alto in somma**: nel confronto del 2026-10-20, su cinque schermate, P1–P7 più P8 (ex A6) e A1–A12 (di cui A6 diventato P8 e A8 chiuso in 21b) | Confronto visivo con la demo a ogni schermata (L1v), non a fine fase |
| Prestazioni, browser rari, schermi insoliti | **Basso** | Solo in L2 e solo a trigger |

## 1. Livelli e budget

I budget sono un **contratto**: chi li supera si ferma e semplifica, non allunga.

| Livello | Quando | Cosa | Chi | Budget |
|---|---|---|---|---|
| **L0** | A ogni passaggio | Rilettura, `pnpm typecheck`, `pnpm lint`, `pnpm ui:check` (include R11–R14), test unitari di `lib/` | Agente di implementazione | 2 min |
| **L1** | Fine di **ogni** passo che tocca una schermata | Il **nucleo** della schermata (sezione 3) a 390 e 1280, tema chiaro | Agente di implementazione | 3 min |
| **L1v** | Subito dopo L1, per le schermate nuove o cambiate nel layout | Confronto visivo con la demo (sezione 3.1) | Agente di verifica, chat pulita | 10 min per schermata |
| **L2** | Solo ai trigger della sezione 4 | Tutti i controlli, tutti i profili e i temi | Agente di verifica, chat pulita | 15 min |
| **L3** | Fine fase e prima del primo uso reale | Sessione reale su Cloud Run, iPhone vero | Chat di design e Mirko | 1 ora |
| **S** | Dopo ogni deploy | `pnpm ui:verify online`: solo richieste HTTP | Chiunque | 1 min |

**L1 non si vieta mai nei prompt di implementazione** (è successo con F4: la regressione di P8 è nata così).

## 2. Chi fa che cosa, per non bloccare nessuno

- **L0 e L1 non richiedono l'umano**: li esegue l'agente di implementazione e riporta l'esito. Mirko non fa screenshot e non apre pagine.
- **L1 è obbligatorio a fine passo e il prompt non lo vieta mai.** Se un controllo del nucleo non è implementato nel motore, L1 non è eseguibile **per quel controllo**: l'agente lo dichiara NON PROVATO, il passo non si marca ✅ ma 🔶 (sezione 6), e **non si fa mai una prova manuale al suo posto né chiesta all'umano**.
- **L1v e L2 si fanno in una chat pulita**, con `02-ui-verifica-agente.mdc`: chi ha scritto il codice non è il più adatto a giudicarlo.
- **L3 si fa una volta per fase**, non ogni sottofase.
- Chi lancia L1 **non cambia mai un controllo** per farlo passare: se sembra sbagliato lo scrive come «controllo dubbio» e lo passa alla chat di design.
- **Il git lo fa Mirko.** Un'eccezione (push di Composer) vale solo se il prompt del passo la scrive e solo per quel passo; nel passo 24 ha funzionato, ma tre scostamenti dalla specifica e 15 file riscritti dal lanciatore sono arrivati su `main` prima del controllo della chat di design.

## 3. Il nucleo di L1 e il resto in L2

L1 è ciò che una modifica a **una sola schermata** può rompere e che costa molto se si rompe. Ogni schermata ha un **nucleo** di al massimo **otto controlli propri** (campo `livello: 1` in `controlli-6.6.json`); tutto il resto sta in L2. Il tetto è controllato da `pnpm ui:check` (R14).

**Gli otto posti del nucleo**, in quest'ordine di priorità:

| # | Posto | Perché | Dove sta il controllo |
|---|---|---|---|
| 1 | Testi chiave della schermata | Titolo, azioni, etichette | `<schermata>-testi` |
| 2 | Console senza errori né avvisi (sviluppo) | Regressioni di Base UI e React | `<schermata>-console` |
| 3 | Errore visibile e comprensibile | Validazione del modulo, o l'errore tipico della schermata | `-modulo-validazione`; per Messaggio globale `-file-non-leggibile` |
| 4 | Azione principale e persistenza | L'azione riesce dall'interfaccia e il dato è nel database | `-persistenza` o `-salvataggio` |
| 5 | Nomi accessibili in italiano | Testi ed etichette per lo screen reader | `-nomi-accessibili` |
| 6 | Cancellazione | Dati persi, cascata, blocco se in uso | `-elimina`, `-elimina-usato`, `-togli` |
| 7 | Permessi e registro della cancellazione | Chi può farlo e che resti traccia | `-elimina-registro-permessi`, `-permessi` |
| 8 | Ciò che cambia il menù pubblico | Interruttore «Disponibile», «Attivo», «Terminato», o il file che riceve il messaggio | `-disponibilita`, `-attivazione`, `-terminato`, `-file-riceve-messaggio` |

Per Giorni speciali il posto 8 è l'interruttore «Attivo» e il posto 3 la **sovrapposizione** (la regola che, se sbagliata, pubblica due menù per lo stesso servizio) più la validazione del modulo. Home e navigazione hanno meno di otto controlli e restano interamente in L1.

**Fuori dal tetto**: i controlli di tipo `comando` (unitari o statici: costano secondi) e i controlli **comuni**, che si applicano agli stati del nucleo: `C1` (nessuno scorrimento orizzontale), `C2` (aree di tocco di almeno 44 px a 390 px, con fogli e menu aperti), `C3` (classe del tema, una volta in chiaro e una in scuro), `CONSOLE`, `AMBIENTE`, `NO-OVERRIDE`.

**Cosa non sta nel nucleo, e perché**
- **Lo stato vuoto**: con il database di sviluppo popolato non si può riprodurre, e infatti tutti i controlli `*-stato-vuoto` hanno `stato_prova` e restano NON PROVATI. Un controllo che non può mai essere provato non sta in L1 (R14). Lo stato si giudica in L1v con il PNG.
- **Lo screenshot**: è un prodotto di L1v, non un controllo.
- **Gli stati simulati** (caricamento, errore di caricamento, errore dell'azione): sezione 7.
- **Il tema scuro su ogni stato**: una volta sullo stato principale (`C3`).

**Dato di fatto, corretto il 2026-10-20**: L1 contava 189 dei 231 controlli delle schermate (da 4 per Home a 27 per Menù fissi; con i 12 comuni, 198 su 243): l'etichetta «livello 1» si era allargata fino a coprire quasi tutto. Con il nucleo diventano **76** (8 per ciascuna delle otto schermate di catalogo e di sezione, più 2 controlli `comando` di Giorni speciali e Messaggio globale, più Home 4 e Navigazione 6, compreso un `comando`). I controlli che cambiano livello sono 113; nessun'altra proprietà dei controlli è cambiata.

**Che cosa il nucleo non prende** (lo dice l'esperienza, non la speranza): i difetti di **specifica** di dettaglio, come il focus sul primo campo non valido o l'ordine delle etichette, non stanno in otto controlli. Li prendono L1v (confronto con la demo), L2 e la revisione del codice contro la specifica. Nel passo 24 la revisione del codice ha trovato tre difetti che L0 non vedeva: due sarebbero stati presi dal nucleo (`file-non-leggibile`, `sovrapposizione`), uno (il focus sui menù fissi) no.

### 3.1 Confronto visivo con la demo (L1v)

Il confronto del 2026-10-20 ha trovato 7 rilievi P in un'ora; i giri automatici precedenti, circa 8 difetti veri su circa 70 FALLITO (percorso-test-v2 §1). Va fatto **a ogni schermata**, non alla fine.

- L'agente di verifica prende gli screenshot di 390 e 1280 chiaro degli stati principali e li confronta con i PNG di riferimento in `docs/design/schermate/<schermata>/`.
- Produce una **tabella di differenze** (cosa, dove, gravità proposta P o A). Non giudica l'estetica in astratto.
- La chat di design **classifica** la tabella (P o A); non rilegge tutti gli screenshot.
- *Da provare una volta*: che l'agente di verifica di Cursor legga bene le immagini. Se non basta, il confronto resta alla chat di design, ma sempre a schermata e mai a fine fase.

## 4. Trigger del livello 2

Si fa L2 (non L1) quando la modifica ha raggio largo: `components/ui/**`, `components.json`, il tema in `app/(app)/app-ui.css`, `app/(app)/layout.tsx`, `components/app/shell/**`, `lib/app/theme.ts`, `lib/auth/**`, login e logout, `collections/Users.ts`, aggiornamento di Next, React, Base UI, shadcn, Tailwind o Payload, primo esemplare di un **tipo** di schermata, chiusura di fase, primo uso reale, bug trovato in produzione (prima si aggiunge il controllo che l'avrebbe preso).

Una modifica solo a documenti non attiva nulla oltre L0. Una modifica solo al backend (`collections/**`, hook, `lib/**` non UI) attiva L0 e gli script `verify-*.ts`, non L1.

**Un esito L2 resta valido** finché non cambia un file del raggio largo: il rapporto riporta il commit, e se dall'ultimo L2 nessun file della lista è cambiato non si ripete. **Nessun L2 o L3 «per scrupolo».**

## 5. Esiti e classificazione

| Esito | Effetto |
|---|---|
| **FALLITO** di un controllo del nucleo di L1 | Blocca il passo. Si rilanciano **solo i controlli falliti**, al massimo due giri; al terzo si ferma e si chiama la chat di design |
| **FALLITO** in L2 | Rilievo **P**, blocca la fase successiva |
| **AVVISO** | Non blocca; si registra come rilievo **A** |
| **ERRORE-STRUMENTO** su un controllo del **nucleo** | Non è un difetto dell'app, ma **il controllo non è stato eseguito**: il passo non si accetta (percorso-test-v2 §5) e il controllo passa a NON PROVATO con scadenza |
| **ERRORE-STRUMENTO** fuori dal nucleo | Non entra nei conteggi dei difetti; si registra come debito dello strumento con la scadenza della sezione 6 |
| **NON PROVATO** | Va nei debiti con il livello e il passo in cui si salda (sezione 6) |

**Un rilievo è P** se vale **uno** di questi casi: impedisce di usare la schermata, di salvare o rischia di perdere o corrompere dati; riguarda permessi o pubblicazione sul sito; è un FALLITO di `C1`, `C2` o console; è una differenza dalla specifica nella schermata principale. **Altrimenti è A.** La classificazione non cambia per chiudere un passo: chi la modifica scrive il motivo. Un controllo dubbio lo risolve la chat di design, non chi esegue.

## 6. Chi scrive i controlli, in che ordine, e il debito di verifica

La chat di design scrive i controlli **insieme alla specifica** di ogni schermata. Una schermata senza i suoi controlli non si implementa: Composer si ferma e chiede, come per un componente mancante.

**Ordine per ogni schermata nuova** (dal 2026-10-11): (1) specifica, mockup e `controlli-<fase>.json`; (2) l'**agente di verifica implementa i controlli del nucleo nel motore, prima** che parta la chat di implementazione; (3) la chat di implementazione fa L0 e L1 con i controlli già pronti; (4) se la schermata attiva un trigger, L2 in chat pulita. Se i controlli non sono pronti, **si ferma l'implementazione**, non si rinuncia a L1.

**Il debito ha una scadenza.** Un passo che tocca una schermata e non ha eseguito L1 **non si marca ✅**: si marca **🔶 implementato, non verificato**. Il debito si salda **entro i due passi successivi della tabella del piano**. **V6 non è il posto dove si accumulano i debiti**: è la verifica di fase e riceve solo ciò che è L2 (stati simulati, matrice completa, WebKit, online).

**Debiti aperti all'approvazione (2026-10-20)**

| Origine | Debito | Scadenza (due passi) | Stato |
|---|---|---|---|
| 21c | Nove flussi di Menù fissi dopo F4: **mai partiti**; il primo (`menu-fissi-elimina-senza-uso`) va in timeout, causa non determinata | **Scaduta**: dopo il 21c sono chiusi 22, 24 e 24b | Proposta: passo 24d, solo i nove flussi con il vecchio lanciatore (`--solo`), un giro, tetto 30 minuti; un flusso in timeout diventa ERRORE-STRUMENTO e gli altri proseguono. **Decide Mirko** |
| 24, 24b | Giorni speciali e Messaggio globale: nucleo non eseguito (51 controlli delle due schermate NON PROVATI; comportamento nel browser mai provato) | Passo **24c** (il successivo) | Scheda del 24c: nucleo in Playwright, tetto 60 minuti, un giro |
| 20 | Tre stati simulati per schermata, bulk da 101, sette screenshot mancanti, confronto visivo a 1280 px | V6 | Sono L2 (sezione 7): non sono debito di L1 |

Se, nonostante questo, un controllo non è implementato quando l'implementazione finisce, **L1 non è eseguibile da chi implementa per quel controllo**: lo dichiara, il passo è 🔶 e il controllo passa all'agente di verifica (debito con scadenza, tabella sopra). **Mai** una prova manuale chiesta all'umano al suo posto: l'umano interviene solo per L3 e per le decisioni.

## 7. Cosa non si fa e cosa si prova a runtime

- **A runtime** si provano i flussi che toccano dati, permessi e pubblicazione (costo alto).
- **Stati simulati** (caricamento, errore di caricamento, errore dell'azione): **una volta per tipo di schermata** o con un test sul componente; non si ripetono su ogni schermata. Stanno in L2 (V6).
- **Mai**: confronto pixel per pixel, giudizio estetico automatico, test con credenziali di produzione, utenti di prova su Cloud SQL, prove manuali chieste all'umano al posto di un controllo, L2 o L3 «per scrupolo».

## 8. Integrazione con le regole esistenti

- **`core/03-validazione-testing.mdc`**: L0 è la sua «validazione di codice»; per la UI dell'Area App il test in ambiente dev con l'umano è sostituito da L1 e L2 (paragrafo di rinvio già presente).
- **`core/04-changelog-commit.mdc`**: la voce `Tests` del CHANGELOG riporta il livello eseguito, il percorso del rapporto, ogni FALLITO e ogni NON PROVATO.
- **`ui/01-ui-app-invarianti.mdc`**: elenca R11–R14 (sezione 10). **`ui/03-ui-test-policy.mdc`**: versione operativa di questa policy.
- **`00-come-eseguire-il-piano.md`**: una chat per sottofase e un commit per sottofase restano.

## 9. Messa in opera e strumento

**Stato del motore, misurato il 2026-10-20**
- **Playwright** (`e2e/`, `pnpm e2e`) implementa oggi: la matrice `C1`, `C2`, `C2-mouse`, `C3`, `C3-no-lampo` e `C3-cambio-sistema` per Servizi e Menù fissi, gli screenshot dei cataloghi, la suite di fumo. **Non implementa nessun controllo di flusso** (persistenza, cancellazione, validazione, permessi) **né la console**, e il suo registro `e2e/controlli/wire-registry.json` ha `tests: []`: `pnpm e2e:wire` passa solo perché ogni id è NON PROVATO per default. Il cablaggio oggi non prova nulla.
- Il **vecchio lanciatore** (`scripts/ui-verify`, congelato) è l'unico posto dove i flussi esistono.

**Regole**
- **Controlli nuovi: solo in Playwright**, con un commento `// control:<id>` nel test e il titolo che termina con `[profilo-tema]`. Il lanciatore non riceve controlli nuovi.
- **Controlli esistenti solo nel lanciatore**: si lanciano con quello (`--solo`), una volta, dopo la pulizia di `§2.1` del piano, e **alla fine si esegue `git checkout -- docs/design/verifica/esiti`** (il lanciatore riscrive gli esiti anche quando muore: R13 lo segnala). Se si blocca: ERRORE-STRUMENTO, **mai rilanciarlo**. Il nucleo di una schermata passa in Playwright **quando la schermata è la prossima toccata** (24c per le due nuove), non con un passo dedicato allo strumento.
- **Dimensione**: `e2e/` conta **3.053 righe** (2.691 di motore e 362 di spec dei controlli e di fumo; la v2 stimava «circa 2.200»). Il limite di 3.000 vale sul **motore** (`e2e` senza `controlli/` e `smoke/`): **margine 309 righe**. Oltre si ferma tutto e si decide se semplificare. I passi di verifica aggiungono spec, non motore.
- **Esiti**: ogni giro in una **cartella sua** (`E2E_ESITI=<data>-<nome>`); `risultati.json` non si sovrascrive mai. Attenzione: senza `E2E_ESITI` il motore scrive in `esiti/2026-10-19-T0/`, cioè sopra un esito esistente: ogni comando di L1 lo imposta, e R13 segnala la violazione.
- **Due tentativi**: se lo strumento fallisce due volte per cause diverse, si rivede il disegno prima del terzo prompt. Un passo, un obiettivo: sviluppo dello strumento e giri lunghi non stanno nella stessa chat. Una sola chat modifica `e2e/` alla volta (R9 del percorso v2).

**Messa in opera**
1. ~~Prima esecuzione corretta~~ Fatto (2026-10-11).
2. ~~Regola operativa e aggiornamento di `01` e `03`~~ Fatto; la v2 aggiorna `03` e aggiunge R11–R14 a `01`.
3. ~~Flag del lanciatore~~ Fatto (2026-10-16).
4. ~~Dopo le prime due schermate nuove: ricalibrare e segnare «validata»~~ **Validata con la v2** (2026-10-20).
5. Il 24c porta in Playwright il nucleo di Giorni speciali e Messaggio globale: primo esemplare di controlli di flusso nel motore.

## 10. Un difetto trovato due volte diventa un controllo che costa zero

Quando una classe di difetto compare per la seconda volta, si aggiunge **un controllo statico o unitario**, non un test di interfaccia.

| Classe | Dove è comparsa | Controllo |
|---|---|---|
| `Select` senza `items` (il trigger mostra «all») | A8: Vini, Distillati, Bevande. **La regola non era scritta da nessuna parte** (la v2 la dava per scritta) | **R11** in `ui:check` + regola in `01` |
| Schermate che leggono o scrivono con `overrideAccess: true` | Controllo `NO-OVERRIDE`, fatto a mano ad ogni passo (anche nella revisione del passo 24) | **R12** in `ui:check` (stesso perimetro: `app/(app)`, `components/app`, `lib/app`, `lib/menu/ui`) |
| Esiti versionati riscritti | Giri del lanciatore: T1e (risultati sovrascritti da ogni giro successivo) e passo 24 (15 file riscritti) | **R13** in `ui:check` (`git status` su `docs/design/verifica/esiti`; file nuovi ammessi) |
| Nucleo di L1 che si allarga di nuovo | I 189 controlli di livello 1 | **R14** in `ui:check` (livello 1 o 2, al più otto per schermata esclusi i `comando`, nessun `stato_prova` in L1) |
| Area di tocco sotto 44 px | P8 | `C2` comune e i marcatori D6 già in `ui:check` |
| `pluralizeIt` che duplicava il numero | P6 | Test unitario in `lib/` (già fatto) |

Ogni controllo è stato provato su casi negativi costruiti apposta (e R14 dà 8 violazioni sul file dei controlli di prima della riassegnazione).

## 11. Accettazione di un passo di verifica

Al massimo **tre criteri, tutti sul risultato per l'app**: (a) i controlli richiesti hanno un **esito misurato** (OK, FALLITO o AVVISO) oppure un NON PROVATO con motivo e scadenza; (b) **zero ERRORE-STRUMENTO sul nucleo**; (c) ambiente pulito (porte, record `verify-ui-`, nessun file di esito versionato modificato). I FALLITO dell'app **non sono un motivo per rifiutare il passo di verifica**: sono il suo risultato, vanno classificati P o A e non si modificano controlli né app per farli sparire. Tempo e perfezione dello strumento sono **obiettivi**, non motivi di rifiuto. Un passo che supera il doppio della stima (R10) si ferma e riporta.

## 12. Punti aperti

- **Automazione in Cloud Build** (L0 e S a ogni push): la configurazione non è stata esaminata; da valutare dopo il 24c. Ogni push su `main` avvia già la build e il deploy.
- **L1v**: da provare una volta che l'agente di verifica di Cursor legga bene gli screenshot.
- **Debito 21c** (nove flussi di Menù fissi): decisione sul passo 24d (sezione 6).
- **Cablaggio `e2e:wire`**: oggi vuoto. Dal 24c ogni test porta `// control:<id>`; resta da decidere, dopo il 24c, se `wire` debba fallire per un controllo del nucleo senza test.

## Appendice: come si riproducono le cifre

- Livelli: `python3 -c` sul JSON, conteggio di `livello` per schermata (prima 189 di 231; dopo 76).
- Righe di `e2e/`: `find e2e -type f \( -name '*.ts' -o -name '*.mjs' \) -not -path '*/node_modules/*' | xargs cat | wc -l` (3.053); `controlli/` e `smoke/` 362.
- Rilievi del confronto del 2026-10-20: `docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md` §2.2 e §2.3 (P1–P8, A1–A12).
- Debito del 21c e del 24: esiti nelle schede 21c e 24 dello stesso file.
