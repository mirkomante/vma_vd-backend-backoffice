# Policy dei test dell'Area App

**Stato**: proposta del 2026-10-11, da validare dopo la prima esecuzione corretta del lanciatore e dopo le prime due schermate (sezione 9).

**Principio**: la verifica automatica costa poco e non ferma nessuno; la verifica estesa costa di più e si fa solo quando il raggio d'impatto è largo; l'umano interviene solo dove nessun automatismo arriva. Questa policy integra `core/03-validazione-testing.mdc` e `core/04-changelog-commit.mdc`, non le sostituisce (sezione 8).

## 1. Livelli

| Livello | Quando | Cosa | Chi lo esegue | Durata obiettivo |
|---|---|---|---|---|
| **L0** Validazione di codice | A ogni passaggio, anche piccolo | Rilettura, `pnpm typecheck`, `pnpm lint`, `pnpm ui:check`, test unitari di `lib/` (è il primo livello di `03`) | Agente di implementazione | meno di 2 minuti |
| **L1** Mirato | Fine di ogni passaggio che tocca una schermata o un componente | `pnpm ui:verify --livello 1 --schermata <id>`: solo le schermate toccate, `telefono-390` e `notebook-1280`, temi `chiaro` e `scuro`, solo i controlli di livello 1 (sezione 3) | Agente di implementazione: lancia, non modifica i controlli | 5 minuti |
| **L2** Esteso | Solo ai trigger della sezione 4 | `pnpm ui:verify --livello 2`: tutte le schermate, tutti i profili e i temi, WebKit, tema, guardie, flussi; più i controlli online senza credenziali dopo il deploy; giudizio visivo della chat di design (C10, rilievi P e A) | **Agente di verifica in chat pulita** (indipendente da chi ha scritto il codice) | 30 minuti |
| **L3** Sessione reale | Fine fase e prima del primo uso reale | Controlli con sessione reale su Cloud Run (Esci, Admin, ruoli admin e super-admin, registro attività) fatti dalla chat di design con il browser di Mirko; giro su iPhone vero (tocco, tastiera, campo ora nativo) fatto da Mirko | Chat di design + Mirko | un'ora, di cui 15 minuti di Mirko |
| **S** Smoke post-deploy | Dopo ogni deploy | `pnpm ui:verify online`: i controlli senza credenziali, solo richieste HTTP | Chiunque, anche Mirko | 1 minuto |

Le durate sono **obiettivi**: la durata reale va misurata e scritta nell'intestazione di ogni rapporto (sezione 9).

## 2. Chi fa che cosa, per non bloccare nessuno

- **L0 e L1 non richiedono l'umano**: l'agente di implementazione li esegue da solo e riporta l'esito. Mirko non fa screenshot e non apre pagine.
- **L2 si fa in una chat pulita**: chi ha scritto il codice non è il più adatto a giudicarlo. È una chat dedicata, con la regola `02-ui-verifica-agente.mdc`.
- **L3 si fa una volta per fase**, non ogni sottofase.
- Chi lancia L1 **non cambia mai un controllo** per farlo passare: se il controllo sembra sbagliato lo scrive nel rapporto come «controllo dubbio» e lo passa alla chat di design.

## 3. Quali controlli stanno in L1 e quali solo in L2

Ogni controllo di `controlli-*.json` avrà un campo `livello` (1 o 2). Regola per assegnarlo: **L1 è ciò che una modifica a una singola schermata può rompere**; **L2 è ciò che si rompe solo con modifiche condivise o richiede tutta la matrice**.

| In L1 (schermata toccata) | Solo in L2 |
|---|---|
| `AMBIENTE` (niente indicatore di sviluppo) | Profili `telefono-360`, `soglia-767`, `soglia-768`, `tablet-820` |
| `C1` scorrimento orizzontale (390 e 1280) | Temi `sistema-chiaro` e `sistema-scuro`, `C3-no-lampo`, `C3-cambio-sistema`, persistenza del tema |
| `C2` aree di tocco (390), con menu e fogli aperti | WebKit |
| `C3` classe del tema (chiaro e scuro) | Guardie, uscita, controlli della shell condivisi (sticky, passaggio a 768 px, menu, blocco utente) |
| Testi, attributi, misure e stati della schermata | `CONSOLE` su tutte le pagine in `locale-dev` |
| `CONSOLE` della sola schermata toccata | `C9` completo, controlli online `on1`–`on6` |
| Screenshot di 390 e 1280, chiaro e scuro, della sola schermata | Screenshot di tutte le schermate |

Un L1 su una schermata con tre stati, due profili e due temi sono dodici combinazioni, contro le circa 1760 righe della prima esecuzione completa.

## 4. Trigger del livello 2

Si fa L2 (non L1) quando la modifica ha raggio largo:

| Cosa è cambiato | Perché |
|---|---|
| `components/ui/**`, `components.json`, il tema in `app/(app)/app-ui.css` | Toccano tutte le schermate |
| `app/(app)/layout.tsx`, `components/app/shell/**`, `lib/app/theme.ts` | Shell, tema e script anti-lampo sono di tutte le pagine |
| `lib/auth/**`, endpoint di login e logout, `collections/Users.ts` | Accesso e sessione |
| Aggiornamento di Next, React, Base UI, shadcn, Tailwind o Payload | Comportamenti che cambiano senza che il codice cambi |
| Primo esemplare di un **tipo** di schermata (primo elenco, primo modulo, primo foglio) | Si prova il tipo, poi basta L1 sulle schermate dello stesso tipo |
| Chiusura di una fase del piano | Punto di controllo |
| Prima del primo uso reale | Punto di controllo |
| Correzione di un bug trovato in produzione | Prima si aggiunge il controllo che l'avrebbe preso, poi si corregge |

Una modifica solo a documenti non attiva nessun livello oltre L0. Una modifica solo al backend (`collections/**`, hook, `lib/**` non UI) attiva L0 e gli script `verify-*.ts` esistenti, non L1.

**Un esito L2 resta valido** finché non cambia un file del raggio largo: il rapporto riporta il commit, e se dall'ultimo L2 nessun file della tabella è cambiato non si ripete.

## 5. Quando un controllo fallisce

| Esito | Effetto |
|---|---|
| **FALLITO** su un controllo di livello 1 | Blocca la chiusura del passaggio. Si corregge e si rilanciano **solo i controlli falliti** (massimo due giri; al terzo si ferma e si chiama la chat di design) |
| **FALLITO** in L2 | Rilievo **P** (decide la chat di design): blocca la fase successiva |
| **AVVISO** | Non blocca; si registra come rilievo **A** |
| **NON PROVATO** | Non blocca ma va nei debiti della fase, con scritto in quale livello verrà provato |
| Controllo dubbio | Lo risolve la chat di design, non chi esegue |

## 6. Chi scrive i controlli

La chat di design scrive i controlli **insieme alla specifica** di ogni schermata (specifica, mockup e controlli sono un unico pacchetto). Una schermata senza i suoi controlli non si implementa: Composer si ferma e chiede, come per un componente mancante. Così Composer sa in anticipo come verrà misurato.

## 7. Cosa la policy non fa

- Nessun confronto pixel per pixel e nessun giudizio estetico automatico: l'aspetto lo giudica la chat di design guardando gli screenshot.
- Nessun test con credenziali di produzione e nessun utente di prova su Cloud SQL.
- Nessun L2 o L3 «per scrupolo»: ogni esecuzione estesa deve avere un trigger della sezione 4.

## 8. Integrazione con le regole esistenti

- **`03-validazione-testing.mdc`**: L0 è la sua «validazione di codice»; il «test in ambiente dev con l'umano» per la **UI** viene sostituito da L1 e L2. *Proposta di modifica a una regola validata: serve la conferma di Mirko prima di scriverla.* Per le funzioni non UI resta com'è.
- **`04-changelog-commit.mdc`**: la voce `Tests` del CHANGELOG riporta il livello eseguito, il percorso del rapporto, gli esiti negativi e i NON PROVATO.
- **`00-come-eseguire-il-piano.md`**: una chat per sottofase e un commit per sottofase restano; L1 si fa dentro la chat di sottofase prima del commit, L2 in una chat pulita a parte.
- **`01-ui-app-invarianti.mdc`** (passi 5 e 6, oggi «`pnpm ui:check` e consegnare gli screenshot»): diventano «`pnpm ui:check` e L1 sulla schermata; gli screenshot li produce il lanciatore».

## 9. Messa in opera (in quest'ordine)

1. Chiudere la prima esecuzione corretta (Cursor la sta correggendo).
2. Aggiungere al lanciatore `--livello`, `--schermata`, `--profili`, `--temi` e la **durata** nell'intestazione del rapporto; aggiungere `livello` ai controlli (`controlli-8.2.json` v3).
3. Misurare le durate reali di L1 e L2 e fissare i budget della sezione 1 su quelle misure.
4. Aggiornare `01` (passi 5 e 6); proporre a Mirko la modifica a `03`.
5. Validare la policy dopo le prime due schermate nuove (Orari e il primo elenco), e solo allora segnare lo stato «validato».

## 10. Punti aperti

- **Automazione in Cloud Build** (L0 e S a ogni push): non ho visto la configurazione di Cloud Build, quindi non so se sia fattibile senza appesantire il deploy. Da valutare dopo il passo 3.
- La tabella dei trigger (sezione 4) è provvisoria: si rivede dopo la prima fase completa.
