# Esecuzione della 6.6: ordine completo, prompt e controlli

**Stato**: approvato da Mirko il 2026-10-16. Riscritto il 2026-10-17 con **una scheda per ogni passo della tabella**: ogni passo ha il suo prompt (o le sue istruzioni, se tocca a te o alla chat di design) e la riga «Incolla in Cursor» che dice con cosa si abbina. La regola di lavoro resta quella di `00-come-eseguire-il-piano.md`; i controlli sono quelli di `docs/design/verifica/policy-test.md` (L0, L1, L2, L3, S).

---

## 1. Come si usa questo documento

### 1.1 Cosa incolli in Cursor: una regola sola

| Tipo di passo | Passi | Cosa incolli in Cursor |
|---|---|---|
| **Implementazione** (Composer scrive codice) | 4, 5, 7, 11, 16, 19, 24, 26 | **Blocco comune (§3) + prompt del passo**, nello stesso primo messaggio, in quest'ordine |
| **Import di produzione** | 31 | Blocco comune + prompt del passo 31 (che sostituisce la regola 6 del Blocco comune) |
| **Revisione di regola** | 1 | Solo il prompt del passo (nessun Blocco comune) |
| **Agente di verifica** (implementa i controlli: VC; esegue L2: V) | 3, 8, 13, 15, 18, 20, 23, 28 | Solo il prompt del passo (ha già le sue regole; **non** il Blocco comune) |
| **Correzione dei rilievi P** (F) | 10, 14, 21, 29 | Solo il prompt del passo (è autonomo), e solo se ci sono rilievi P |
| **Design, rilievi, tuoi** (D, RL, M) | 2, 6, 9, 12, 17, 22, 25, 27, 30 | Niente in Cursor: istruzioni nella scheda del passo |

Ogni scheda del §4 comincia con la riga **«Incolla in Cursor»** con la combinazione giusta, e dentro il prompt la prima riga dice «PASSO N …» e, per le chat di implementazione, che segue il Blocco comune. Ogni chat di Cursor è **nuova**: non riusare chat di passi precedenti.

### 1.2 Il ciclo di un passo con Cursor

- **Chat di implementazione e di correzione (I, F)**: incolli → Cursor risponde con la **Parte A** (solo una proposta: file, ambiguità, verifiche) e si ferma → **la incolli qui** → io ti rispondo con le correzioni e il «procedi» → incolli la mia risposta in Cursor → Cursor implementa, verifica e chiude con la tabella «Esiti reali» e un commit locale → **incolli qui la risposta finale**, fai il push e scrivi «push fatto» → io controllo il repo e aggiorno lo stato.
- **Agente di verifica e revisione (VC, V, R0)**: incolli → Cursor lavora e non fa git → **incolli qui il suo resoconto finale** → tu fai il commit del suo lavoro (messaggio indicato nella scheda) e il push, e scrivi «push fatto» → io controllo e aggiorno lo stato.
- **Passi tuoi e della chat di design (D, RL, M)**: la scheda dice cosa fai.

### 1.3 Dove si segna lo stato, e chi lo aggiorna

Lo stato sta in **un solo posto**: la colonna **Stato** della tabella (§2). Valori: 🔲 da fare; 🔶 fatto da Composer, da controllare; ✅ controllato dalla chat di design, con l'hash del commit. Le schede del §4 non hanno una propria riga di stato.

**Come si aggiorna** (due momenti, e li fa Composer con un prompt: non devi modificare il file a mano):
1. **Alla fine della sua chat** (passi I e F), nello stesso commit finale, Composer segna la **propria riga** 🔶: solo quella, non ✅, non la riga «Ultimo aggiornamento». È già scritto nel Blocco comune (regola 7) e nei prompt F.
2. **Dopo il tuo «push fatto» e il mio controllo del repo** (hash, file cambiati, esiti reali, `ui:check`) ti do un **prompt di aggiornamento stato**, già compilato, da incollare nella stessa chat di Composer (o in una chat nuova di Composer, per i passi dell'agente di verifica, che non possono modificare questo file). Segna ✅ con l'hash, aggiorna «Ultimo aggiornamento» e «Prossimi passi», fa un commit locale; tu fai il push. Un passo è ✅ solo quando il mio controllo è passato, **non quando Cursor finisce**.

Per i passi D, RL e M l'aggiornamento lo preparo io con lo stesso prompt (o con lo zip, se ci sono altre modifiche).

**Modello del prompt di aggiornamento stato** (lo compilo io; i campi `<…>` sono quelli che cambiano):

```text
Aggiornamento stato del piano (nessuna implementazione). Modifica solo
docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md:
1. Nella tabella del §2, riga del passo <N>: colonna Stato → «✅ <HASH>».
2. Sotto la tabella, riga «Ultimo aggiornamento»: «<DATA> (commit `<HASH ULTIMO COMMIT>`).
   Prossimi passi: <PASSI>.»
Non cambiare nient'altro. Commit locale con messaggio «docs(piano): 6.6 — passo <N> (<SIGLA>) completato,
aggiornamento dello stato». Niente push. Rispondi con il diff in una riga.
```

Gli altri due posti restano come sono: il CHANGELOG (storia di ogni chat, scritta da Composer) e la checklist di chiusura di 6.6 in `fase-6-menu-digitale.md` (cosa è stato consegnato, spuntata da Composer).

### 1.4 Decisioni già confermate

1. **«Ricompila il menù pubblico» nascosto** dietro una bandiera spenta durante tutta la 6.6: la 6.5 viene dopo la 6.6 e dopo la 6.9. I controlli sul pulsante sono NON PROVATI con l'evidenza «rinviato alla 6.5» (gli esiti ammessi restano OK, FALLITO, AVVISO, NON PROVATO). Assunzione ancora da confermare: gli avvisi di salvataggio e di eliminazione non nominano il pulsante e hanno solo il titolo (`integrazione/spec.md` §5).
2. **Un solo file dei controlli**, `controlli-6.6.json`, a cui aggiungo le schermate man mano; nei comandi si indica sempre `--controlli`, perché il lanciatore senza l'opzione prende l'ultimo file in ordine alfabetico.
3. **Ordine dei controlli** (`policy-test.md` §6): prima i controlli (D), poi l'agente li implementa nel lanciatore (VC), poi la chat di implementazione (I) con L1, poi se c'è un trigger l'agente esegue L2 (V).
4. **Riga di registro** (`area`, `detail`): la propone Composer nella Parte A del passo 4. **Import di produzione**: sessione a sé, passo 31.
5. **Controlli in debito** (deciso il 2026-10-17 dopo VC1, in linea con `policy-test.md` §6, ultimo capoverso): l'agente VC implementa tutto ciò che si può fare **senza la schermata** (id, tipi, lettura degli attesi da `lib/`, dati di prova, controlli sulle schermate già esistenti) ed elenca nel rapporto i flussi che richiedono la schermata come «debito». La chat di implementazione dichiara quei controlli NON PROVATI (non è un blocco). L'agente V successivo li **completa e li esegue** nello stesso passo (modifica solo `scripts/ui-verify/**`, mai i controlli JSON); i difetti che emergono sono rilievi P e A come gli altri.

---

## 2. Tabella unica: l'ordine completo

Sigle: **R** revisione di regola; **I** implementazione (Composer); **VC** l'agente di verifica implementa i controlli nel lanciatore (chat pulita, prima della chat I); **V** l'agente esegue L2 (chat pulita); **D** controlli scritti dalla chat di design; **RL** rilievi P e A della chat di design dopo un V; **F** correzione dei P (Composer); **M** passo tuo.

| # | Stato | Incolla in Cursor | Sigla | Chi | Cosa | Controlli | Si passa al successivo quando |
|---|---|---|---|---|---|---|---|
| 1 | ✅ e9867a5 | Solo il prompt del passo 1 | R0 | Composer (chat breve) | Revisione di asse di `.cursor/rules/ui/01-ui-app-invarianti.mdc` contro `02` e `03` | revisione, nessun codice | nessuna contraddizione, o corretta |
| 2 | ✅ 6a77311 | — | D1 | Design | `controlli-6.6.json` con shell, home, navigazione e Piatti; aggiorno `controlli-8.2.json` per le otto voci | — | tu committi e pushi i file |
| 3 | ✅ 2db0723 | Solo il prompt del passo 3 | VC1 | Agente di verifica | Implementa nel lanciatore i controlli di D1 | lint e typecheck; i controlli si caricano e le pagine assenti danno NON PROVATO | tu committi e pushi |
| 4 | ✅ 23b934f | Blocco comune + prompt del passo 4 | I0a | Composer | Permessi di cancellazione, registro, matrici | L0 + `verify:menu-6_2`, `6_3`, `6_4`, `availability-final-proofs` | tabella degli esiti senza FALLITO; tu pushi |
| 5 | ✅ 91526bd | Blocco comune + prompt del passo 5 | I0b | Composer | Formati dei campi e import | L0 + test unitari + `verify:menu-6_2` + idempotenza dell'import | idem |
| 6 | ✅ 91526bd (report a secco fatto da Composer) | — (comando nel terminale) | M1 | Tu | Report a secco esteso sullo snapshot e mi mandi le forme di anno, grado, invecchiamento | — | non blocca; prima del passo 31 |
| 7 | ✅ b3c9fb4 | Blocco comune + prompt del passo 7 | I1 | Composer | Fondamenta UI e integrazione | L0 + **L1** `shell,home` | L1 verde; tu pushi |
| 8 | ✅ 3c3b777 | Solo il prompt del passo 8 | V1 | Agente di verifica | **L2** su shell, home, navigazione | **L2** | rapporto scritto; tu committi |
| 9 | ✅ 3c3b777 (nessun P) | — | RL1 | Design | Leggo il rapporto: rilievi P e A | — | nessun P aperto |
| 10 | — non necessario (nessun P) | Solo il prompt del passo 10, se ci sono P | F1 | Composer | Correzione dei P di V1, solo se ce ne sono | L0 + L1 dei soli controlli falliti | P chiusi |
| 11 | ✅ f4ffb96 | Blocco comune + prompt del passo 11 | I2 | Composer | **Piatti** | L0 + **L1** `piatti` | L1 verde; tu pushi |
| 12 | ✅ 6507cde | — | D3 | Design | Controlli per Vini, Distillati, Bevande, in parallelo con la chat I2 | — | file pronto prima del passo 15 |
| 13 | ✅ 0c0f4e8 (con V2 quater) | Solo il prompt del passo 13 | V2 | Agente di verifica | **L2** su Piatti (primo elenco, primo modulo, primo foglio) più regressione shell e home | **L2** | rapporto scritto |
| 14 | ✅ 2b53c00 | Solo il prompt del passo 14, se ci sono P | RL2/F2 | Design, Composer | Rilievi di V2 e correzione dei P. Con il primo elenco completo si ricalibrano i tempi, si rivedono i trigger e si segna «validata» la policy (`policy-test.md` §9, punto 4) | L0 + L1 dei falliti | nessun P aperto |
| 15 | ✅ 1fdb2d9 | Solo il prompt del passo 15 | VC3 | Agente di verifica | Implementa i controlli di Vini, Distillati, Bevande | lint e typecheck | tu committi e pushi |
| 16 | ✅ 97a48b5 | Blocco comune + prompt del passo 16 | I3 | Composer | **Vini, Distillati, Bevande** | L0 + **L1** `vini,distillati,bevande` | L1 verde; tu pushi |
| 17 | ✅ c498377 | — | D5 | Design | Controlli per Servizi e Menù fissi, in parallelo con la chat I3 | — | file pronto prima del passo 18 |
| 18 | ✅ f76c347 | Solo il prompt del passo 18 | VC4 | Agente di verifica | Implementa i controlli di Servizi e Menù fissi | lint e typecheck | tu committi e pushi |
| 19 | ✅ 2f3f932 | Blocco comune + prompt del passo 19 | I4 | Composer | **Servizi e Menù fissi** con Categorie | L0 + **L1** `servizi,menu-fissi` | L1 verde; tu pushi |
| 20 | 🔶 | Solo il prompt del passo 20 | V4 | Agente di verifica | **L2 mirato** sui tipi nuovi: schede come percorsi, vista di scelta, conferme con cascade **(dal 2026-10-19 si chiude con T1c e T2a: vedi 2.1 e 2.2)** | **L2** mirato | rapporto scritto |
| 21 | 🔲 | Solo il prompt del passo 21, se ci sono P | RL4/F4 | Design, Composer | Rilievi di V4 e correzione dei P | L0 + L1 dei falliti | nessun P aperto |
| 22 | 🔲 | — | D6 | Design | Controlli per Giorni speciali e Messaggio globale | — | file pronto |
| 23 | 🔲 | Solo il prompt del passo 23 | VC5 | Agente di verifica | Implementa i controlli di Giorni speciali e Messaggio globale **(dal 2026-10-19 sostituito da T2d: i controlli si scrivono nel nuovo framework)** | lint e typecheck | tu committi e pushi |
| 24 | 🔲 | Blocco comune + prompt del passo 24 | I5 | Composer | **Giorni speciali e Messaggio globale** | L0 + **L1** `giorni-speciali,messaggio-globale` | L1 verde; tu pushi |
| 25 | 🔲 | — | D7 | Design | Controlli di chiusura: L2 completo e L3 in `controlli-6.6.json`; i controlli online nuovi li completa V6 | — | file pronto |
| 26 | 🔲 | Blocco comune + prompt del passo 26 | I6 | Composer | **Chiusura**: tabella completa delle checklist di §9, tutti i `verify:*`, CHANGELOG di sottofase | L0 + L1 su tutte le schermate + `verify:*` | tabella senza FALLITO; tu pushi |
| 27 | 🔲 | — (istruzioni del passo) | M2 | Tu | Deploy in produzione | **S** (smoke) | smoke verde |
| 28 | 🔲 | Solo il prompt del passo 28 | V6 | Agente di verifica | **L2 completo**: tutte le schermate, profili, temi, WebKit, più i controlli online senza credenziali **(dal 2026-10-19: esegue la suite e2e completa più i controlli online)** | **L2** | rapporto scritto |
| 29 | 🔲 | Solo il prompt del passo 29, se ci sono P | RL6/F6 | Design, Composer | Rilievi di V6 e correzione dei P | L0 + L1 dei falliti | nessun P aperto |
| 30 | 🔲 | — (istruzioni del passo) | M3/D9 | Tu, Design | **L3**: sessione reale su Cloud Run (io col tuo browser) e giro su iPhone vero (tu), §6 | **L3** | esito scritto; rilievi P chiusi |
| 31 | 🔲 | Blocco comune + prompt del passo 31 | I7 | Tu e Composer | **Import di produzione 6.8**: report a secco in produzione, backup su richiesta, `--apply`, controlli REST | verifica dei conteggi | conteggi coincidenti: **6.6 chiusa** (✅) |
| 32 | 🔲 | — | — | — | Dopo la 6.6: 6.9 (scaffold del frontend), poi 6.5 (accende «Ricompila» e ne prova il pulsante) | vedi sezione 9 | — |

**Ultimo aggiornamento**: 2026-10-19 (commit `0bb6847`). **Prossimo passo: T1c bis** (chiude T1c: fixture isolate per worker, simulazioni con server di sviluppo dedicati, setup in-process, giro completo sotto 10 minuti), poi il confronto visivo (C10) di Servizi e Menù fissi, T2a, T1b, T2b, T1a, T2c.

**Regole dei controlli** (`policy-test.md` §5): un **FALLITO di L1 blocca la chiusura del passaggio**: si corregge e si rilanciano solo i controlli falliti, al massimo due giri, al terzo si ferma e si chiama la chat di design. Un **FALLITO di L2 è un rilievo P** e blocca la chat successiva. Un **AVVISO** non blocca e si registra come rilievo A. Un **NON PROVATO** non blocca ma va nei debiti con scritto in quale livello verrà provato. **S** (smoke) dopo ogni deploy. **Un controllo non implementato** nel lanciatore quando finisce una chat I rende L1 non eseguibile da chi implementa: lo dichiara e lo passa all'agente di verifica; mai una prova manuale chiesta a te al suo posto. Una modifica solo a documenti attiva solo L0; una solo al backend L0 più gli script `verify-*.ts`, non L1 (per questo le chat dei passi 4 e 5 non hanno L1).

---

### 2.1 Percorso di test v2 (dal 2026-10-19)

La verifica resta completa e i controlli dei file JSON restano la fonte di verità: cambia il motore (Playwright Test al posto del vecchio `ui:verify`). Descrizione, regole anti-blocco, esiti e criteri di accettazione: **`docs/design/verifica/percorso-test-v2.md`**. Il vecchio lanciatore è **congelato da subito** (regola R9): il passo 20g è stato annullato (vedi 2.2).

| Passo | Chi | Cosa | Stima | Accettazione |
|---|---|---|---|---|
| **T0** | Agente di verifica | Spike (Local API nello stesso processo, o REST) e scheletro `e2e/` con suite di fumo | 90 min | fumo sotto 60 s; test bloccato ucciso; fixture ripulita; reporter |
| **T1c** | Agente di verifica | C1–C3, console e screenshot: **Servizi e Menù fissi** (chiude V4; per primo perché mai verificati visivamente) | 60 min | sotto 10 min; screenshot completi; 0 ERRORE-STRUMENTO; poi confronto visivo (C10) a cura della chat di design |
| **T1b** | Agente di verifica | Idem: Vini, Distillati, Bevande | 60 min | idem |
| **T1a** | Agente di verifica | Idem: home, navigazione, Piatti (già verificati visivamente in V2 quater: serve a tarare il nuovo motore) | 60 min | idem; i risultati di C2 su Piatti coincidono con quelli noti |
| **T2a** | Agente di verifica | Flussi di Servizi e Menù fissi | 90 min | 0 ERRORE-STRUMENTO; i controlli già corretti tornano OK |
| **T2b** | Agente di verifica | Flussi dei cataloghi (Vini, Distillati, Bevande) | 90 min | idem |
| **T2c** | Agente di verifica | Flussi di Piatti e home | 90 min | idem |
| **T2d** | Agente di verifica | Flussi di Giorni speciali e Messaggio globale (dopo il passo 24) | 90 min | idem |
| **T3** | Design (e chiave API, se la si usa) | Confronto visivo (C10) di tutti gli stati | 60 min | nessun P aperto |
| **T4** | Agente di verifica | Pensionamento del vecchio lanciatore, `ui:verify` come alias di `pnpm e2e` | 60 min | parità con il vecchio, docs aggiornate |

**Regola di arresto (R10)**: un passo che supera il doppio della stima si ferma e riporta. **Ordine**: T0 → T1c → (C10 di Servizi e Menù fissi, a cura mia) → T2a → passo 21 (se ci sono P) → T1b → T2b → T1a → T2c → passi 22–26 con T2d al posto del 23 → V6 con la suite completa.

### 2.2 Stato della serie 20 (aggiornato il 2026-10-19)

| Passo | Cosa | Stato | Note |
|---|---|---|---|
| 20 | V4: L2 di Servizi e Menù fissi | 🔶 eseguito, incompleto | nessun difetto nuovo dell'app; 4 FALLITO del lanciatore |
| 20b | F-SEL: tendine facoltative | ✅ `ed64db5` | |
| 20c | F-TAB: schede con `Link` | ✅ `6ae1f34` | |
| 20d | V4 bis: helper Payload persistente e fix dei flussi | ✅ parziale `a7114d8` | 22 controlli OK; matrice e screenshot non fatti |
| 20e | VC-parallelo: avanzamento, matrice in parallelo | 🔶 chiuso con riserva `a35f8fe` | log e battito, limite su tutti i pacchetti; il blocco di fondo (chiamate sincrone) non risolto |
| 20f | V4 ter: Servizi e Menù fissi L2, regressione, screenshot | **eseguito due volte, risultati inutilizzabili** (`ff68c75`, `25fa77c`) | la prima volta si è bloccato; la seconda, in modalità legacy, ha dato 17 falsi FALLITO e **0 screenshot** (il lanciatore non ha il codice per salvarli) |
| 20g | VC-sync: ultima manutenzione del vecchio lanciatore | ❌ **annullato** | non vale la pena riparare un motore che si sostituisce: T0 + T1c danno gli screenshot di Servizi e Menù fissi in circa 2 ore e mezza, e senza lavoro buttato |

## 3. Blocco comune (da incollare PRIMA del prompt di ogni chat di implementazione)

È il primo dei due testi che incolli nei passi 4, 5, 7, 11, 16, 19, 24, 26 e 31 (vedi §1.1). Il prompt del passo va **dopo**, nello stesso messaggio.

```text
BLOCCO COMUNE: vale per tutte le chat di implementazione della sottofase 6.6.

Sei Composer nel repository VMA VD (Payload CMS e Next.js). Lavori sulla sottofase 6.6 di
docs/piano-sviluppo/fase-6-menu-digitale.md, che si esegue in più chat; questa è UNA di quelle chat e fa solo
quello che il prompt dice. Le regole di .cursor/rules si caricano da sole.

REGOLE
1. Leggi per intero, prima di scrivere codice, i documenti elencati nel prompt. Non assumere nulla oltre la
   documentazione: quello che non è scritto, chiedilo. Non modificare i documenti di design
   (docs/design/schermate/**, docs/design/decisioni-layout-app.md, docs/design/verifica/controlli-*.json)
   le possiede la chat di design. Nella tabella degli stati di
   docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md tocchi solo la riga del tuo passo, come dice la
   Parte D. Se trovi un conflitto tra specifica e codice, dichiaralo in Parte A e annotalo come deviazione in
   Parte D.
2. PARTE A, solo proposta, nessun codice. Rispondi con: (a) i file che crei o modifichi, in ordine;
   (b) ogni ambiguità, contraddizione o punto non coperto che hai trovato, con la lettura che scegli: dichiarala
   ora, prima di scrivere, non a posteriori; (c) le verifiche che farai; (d) quello che NON farai.
   Poi FERMATI e aspetta il mio «procedi».
3. PARTE B, implementazione di quanto approvato. Nessuna nuova dipendenza e nessuna migrazione, salvo dove il
   prompt lo dice. Componenti shadcn solo come da docs/design/installazione-componenti-ui.md, con le deviazioni
   D6 subito dopo l'installazione. Nessun colore o misura fuori dai token; nessuna eccezione ui-check-allow senza
   chiedermelo. I testi sono quelli della sezione «Testi» delle specifiche: non riscriverli.
4. Dati: Local API con la sessione dell'utente (overrideAccess: false). Mai overrideAccess: true in una
   schermata.
5. PARTE C, verifiche. A ogni passaggio L0: pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/.
   A fine di ogni passaggio che tocca una schermata L1: pnpm ui:verify --livello 1 --schermata <id>
   --controlli controlli-6.6.json (e, per la shell, gli id di controlli-8.2.json). NON modificare mai i controlli,
   le soglie o le tolleranze: se un controllo ti sembra sbagliato, scrivilo come «controllo dubbio». Se un
   controllo della schermata non è ancora implementato nel lanciatore, L1 non è eseguibile da te per quel
   controllo: dichiaralo NON PROVATO (lo completa e lo esegue l'agente di verifica nel passo V successivo) e vai
   avanti con il resto, senza prove manuali al suo posto; non è un motivo per fermare la chat. Se un L1 fallisce, correggi e rilancia solo i controlli falliti;
   al terzo giro fermati e riportami.
5b. PRIMA DI OGNI COMMIT, anche di soli script o documenti: pnpm typecheck e pnpm lint sull'INTERO repo. La build di Cloud
   Build (next build) controlla anche scripts/**: un commit senza controllo dei tipi ha già fatto fallire la build di
   produzione (F-EN, script di servizio). Non lasciare correzioni locali non committate. Giri di ui:verify: UNO alla
   volta (il lanciatore rifiuta il secondo) e, a livello 2, una schermata per volta.
6. FERMATI e riferisci, senza aggirare, se: un pacchetto non si installa o genera conflitti; serve un passaggio
   fuori dal codice (database, credenziali, deploy); un ambiente non c'è. Mai produzione: niente
   scripts/prod-db.sh, niente credenziali di produzione, niente utenti di prova su Cloud SQL.
7. PARTE D, chiusura. Stato della 6.6 in fase-6 e in 00-piano-generale.md: «🔶 in corso» (diventa ✅ solo dopo
   l'import di produzione). Voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]: per ogni ambiguità
   risolta scrivi Ufficiale (cosa prevedeva il piano), Percepito (la lettura che hai dichiarato in Parte A),
   Osservato (cosa è successo davvero); esiti di test anche negativi o parziali. Deviazioni annotate nel file di
   fase, sottofase 6.6. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md
   segna la riga del TUO passo con «🔶 fatto, da controllare» (non ✅, nessun'altra riga, non «Ultimo
   aggiornamento»: li segna la chat di design dopo il controllo). Commit locale (git add + git commit,
   messaggio che nomina la chat), con questa modifica inclusa; MAI git push.
8. RISPOSTA FINALE: tabella «Esiti reali» (cosa hai eseguito, comando, OK / FALLITO / NON PROVATO, evidenza),
   poi deviazioni, poi punti aperti. Non dichiarare fatto ciò che non hai provato.
```

---

## 4. Una scheda per ogni passo

### Passo 1 — R0: revisione della regola UI (chat breve)

> Già eseguito (✅ `e9867a5`): il prompt resta qui come riferimento.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Revisione di coerenza di un asse delle regole di progetto. Non scrivere codice e non modificare nessun file.

Leggi per intero i tre file della cartella .cursor/rules/ui/:
  01-ui-app-invarianti.mdc   (modificato il 2026-10-14: riga sulle azioni di riga dei contenuti del menù, D13 e D14)
  02-ui-verifica-agente.mdc
  03-ui-test-policy.mdc

Confronta questo file (01) con gli altri file dello stesso asse (stessa cartella) e segnala contraddizioni.
Poi controlla in particolare che la riga nuova su D13 e D14 in 01 non contraddica:
  - docs/design/decisioni-layout-app.md, D13 e D14;
  - le altre righe di 01 (dimensioni di tocco D6, componenti, colori, testi).

Rispondi con: (1) contraddizioni trovate (file, riga, citazione breve), (2) punti ambigui, (3) nessun problema, se è così.
Non proporre riscritture lunghe: una correzione per riga.
```

**Quando Cursor ha finito**: incollami qui la sua risposta; io la verifico nei file e preparo le correzioni. Non c'è altro da incollare in Cursor.

### Passo 2 — D1: controlli della shell, della home, della navigazione e di Piatti

> Già consegnato (✅ `6a77311`).

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 2»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

### Passo 3 — VC1: l'agente implementa i controlli di D1

> **Esito (2026-10-17)**: accettato con debito. Implementati nel lanciatore: navigazione, shell v4, home-testi e home-righe-di-stato (FALLITO atteso fino a I1: 2 controlli × 2 profili), NO-OVERRIDE, RICOMPILA-ASSENTE (parziale). Con solo cablaggio (NON PROVATO): `home-riga-menu-*` e `piatti-*`, che il passo V successivo completa ed esegue (vedi §1.4, punto 5). Rapporto: `docs/design/verifica/esiti/2026-10-17-controlli/rapporto.md`.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui IMPLEMENTI I CONTROLLI nel lanciatore, non
verifichi ancora nessuna schermata nuova. Istanza: VC1, prima della chat I1 della sottofase 6.6.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md (sezione 6: ordine per ogni schermata nuova)
3. docs/design/verifica/controlli-6.6.json, SOLO le schermate: home, navigazione, piatti; più i controlli comuni
   (NO-OVERRIDE, RICOMPILA-ASSENTE, RICOMPILA-PRESENTE) e dati_e_sicurezza.
   E docs/design/verifica/controlli-8.2.json versione 4, SOLO la schermata: shell.
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/integrazione/spec.md,
   docs/design/schermate/shell/spec.md, docs/design/schermate/piatti/spec.md

Poi:
A. Leggi scripts/ui-verify/run.mjs e scripts/ui-verify/lib/. Per ogni controllo delle schermate indicate, trova se il
   lanciatore sa già eseguirlo (stesso tipo di controllo, stesso selettore). Elenca quelli che mancano.
   Il modello è il modulo per schermata scripts/ui-verify/lib/run-orari.mjs (agganciato da run.mjs): per il Menù
   crea un modulo analogo (per esempio scripts/ui-verify/lib/run-menu.mjs) e agganciaglielo. I valori attesi della
   shell oggi sono anche scritti nel codice (scripts/ui-verify/lib/engine.mjs, riga circa 535, e run.mjs: home-testi,
   shell-menu-voci, shell-segnaposto): portali a quelli di controlli-8.2.json v4 (descrizione della scheda Menù
   «Piatti, vini, bevande, menù fissi e altro», titolo «Oggi», voci della navigazione lette da lib/app/navigation.ts
   con enabled vero). Gestisci anche: «stato_prova» e «rinviato_a» (esito NON PROVATO con l'evidenza «rinviato alla
   6.5»: gli esiti ammessi restano OK, FALLITO, AVVISO e NON PROVATO, non esiste un esito RINVIATO); il profilo
   telefono-390-basso; le simulazioni APP_MENU_DEV_SIMULATE_* e i dati di prova «verify-ui-…» di dati_e_sicurezza
   (creati e cancellati in try/finally, solo sviluppo); il comando NO-OVERRIDE; `--controlli controlli-6.6.json`
   con `--schermata`.
B. Implementa i tipi di controllo che mancano (per esempio: modulo con select, finestra di conferma con elenco,
   riga di stato della home, flussi con dati di prova, lettura di testi attesi da lib/). Non cambiare nessun
   controllo, soglia o tolleranza dei file JSON; i testi attesi delle costanti si leggono da lib/, non si copiano.
   Se un controllo ti sembra sbagliato o impossibile, scrivilo come «controllo dubbio» e lascialo com'è.
C. Prova il cablaggio: pnpm lint e pnpm typecheck verdi; il lanciatore carica controlli-6.6.json e controlli-8.2.json,
   riconosce ogni id e tipo delle schermate indicate.
   - Schermate non ancora implementate: oggi /app/menu è un SEGNAPOSTO (non Piatti) e la riga di stato della home e
     le voci nuove della navigazione non esistono ancora (le fa la chat I1, Piatti la chat I2). I controlli di home
     (riga del Menù), navigazione (voci non accese) e piatti danno NON PROVATO con l'evidenza «schermata non ancora
     implementata», senza errori del lanciatore. Per riconoscere il segnaposto usa la logica che già c'è
     (SEGNAPOSTO_H1).
   - La shell esiste: esegui pnpm ui:verify --livello 1 --schermata shell --controlli controlli-8.2.json su
     locale-prod. I controlli che descrivono lo stato DOPO la chat I1 (home-testi: «Oggi» e la nuova descrizione;
     home-righe-di-stato) possono dare FALLITO sul codice di oggi: riportali nel rapporto come «FALLITO atteso fino
     a I1», senza toccare né il codice dell'app né i controlli. Ogni altro FALLITO sulla shell va analizzato: o è un
     difetto del lanciatore (correggilo) o un difetto vero (riportalo).
D. Scrivi in docs/design/verifica/esiti/<AAAA-MM-GG>-controlli/ un breve rapporto: controlli già coperti, controlli
   aggiunti, controlli dubbi, FALLITO attesi fino a I1, NON PROVATO (con il motivo).

Non fare git. Puoi modificare solo scripts/ui-verify/** e il rapporto; non toccare app/, components/, lib/,
docs/design (fuori da verifica/esiti), né i controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO,
AVVISO e NON PROVATO.
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `test(ui-verify): controlli del Menù nel lanciatore (VC1)`

### Passo 4 — I0a: Parte 0, permessi di cancellazione e registro (solo backend)

> **Esito (2026-10-17)**: codice controllato nel repo (`23b934f`, `01c50d6`): predicato solo staff per le categorie, `area` con context/API/ruoli, conteggi con `overrideAccess: true` solo nel `beforeDelete`, matrici di `verify-menu-6_2` e `6_3` aggiornate; test unitari 8/8 (comando `node --experimental-strip-types --test lib/app/*.test.ts`); `verify:menu-6_4` OK con il server di sviluppo avviato. **Debito**: la parte standalone di `verify:menu-availability-final-proofs` resta NON PROVATA in locale (manca il bucket GCS): la coprono i passi 27 e 30. Lezione: `verify:menu-6_4` e `final-proofs` richiedono `pnpm dev` con le variabili d'ambiente dell'intestazione dello script.

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 4 (I0a). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I0a: Parte 0 di 6.6, permessi di cancellazione, registro attività, matrici di prova.
Solo backend: nessuna schermata, nessuna migrazione, nessun L1.

OBIETTIVO
Il manager App attivo può cancellare fisicamente i contenuti del menù, tranne le categorie dei menù fissi; ogni
cancellazione lascia una riga nel registro attività; le matrici di prova lo dimostrano.

LEGGI
- docs/piano-sviluppo/fase-6-menu-digitale.md, sezione 6.6, «Parte 0» e la checklist di chiusura.
- docs/piano-sviluppo/ADR-113 (§3 e emendamento del 2026-10-14), ADR-108 (emendamenti sulla cancellazione e nota
  del 2026-10-13 sulle relazioni), ADR-115 (nota del 2026-10-14 sulle cancellazioni).
- docs/design/decisioni-layout-app.md, D14.
- Codice: lib/menu/access.ts, lib/menu/contentCollection.ts, collections/menu/menuContentCollections.ts,
  collections/menu/specialDays.ts, lib/menu/availability/menuAvailabilityHooks.ts (esiste già un afterDelete per
  il file di disponibilità: non romperlo), lib/activityLog/ (logActivity.ts, constants.ts, gli hook auth per
  vedere come si imposta `area`), collections/ActivityLog.ts, scripts/verify-menu-6_2.ts, scripts/verify-menu-6_3.ts.

COSA FARE
1. lib/menu/access.ts: canDeleteMenuContentRequest ammette staff Admin oppure manager App attivo
   (isActiveAppManagerRequest). Aggiorna il commento.
2. menuContentAccess è condiviso oggi da otto collection (le sette di MENU_CONTENT_SLUGS più special-days).
   Crea un secondo oggetto di `access` per fixed-menu-categories con delete riservato allo staff Admin
   (create, read, update invariati) e usalo solo lì. Le tassonomie e menu-general non cambiano.
3. Registro: un hook afterDelete per ciascuna di dishes, wines, spirits, drinks, menu-services, fixed-menus e
   special-days, che scrive una riga con logActivity: eventType 'delete' (già nell'enum: verificalo), user, area,
   collection, documentId e detail con il nome della voce e il numero di riferimenti che la usavano (menu-services:
   i fixed-menus che la contengono; fixed-menus: gli special-days che li contengono; le altre 0). Nessun dato
   personale. Un errore di scrittura non blocca la cancellazione (logActivity lo gestisce già: non
   sovrascriverlo). I riferimenti spariscono con il cascade: il conteggio va letto prima della cancellazione;
   proponi in Parte A come (per esempio beforeDelete e req.context). Proponi anche come determinare `area`
   (admin o app) e se serve toccare la condizione di visibilità del campo `detail` in collections/ActivityLog.ts
   (oggi solo per systemAction): proponi, non fare senza il mio ok.
4. Prove (la Parte 0 le descrive): aggiorna la matrice di verify-menu-6_2 (7 profili × 7 collection, delete) e quella
   di verify-menu-6_3: il manager è consentito su sei collection più i giorni speciali e rifiutato su
   fixed-menu-categories; utente senza ruolo e adminRole manager senza appRole rifiutati ovunque; la riga di
   registro esiste dopo ogni cancellazione, con detail corretto; un piatto in un menù fisso non si cancella
   (rifiuto del database); un servizio o un menù fisso cancellati spariscono dai menù fissi e dai giorni
   speciali (cascade).

NON FARE: schermate, migrazioni, modifiche a tassonomie o menu-general, import.

VERIFICHE: L0, poi pnpm verify:menu-6_2, verify:menu-6_3, verify:menu-6_4 e verify:menu-availability-final-proofs
(gli ultimi due per assicurarti che l'hook della disponibilità non cambi). Richiedono il database di sviluppo
locale in esecuzione: se non c'è, fermati e dimmelo.

CHIUSURA: spunta in fase-6, 6.6, solo le voci di Parte 0 che hai davvero provato. Poi Parte D del blocco comune.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 5 — I0b: formati dei campi e import (solo backend)

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 5 (I0b). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I0b: formati dei campi di vini, distillati e bevande, e import.
Solo backend: nessuna schermata, nessuna migrazione, nessun cambio di schema (i campi restano di tipo testo), nessun L1.

OBIETTIVO
Un solo modulo con le forme canoniche; funzioni validate nel server; l'import scrive valori conformi e il report
a secco mostra le forme distinte trovate.

LEGGI
- docs/piano-sviluppo/ADR-108 (note sui formati di vini, distillati e bevande del 2026-10-14) e ADR-112 (note di
  pari data).
- docs/design/decisioni-layout-app.md, D15 e i rilievi A33–A43.
- docs/design/schermate/vini/spec.md, distillati/spec.md, bevande/spec.md: sezioni «Collegamento ai dati» e
  «Testi» (messaggi d'errore del server).
- docs/piano-sviluppo/fase-6-menu-digitale.md: 6.6 Parte 0 (punto sui formati) e 6.8 (Normalizzazioni, Esecuzione in
  produzione).
- Codice: lib/menu/validateWineGeography.ts (esempio di validate), collections/menu/menuContentCollections.ts,
  scripts/import-menu-vtn-backend.ts e scripts/import-menu-vtn-backend/, scripts/verify-menu-6_2.ts,
  scripts/verify-menu-6_8-import-idempotency.ts.

COSA FARE
1. Un solo modulo in lib/menu/ (nome da proporre in Parte A, per esempio lib/menu/formats.ts) con, per ogni
   campo: elenco o regola canonica, validatore, funzione di normalizzazione per l'import, messaggio d'errore
   del server. Le forme sono quelle delle note di ADR-108: non reinventarle. Vini: year, volume, abv.
   Distillati: abv, aging. Bevande: volume, abv. Il volume dei distillati NON si valida e non si gestisce.
   I messaggi sono quelli delle specifiche.
2. Funzioni validate sui campi: wines (year, volume, abv), spirits (abv, aging), drinks (volume, abv). Accettano
   il campo vuoto, la forma canonica, oppure il valore già salvato e non modificato (confronto con il documento
   originale). Valgono per Admin, REST e Local API.
   DA PROVARE IN PARTE A con un test minimo: l'aggiornamento parziale di un documento che ha già un valore NON
   canonico (per esempio solo `disabled`) non deve fallire. Se Payload lo rifiuta, proponi il disegno
   dell'eccezione e fermati.
3. Import: normalizza anno e grado dei vini, grado e invecchiamento dei distillati, grado delle bevande, e la
   capacità con le liste canoniche. Una forma non riconosciuta è un errore nel report, non una scrittura
   silenziosa. Report a secco esteso: per ogni campo, l'elenco delle forme distinte trovate con il conteggio e il
   trattamento (normalizzata o rifiutata). L'import lo provi solo sul database di sviluppo.
4. Prove: test unitari del modulo (node:test, come lib/app/breadcrumb.test.ts): forme valide, non valide, bordi,
   «NV», anno corrente. verify-menu-6_2 deve scrivere valori conformi. Richieste dirette con valori non validi
   (per esempio «46%» in un distillato, «20 cl» in una bevanda) rifiutate con il messaggio previsto.
   verify-menu-6_8-import-idempotency resta verde.

NON FARE: schermate, esecuzione dell'import in produzione, migrazioni, modifica del volume dei distillati.

VERIFICHE: L0, test unitari, pnpm verify:menu-6_2, e l'idempotenza dell'import
(pnpm payload run scripts/verify-menu-6_8-import-idempotency.ts). Serve il database di sviluppo locale.

DOPO (non è di questa chat): io lancio da locale il report a secco sullo snapshot e leggo le forme reali;
le regole di normalizzazione si fissano su quelli prima dell'import di produzione.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 6 — M1: report a secco dell'import sullo snapshot

**Chi**: tu, nel terminale. Nessun prompt di Cursor.

**Prerequisito**: la chat I0b (passo 5) è chiusa e pushata, e il database di sviluppo è in esecuzione (127.0.0.1:5432/vma_vd_dev).

**Cosa fai**
1. Dalla radice del repo: `pnpm import:menu -- ~/vtn-export-2026-10-12`
   Senza `--apply`: stampa solo il report a secco e non scrive nulla. Se la cartella dello snapshot non c'è, o vuoi uno snapshot del giorno, si rifà come in `docs/operativo/export-menu-vtn-backend.md` (lo snapshot non si committa).
2. Copia il report completo (soprattutto la parte con le forme distinte di anno, grado, invecchiamento e capacità, e i conteggi) e incollamelo qui.

**Cosa succede dopo**: io leggo le forme reali e ti dico se le regole di normalizzazione della chat I0b bastano. Se no, ti preparo una piccola chat di correzione da fare **prima** dell'import di produzione (passo 31). Questo passo non blocca il resto: va fatto prima del passo 31.

### Passo 7 — I1: fondamenta UI e integrazione

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 7 (I1). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I1: fondamenta UI e integrazione del Menù nella shell. NON costruire nessuna schermata di elenco o modulo.

OBIETTIVO
Navigazione a otto voci (le nuove spente), correzione del percorso più lungo con test, scheda «Menù» in home con la
riga dei piatti terminati, componenti shadcn e blocchi condivisi pronti.

LEGGI
- docs/design/schermate/integrazione/spec.md, per intero (prevale su shell/spec.md dove divergono).
- docs/design/schermate/shell/spec.md; docs/design/decisioni-layout-app.md (D1, D2, D6, D9, D13, D14, A51–A54).
- docs/design/installazione-componenti-ui.md; docs/design/modello-specifica-schermata.md.
- Sezioni «Albero blocchi» e «Componenti da installare e da comporre» delle specifiche piatti, vini, servizi,
  menu-fissi, giorni-speciali, messaggio-globale: per sapere quali blocchi sono condivisi.
- Codice: lib/app/navigation.ts, lib/app/nav-icon-keys.ts, components/app/app-nav-icon.tsx, lib/app/breadcrumb.ts e
  breadcrumb.test.ts, components/app/shell/*, components/app/home/section-card.tsx, app/(app)/app/(shell)/*.

COSA FARE
1. Componenti: installa quelli mancanti per la 6.6, cioè switch, tabs, table, badge, textarea, checkbox, select,
   con pnpm exec shadcn add e le deviazioni D6 subito dopo ognuno. Nota: tabs, table, badge, textarea, checkbox
   e select erano previsti per la 5.5 (Prenotazioni), non ancora fatta: scrivilo nel CHANGELOG.
2. Navigazione (integrazione §2): otto voci con id, percorsi e icone della tabella; nuove icone in
   nav-icon-keys.ts e app-nav-icon.tsx (martini, book-open, concierge-bell, calendar-heart, megaphone; togli
   beer e list se non servono più). Le sette voci senza pagina restano enabled: false. «Piatti» resta su /app/menu.
3. Voce attiva e briciole: regola del percorso più lungo (integrazione §2). Correggi components/app/shell/
   app-sidebar-nav.tsx (riga circa 35) e lib/app/breadcrumb.ts (riga circa 17); le sotto-pagine in una costante
   (/app/menu/fixed/categories diventa «Categorie»). Test unitari per TUTTI i casi della tabella di §2, compresi
   /app/menu/wines, /app/menu/fixed/categories e /app/reservations/day-exceptions. Aggiorna breadcrumb.test.ts
   (oggi mockNav ha una sola voce Menù).
4. Home (integrazione §3): descrizione della scheda Menù «Piatti, vini, bevande, menù fissi e altro» in
   HOME_SECTION_CARDS; riga «{N} piatti terminati» o «Nessun piatto terminato» con payload.count su dishes con
   where soldOut vero E disabled non vero (un piatto disabilitato non conta nemmeno se è terminato),
   overrideAccess: false, sessione dell'utente, nessuna cache; stati di D2 (caricamento con Skeleton alla stessa
   altezza; errore: la riga non compare). Solo per chi vede la sezione menu. Titolo della home: «Oggi» e
   «Situazione di oggi e accesso alle sezioni.» appena almeno una scheda ha una riga di stato attiva (dalla
   tua chat, per chi vede il Menù); «Area App» e «Scegli una sezione.» altrimenti (integrazione §3).
5. Blocchi condivisi (cartella e nomi da proporre in Parte A, per esempio components/app/menu/ e lib/menu/ui/):
   solo quelli che servono a più di una schermata: intestazione di pagina con azioni; riga con interruttore,
   matita e cestino (nomi accessibili come da spec); foglio dei filtri con etichette rimovibili; conferma di
   eliminazione; blocco degli avvisi; stati di caricamento, errore e vuoto; campo localizzato con traduzione
   inglese a scomparsa (D10); funzioni pure (formato del prezzo con la virgola, singolare e plurale, ordine per
   nome in italiano, data in lettere). Niente anticipazioni di cose usate da una sola schermata. Le chiamate alla Local API per cancellare (e per
   coerenza ogni scrittura dell'App) passano `context: { [ACTIVITY_AREA_CONTEXT_KEY]: 'app' }` (costante di
   lib/menu/menuContentDeleteLog.ts, creata nel passo 4): mettila in un solo helper condiviso, così un admin che
   cancella dall'App risulta `area: app` nel registro.
6. «Ricompila il menù pubblico»: costruisci il componente (pulsante e finestra di conferma, testi di
   docs/design/schermate/piatti/spec.md) dietro una sola costante spenta (per esempio in lib/menu/). La 6.5 fornirà
   l'endpoint e la accenderà. Finché è spenta, il pulsante e la finestra non compaiono in nessuna schermata e gli
   avvisi di salvataggio e di eliminazione che nominano «Ricompila il menù pubblico» hanno solo il titolo: il
   blocco condiviso degli avvisi deve leggere la stessa costante (integrazione §5).
7. Simulazioni di sviluppo: un modulo lib/app/menu/devSimulate.ts sul modello di lib/app/hours/devSimulate.ts, con
   APP_MENU_DEV_SIMULATE_LOAD_ERROR, APP_MENU_DEV_SIMULATE_SAVE_ERROR e APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS (ms),
   attive solo con NODE_ENV diverso da production e valide per tutte le schermate del Menù (le usa il lanciatore
   dei controlli: docs/design/verifica/controlli-6.6.json, dati_e_sicurezza). Non documentarle in produzione.
8. scripts/verify-lib-app-8_2.ts oggi attende esattamente «Piatti,Orari,Elenco»: aggiornalo per attendere l'elenco
   delle voci abilitate (lo aggiornerà anche ogni chat che accende voci).

NON FARE: schermate di elenco o modulo, rotte nuove, migrazioni, pulsante «Ricompila» attivo.

VERIFICHE: L0; poi L1 con i controlli già implementati da VC1: pnpm ui:verify --livello 1 --schermata shell
--controlli controlli-8.2.json (shell aggiornata a otto voci) e pnpm ui:verify --livello 1 --schermata
home,navigazione --controlli controlli-6.6.json. Poi pnpm payload run scripts/verify-lib-app-8_2.ts.

CHIUSURA: Parte D del blocco comune.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 8 — V1: l'agente esegue L2 su shell, home e navigazione

> **Esito (2026-10-17)**: accettato. I quattro controlli `home-riga-menu-*` sono stati implementati ed eseguiti (tutti OK); console di sviluppo pulita; regressione della shell OK dopo la correzione di un difetto del lanciatore (selettore di `shell-menu-voci`, `3c3b777`). Nessun rilievo P; rilievi A in `docs/design/verifica/esiti/2026-10-17-V1/rilievi.md`. L'agente ha aggiornato anche il CHANGELOG con la voce del suo lavoro: va bene, ma la regola 02 gli permette solo `scripts/ui-verify/**` e `esiti/**`.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi. Istanza: V1, dopo la chat I1.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (i controlli del Menù) e docs/design/verifica/controlli-8.2.json
   (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/integrazione/spec.md, docs/design/schermate/shell/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status --short).
   Se git status non è pulito, fermati e dimmelo.
A. Il lanciatore implementa già i controlli di navigazione e di shell (passo VC1). Sono IN DEBITO i controlli
   home-riga-menu-testo, home-riga-menu-casi, home-riga-menu-stati e home-riga-menu-altezza (elencati nel rapporto
   docs/design/verifica/esiti/2026-10-17-controlli/rapporto.md): ora la home con la riga esiste (chat I1), quindi
   IMPLEMENTALI tu in scripts/ui-verify/** (modulo scripts/ui-verify/lib/run-menu.mjs) ed ESEGUILI in questa
   verifica, con le simulazioni APP_MENU_DEV_SIMULATE_* su un server di sviluppo separato (porta 3200, mai in
   production). Non cambiare i controlli JSON. Nel rapporto scrivi quali hai completato ed eseguito e quali no, e
   perché. Se un controllo di navigazione era un «controllo dubbio» di VC1 (nav-pannello-telefono), non toccarlo
   ora.
B. Esegui, su locale-dev (solo il controllo CONSOLE) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata home,navigazione
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6, dopo il deploy. Scrivili NON PROVATO con il motivo «si provano in V6».
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README, sezione 7.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i
controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `docs(verifica): rapporto L2 V1 (shell, home, navigazione)`

### Passo 9 — RL1: rilievi di V1

**Chi**: la chat di design (io).
**Cosa fai tu**: dopo che l'agente di verifica ha finito e tu hai pushato il suo rapporto, incollami qui il suo resoconto finale. Io leggo il rapporto, assegno i rilievi **P** (bloccano) e **A** (non bloccano), li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` e ti consegno lo zip con il file e il nome della `<CARTELLA>`. Se non ci sono P, il passo successivo parte subito.

### Passo 10 — F1: correzione dei P di V1 (solo se ci sono)

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

**Quando serve**: solo se nel passo 9 ti consegno dei rilievi P. In `<CARTELLA>` incolli il nome che ti do io.

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F1: correzione dei rilievi P della verifica L2 V1. Fai solo
questo. Le regole di .cursor/rules si caricano da sole.

CARTELLA DEI RILIEVI = <INCOLLA QUI il nome della cartella che ti dà la chat di design, per esempio 2026-10-17-locale-prod>

LEGGI per intero:
- docs/design/verifica/esiti/<CARTELLA>/: il rapporto dell'agente e rilievi.md (i rilievi P assegnati dalla chat di
  design, uno per riga: id, valore misurato, valore atteso, schermata).
- Le specifiche della schermata interessata, sezioni «Testi» e «Layout»: docs/design/schermate/integrazione/spec.md, docs/design/schermate/shell/spec.md

REGOLE
1. Correggi SOLO i rilievi P elencati in rilievi.md. Non toccare i rilievi A. Non cambiare controlli, soglie,
   specifiche né documenti di design (docs/design/**). Se un P ti sembra un controllo dubbio o una specifica
   sbagliata, dillo e non correggere.
2. PARTE A, solo proposta: per ogni P scrivi la causa che vedi nel codice e il file che toccherai. Poi FERMATI e
   aspetta il mio «procedi».
3. Dati: Local API con la sessione dell'utente (overrideAccess: false). Nessuna nuova dipendenza, nessuna
   migrazione. Componenti shadcn solo come da docs/design/installazione-componenti-ui.md.
4. Verifiche: L0 (pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/) e L1 dei soli controlli falliti:
   pnpm ui:verify --livello 1 --schermata <id> --controlli controlli-6.6.json (per la shell: --controlli
   controlli-8.2.json). Al massimo due giri; al terzo fermati e riportami. Non modificare mai i controlli.
5. Fermati e riferisci, senza aggirare, se serve un passaggio fuori dal codice o manca un ambiente. Mai produzione.
6. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased] con cosa era sbagliato e cosa è
   cambiato (comprensibile senza questa chat); commit locale (git add + git commit, messaggio che nomina la chat
   F1); MAI git push. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md
   segna la riga del passo 10 con «🔶 fatto, da controllare» (solo quella riga) nello stesso commit.
7. RISPOSTA FINALE: tabella «Esiti reali» con un rigo per ogni P: corretto / non corretto, con evidenza.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 11 — I2: Piatti (prima schermata accesa)

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 11 (I2). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I2: schermata Piatti (/app/menu). È la prima schermata accesa del Menù e fa da modello per le altre.

LEGGI
- docs/design/schermate/piatti/spec.md, per intero, e il suo mockup (docs/design/schermate/piatti/mockup.html).
- docs/design/decisioni-layout-app.md (D5, D6, D8, D9, D10, D13, D14, A-rilievi su piatti).
- docs/piano-sviluppo/fase-6-menu-digitale.md: 6.6 (Contenuto) e 6.4 (reset di «terminato», confini dei servizi).
- docs/piano-sviluppo/ADR-108 (nota del 2026-10-13: il database rifiuta la cancellazione di un piatto in un menù
  fisso) e ADR-113.
- Codice: ciò che ha lasciato la chat I1 (blocchi condivisi, componenti, navigazione), app/(app)/app/(shell)/menu/
  page.tsx (oggi segnaposto), app/(app)/app/(shell)/hours/actions.ts e components/app/hours/ (modello delle azioni
  del server e dei moduli), lib/menu/availability/serviceBoundaries.ts e resetDishesSoldOut.ts, collections/menu/
  menuContentCollections.ts (dishes).

COSA FARE (la specifica è il contratto; qui solo l'indice)
1. Rotta /app/menu: elenco dei piatti raggruppato per categoria, ricerca, filtri (foglio dal basso su telefono), righe
   con «Terminato» (interruttore), occhio per disabilitare, matita, cestino; avvisi; stati (caricamento, errore,
   vuoto, nessun risultato).
2. «Terminato» e scadenza: una funzione pura in lib/menu/availability/serviceBoundaries.ts che dà il prossimo
   confine di servizio dopo un istante (nome proposto: nextServiceStartBoundaryAfter), con test; riga, avviso e
   modulo dicono «fino all’apertura della cena» (o «del pranzo») dagli orari.
3. Eliminazione (D14): conferma semplice; se il piatto è in uno o più menù fissi, la finestra «Non si può eliminare»
   con l'elenco dei menù, letto prima con la sessione dell'utente.
4. Modulo (foglio): nome e descrizione localizzati con traduzione inglese a scomparsa, prezzo, categoria,
   allergeni, flag (glutenFree, dairyFree, vegan, eggFree), disabilitato; validazione e messaggi come da spec.
5. Azioni del server nel modello di hours/actions.ts, con la sessione dell'utente e overrideAccess: false;
   ogni cancellazione passa il context di area app (helper di I1).
6. «Ricompila»: usa il componente di I1 dietro la bandiera spenta; non farlo comparire, e negli avvisi di
   salvataggio e di eliminazione ometti la frase che nomina il pulsante (blocco condiviso di I1).
7. Simulazioni di sviluppo di I1 (APP_MENU_DEV_SIMULATE_*): leggile nel caricamento dell'elenco e nelle azioni del
   server, così il lanciatore può provare caricamento lento, errore di caricamento ed errore dell'azione.
8. Dati di prova dei controlli: voci «verify-ui-…» create e cancellate dal lanciatore; non devono essere
   trattate in modo speciale dal codice.

NON FARE: altre schermate, pulsante «Ricompila» visibile, modifiche a collections o hook di disponibilità.

VERIFICHE: L0; L1 con pnpm ui:verify --livello 1 --schermata piatti --controlli controlli-6.6.json. Se tocchi codice dell'hook della disponibilità, anche pnpm
verify:menu-6_4. Prova a mano da dev: segnare «terminato» un piatto fa cambiare il file di disponibilità (storage di
sviluppo) entro pochi secondi.

CHIUSURA: Parte D del blocco comune; aggiungi la riga «Piatti: fatto» nella sottofase 6.6 di fase-6.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 12 — D3: controlli per Vini, Distillati, Bevande

> **Consegnato (2026-10-17)**: in `docs/design/verifica/controlli-6.6.json` ci sono le schermate `vini` (31 controlli), `distillati` (26) e `bevande` (26), ricavate dalla §9 e dalle sezioni 4–7 delle tre specifiche, con lo stesso scheletro di Piatti e i controlli specifici (vini: anno e NV, cascata e filtri dell'origine, opzioni filtrate nella query, valore fuori filtro, coerenza geografica; distillati: capacità non gestita; bevande: paese facoltativo). I controlli sul pulsante «Ricompila» e lo stato «vuoto» sono NON PROVATI; `*-accesso` è NON PROVABILE (coperto da `verify-roles-8_3`). Li implementa nel lanciatore il passo 15 (VC3).

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 12»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

Si fa in parallelo con la chat del passo 11 e deve essere pronto prima del passo 15.

### Passo 13 — V2: l'agente esegue L2 su Piatti (primo elenco, primo modulo, primo foglio)

> **Esito finale (2026-10-18)**: chiuso con **V2 quater** (`0c0f4e8`): 0 FALLITO su menu, shell e Orari, sei P corretti dopo F2, nessun P aperto (`docs/design/verifica/esiti/2026-10-18-V2quater/rilievi.md`). **Esito intermedio (2026-10-17)**: **incompleto**. Eseguiti la regressione della shell, la console di sviluppo e buona parte dei flussi di Piatti; interrotti dopo circa 17 minuti, con stati pesanti saltati e `piatti-terminato` non rieseguito dopo la correzione. Rilievi in `docs/design/verifica/esiti/2026-10-17-V2/rilievi.md`: **6 P** (margine doppio, scheda mobile, aree di tocco, Categoria mostra l'identificativo, allergeni, icone e dettagli dei blocchi condivisi) e i difetti del lanciatore da correggere in V2 bis. Il passo diventa ✅ solo con V2 bis.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi. Istanza: V2, dopo la chat I2.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (i controlli del Menù) e docs/design/verifica/controlli-8.2.json
   (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/piatti/spec.md, docs/design/schermate/integrazione/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status --short).
   Se git status non è pulito, fermati e dimmelo.
A. Il lanciatore ha già i controlli di home e navigazione. Sono IN DEBITO tutti i controlli piatti-* eseguibili
   (elencati come debito nel rapporto VC1, docs/design/verifica/esiti/2026-10-17-controlli/rapporto.md) e il caso
   degli avvisi di salvataggio e di eliminazione di RICOMPILA-ASSENTE: ora la schermata Piatti esiste (chat I2),
   quindi IMPLEMENTALI tu in scripts/ui-verify/** (modulo scripts/ui-verify/lib/run-menu.mjs) ed ESEGUILI in
   questa verifica, con dati di prova «verify-ui-…» creati e cancellati in try/finally e le simulazioni
   APP_MENU_DEV_SIMULATE_* su un server di sviluppo separato (porta 3200, mai in production). Quelli «rinviati alla
   6.5» restano NON PROVATI. Non cambiare i controlli JSON. Nel rapporto scrivi quali hai completato ed eseguito e
   quali no, e perché.
B. Esegui, su locale-dev (solo il controllo CONSOLE) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6, dopo il deploy. Scrivili NON PROVATO con il motivo «si provano in V6».
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README, sezione 7.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i
controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `docs(verifica): rapporto L2 V2 (Piatti)`

### Passo 14 — RL2/F2: rilievi di V2 e correzione dei P (solo se ci sono)

**Chi**: la chat di design (io).
**Cosa fai tu**: dopo che l'agente di verifica ha finito e tu hai pushato il suo rapporto, incollami qui il suo resoconto finale. Io leggo il rapporto, assegno i rilievi **P** (bloccano) e **A** (non bloccano), li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` e ti consegno lo zip con il file e il nome della `<CARTELLA>`. Se non ci sono P, il passo successivo parte subito.

Con il primo elenco completo si ricalibrano i tempi, si rivedono i trigger e si segnano «validata» la policy dei test e la regola `ui/01-ui-app-invarianti.mdc` (`policy-test.md` §9, punto 4).

**Passo F2 (ci sono 6 P: va lanciato)**

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F2: correzione dei rilievi P della verifica L2 V2. Fai solo
questo. Le regole di .cursor/rules si caricano da sole.

CARTELLA DEI RILIEVI = 2026-10-17-V2

LEGGI per intero:
- docs/design/verifica/esiti/<CARTELLA>/: il rapporto dell'agente e rilievi.md (i rilievi P assegnati dalla chat di
  design, uno per riga: id, valore misurato, valore atteso, schermata).
- Le specifiche della schermata interessata, sezioni «Testi» e «Layout»: docs/design/schermate/piatti/spec.md
- Per i rilievi visivi (P2, P4, P5, P6): il mockup docs/design/schermate/piatti/mockup.html e i PNG di riferimento nella
  stessa cartella (390-*.png e 1280-*.png): confronta stato per stato prima e dopo, e riporta ogni differenza che
  trovi oltre ai sei P (come «da valutare», senza correggerla: la valuta la chat di design).
- I blocchi condivisi (components/app/menu/*) sono usati da tutte le schermate future: correggili lì, non nella
  schermata dei Piatti.

REGOLE
1. Correggi SOLO i rilievi P elencati in rilievi.md. Non toccare i rilievi A. Non cambiare controlli, soglie,
   specifiche né documenti di design (docs/design/**). Se un P ti sembra un controllo dubbio o una specifica
   sbagliata, dillo e non correggere.
2. PARTE A, solo proposta: per ogni P scrivi la causa che vedi nel codice e il file che toccherai. Poi FERMATI e
   aspetta il mio «procedi».
3. Dati: Local API con la sessione dell'utente (overrideAccess: false). Nessuna nuova dipendenza, nessuna
   migrazione. Componenti shadcn solo come da docs/design/installazione-componenti-ui.md.
4. Verifiche: L0 (pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/) e L1 dei soli controlli falliti:
   pnpm ui:verify --livello 1 --schermata <id> --controlli controlli-6.6.json (per la shell: --controlli
   controlli-8.2.json). Al massimo due giri; al terzo fermati e riportami. Non modificare mai i controlli.
5. Fermati e riferisci, senza aggirare, se serve un passaggio fuori dal codice o manca un ambiente. Mai produzione.
6. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased] con cosa era sbagliato e cosa è
   cambiato (comprensibile senza questa chat); commit locale (git add + git commit, messaggio che nomina la chat
   F2); MAI git push. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md
   segna la riga del passo 14 con «🔶 fatto, da controllare» (solo quella riga) nello stesso commit.
7. RISPOSTA FINALE: tabella «Esiti reali» con un rigo per ogni P: corretto / non corretto, con evidenza.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 14b — V2 bis: l'agente rifà L2 su Piatti dopo F2

> **Esito (2026-10-17)**: **eseguito prima di F2** (commit `c67467e`). Non verifica le correzioni: dà lo stato di partenza e ha corretto sette difetti del lanciatore (3.4.1). Le correzioni di F2 si verificano con **V2 ter** (passo 14c, sotto). Il prompt qui sotto è rimasto per riferimento.

**Quando** (se mai si ripetesse): dopo che F2 è chiuso e pushato. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V2 bis,
dopo la chat F2 (correzione dei rilievi P della verifica L2 V2).

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (schermate home, navigazione, piatti; comuni) e
   docs/design/verifica/controlli-8.2.json (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. docs/design/verifica/esiti/2026-10-17-V2/rilievi.md (i rilievi P e A, i difetti del lanciatore, i limiti di V2)
6. Le specifiche, solo per capire i controlli: docs/design/schermate/piatti/spec.md,
   docs/design/schermate/integrazione/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status
   --short). Se git status non è pulito, fermati e dimmelo.
A. LANCIATORE (modifichi solo scripts/ui-verify/**, mai i controlli JSON). Correggi i difetti elencati in
   rilievi.md, sezione «Difetti del lanciatore», e il resto:
   1. piatti-terminato: apri prima il foglio «Filtri» per usare il select «Stato»; il flusso deve completare.
   2. Ogni FALLITO e ogni AVVISO riporta i valori REALI misurati e attesi (per esempio per piatti-modulo-inglese:
      il nome e la descrizione letti con locale=en e quelli attesi; per piatti-tassonomie: le opzioni lette dal
      modulo, quelle lette dalle collection e l'esito delle creazioni rifiutate; per piatti-ordine-100: quanti
      piatti arrivano, quale avviso compare, se il pulsante manca). Se un controllo non riesce a misurare, scrivi
      NON PROVATO con il motivo, non FALLITO.
   3. piatti-azioni-pagina: confronta con la larghezza della colonna del contenuto (finestra meno 2 × 16 px a
      390 px), non con quella di main (il JSON è già corretto).
   4. shell-margine-contenuto: non misurare /app/menu (ora è la schermata Piatti).
   5. Stati pesanti di C1/C2 (più di 100 piatti, caricamento, errore di caricamento): eseguili uno per volta con un
      tempo massimo per stato; se uno lo supera, NON PROVATO con il motivo e prosegui con gli altri. Non abortire
      l'intero giro. Se serve, lancia il giro a pezzi (per --schermata, per profilo).
   6. Implementa piatti-elimina-concorrenza (la finestra aperta, poi un menù fisso che usa il piatto, poi «Elimina»).
   7. piatti-confronto-visivo: salva gli screenshot di TUTTI gli stati con riferimento (sezione immagini del JSON)
      a 390 e 1280 px, in chiaro e scuro, con il nome previsto: la chat di design li confronta con i PNG.
B. Esegui, su locale-dev (solo il controllo CONSOLE e le simulazioni) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
   Il giro completo può durare più di 20 minuti: è normale. Non interromperlo e non dichiarare fatto ciò che non
   è girato.
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6. Scrivili NON PROVATO con il motivo.
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-17-locale-prod/ e 2026-10-17-locale-dev/ come da README,
   sezione 7, e un riepilogo breve in docs/design/verifica/esiti/2026-10-17-V2bis/rapporto.md: i sei P (P1–P6) uno
   per uno con l'esito, i difetti del lanciatore uno per uno con l'esito, e l'elenco dei NON PROVATO con il motivo.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti),
né i controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/`: fai tu `git add -A` e un commit con il messaggio `test(ui-verify): V2 bis — rilievi P e difetti del lanciatore corretti`, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.


### Passo 14c — V2 ter: l'agente verifica le correzioni di F2 su Piatti

> **Esito (2026-10-17)**: **eseguito prima di F2** (commit `3a27e4a`): ha misurato lo stesso codice di V2 bis. Ha però corretto i difetti rimasti del lanciatore. Le correzioni di F2 (`c9eda6e`, `a2e25d4`, `2b53c00`) si verificano con **V2 quater** (passo 14d, sotto). Il prompt di questa scheda resta per riferimento.

**Quando**: **dopo** che F2 (passo 14) è chiuso, controllato e pushato. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V2 ter,
dopo la chat F2 (correzione dei rilievi P di V2).

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (schermate home, navigazione, piatti; comuni) e
   docs/design/verifica/controlli-8.2.json (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. docs/design/verifica/esiti/2026-10-17-V2/rilievi.md (compreso l'«Aggiornamento dopo V2 bis») e
   docs/design/verifica/esiti/2026-10-17-V2bis/rapporto.md
6. Le specifiche, solo per capire i controlli: docs/design/schermate/piatti/spec.md,
   docs/design/schermate/integrazione/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status
   --short). Se git status non è pulito, fermati e dimmelo.
A. LANCIATORE (modifichi solo scripts/ui-verify/**, mai i controlli JSON). Correggi i difetti rimasti dopo V2 bis:
   1. piatti-colonna-elenco: FALLITO se il nome della scheda ha meno di 100 px (avviso se fuori di 10 px da 137).
   2. piatti-tassonomie: aspetta che le opzioni del Select si carichino e leggile aprendo il menu; riporta le
      opzioni lette, quelle delle collection e l'esito delle creazioni rifiutate. Il menu deve mostrare i NOMI
      delle categorie (non gli identificativi) e nel foglio dei filtri «Tutte le categorie» e «Tutti».
   3. piatti-modulo-inglese: leggi il piatto senza inglese per id (o per nome con locale it), non per nome con
      locale en: l'inglese è vuoto e la ricerca non lo troverebbe. Atteso: con locale=en nome e descrizione
      ricadono sull'italiano.
   4. piatti-ordine-100: porta il numero TOTALE dei piatti a 101 (crea 101 meno quelli già presenti), poi verifica
      «Mostrati 100 piatti su 101».
   5. piatti-stati-ui: togli la voce «vuoto» (è nel controllo piatti-stato-vuoto, NON PROVABILE).
   6. piatti-elimina-concorrenza: atteso «Non si può eliminare {nome}» con l'elenco aggiornato dei menù oppure
      «Operazione non riuscita»; in entrambi i casi il piatto resta (il JSON e la specifica sono già aggiornati).
B. Esegui, su locale-dev (solo il controllo CONSOLE e le simulazioni) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
   Il giro completo dura più di 20 minuti: è normale. Non interromperlo e non dichiarare fatto ciò che non è girato.
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6. Scrivili NON PROVATO con il motivo.
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-17-locale-prod/ e 2026-10-17-locale-dev/ come da README,
   sezione 7, e un riepilogo breve in docs/design/verifica/esiti/2026-10-17-V2ter/rapporto.md: i sei P (P1–P6) uno
   per uno con l'esito (corretto, non corretto, non valutabile) e il valore misurato, i difetti del lanciatore uno
   per uno, i NON PROVATO con il motivo, e il numero di screenshot salvati per il confronto visivo.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i
controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami il suo resoconto finale. Fai tu `git add -A` e un commit con il messaggio `test(ui-verify): V2 ter — verifica delle correzioni di F2 su Piatti`, poi il push, e scrivimi «push fatto». Io confronto gli screenshot con i PNG di riferimento (C10), assegno i rilievi e ti do il prompt di aggiornamento stato (§1.3). Il passo 13 diventa ✅ quando V2 ter è senza P aperti.


### Passo 14d — V2 quater: l'agente verifica le correzioni di F2 su Piatti

**Quando**: ora che F2 è chiuso e nel repo (passo 14 ✅). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V2 quater,
dopo la chat F2 (correzione dei rilievi P di V2). Le correzioni di F2 sono nei commit c9eda6e, a2e25d4 e 2b53c00.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (schermate home, navigazione, piatti; comuni) e
   docs/design/verifica/controlli-8.2.json (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. docs/design/verifica/esiti/2026-10-17-V2/rilievi.md (compreso l'«Aggiornamento dopo V2 bis») e
   docs/design/verifica/esiti/2026-10-17-V2ter/rapporto.md
6. Le specifiche, solo per capire i controlli: docs/design/schermate/piatti/spec.md,
   docs/design/schermate/integrazione/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status
   --short). Se git status non è pulito, fermati e dimmelo.
   PRECONDIZIONE: esegui `git log --oneline 3076b1c..HEAD -- app components lib`. Deve elencare i commit di F2
   (almeno «fix(app): F2 correzione rilievi P1–P6 schermata Piatti» e «fix(ui): F2 checkbox»). Se non c'è alcun
   commit che tocchi app/, components/ o lib/, FERMATI subito e dimmi che F2 non è nel repo: non eseguire nessun
   giro.
A. LANCIATORE (modifichi solo scripts/ui-verify/**, mai i controlli JSON):
   1. Correggi l'errore di lint in scripts/ui-verify/menu-payload.ts:326 (prefer-const) e verifica che
      pnpm lint dia 0 errori e nessun avviso nuovo nei file di scripts/ui-verify/** che hai toccato.
   2. Se trovi altri difetti del lanciatore, correggili e riportali uno per uno.
B. Esegui, su locale-dev (solo il controllo CONSOLE e le simulazioni) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata piatti,home,navigazione
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
   pnpm ui:verify --livello 2 --controlli controlli-8.5.json --schermata orari   (regressione: F2 ha toccato
   componenti condivisi, checkbox e collapsible)
   Il giro completo dura più di 20 minuti: è normale. Non interromperlo e non dichiarare fatto ciò che non è girato.
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6. Scrivili NON PROVATO con il motivo.
D. Salva gli screenshot di TUTTI gli stati con riferimento (sezione immagini del JSON) a 390 e 1280 px, in chiaro e
   scuro: la chat di design li confronta con i PNG di riferimento (C10). Scrivi gli esiti in
   docs/design/verifica/esiti/2026-10-17-locale-prod/ e 2026-10-17-locale-dev/ come da README, sezione 7, e un
   riepilogo breve in docs/design/verifica/esiti/2026-10-18-V2quater/rapporto.md con: i sei P (P1–P6) uno per uno
   (corretto, non corretto, non valutabile) con il valore misurato e quello atteso; per la casella, i due
   rettangoli (radice e quadratino) misurati; i NON PROVATO con il motivo; il numero di screenshot salvati.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status e git log). Non toccare app/, components/, lib/, docs/design (fuori da
verifica/esiti), né i controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il
valore misurato e quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo:
scrivilo come «controllo dubbio».
```

**Quando Cursor ha finito**: incollami il suo resoconto finale. Fai tu `git add -A` e un commit con il messaggio `test(ui-verify): V2 quater — verifica di F2 su Piatti e lint pulito`, poi il push, e scrivimi «push fatto». Io confronto gli screenshot con i PNG di riferimento (C10), assegno i rilievi e ti do il prompt di stato. Il passo 13 diventa ✅ quando V2 quater è senza P aperti.

### Passo 15 — VC3: l'agente implementa i controlli di Vini, Distillati, Bevande

> **Esito (2026-10-18)**: accettato, dopo due correzioni nella stessa chat (`ef5942c`, `1fdb2d9`). Cablaggio di Vini, Distillati e Bevande (`run-catalog.mjs`, 31 + 26 + 26 controlli riconosciuti); contesto touch degli screenshot C10 corretto con `isMobile` e `hasTouch` (misurato: pulsante 42–44 px contro 34 px senza tocco; l'override di `matchMedia` in JavaScript non cambia gli stili CSS `pointer-coarse:`); `C2-mouse` senza `textarea`; controlli nuovi `piatti-casella-misure` e `piatti-allergeni-selezione` ora con misure vere (radice 44×44 e quadratino 16×16 per le quattro caselle, interruttori 32×18); regola «misura vuota = NON PROVATO» (`measure-esito.mjs`). Tutti i controlli di Vini, Distillati e Bevande a runtime sono NON PROVATI finché non esistono le schermate (I3); i flussi in debito (bulk da 101, confronto visivo, SQL) li completa il passo V dopo I3. Rapporto: `docs/design/verifica/esiti/2026-10-18-controlli/rapporto.md`.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui IMPLEMENTI I CONTROLLI nel lanciatore, non
verifichi ancora nessuna schermata nuova. Istanza: VC3, prima della chat I3 della sottofase 6.6.

Prerequisito: i controlli di queste schermate li scrive la chat di design in docs/design/verifica/controlli-6.6.json.
Se una delle schermate indicate qui sotto NON è nel file, fermati e dimmelo: non scriverle tu.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md (sezione 6: ordine per ogni schermata nuova)
3. docs/design/verifica/controlli-6.6.json, SOLO le schermate: vini, distillati, bevande; più i controlli comuni
   (NO-OVERRIDE, RICOMPILA-ASSENTE, RICOMPILA-PRESENTE) e dati_e_sicurezza.
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/vini/spec.md, distillati/spec.md, bevande/spec.md

Poi:
A. Il lanciatore ha già il modulo scripts/ui-verify/lib/run-menu.mjs creato dal passo VC1, con la gestione di
   «stato_prova» e «rinviato_a», delle simulazioni APP_MENU_DEV_SIMULATE_* e dei dati di prova «verify-ui-…»:
   ESTENDILO, non crearne un altro. Per ogni controllo delle schermate indicate, trova se il lanciatore sa già
   eseguirlo (stesso tipo, stesso selettore). Elenca quelli che mancano.
B. Implementa i tipi di controllo che mancano (elenco raggruppato per tipologia, foglio dei filtri con il filtro per origine a cascata (paese, regione, denominazione), select con la voce per svuotarlo, campo anno con la casella «Senza annata (NV)», avviso con «Mostra altri vini» con 101 voci di prova, flussi con dati «verify-ui-…»). Non cambiare nessun controllo, soglia o tolleranza dei
   file JSON; i testi attesi delle costanti si leggono da lib/, non si copiano. Se un controllo ti sembra sbagliato
   o impossibile, scrivilo come «controllo dubbio» e lascialo com'è.
B2. Difetti noti del lanciatore da correggere (rilievi di V2 quater, docs/design/verifica/esiti/2026-10-18-V2quater/rilievi.md):
   1. gli screenshot del confronto visivo (C10) vanno scattati con il contesto touch dei controlli C2 (oggi i
      pulsanti risultano alti 35 px nello screenshot e 44 px nelle misure);
   2. C2-mouse deve escludere la textarea (il JSON la esclude già: il selettore del lanciatore è fisso);
   3. implementa i controlli nuovi di Piatti piatti-casella-misure e piatti-allergeni-selezione (il secondo seleziona
      due allergeni e una caratteristica prima dello screenshot).
C. Prova il cablaggio: pnpm lint e pnpm typecheck verdi; il lanciatore carica controlli-6.6.json e riconosce ogni
   id e tipo delle schermate indicate. Le schermate non ancora implementate (le fa la chat I3) danno NON PROVATO
   con l'evidenza «schermata non ancora implementata», senza errori del lanciatore. Non provare le schermate.
   Per i flussi che richiedono la schermata esistente (moduli, finestre, simulazioni): implementa tutto ciò che si
   può senza la pagina (id, tipo, lettura degli attesi da lib/, dati di prova, funzioni di supporto) ed elenca nel
   rapporto, sotto «Debito», i flussi che restano da completare: li completa ed esegue l'agente di verifica del
   passo V successivo, dopo la chat di implementazione (policy-test.md §6, ultimo capoverso).
D. Scrivi in docs/design/verifica/esiti/<AAAA-MM-GG>-controlli/ un breve rapporto: controlli già coperti, controlli
   aggiunti, controlli dubbi, NON PROVATO (con il motivo).

Non fare git (puoi leggere git status). Puoi modificare solo scripts/ui-verify/** e il rapporto; non toccare app/,
components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in italiano, distinguendo
sempre OK, FALLITO, AVVISO e NON PROVATO.
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `test(ui-verify): controlli di Vini, Distillati, Bevande nel lanciatore (VC3)`

### Passo 16 — I3: Vini, Distillati, Bevande

> **Esito (2026-10-18)**: accettato dopo una correzione (`97a48b5`). Tre schermate in un commit (`7bdfa5b`, 62 file; nessun file in `collections/`, nessuna dipendenza; 66 test unitari su 66 nel mio ambiente). Il primo rapporto dava il lint a 6 errori `react-hooks/set-state-in-effect`, descritti a torto come «preesistenti»: corretti (lint 0 errori) togliendo gli effetti di sincronizzazione e azzerando il modulo con la `key`. **Debito**: Distillati e Bevande restano molto simili (pagina elenco 79 %, azioni 67 %, foglio del modulo 68 %); l'estrazione si valuta alla chiusura della 6.6 (I6), non prima. **Nota di processo**: Composer ha toccato una riga del lanciatore (`run-catalog.mjs`: l'opzione «Tutti i paesi» al posto di «—»), cosa che le regole non gli consentono; la modifica è giusta (era un «controllo dubbio» di VC3, allineato alla specifica §6) e la tengo. I flussi veri di Vini, Distillati e Bevande (cascata, anno e NV, «Mostra altri», bulk da 101, eliminazione, validazione) non sono ancora stati eseguiti: li esegue il passo 16b (V3).

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 16 (I3). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I3: schermate Vini (/app/menu/wines), Distillati (/app/menu/spirits), Bevande (/app/menu/drinks).

LEGGI
- docs/design/schermate/vini/spec.md, distillati/spec.md, bevande/spec.md, per intero, con i mockup.
- docs/design/decisioni-layout-app.md (D5, D8, D9, D10, D13, D14, D15, A33–A43).
- docs/piano-sviluppo/ADR-108 (note sui formati e sull'origine dei vini), ADR-112.
- Codice: la schermata Piatti (modello di elenco, filtri, foglio, azioni), i blocchi condivisi di I1, il modulo dei
  formati di I0b (lib/menu/formats.ts o come è stato chiamato), lib/menu/validateWineGeography.ts,
  collections/menu/menuContentCollections.ts (wines, spirits, drinks e tassonomie).

COSA FARE
1. Riusa lo scheletro di Piatti: se una parte serve a più schermate, estraila in un blocco condiviso; non copiare.
2. Vini: raggruppati per tipologia; foglio dei filtri con il filtro per origine a cascata (paese, regione,
   denominazione); la classificazione non è un filtro; oltre 100 voci l'avviso con «Mostra altri vini»; modulo con
   la cascata (regione e denominazione disabilitate finché manca il livello superiore o non esistono valori; il
   cambio del livello alto svuota quelli sotto), classificazioni del paese scelto (aiuto dell'interfaccia, non
   validazione), anno numerico validato con la casella «Senza annata (NV)», capacità e grado a scelta con le liste
   del modulo dei formati, prezzo al calice facoltativo; gli errori di coerenza geografica del server si mostrano
   sotto il campo indicato.
3. Distillati: nessuna geografia a cascata, nessun anno, nessun prezzo al calice, nessuna capacità; grado e
   invecchiamento a scelta; un solo prezzo, con l'etichetta «Prezzo al bicchiere (€)».
4. Bevande: nome e descrizione localizzati (la traduzione inglese contiene anche il nome); paese facoltativo con
   «Nessun paese»; capacità e grado a scelta; nessuna scelta degli allergeni.
5. Tutti: ogni `Select` riceve `items` (valore → etichetta), altrimenti il trigger mostra il valore interno (era il
   difetto P4 di Piatti): stesso schema di dish-form-sheet.tsx e dishes-page.tsx; ogni select facoltativo ha la voce per svuotarlo; un valore già salvato e fuori elenco resta visibile e
   salvabile; Paesi e regioni nei menu a tendina filtrati NELLA QUERY (solo enabled), non solo nascosti.
6. Accendi in navigazione le tre voci (enabled: true) e aggiorna scripts/verify-lib-app-8_2.ts con le voci abilitate.

NON FARE: altre schermate, modifica dei formati (sono di I0b), «Ricompila» visibile.

VERIFICHE: L0; L1 su `vini,distillati,bevande`. Per «Mostra altri vini» crea nel database di sviluppo 101 vini di
prova e poi eliminali (dichiaralo nella risposta); mai dati di prova in produzione.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.


### Passo 16b — V3: l'agente esegue L2 su Vini, Distillati e Bevande

> **Chiuso (2026-10-18)**: ✅ con V3 bis (passi 16c, 16d, 16e). **P1 confermato corretto**: la prova mirata con due vini (paese Filippine e Vietnam, entrambi disabilitati) mostra nel trigger il paese salvato (Filippine, Vietnam), e il menu aperto lo marca come selezionato; il FALLITO di `vini-origine-fuori-filtro` era del lanciatore (il paese della Local API è un oggetto con il nome localizzato; apriva un record non verificato). Il C2 dell'eliminazione misura 288×44 in tutti e quattro i casi (la prima misura era durante l'animazione di apertura). **Debito del lanciatore dei cataloghi** (NON PROVATO, nessun difetto dell'app): `*-persistenza`, `vini-formati-ui`, `vini-origine-cascata`, `bevande-modulo-inglese`; si chiude nel passo 18 (VC4), con una prova breve `--solo`, e comunque prima di V6.

> **Esito (2026-10-18)**: **incompleto**, circa due ore di esecuzione (non giustificate: vedi il passo 16d). Eseguiti i flussi veri dei tre cataloghi (200 screenshot), regressione veloce OK. Dei 33 FALLITO, un solo difetto dell'app è certo (**P1**: il modulo mostra l'identificativo di un valore salvato fuori dall'elenco, per esempio un paese poi disabilitato); gli altri sono difetti del lanciatore o misure troppo povere per classificare. Rilievi in `docs/design/verifica/esiti/2026-10-18-V3/rilievi.md`. Il passo si chiude con **16e (V3 bis)**.

**Quando**: ora che I3 e la sua correzione sono nel repo (passo 16 ✅) e i controlli di Servizi e Menù fissi sono già nel file (passo 17 ✅). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Non** lanciare VC4 (passo 18) in parallelo: usano lo stesso lanciatore e lo stesso build.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V3, dopo la
chat I3 (schermate Vini, Distillati e Bevande) e la sua correzione. I commit di I3 sono 7bdfa5b e 97a48b5.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (schermate vini, distillati, bevande; comuni) e
   docs/design/verifica/controlli-8.2.json (shell, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. docs/design/verifica/esiti/2026-10-18-controlli/rapporto.md, sezione «Debito» (i flussi che VC3 ha lasciato da
   completare dopo I3)
6. Le specifiche, solo per capire i controlli: docs/design/schermate/vini/spec.md, distillati/spec.md,
   bevande/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status
   --short). Se git status non è pulito, fermati e dimmelo.
   PRECONDIZIONE: `git log --oneline 7f87ecb..HEAD -- components/app/wines components/app/spirits
   components/app/drinks` deve elencare i commit di I3. Se non c'è nessun commit che li tocchi, FERMATI subito e
   dimmi che I3 non è nel repo: non eseguire nessun giro.
A. LANCIATORE (modifichi solo scripts/ui-verify/**, mai i controlli JSON). Completa ed esegui i flussi in debito:
   bulk da 101 record con «Mostra altri …» (porta il TOTALE a 101: crea 101 meno quelli già presenti; poi pulisci),
   formati dal server (Local API e, se pnpm dev è avviato, REST), eliminazione con registro e permessi, persistenza,
   filtri a cascata dell'origine dei vini, anno e NV, coerenza geografica, opzioni dell'origine filtrate nella
   query (Libano e Sicilia assenti), capacità non gestita dei distillati, paese facoltativo delle bevande, confronto
   visivo (salva TUTTI gli stati con riferimento a 390 e 1280 px, chiaro e scuro, nel contesto touch dei profili con
   tocco). Se un controllo non riesce a misurare, scrivi NON PROVATO con il motivo, mai OK. Se trovi difetti del
   lanciatore, correggili e riportali uno per uno. pnpm lint a 0 errori.
B. Esegui, su locale-dev (solo il controllo CONSOLE e le simulazioni) e su locale-prod (tutti gli altri), UNA
   schermata per volta, per non superare il tempo massimo:
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata vini
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata distillati
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata bevande
   Regressione veloce (livello 1): --schermata piatti,home,navigazione con controlli-6.6.json e
   --schermata shell con controlli-8.2.json (I3 ha toccato blocchi condivisi: avvisi, stato vuoto, nav).
   Ogni giro può durare più di 15 minuti: è normale. Non interromperlo e non dichiarare fatto ciò che non è girato.
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6. Scrivili NON PROVATO con il motivo.
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-18-locale-prod/ e 2026-10-18-locale-dev/ come da README,
   sezione 7, e un riepilogo in docs/design/verifica/esiti/2026-10-18-V3/rapporto.md con, per OGNI schermata: i
   controlli OK, FALLITO e AVVISO con il valore misurato e quello atteso (mai «—»); per ogni FALLITO la tua
   classificazione («difetto dell'app», «difetto del lanciatore», «controllo dubbio»); i NON PROVATO con il motivo;
   il numero di screenshot salvati.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti (anche i record del bulk), e verifica con git status che
   i file nuovi siano solo quelli attesi.

Non fare git (puoi leggere git status e git log). Non toccare app/, components/, lib/, docs/design (fuori da
verifica/esiti), né i controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il
valore misurato e quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo:
scrivilo come «controllo dubbio».
```

**Quando Cursor ha finito**: incollami il suo resoconto finale. Fai tu `git add -A` e un commit con il messaggio `test(ui-verify): V3 — L2 su Vini, Distillati e Bevande`, poi il push, e scrivimi «push fatto». Io confronto gli screenshot con i PNG di riferimento (C10), assegno i rilievi P e A e, se ci sono P, ti do il prompt di correzione.


### Passo 16c — F3: correzione di P1 su Vini, Distillati e Bevande

> **Esito (2026-10-18)**: ✅ `8336553`. P1 corretto nel codice: il nome del valore salvato arriva dalle relazioni già caricate (`relationshipName`) ed è abbinato all'identificativo **salvato** (`initialValues.*Id`) per paese, regione, denominazione e classificazione nei vini e per il paese nei distillati e nelle bevande; 69 test unitari su 69 nel mio ambiente (casi: fuori elenco, valore cambiato, opzioni non ancora caricate, dentro elenco). L'effetto non è ancora confermato da un L1: il primo L1 di Composer ha dato `vini-origine-fuori-filtro` FALLITO prima di un ultimo ritocco (`SelectValue`) e il secondo è stato interrotto: lo conferma V3 bis. Composer ha lanciato **due L1 insieme** (stessi server, stessa porta, stessi dati di prova): per questo VC-tempi aggiunge un blocco contro i giri concorrenti. I sei punti «da verificare» sono stati letti nel codice: nessuna evidenza di difetto dell'app (probabile lanciatore).

**Quando**: ora. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (è autonomo; **non** il Blocco comune).

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F3: correzione del rilievo P1 della verifica L2 V3.
Fai solo questo. Le regole di .cursor/rules si caricano da sole.

LEGGI per intero:
- docs/design/verifica/esiti/2026-10-18-V3/rilievi.md (P1, i punti «da verificare» e i difetti del lanciatore)
- docs/design/schermate/vini/spec.md, distillati/spec.md e bevande/spec.md, in particolare §7 (valore salvato fuori
  elenco)
- il codice: components/app/wines/wine-form-sheet.tsx, spirit-form-sheet.tsx, drink-form-sheet.tsx,
  lib/menu/catalog/selectItems.ts, app/(app)/app/(shell)/menu/wines-actions.ts, spirits-actions.ts, drinks-actions.ts,
  lib/app/menu/catalog/catalogActions.ts

REGOLE
1. Correggi SOLO il P1. Non toccare controlli, soglie, specifiche, documenti di design (docs/design/**) né
   scripts/ui-verify/**: il lanciatore non è tuo. Gli altri punti del rilievo («da verificare») li leggi nel codice e
   riporti la causa che vedi, SENZA correggere senza evidenza.
2. PARTE A, solo proposta: per P1 scrivi la causa che vedi nel codice, i file che toccherai e come leggi il nome del
   valore salvato; per ogni punto «da verificare» scrivi che cosa vedi nel codice e se, secondo te, è un difetto
   dell'app o del lanciatore (con la riga di codice). Poi FERMATI e aspetta il mio «procedi».
3. P1: un valore salvato che non è più nell'elenco (paese o regione disabilitati, denominazione o classificazione non
   più presenti) deve mostrare il NOME del valore salvato nel campo, e restare salvabile senza cambiarlo.
   buildSelectItems oggi riceve l'etichetta solo per alcuni campi, e nella regione passa l'identificativo come
   etichetta. Leggi il nome dal record salvato (depth sufficiente) e passalo come savedLabel per paese, regione,
   denominazione e classificazione nei vini e per il paese nei distillati e nelle bevande. Test unitari (node
   --experimental-strip-types con il caricatore) che mostrano il nome per un valore fuori elenco.
4. Dati: Local API con la sessione dell'utente (overrideAccess: false). Nessuna dipendenza, nessuna migrazione.
5. Verifiche: L0 (pnpm typecheck, pnpm lint con 0 errori, pnpm ui:check, test unitari di lib/) e un L1 BREVE:
   pnpm ui:verify locale-prod --livello 1 --schermata vini,distillati,bevande --controlli controlli-6.6.json
   --profili telefono-390 --temi chiaro. Non fare giri più lunghi: la verifica completa la farà V3 bis.
6. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased] (cosa era sbagliato e cosa è cambiato);
   commit locale (messaggio che nomina F3); MAI git push.
7. RISPOSTA FINALE: tabella «Esiti reali» per P1 e, per ogni punto «da verificare», che cosa hai letto nel codice.
```

**Quando Cursor ha scritto la Parte A**: incollamela qui; io rispondo con il «procedi» e le correzioni. Poi segui il ciclo normale: tabella degli esiti, commit, push, «push fatto».

### Passo 16d — VC-tempi: il lanciatore veloce, mirato e senza blocchi

> **Esito (2026-10-18)**: ✅ `1d1bc00` (lanciatore 3.5.0). Criteri di accettazione rispettati: rilancio mirato di tre controlli in **40,8 s** (build rifatta) e **33,4 s** (build riusata); L2 con due schermate rifiutato subito; stato forzato oltre il tempo: NON PROVATO «tempo» e prosecuzione; nessun listener residuo sulle porte; secondo avvio rifiutato con il PID del primo; lint a 0 errori. Controllato nel repo: 18 file, tutti in `scripts/ui-verify/**` e negli esiti; sintassi dei file verificata; presenti `--solo`, il blocco (`.next/ui-verify.lock`, messaggio «giro già in corso (PID …)»), il rifiuto di più schermate a livello 2, la build riusata e i tempi (`lib/timeouts.mjs`: 90 s per flusso, 60 s per cella; budget 15 min per schermata con guardia; timeout locale-prod di nuovo a 25 minuti). Opzioni nuove: `--solo <id,…>`, `UI_VERIFY_BUDGET_MS`, `UI_VERIFY_STATE_TIMEOUT_MS`, `UI_VERIFY_FLOW_TIMEOUT_MS`. Da qui ogni V si lancia **una schermata per volta**, o con `--solo`.

**Perché**: V3 è durato circa due ore (V2 quater circa 26 minuti per giro). I blocchi e la lentezza vengono dal lanciatore, non dal modello: nessun tempo massimo vero, uscita non garantita, build rifatta a ogni giro, nessuna possibilità di rilanciare un solo controllo. **Quando**: dopo F3 (16c), prima di V3 bis e di qualunque altro giro lungo. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui MIGLIORI IL LANCIATORE (scripts/ui-verify/**):
non verifichi nessuna schermata nuova. Istanza: VC-tempi. Obiettivo: giri più veloci, mirati, che non si bloccano e che non si sovrappongono.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/esiti/2026-10-18-V3/rilievi.md (sezione «Difetti del lanciatore») e
   docs/design/verifica/esiti/2026-10-18-V3/rapporto.md
4. scripts/ui-verify/run.mjs e scripts/ui-verify/lib/ (cli.mjs, engine.mjs, run-menu.mjs, run-piatti.mjs,
   run-catalog.mjs, run-catalog-flows.mjs, report.mjs, ensure-ports.mjs)

Poi, in quest'ordine (modifichi SOLO scripts/ui-verify/**, mai i controlli JSON):
A. Rilancio mirato: aggiungi `--solo <id,id,…>` che esegue SOLO i controlli indicati (qualunque schermata), anche a
   livello 2, senza eseguire gli altri e senza i loro stati; le righe dei controlli non eseguiti restano quelle
   dell'ultimo esito (non vengono azzerate). Con --solo il profilo e il tema si limitano a quelli del controllo (o a
   --profili e --temi se indicati).
B. Build riusata: salva in .next/ui-verify-build.json l'hash di git HEAD più l'hash dello stato di app/, components/,
   lib/, collections/, globals/, payload.config.ts, package.json e pnpm-lock.yaml (git diff e file non tracciati). Se
   l'hash coincide con l'ultima build riuscita, salta pnpm build e riusa .next; altrimenti rifai la build. Scrivi
   nel log «build riusata» o «build rifatta».
C. Tempi massimi veri, con uscita forzata:
   1. per ogni controllo a flusso 90 secondi; per ogni stato della matrice C1/C2/C3 60 secondi. Allo scadere: esito
      NON PROVATO con il motivo «tempo» e il nome dello stato o del passo, e si prosegue;
   2. un budget per schermata (default 15 minuti, configurabile con UI_VERIFY_BUDGET_MS) e un timer di guardia
      (budget più 2 minuti) che, se il giro è ancora vivo, chiude il browser, ferma il server e fa process.exit con
      i risultati già scritti. Riporta il default di 25 minuti (non 45) e togli l'allungamento a 45 minuti.
   3. chiusura pulita in un finally: browser, contesti, server di produzione e server di simulazione (porta 3200)
      sempre chiusi, anche dopo un errore; alla fine controlla con `ps` che non ne resti nessuno e scrivilo nel log.
D. A livello 2 il lanciatore ACCETTA UNA SOLA schermata per volta: con più schermate esce subito con un messaggio
   chiaro («a livello 2 lancia una schermata per volta, oppure usa --solo»), senza eseguire nulla. Il livello 1 resta
   libero.
E. Esiti onesti: ogni FALLITO e ogni AVVISO riporta i valori REALI misurati e attesi; se una parte del controllo non è
   provabile, NON PROVATO per quella parte, mai FALLITO per tutto il controllo. In particolare:
   1. i controlli *-elimina-registro-permessi non danno FALLITO perché l'utente «senza ruolo» non è creabile (schema
      Users): quella parte è NON PROVATO «coperto da scripts/verify-roles-8_3.ts» e il resto decide l'esito;
   2. i controlli *-modulo-inglese, *-tassonomie, *-persistenza e vini-formati-ui scrivono nel «misurato» che cosa è
      stato letto (opzioni, valori, conteggi), e per le opzioni dei Select aspettano che si carichino aprendo il menu
      prima di leggerle (come già in piatti-tassonomie);
   3. la creazione di un record dal modulo sceglie davvero la tipologia (e il paese dove serve) prima di salvare.
E2. Blocco contro i giri concorrenti: all'avvio il lanciatore crea un file di blocco (per esempio .next/ui-verify.lock,
   o nella cartella temporanea) con PID e ora di avvio; se un altro giro è vivo (il PID esiste ancora) esce SUBITO
   con il messaggio «giro già in corso (PID …, avviato alle …): attendi o ferma quel processo»; un blocco con PID
   morto si ignora e si sovrascrive; il blocco si toglie nel finally e anche nel timer di guardia. Vale per ogni
   livello (anche L1) e per ogni schermata.
F. Prova, con numeri: (1) `--solo piatti-testi,piatti-azioni-pagina,piatti-colonna-elenco` su locale-prod: riporta il
   tempo totale (atteso meno di 4 minuti) e se ha riusato la build; (2) lo stesso comando subito dopo: atteso build
   riusata e meno di 2 minuti; (3) un L2 con due schermate: atteso il messaggio di rifiuto; (4) uno stato forzato a
   superare il tempo (per esempio con UI_VERIFY_STATE_TIMEOUT_MS=1000): atteso NON PROVATO «tempo» e prosecuzione;
   (5) `ps` a fine giro senza processi residui; (6) un secondo avvio mentre il primo gira: atteso il rifiuto con il
   PID del primo, e nessun processo del secondo rimasto vivo. pnpm lint a 0 errori.
G. Scrivi un breve rapporto in docs/design/verifica/esiti/2026-10-18-VCtempi/rapporto.md con le cinque misure e le
   opzioni nuove (--solo, UI_VERIFY_BUDGET_MS, UI_VERIFY_STATE_TIMEOUT_MS).

Non fare git (puoi leggere git status e git log). Non toccare app/, components/, lib/, docs/design (fuori da
verifica/esiti), né i controlli JSON. Rispondi in italiano con la tabella OK / FALLITO / NON PROVATO delle cinque prove.
```

**Quando Cursor ha finito**: incollami il resoconto, commit `test(ui-verify): VC-tempi — rilancio mirato, build riusata, tempi massimi, una schermata per giro`, push, «push fatto». Criterio di accettazione: i tempi misurati al punto F; se non li rispetta, non passiamo oltre.

### Passo 16e — V3 bis: rilancio mirato dei controlli di V3

> **Esito (2026-10-18)**: ✅ (`54ed0d6`, `d48f3f5`, `e8716c6`). Due passate più una prova mirata su P1; durata complessiva circa un'ora (oltre l'obiettivo di 15 minuti: build rifatta e matrice C2 completa nel merge `--solo`, poi corretti con `--stati`). Esiti nel passo 16b.

**Quando**: dopo F3 (16c) e VC-tempi (16d). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V3 bis, dopo F3
(correzione del rilievo P1) e dopo VC-tempi (lanciatore con --solo, build riusata e tempi massimi).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/README.md e
policy-test.md; docs/design/verifica/esiti/2026-10-18-V3/rilievi.md; docs/design/verifica/esiti/2026-10-18-VCtempi/
rapporto.md; docs/design/schermate/vini/spec.md, distillati/spec.md e bevande/spec.md (solo per capire i controlli).

Poi:
0. Riporta l'hash di HEAD e git status (solo lettura). PRECONDIZIONI: `git log --oneline 8acc58f..HEAD -- components
   lib app` deve elencare il commit di F3, e `git log --oneline 8acc58f..HEAD -- scripts/ui-verify` quello di
   VC-tempi. Se manca uno dei due, FERMATI e dimmelo.
B. Rilancia SOLO questi controlli con `--solo <id,id,…>` (opzione di VC-tempi: un solo comando per schermata, con i
   controlli elencati; lo stesso comando può essere ripetuto riusando la build). Il lanciatore ora rifiuta due
   giri contemporanei e più schermate a livello 2, ha tempi massimi veri e chiude da solo browser e server: non
   lanciare mai un secondo giro mentre uno è attivo. Profili e temi: il minimo (telefono-390 chiaro, e
   notebook-1280 chiaro dove il controllo lo richiede):
   - vini: vini-origine-fuori-filtro, vini-origine-cascata, vini-tassonomie, vini-persistenza, vini-formati-ui,
     vini-modulo-inglese, vini-elimina-registro-permessi, C2 sullo stato «elimina»
   - distillati: distillati-origine-fuori-filtro se esiste, distillati-tassonomie, distillati-persistenza,
     distillati-modulo-inglese, distillati-elimina-registro-permessi, C2 sullo stato «elimina»
   - bevande: gli stessi (per il paese facoltativo: bevande-paese-facoltativo)
   Per il «fuori filtro» (P1): disabilita un paese con la Local API, apri il modulo di un record che lo usa e riporta
   che cosa mostra il campo (atteso: il NOME del paese), poi ripristina il paese in un finally.
   Per C2 sull'eliminazione: riporta le altezze misurate dei pulsanti «Indietro» ed «Elimina» e lo stesso valore in
   Piatti, nello stesso contesto, così si capisce se la differenza è dell'app o della misura.
C. Per ogni controllo riporta il valore misurato e quello atteso (mai «—») e la tua classificazione: «corretto»,
   «difetto dell'app», «difetto del lanciatore», «controllo dubbio». Nessun giro completo. Tempo atteso: meno di
   15 minuti in tutto; se un controllo supera il tempo massimo, NON PROVATO con il motivo.
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-18-locale-prod/ e un riepilogo in
   docs/design/verifica/esiti/2026-10-18-V3bis/rapporto.md. Chiudi i processi, cancella i dati «verify-ui-…» e
   l'utente di prova.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in
italiano con la tabella OK / FALLITO / AVVISO / NON PROVATO.
```

**Quando Cursor ha finito**: incollami il resoconto, commit `test(ui-verify): V3 bis — rilancio mirato dei controlli di V3`, push, «push fatto». Se non ci sono P aperti, il passo 16b si chiude.

### Passo 17 — D5: controlli per Servizi e Menù fissi

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 17»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

Si fa in parallelo con la chat del passo 16 e deve essere pronto prima del passo 18.

### Passo 18 — VC4: l'agente implementa i controlli di Servizi e Menù fissi

> **Esito (2026-10-18)**: ✅ `f76c347` (lanciatore 3.6.0). 20 file, tutti in `scripts/ui-verify/**` e negli esiti; sintassi dei moduli nuovi verificata. Cablati i 23 controlli di Servizi e i 32 di Menù fissi (`run-menu-list.mjs`, `run-menu-list-flows.mjs`: schede come percorsi, «Scegli piatti», frecce, cascade, categoria vuota, visibilità); finché le schermate non esistono sono NON PROVATI. Delle cinque correzioni ai cataloghi: `vini-origine-cascata` OK, `distillati-paese-fuori-filtro` OK, `bevande-modulo-inglese` OK ma con una scoperta (vedi passo 18b), `bevande-paese-fuori-filtro` non rieseguito; **`vini-persistenza` e `vini-formati-ui` restano FALLITO per il lanciatore** (gli id dei campi esistono nell'app: timeout del flusso di creazione e riga di prova non raggiungibile in un elenco di oltre 100). Sono debito NON PROVATO, da riprendere in V6; la persistenza è coperta anche da `verify:menu-6_2` e dal giro L3.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui IMPLEMENTI I CONTROLLI nel lanciatore, non
verifichi ancora nessuna schermata nuova. Istanza: VC4, prima della chat I4 della sottofase 6.6.

Prerequisito: i controlli di queste schermate li scrive la chat di design in docs/design/verifica/controlli-6.6.json.
Se una delle schermate indicate qui sotto NON è nel file, fermati e dimmelo: non scriverle tu.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md (sezione 6: ordine per ogni schermata nuova)
3. docs/design/verifica/controlli-6.6.json, SOLO le schermate: servizi, menu-fissi; più i controlli comuni
   (NO-OVERRIDE, RICOMPILA-ASSENTE, RICOMPILA-PRESENTE) e dati_e_sicurezza.
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/servizi/spec.md, menu-fissi/spec.md, integrazione/spec.md (§2: schede come percorsi)

Poi:
A. Il lanciatore ha già il modulo scripts/ui-verify/lib/run-menu.mjs creato dal passo VC1, con la gestione di
   «stato_prova» e «rinviato_a», delle simulazioni APP_MENU_DEV_SIMULATE_* e dei dati di prova «verify-ui-…»:
   ESTENDILO, non crearne un altro. Per ogni controllo delle schermate indicate, trova se il lanciatore sa già
   eseguirlo (stesso tipo, stesso selettore). Elenca quelli che mancano.
B. Implementa i tipi di controllo che mancano (schede come percorsi (/app/menu/fixed e /app/menu/fixed/categories), vista «Scegli piatti» dentro lo stesso foglio, frecce «Sposta su» e «Sposta giù», conferme di eliminazione con il cascade dichiarato, campo Categoria vuoto, avvisi di visibilità). Non cambiare nessun controllo, soglia o tolleranza dei
   file JSON; i testi attesi delle costanti si leggono da lib/, non si copiano. Se un controllo ti sembra sbagliato
   o impossibile, scrivilo come «controllo dubbio» e lascialo com'è.
C. Prova il cablaggio: pnpm lint e pnpm typecheck verdi; il lanciatore carica controlli-6.6.json e riconosce ogni
   id e tipo delle schermate indicate. Le schermate non ancora implementate (le fa la chat I4) danno NON PROVATO
   con l'evidenza «schermata non ancora implementata», senza errori del lanciatore. Non provare le schermate.
   Per i flussi che richiedono la schermata esistente (moduli, finestre, simulazioni): implementa tutto ciò che si
   può senza la pagina (id, tipo, lettura degli attesi da lib/, dati di prova, funzioni di supporto) ed elenca nel
   rapporto, sotto «Debito», i flussi che restano da completare: li completa ed esegue l'agente di verifica del
   passo V successivo, dopo la chat di implementazione (policy-test.md §6, ultimo capoverso).
C2. DIFETTI NOTI del lanciatore dei cataloghi (V3 bis, docs/design/verifica/esiti/2026-10-18-V3bis/rapporto.md): correggili
   ora, con una prova breve --solo (una schermata per volta, --stati dove serve, meno di 10 minuti in tutto) e
   riporta i valori misurati:
   1. *-persistenza: la creazione dal modulo deve compilare TUTTI i campi obbligatori (nome, tipologia, paese dove
      serve, PREZZO), verificare la chiusura del foglio e l'avviso, chiudere i listbox prima di cliccare il campo
      successivo (select per id DOM, come #wine-field-country), poi leggere il record per id o per nome; se la
      creazione non riesce, riporta il messaggio del foglio.
   2. vini-formati-ui: il record di prova non si raggiunge in un elenco di oltre 100 vini: filtra con la ricerca
      «verify-ui-» prima di aprire la riga; riporta le opzioni lette di Capacità (Non indicata, 25, 33, 37,5, 50, 75,
      150 cl) e di Grado.
   3. vini-origine-cascata: scegli le opzioni con la tastiera (apri il campo, digita l'inizio del nome, Invio) o
      scorrendo finché l'opzione è visibile; riporta le regioni dell'Italia lette dal menu e quelle della collection.
   4. bevande-modulo-inglese: l'errore «Il seguente campo non è valido: Nome» arriva da create-catalog-items; una
      scrittura in locale en di un campo localizzato richiede anche il nome (campo obbligatorio): crea il record in
      italiano con il nome, poi aggiorna l'inglese includendo il nome o usando i dati completi. IMPORTANTE: prova
      anche DAL MODULO dell'app: apri una bevanda, scrivi SOLO la descrizione inglese e salva. Se fallisce con
      un errore sul nome, è un difetto dell'APP: riportalo con il messaggio e non correggerlo.
   5. Usa il parsing del paese della Local API per i controlli *-origine-fuori-filtro (il paese è un oggetto con il
      nome localizzato, per esempio { it: "Filippine" }), apri il record GIUSTO (sottotitolo uguale al nome), aspetta
      il caricamento e leggi il testo del trigger del campo Paese; gli id distillati-paese-fuori-filtro e
      bevande-paese-fuori-filtro sono già nel file dei controlli. Puoi riusare scripts/ui-verify/probe-p1-vini-dual-country.mjs.
D. Scrivi in docs/design/verifica/esiti/<AAAA-MM-GG>-controlli/ un breve rapporto: controlli già coperti, controlli
   aggiunti, controlli dubbi, NON PROVATO (con il motivo), e l'esito delle cinque correzioni del punto C2 con i valori
   misurati.

Non fare git (puoi leggere git status). Puoi modificare solo scripts/ui-verify/** e il rapporto; non toccare app/,
components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in italiano, distinguendo
sempre OK, FALLITO, AVVISO e NON PROVATO.
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `test(ui-verify): controlli di Servizi e Menù fissi nel lanciatore (VC4)`


### Passo 18b — F-EN: salvare solo la traduzione inglese non deve fallire

> **Esito (2026-10-18)**: ✅ `5e5b7d3`, `fad9e26`. Riprodotto il difetto su tutte e cinque le collection con un nome obbligatorio e localizzato (dishes, drinks, menu-services, fixed-menus, fixed-menu-categories). Scoperta mia durante la Parte A: nelle cinque tabelle delle lingue la colonna `name` è `NOT NULL` (migrazione 6.2), quindi «solo validazione» non bastava e Piatti aggirava il vincolo copiando il nome italiano in inglese. Correzione senza migrazione e senza cambio dei tipi: `required: true` invariato, `validate` personalizzata (`lib/menu/localizedNameField.ts`, delega a `text()` con l'obbligo solo per la lingua predefinita), nome inglese scritto come stringa vuota quando non c'è (Payload la tratta come assente nel ripiego), Piatti non copia più il nome italiano. Prova decisiva (a)–(e) superata su tutte e cinque, `verify:menu-6_2` con la nuova matrice OK, lint a 0 errori, 69 test su 69. Le due regressioni segnalate (`verify:menu-6_3` e `verify:menu-6_4`) erano **database di sviluppo sporco**, non F-EN: record `verify-ui-fen-*` rimasti e un wipe interrotto da una chiave esterna (il roundtrip di import di `verify:menu-6_4` cancella e reimporta tutti i piatti: per questo il conteggio poteva passare da 47 a 12). Ripristinato il database di sviluppo (wipe, import, secondo import: 0 creati) e rilanciati i due script: OK entrambi. Script di servizio nuovi, solo database di sviluppo (protetti da `assertDevDatabaseFromEnv`): `scripts/prep-wipe-clear-nonimport.ts` e `scripts/audit-dev-db-snapshot.ts`. **Debito documentale**: tre riferimenti diversi dell'impronta dell'import (`18cf7298…` di I0b, `d2cd0cc6…` del fingerprint di contenuto attuale, `EXPECTED_IMPORT_CONTENT_HASH` `16601c1c…` in `verify-menu-6_4-lib.ts`) con algoritmi diversi; l'impronta con id e date cambia a ogni wipe: da allineare nella chiusura (I6) e nella checklist di 6.8.

**Perché**: VC4 ha provato dal modulo dell'app a scrivere SOLO la descrizione inglese di una bevanda: il salvataggio dà «Operazione non riuscita». Il nome (`name`) è un campo **obbligatorio e localizzato** (`required: true, localized: true`), e le azioni scrivono l'inglese con `fallbackLocale: false` e solo i campi compilati: se il nome inglese è vuoto, Payload rifiuta la scrittura in `en`. Ma la traduzione inglese è **facoltativa** in tutte le specifiche («Se resta vuota, il menù mostra il testo italiano»). Il difetto vale probabilmente anche per Piatti e per le altre collection con il nome obbligatorio e localizzato (menu-services, fixed-menus, fixed-menu-categories), che oggi nessun controllo prova con la sola descrizione. **Quando**: ora, prima di I4 (che costruisce Servizi e Menù fissi). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (è autonomo; non il Blocco comune).

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F-EN: correzione di un difetto emerso da VC4. Fai solo
questo. Le regole di .cursor/rules si caricano da sole.

PROBLEMA
Dal modulo dell'app, scrivere SOLO la descrizione inglese (nome inglese vuoto) di una bevanda dà «Operazione non
riuscita» (il lanciatore, create-catalog-items, vede «Il seguente campo non è valido: Nome»). Le collection hanno `name`
con required: true e localized: true; le azioni scrivono l'inglese con locale 'en', fallbackLocale: false e solo i
campi compilati (per esempio app/(app)/app/(shell)/menu/drinks-actions.ts, righe 204–219). La traduzione inglese è
facoltativa nelle specifiche e il frontend ripiega sull'italiano quando l'inglese manca.

LEGGI per intero
- docs/design/verifica/esiti/2026-10-18-controlli/rapporto.md (esito di VC4 sulla traduzione inglese delle bevande)
- docs/piano-sviluppo/ADR-108 (modello dati) e ADR-112 (contratto con il frontend, ripiego sulla lingua italiana)
- collections/menu/menuContentCollections.ts (dishes, drinks, menu-services, fixed-menu-categories, fixed-menus),
  le azioni dishes-actions.ts, drinks-actions.ts, wines-actions.ts, spirits-actions.ts e lib/app/menu/catalog/catalogActions.ts
- scripts/verify-menu-6_2.ts (la matrice di prova delle collection)

REGOLE
1. PARTE A, solo proposta, nessuna modifica. (a) RIPRODUCI il difetto con uno script che usa la Local API sul database
   di SVILUPPO (pnpm payload run, mai produzione): per ognuna delle collection con un nome obbligatorio e localizzato
   (dishes, drinks, menu-services, fixed-menus, fixed-menu-categories), un update con locale 'en', fallbackLocale: false
   e SOLO la descrizione (o solo un campo localizzato diverso dal nome) su un record che ha il nome inglese vuoto;
   riporta per ognuna: riuscito o l'errore esatto. Cancella i record di prova (prefisso «verify-ui-»). (b) Spiega la
   causa che trovi (come Payload valida `required` su un campo localizzato quando si scrive in un'altra lingua e il
   valore è vuoto). (c) Proponi la correzione più piccola e sicura, scegliendo fra: 1) una `validate` sul campo `name`
   che applica l'obbligo solo per la lingua italiana (la predefinita) e accetta l'inglese vuoto; 2) un cambio nelle
   azioni dell'app. Spiega perché una è migliore per l'altra (in particolare cosa succede al ripiego sull'italiano
   se si salvasse il nome italiano nel campo inglese: NON farlo). Indica i file e come provi che creare in italiano
   senza nome resta rifiutato. Poi FERMATI e aspetta il mio «procedi».
2. Dopo il «procedi»: implementa, SENZA migrazioni di schema (è solo una validazione) e senza nuove dipendenze. Se
   modifichi collections/**, mantieni gli hook della disponibilità invariati. Aggiungi alla matrice di
   scripts/verify-menu-6_2.ts: update in inglese con la sola descrizione riuscito per ognuna delle collection; create in
   italiano senza nome ancora RIFIUTATO; lettura con locale 'en' di un record senza nome inglese ricade sull'italiano.
3. Verifiche: L0 (pnpm typecheck, pnpm lint con 0 errori, pnpm ui:check, test unitari di lib/ con il caricatore),
   pnpm verify:menu-6_2, pnpm verify:menu-6_3, pnpm verify:menu-6_4 (richiede pnpm dev con le variabili
   dell'intestazione dello script; serve a escludere effetti sugli hook della disponibilità). NON fare giri di
   pnpm ui:verify: la verifica dal modulo la rifà l'agente di verifica dopo, con --solo.
4. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md (cosa era sbagliato e cosa è cambiato); una nota di
   chiarimento in fondo a ADR-108 (data, decisione, effetto sul ripiego in italiano); commit locale (messaggio che
   nomina F-EN); MAI git push. Non toccare docs/design/**, i controlli né scripts/ui-verify/**. Nella tabella degli
   stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md non toccare nulla (la aggiorna la chat di
   design).
5. RISPOSTA FINALE: tabella «Esiti reali» con, per ogni collection, il comportamento prima e dopo.
```

**Quando Cursor ha scritto la Parte A**: incollamela qui. **Quando ha finito**: commit, push, «push fatto». Dopo F-EN parte I4.

### Passo 19 — I4: Servizi e Menù fissi con Categorie

> **Esito (2026-10-18)**: ✅ `2813234` (Servizi), `4a9c36c` (correzione dello script che faceva fallire la build di produzione), `2f3f932` (Menù fissi con Categorie). Controllato io su `2f3f932`: 34 file, nessuno in `collections/`, nessuna dipendenza né migrazione, nessun file del lanciatore; `tsc --noEmit` sull'intero repo **0 errori**, ESLint sui file toccati senza errori, **89 test unitari su 89**. Servizi usa il catalogo condiviso con ricerca, filtri, raggruppamento e avviso parziale spenti (nessun terzo elenco); Menù fissi: schede come collegamenti, un solo `findByID` con `depth=2` per il modulo, vista «Scegli piatti» nel foglio, categorie senza cestino, inglese con tutte le righe `dishes` (id e piatto) e nome vuoto come stringa vuota (`verify-fixed-menu-en-locale.ts`: ordine, piatti e porzioni italiane invariati). L1: parziale, per difetti del lanciatore e non dell'app: `menu-fissi-schede-percorsi` (`page.goBack()` subito dopo il clic: gara con la navigazione, le schede sono `<a href>` che ricaricano il documento) e `menu-fissi-composizione` (la fixture del lanciatore richiede `verify-ui-p1` dopo un `delete-prefix` che non copre le collection nuove). **Da migliorare dopo V4 (rilievo A)**: le schede sono `<a>` semplici (navigazione con ricarica completa, `role="tab"` senza `aria-selected`): meglio `Link` di Next. **Nuovi script di servizio, solo sviluppo**: `scripts/cleanup-verify-ui-menu-fixtures.ts` (elimina i `verify-ui-*` su servizi, menù fissi, categorie e giorni speciali e ricrea `verify-ui-pranzo` e `verify-ui-sempre`).

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 19 (I4). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I4: schermate Servizi (/app/menu/services) e Menù fissi con Categorie (/app/menu/fixed e
/app/menu/fixed/categories).

LEGGI
- docs/design/schermate/servizi/spec.md, menu-fissi/spec.md e integrazione/spec.md (§2: schede come percorsi,
  briciola «Menù › Menù fissi › Categorie»), per intero, con i mockup.
- docs/design/decisioni-layout-app.md (D8, D9, D10, D13, D14, A45, A46, A53).
- docs/piano-sviluppo/ADR-108 (note del 2026-10-13 sulle relazioni e del 2026-10-14 sulla visibilità efficace),
  ADR-112.
- Codice: Piatti e Vini (modello), i blocchi condivisi, lib/menu/validateFixedMenuDishes.ts, collections/menu/
  menuContentCollections.ts (menu-services, fixed-menus, fixed-menu-categories), la costante delle sotto-pagine in
  lib/app/breadcrumb.ts (da I1).

COSA FARE
1. Servizi: elenco piatto per nome senza ricerca né filtri; conferma di eliminazione che dichiara il cascade
   («Verrà tolto anche da N menù fissi: …», al massimo tre nomi poi «e altri N»), letto prima con la sessione
   dell'utente.
2. Menù fissi: due rotte (le schede sono collegamenti, non stato); elenco per categoria; conferma di eliminazione
   con il cascade sui giorni speciali (date, al massimo tre); scheda «Categorie» con interruttore «Attiva» e
   matita, SENZA cestino; modulo della categoria.
3. Modulo del menù fisso in un foglio a due viste: modulo e «Scegli piatti» (stesso foglio, nessuna finestra sopra
   un'altra); frecce «Sposta su» e «Sposta giù» da 44 px; «Togli» senza conferma; almeno un piatto («Aggiungi
   almeno un piatto.»); porzione per piatto con la sua traduzione inglese; servizi a caselle; stato dei piatti
   (Disabilitato, Terminato); campo Categoria senza categorie: disabilitato con il messaggio di spec, «Nuovo menù
   fisso» attivo.
4. Visibilità: precompilata dalla categoria al primo uso, non sovrascritta dopo una scelta manuale; avviso
   informativo e avviso «non comparirà mai» come da spec (non bloccante). Funzioni pure in lib/ con test: visibilità
   efficace (incrocio di menù e categoria), precompilazione, spostamento di un elemento, applicazione della scelta
   dei piatti (tolti, aggiunti in fondo, ordine e porzioni degli altri invariati).
5. Accendi in navigazione Servizi e Menù fissi (enabled: true) e aggiorna scripts/verify-lib-app-8_2.ts con le voci abilitate.

TRADUZIONE INGLESE (dal passo 18b): la traduzione è facoltativa in ogni modulo. Scrivere SOLO la descrizione, o solo il
nome, in inglese deve riuscire; il nome inglese vuoto non deve far fallire il salvataggio e non va riempito con il nome
italiano. Le azioni scrivono in inglese solo i campi compilati, con fallbackLocale: false. Dopo F-EN la collection lo
consente: non aggirare il problema nelle azioni.

NON FARE: Giorni speciali, «Ricompila» visibile, eliminazione delle categorie, modifiche allo schema.

VERIFICHE: L0; L1 su `servizi,menu-fissi`. Prove a mano da dev (dichiarale): eliminare un servizio e un menù fisso di
prova fa sparire i collegamenti; un piatto in un menù fisso non si elimina; la rotta /app/menu/fixed/categories
apre la scheda giusta e le briciole sono corrette.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 20 — V4: l'agente esegue L2 mirato sui tipi nuovi

> **Esito (2026-10-18)**: 🔶 incompleto (`f0bdd6b`). **Nessun difetto nuovo dell'app.** Servizi L2 completo; composizione dei menù OK; traduzione inglese dal modulo di Bevande e Piatti OK (F-EN funziona dall'app); `menu-fissi-schede-percorsi` misura `documentReloaded = true` (le schede ricaricano il documento: rilievo A, vedi 20c). I quattro FALLITO sono del lanciatore: `servizi-righe-azioni` (l'aspettativa è invertita: il controllo dice che lo switch **resta attivo** sulle righe disabilitate), `servizi-elimina-cascade-registro-permessi` (la cascata è già provata da `verify-menu-6_3.ts`; la misura è prematura o interrotta da `ensure-norole-user`), `menu-fissi-ordine-piatti` (fixture mancante) e `menu-fissi-visibilita-categoria` (non esegue tutti i passi: con la categoria «Solo pranzo» la visibilità si precompila uguale, l'avviso arriva solo dopo il cambio manuale). Il giro L2 di Menù fissi si è interrotto a circa 80 s e 32 controlli sono NON PROVATI. **Causa dei tempi lunghi**: ogni operazione sui dati di prova lancia `pnpm payload run scripts/ui-verify/menu-payload.ts`, cioè un processo Payload nuovo per operazione; un loop sull'elenco degli id ha bloccato il payload per più di 2 minuti. Si chiude con il passo 20d.

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi. Istanza: V4, dopo la chat I4.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (i controlli del Menù) e docs/design/verifica/controlli-8.2.json
   (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/menu-fissi/spec.md, docs/design/schermate/servizi/spec.md, docs/design/schermate/integrazione/spec.md

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status --short).
   Se git status non è pulito, fermati e dimmelo.
A. Il lanciatore ha già i controlli di servizi e menu-fissi cablati (passo VC4). Se nel rapporto VC4
   (docs/design/verifica/esiti/<data>-controlli/) ci sono flussi IN DEBITO, ora le schermate esistono (chat I4):
   IMPLEMENTALI tu in scripts/ui-verify/** (modulo scripts/ui-verify/lib/run-menu.mjs) ed ESEGUILI in questa
   verifica, con dati di prova «verify-ui-…» creati e cancellati in try/finally. Non cambiare i controlli JSON.
   Nel rapporto scrivi quali hai completato ed eseguito e quali no, e perché.
A2. DEBITI NOTI del lanciatore dopo I4 (da correggere ora in scripts/ui-verify/**):
   1. menu-fissi-schede-percorsi: dopo il clic sulla scheda «Categorie» ASPETTA la navigazione (per esempio
      Promise.all([page.waitForURL(...), clic])) prima di page.goBack(): oggi la chiama subito e la gara con la
      navigazione lascia l'URL su /app/menu/fixed/categories. Riporta anche, come informazione (non esito), se il
      passaggio tra le schede ricarica il documento (metti window.__v4 = 1 prima del clic e controllalo dopo): le
      schede sono <a href> semplici e questo dà il rilievo A «meglio Link di Next».
   2. Fixture e dati di prova: delete-prefix non copre menu-services, fixed-menus, fixed-menu-categories e
      special-days; la composizione dei menù fissi richiede piatti «verify-ui-p1…» dopo un delete-prefix che li
      cancella. Estendi delete-prefix a queste collection (nell'ordine che rispetta le chiavi esterne: giorni speciali,
      menù fissi, categorie, servizi, piatti) e crea le fixture (categorie verify-ui-pranzo e verify-ui-sempre, piatti
      di prova, servizi) DOPO la pulizia e prima del flusso. Puoi usare scripts/cleanup-verify-ui-menu-fixtures.ts
      come riferimento (non lo modificare).
   3. Completa ed esegui i flussi in debito di servizi e menu-fissi (composizione, ordine con le frecce, doppioni,
      porzione e traduzione, visibilità dalla categoria, eliminazione con cascade e registro, disponibilità,
      persistenza, accesso dove provabile, stati simulati): con --solo, UNA schermata per volta, riportando
      il valore misurato.
B. Esegui UNA schermata alla volta (il lanciatore a livello 2 rifiuta più schermate e due giri insieme), su locale-dev
   (solo il controllo CONSOLE) e su locale-prod (tutti gli altri). Budget per schermata 15 minuti; se un giro supera
   5 minuti senza produrre file, fermati e riportalo:
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata servizi
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata menu-fissi
   pnpm ui:verify --livello 1 --controlli controlli-6.6.json --schermata navigazione,home,piatti   (regressione veloce)
   pnpm ui:verify --livello 1 --controlli controlli-8.2.json --schermata shell   (regressione della shell)
   (L2 mirato sui tipi nuovi: schede come percorsi, vista di scelta nel foglio, conferme con cascade)
B2. Dopo F-EN (passo 18b): rilancia con --solo, in due minuti, bevande-modulo-inglese (dal modulo: scrivi SOLO la
   descrizione inglese di una bevanda e salva: atteso salvataggio riuscito e badge «Presente») e piatti-modulo-inglese
   (lo stesso su un piatto), e riporta i valori letti.
C. Non eseguire i controlli «online-senza-credenziali»: si fanno in V6, dopo il deploy. Scrivili NON PROVATO con il motivo «si provano in V6».
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README, sezione 7.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i
controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `docs(verifica): rapporto L2 V4 (Menù fissi, Servizi)`


### Passo 20b — F-SEL: tendine facoltative di Distillati, Bevande e Vini

> **Esito (2026-10-18)**: ✅ `ed64db5` (esiti L1 in `16dd08c`). Difetti segnalati dall'utente con degli screenshot: Distillati (Invecchiamento, Grado) e Bevande (Capacità, Grado) mostravano il testo grezzo `__empty__`, il Paese delle Bevande `__no_country__`, e le coppie erano su due righe invece che affiancate come nei Vini. Causa: `value={x || EMPTY_SELECT}` con `items` senza la chiave segnaposto, e `SelectValue` con `null` come testo per il paese vuoto. Correzione: componente condiviso `OptionalSelectField` (`components/app/menu/catalog/optional-select-field.tsx`, con `lib/menu/catalog/optionalSelectValue.ts`): valore vuoto → `undefined` → segnaposto («Scegli», «Facoltativo» per il paese delle Bevande); la voce vuota dell'elenco svuota il campo; il segnaposto interno non arriva mai nello stato. Corretto anche un problema latente nei Vini: scegliere «Non indicata» salvava `__empty__`. Layout `grid-cols-1 md:grid-cols-2`. Controllato io: `tsc` sull'intero repo 0 errori, ESLint sui file toccati senza errori, 100 test unitari su 100 (11 nuovi), L1 di distillati, bevande e vini OK secondo il rapporto di Composer.

### Passo 20c — F-TAB: le schede di Menù fissi navigano senza ricaricare il documento

> **Esito (2026-10-19)**: ✅ `6ae1f34` (esiti L1 in `e0e85da`). Le due schede diventano `Link` di `next/link` con `aria-selected` coerente con la scheda attiva; il commit tocca solo `fixed-menus-shell.tsx` e il CHANGELOG. Controllato io: `tsc` sull'intero repo 0 errori, ESLint senza errori, 100 test unitari su 100. L1 di Composer: `menu-fissi-schede-percorsi` con `documentReloaded = false`.

**Perché**: V4 misura `documentReloaded = true`: le due schede sono `<a href>` semplici e ogni cambio scheda ricarica tutto il documento. **Quando**: ora, prima di V4 bis. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (autonomo).

```text
Sei Composer nel repository VMA VD. Chat F-TAB: le schede di Menù fissi devono navigare senza ricaricare il documento.
Fai solo questo, direttamente. Le regole di .cursor/rules si caricano da sole.

PRECONDIZIONE: nessun giro del lanciatore attivo (ps e .next/ui-verify.lock); altrimenti FERMATI.

PROBLEMA: in components/app/fixed-menus/fixed-menus-shell.tsx le due schede «Menù fissi» e «Categorie» sono <a href>
semplici: ogni cambio scheda ricarica tutto il documento (V4: documentReloaded = true). Il resto dell'app usa la
navigazione di Next. Le schede restano collegamenti (percorsi /app/menu/fixed e /app/menu/fixed/categories), non stato.

FAI
1. Sostituisci i due <a> con Link di next/link, mantenendo href, classi, role="tab"/"tablist", aria-current e il
   comportamento del tasto indietro; aggiungi aria-selected coerente con la scheda attiva. Non cambiare altro
   dell'aspetto.
2. Cerca nel resto di app/ e components/ altri <a href="/app...> per navigazione interna dell'area App (stessa classe di
   difetto) e correggili solo se sono link interni; riporta l'elenco di cosa hai trovato.
3. PRIMA DEL COMMIT pnpm typecheck e pnpm lint sull'INTERO repo, pnpm ui:check, test unitari di lib/. L1 breve, un solo
   giro: pnpm ui:verify locale-prod --livello 1 --schermata menu-fissi --controlli controlli-6.6.json --solo
   menu-fissi-schede-percorsi (il lanciatore riporta documentReloaded: atteso FALSE).
4. CHANGELOG sotto [Unreleased]; commit locale che nomina F-TAB; MAI git push. Non toccare docs/design/**, i controlli,
   scripts/ui-verify/**, collections/**, dipendenze, migrazioni.
RISPOSTA FINALE: tabella «Esiti reali» (comando, esito, evidenza), file toccati e l'elenco dei <a> interni trovati.
```

**Quando Cursor ha finito**: incollami la tabella; io eseguo `tsc`, ESLint e i test prima del via libera al push.

### Passo 20d — V4 bis: helper persistente e completamento di Servizi e Menù fissi

> **Esito (2026-10-19)**: ✅ parziale, `a7114d8` (lanciatore 3.7.0). **Nessun FALLITO** su Servizi e Menù fissi, **22 controlli OK**: Servizi (righe con lo switch attivo sulle righe disabilitate, cascata con registro `riferimenti=1` e menù senza il servizio, disponibilità, eliminazione, modulo, persistenza, ordine, console) e Menù fissi (schede con `documentReloaded = false`, ordine con frecce a 44 px, visibilità con i due avvisi, composizione, categoria, validazione, console): i quattro FALLITO di V4 erano davvero del lanciatore. **Helper Payload persistente** (daemon TCP su `127.0.0.1:31997`, protetto da `assertDevDatabaseFromEnv`): creazione da 1956 a 874 ms, lettura da 1962 a 132 ms. **Non fatto** (passa a 20e e 20f): la matrice C1/C2/C3 di Servizi (il giro è stato interrotto dopo circa 21 minuti: celle stato × profilo × tema eseguite una dopo l'altra), Menù fissi L2 a gruppi, la regressione L1 (l'avvio di `ui:verify` è rimasto senza output per oltre 4 minuti) e gli screenshot per il confronto visivo. **Durata del passo**: circa 2 ore e mezza, di cui circa 85 minuti di programmazione del lanciatore: un prompt che mette insieme sviluppo e giri lunghi non sta in 45 minuti; da qui in avanti ogni passo che modifica il lanciatore ha un tetto di 30 minuti di programmazione e un `progress.log`.

**Quando**: dopo F-TAB (20c). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V4 bis, dopo V4,
F-SEL (tendine facoltative) e F-TAB (schede con Link).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/README.md e
policy-test.md; docs/design/verifica/controlli-6.6.json (schermate servizi e menu-fissi); docs/design/verifica/esiti/
2026-10-18-locale-prod/rapporto-v4-agente.md; docs/design/verifica/esiti/2026-10-18-VCtempi/rapporto.md.

0. Riporta HEAD e git status (solo lettura). PRECONDIZIONI: git log deve elencare F-SEL e F-TAB su components/app; se
   mancano, FERMATI. Controlla porte e processi residui: `lsof -nP -iTCP:3000,3100,3200 -sTCP:LISTEN` e
   `.next/ui-verify.lock`; un blocco con PID morto si ignora.
A. VELOCITÀ (la causa dei giri lunghi): oggi ogni operazione sui dati di prova lancia `pnpm payload run
   scripts/ui-verify/menu-payload.ts`, cioè un processo Payload nuovo per operazione (secondi ciascuna). Sostituiscilo
   con un helper PERSISTENTE: un solo processo Payload avviato una volta per giro, che esegue le operazioni inviate come
   righe JSON (o su una porta locale), chiuso nel finally e dal timer di guardia. Mantieni le stesse operazioni e la
   protezione del database di sviluppo (assertDevDatabaseFromEnv). Misura il tempo medio di una creazione e di una
   lettura PRIMA e DOPO (atteso: sotto 1 secondo) e riportalo.
B. Correggi in scripts/ui-verify/** (mai i controlli JSON) i difetti del lanciatore emersi in V4:
   1. servizi-righe-azioni: il controllo dice che lo switch RESTA ATTIVO sulle righe disabilitate (riga attenuata e
      badge «Disabilitato»); il lanciatore aspetta il contrario.
   2. servizi-elimina-cascade-registro-permessi: dopo l'eliminazione dalla pagina leggi con la Local API (depth 0) i
      servizi del menù fisso di prova e il registro; riporta i valori prima e dopo. Se «utente senza ruolo» non è
      provabile è NON PROVATO per quella parte (coperta da verify-roles-8_3), non FALLITO per tutto. La cascata è già
      provata da verify:menu-6_3: se la misura non la conferma, riportala come difetto del lanciatore o come anomalia
      da indagare con i valori reali.
   3. menu-fissi-ordine-piatti: crea PRIMA i piatti verify-ui-p1…p4 e il menù di prova; esegui i passi del controllo
      (frecce, ordine salvato, «Togli») e riporta i valori.
   4. menu-fissi-visibilita-categoria: esegui TUTTI i passi: scegli la categoria «verify-ui-pranzo» (la visibilità si
      precompila «Solo pranzo»), cambia a mano in «Sempre» (atteso: avviso informativo), poi in «Solo cena» (atteso:
      avviso rosso «non comparirà mai»), poi scegli «verify-ui-sempre» (la scelta manuale non viene sovrascritta), e
      riporta i testi letti.
   5. Timeout: il giro menu-fissi si è interrotto a circa 80 secondi con TimeoutError nella preparazione degli stati e
      degli screenshot: individua quale stato e correggi (attese, dati di prova mancanti).
C. Esegui UNA schermata per volta, a gruppi di stati (--stati), con meno di 5 minuti ciascuno; budget per schermata 15
   minuti; se un giro supera 5 minuti senza produrre file, fermati e riportalo:
   - locale-prod L2 servizi; locale-prod L2 menu-fissi (a gruppi di stati);
   - locale-dev solo il controllo CONSOLE per servizi e menu-fissi;
   - regressione L1 (uno alla volta): navigazione,home,piatti con controlli-6.6.json, e shell con controlli-8.2.json.
   Controlla anche che menu-fissi-schede-percorsi riporti documentReloaded FALSE dopo F-TAB.
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-18-locale-prod/ e 2026-10-18-locale-dev/ e un riepilogo in
   docs/design/verifica/esiti/2026-10-18-V4bis/rapporto.md con, per OGNI controllo di servizi e menu-fissi, OK / FALLITO /
   AVVISO / NON PROVATO, il valore misurato e quello atteso (mai «—»), la tua classificazione per ogni FALLITO e il
   tempo di ogni giro. Chiudi processi e porte, cancella i dati «verify-ui-…» e l'utente di prova, e verifica con git
   status i file nuovi.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in
italiano con la tabella OK / FALLITO / AVVISO / NON PROVATO.
```

**Quando Cursor ha finito**: incollami il resoconto; commit `test(ui-verify): V4 bis — helper persistente e completamento di Servizi e Menù fissi`, push, «push fatto».


### Passo 20e — VC-parallelo: matrice in parallelo, avanzamento leggibile, avvio senza blocchi

> **Esito (2026-10-19)**: 🔶 chiuso con riserva, `f5e8b0d` (3.8.0) e `a35f8fe` (3.9.0). Controllato io su `a35f8fe`: `tsc` sull'intero repo 0 errori, ESLint su `scripts/ui-verify` 0 errori, sintassi dei moduli verificata, nessun file fuori da `scripts/ui-verify/**` e dagli esiti. **Fatto**: `.next/ui-verify-progress.log` con una riga per fase, per controllo e un battito ogni 30 secondi con il passo interno; avvio a fasi con limite di 60 secondi (causa dell'avvio «muto»: l'avanzamento andava su stderr con `\r` senza newline); matrice C1/C2/C3 in parallelo (`UI_VERIFY_PARALLEL`, default 4; Servizi: 40 celle in 2 min 13 s); secondo avvio rifiutato con il PID; limite di 60 secondi per cella su **tutti** i pacchetti (`runTimedControl`: accesso, login, shell, menu); client del daemon Payload asincrono con errore chiaro dopo 20 secondi (il `spawnSync sleep` bloccava timer e Playwright: era la causa dei blocchi osservati nei due giri L2 di Servizi). **Non dimostrato**: L2 di Servizi completo e le quattro regressioni L1 con i nuovi limiti; li prova il passo 20f (con una prova di sanità iniziale). **Nota di processo**: guardiano `scripts/ui-verify/watch.sh` (avviso o fermo automatico quando il log resta fermo), nato da un giro bloccato per più di 7 minuti che il limite di 60 secondi non vedeva perché il thread principale era occupato.

**Perché**: V4 bis ha dimostrato che i controlli veri di Servizi e Menù fissi funzionano, ma la **matrice C1/C2/C3** (celle stato × profilo × tema) gira una cella dopo l'altra: per Servizi supera i 20 minuti. In più, da fuori non si capisce se un giro lavora o è appeso, e l'avvio di `ui:verify` è rimasto muto per oltre 4 minuti. **Quando**: ora. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Tetto**: 30 minuti di programmazione; se lo superi, fermati e riporta.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui MIGLIORI IL LANCIATORE (scripts/ui-verify/**): non
verifichi schermate nuove. Istanza: VC-parallelo. Obiettivo: giri più brevi, leggibili da fuori e senza blocchi.

TETTO: 30 minuti di programmazione. Se li superi, FERMATI e riporta a che punto sei: non continuare.

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/README.md e
policy-test.md; docs/design/verifica/esiti/2026-10-18-V4bis/rapporto.md; docs/design/verifica/esiti/2026-10-18-VCtempi/
rapporto.md; scripts/ui-verify/run.mjs e scripts/ui-verify/lib/ (engine.mjs, run-menu-list.mjs, run-catalog.mjs,
run-piatti.mjs, report.mjs, timeouts.mjs, menu-payload.mjs).

Poi, in quest'ordine (modifichi SOLO scripts/ui-verify/**, mai i controlli JSON):
A. AVANZAMENTO LEGGIBILE. Scrivi in .next/ui-verify-progress.log (non versionato) una riga all'avvio di ogni fase e di
   ogni controllo o stato, e un battito ogni 30 secondi, nel formato: `HH:MM:SS | schermata | fase | controllo o stato |
   n/N | secondi trascorsi`. Stampa le stesse righe su stdout. Scrivi nel rapporto il comando per seguirlo
   (`tail -f .next/ui-verify-progress.log`).
B. AVVIO SENZA BLOCCHI. Nei giri di regressione L1 (navigazione, home, piatti, shell) l'avvio di ui:verify è rimasto muto
   per oltre 4 minuti. Individua la causa (attesa del blocco, build, avvio del server, porta occupata, daemon Payload,
   cache della build) e fai in modo che ogni fase di avvio stampi subito una riga e che, se una fase supera 60
   secondi senza progressi, il giro esca con un messaggio che dice quale fase e perché. Riporta la causa trovata.
C. MATRICE IN PARALLELO. Le celle C1/C2/C3 (stato × profilo × tema) di Servizi, Menù fissi e dei cataloghi devono
   girare in parallelo in N contesti del browser (UI_VERIFY_PARALLEL, default 4), ciascuno con la sua pagina. Le
   fixture si preparano UNA volta per stato prima delle celle; i flussi che modificano i dati (eliminazioni, interruttori,
   salvataggi) restano seriali e fuori dalla matrice. L'ordine dei risultati nel rapporto resta deterministico. Il
   tempo massimo per cella resta 60 secondi (NON PROVATO «tempo» e si prosegue); il budget per schermata resta 15
   minuti con la guardia.
D. CHIUSURA PULITA. Il daemon Payload (porta 31997), il server dell'app, il browser e il blocco si chiudono sempre,
   anche con SIGINT, SIGTERM, errore o timer di guardia. A fine giro controlla con `ps` e `lsof` che non resti nulla e
   scrivilo nel log.
E. PROVE CON NUMERI: (1) L2 di servizi su locale-prod: tempo totale, numero di celle, parallelismo (atteso circa 6
   minuti; se non basta, riporta dove va il tempo). (2) Un giro L1 `--schermata navigazione`, uno `home`, uno `piatti`
   e uno `shell` con controlli-8.2.json, UNO ALLA VOLTA: tempo di ognuno (atteso meno di 3 minuti ciascuno) e con il
   log che avanza. (3) Un secondo avvio mentre uno è attivo: rifiutato con il PID. (4) `ps` e `lsof` finali puliti.
   (5) pnpm typecheck e pnpm lint sull'INTERO repo.
F. Scrivi docs/design/verifica/esiti/2026-10-19-VCparallelo/rapporto.md con le misure, le opzioni nuove e la causa
   dell'avvio muto.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli JSON. Rispondi
in italiano con la tabella OK / FALLITO / NON PROVATO delle prove e i numeri.
```

**Quando Cursor ha finito**: incollami il resoconto. Prima del via libera al push eseguo io `tsc` e ESLint. Commit `test(ui-verify): VC-parallelo — matrice in parallelo, progress.log, avvio senza blocchi`, push, «push fatto». Accettazione: Servizi L2 sotto i 10 minuti e i quattro giri di regressione sotto i 3 minuti ciascuno.

### Passo 20f — V4 ter: Menù fissi L2, regressione e screenshot per il confronto visivo

> **Esito (2026-10-19)**: **eseguito due volte, risultati inutilizzabili**. Primo tentativo (`ff68c75`): la prova di sanità A0 (L1 `navigazione`) si è fermata dopo 15 secondi per oltre 10 minuti (battito scomparso: chiamata sincrona senza tempo massimo). Secondo tentativo (`25fa77c`), con `UI_VERIFY_MENU_PAYLOAD_LEGACY=1` che avevo prescritto io: la modalità legacy non è mantenuta e restituisce `undefined`; 17 FALLITO e nessuno è un difetto dell'app (`home-riga-menu-testo` «count API=undefined», `piatti-tassonomie` «reading 'map' of undefined», e simili). Valido: i flussi e la matrice C1/C2/C3 di Servizi e Menù fissi sono OK, console pulita. **0 screenshot** (il lanciatore non ha il codice per salvarli per Servizi e Menù fissi). Il passo si rifà con il nuovo motore: T1c.

**Quando**: dopo 20e. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi l'app. Istanza: V4 ter, dopo V4 bis
e VC-parallelo (matrice in parallelo, progress.log, avvio senza blocchi).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/README.md e
policy-test.md; docs/design/verifica/controlli-6.6.json (schermate servizi e menu-fissi); docs/design/verifica/esiti/
2026-10-18-V4bis/rapporto.md; docs/design/verifica/esiti/2026-10-19-VCparallelo/rapporto.md.

0. Riporta HEAD e git status (solo lettura). PRECONDIZIONI: `git log --oneline` deve elencare il commit di VC-parallelo
   su scripts/ui-verify; se manca, FERMATI. Controlla `lsof -nP -iTCP:3000,3100,3200,31997 -sTCP:LISTEN` e il blocco.
   Segui i giri con `tail -f .next/ui-verify-progress.log`.
A0. PROVA DI SANITÀ (3.9.0): prima di tutto `pnpm ui:verify locale-prod --livello 1 --schermata navigazione
   --controlli controlli-6.6.json` con il progress.log che avanza (atteso meno di 3 minuti). Se supera 5 minuti, o il
   guardiano scripts/ui-verify/watch.sh ferma il giro, FERMATI: riporta l'ultima riga del progress.log e il passo
   bloccato, e non proseguire (il lanciatore va corretto prima).
A. Esegui, UNA schermata per volta (il lanciatore lo impone), con meno di 10 minuti ciascuna. Se un giro viene fermato
   da un blocco, scrivilo nel rapporto con l'ultima riga del progress.log, NON correggere il lanciatore e passa al giro
   successivo:
   1. locale-prod L2 `--schermata servizi` (con la matrice C1/C2/C3 completa e TUTTI gli screenshot degli stati);
   2. locale-prod L2 `--schermata menu-fissi`, a gruppi di stati con --stati se serve (elenco e categorie; moduli
      e vista «Scegli piatti»; conferme di eliminazione e stati UI), con la matrice completa e TUTTI gli screenshot;
   3. locale-dev: solo i controlli CONSOLE di servizi e menu-fissi e le simulazioni (errore di caricamento,
      errore del server, caricamento lento) per `servizi-stati-ui` e `menu-fissi-stati-ui`;
   4. regressione L1, uno alla volta: `navigazione`, `home`, `piatti` (controlli-6.6.json) e `shell` (controlli-8.2.json).
   Se un giro supera 10 minuti senza avanzare nel progress.log, fermati e riportalo.
B. Gli screenshot (a 390 e 1280 px, chiaro e scuro, con il contesto touch dei profili con tocco) di TUTTI gli stati di
   riferimento di servizi e menu-fissi vanno in docs/design/verifica/esiti/2026-10-19-locale-prod/img/ con il nome
   <schermata>-<stato>-<profilo>-<tema>.png: li confronta la chat di design (C10) con i PNG di docs/design/schermate/.
   Riporta il numero di screenshot per schermata e quelli mancanti con il motivo.
C. NON PROVATO con il motivo: stati «vuoto» (database popolato), `*-accesso` (coperto da verify-roles-8_3),
   `*-ricompila` (rinviato alla 6.5), online (V6).
D. Scrivi gli esiti in docs/design/verifica/esiti/2026-10-19-locale-prod/ e 2026-10-19-locale-dev/ e un riepilogo in
   docs/design/verifica/esiti/2026-10-19-V4ter/rapporto.md con, per OGNI controllo di servizi e menu-fissi, OK / FALLITO /
   AVVISO / NON PROVATO, il valore misurato e quello atteso (mai «—»), la tua classificazione per ogni FALLITO e il
   tempo di ogni giro. Chiudi processi e porte, cancella i dati «verify-ui-…» e l'utente di prova, verifica con git status.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in
italiano con la tabella OK / FALLITO / AVVISO / NON PROVATO.
```

**Quando Cursor ha finito**: incollami il resoconto; commit `test(ui-verify): V4 ter — L2 di Servizi e Menù fissi, regressione e screenshot`, push, «push fatto». Poi confronto gli screenshot con i riferimenti (C10) e assegno i rilievi.

### Passo 20g — VC-sync: ANNULLATO (2026-10-19)

**Non eseguire.** Era l'ultima manutenzione prevista per il vecchio lanciatore (client del daemon asincrono, battito in un worker, screenshot di Servizi e Menù fissi, rilancio dei controlli con falsi FALLITO). Annullato perché: (1) il vecchio lanciatore viene sostituito dal percorso v2 (T0–T4) e il lavoro sarebbe buttato; (2) per ottenere gli screenshot di Servizi e Menù fissi bastano T0 (90 minuti) e T1c (60 minuti), cioè circa 2 ore e mezza, contro le 80–120 minuti di 20g più comunque il resto; (3) la causa dei blocchi (chiamate sincrone senza tempo massimo) è esclusa **per costruzione** dalle regole R1–R3 del nuovo motore. Il giro L1 che serve a Composer durante I5 e I6 continua a usare il vecchio `ui:verify` così com'è.

### Passo T0 — Spike e scheletro del nuovo test runner (Playwright Test)

> **Esito (2026-10-19)**: ✅ `060fe0c` (spike) e `76578ea` (scheletro), più una correzione di tipo mia. **Spike GO, Opzione A**: la Local API di Payload gira nello stesso processo del test (circa 3,7 secondi, database di sviluppo, record creato, riletto e cancellato); nessun daemon e nessun REST. Il caricatore ESM di Playwright non risolveva `payload-oauth2`: lo si risolve da `payload` con `createRequire` (`e2e/lib/tsx-loader.ts`, nessuna versione scritta a mano, nessuna dipendenza nuova) e si avvia Playwright con `e2e/scripts/playwright-cli.mjs`. **Push dello schema**: disattivato nei worker con `PAYLOAD_DISABLE_PUSH=1` (unica modifica a `payload.config.ts`: `push` solo se `NODE_ENV !== 'production'` e la variabile non vale 1; la produzione è invariata). **Suite di fumo**: circa 20 secondi con la build riusata (criterio: meno di 60); test volutamente bloccato → ERRORE-STRUMENTO «tempo» e il giro continua; record `verify-ui-fix-*` zero dopo l'eccezione; reporter e `.next/e2e-progress.log`; secondo avvio rifiutato con il PID; `e2e:wire`: 192 id; nessuna chiamata vietata (R1). **Controllato io**: perimetro (solo `e2e/`, regola 02, `package.json` con tre script e `typecheck` esteso, `tsconfig.json` con l'esclusione di `e2e`, `.gitignore`, `eslint.config.mjs` con un override per `e2e/**`, `payload.config.ts` come sopra), nessuna chiamata sincrona in `e2e/`, ESLint senza errori. **Difetto trovato da me**: `pnpm typecheck` completo falliva in un checkout pulito con due errori in `e2e/` (`NodeJS.ProcessEnv` richiede `NODE_ENV` quando sono caricati i tipi di Next): corretto con `Record<string, string | undefined>` in `e2e/lib/payload-cli.ts` e `e2e/lib/exec.ts`; ora `pnpm typecheck` e ESLint passano a 0 errori anche da zero.

**Quando**: ora. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 90 minuti, con un checkpoint dopo lo spike (15 minuti): l'agente si ferma e aspetta il tuo «continua».

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T0 (spike e scheletro del nuovo test runner). Costruisci lo scheletro di e2e/ con Playwright Test. NON verifichi schermate nuove e NON tocchi il vecchio lanciatore.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json (solo la struttura) e scripts/ui-verify/provision-user.ts (come si crea l'utente di prova).

AUTORIZZAZIONE ESPLICITA PER QUESTO PASSO (estende la regola 02, che oggi consente solo scripts/ui-verify/**): puoi creare e2e/**,
aggiungere a package.json gli script e2e, e2e:smoke e e2e:wire (e portare `typecheck` a eseguire anche
`tsc --noEmit -p e2e/tsconfig.json`), aggiungere a tsconfig.json solo l'esclusione di e2e, aggiungere a .gitignore
/test-results/ e .next/e2e-*, e aggiornare .cursor/rules/ui/02-ui-verifica-agente.mdc (campo globs e sezione «Cosa puoi
modificare») includendo e2e/**. Non modificare altro. @playwright/test è già una dipendenza: nessuna dipendenza nuova.

STIMA 90 MINUTI. Dopo lo SPIKE (parte A) FERMATI e riporta GO o NO-GO: aspetta il mio «continua».

A. SPIKE (15 minuti, esito scritto). Scegli come i test creano e leggono i dati di prova:
   Opzione A: la Local API di Payload nello stesso processo di un test (nessun processo figlio, nessun daemon): un test crea
   un piatto «verify-ui-spike», lo rilegge con depth, lo cancella in afterEach; protetto da assertDevDatabaseFromEnv
   (scripts/import-menu-vtn-backend/databaseUrl); meno di 15 secondi. Possibili ostacoli: alias dei percorsi, ESM/CJS,
   server-only. Opzione B (solo se A non funziona in 15 minuti): le stesse operazioni via REST di Payload con un utente di
   prova di ruolo admin creato una volta in global-setup, con la richiesta autenticata di Playwright (`request`).
   NON riusare il vecchio daemon TCP e NON usare mai spawnSync nei test. Riporta quale opzione hai scelto, perché, e il tempo.
B. SCHELETRO in e2e/: playwright.config.ts (progetti telefono-390 con isMobile, hasTouch e scala 3, notebook-1280,
   soglia-767 e soglia-768, ciascuno in chiaro e scuro con colorScheme; timeout 60 s; actionTimeout 15 s;
   navigationTimeout 30 s; globalTimeout 25 minuti; webServer che avvia pnpm start sulla porta 3100 e riusa la build se
   .next/BUILD_ID corrisponde all'hash del codice; reporter personalizzato), global-setup.ts (blocco di un solo giro con PID,
   id del giro, utente di prova, login una volta con storageState), global-teardown.ts (pulizia dei record
   verify-ui-<giro> nell'ordine giorni speciali, menù fissi, categorie, servizi, vini, distillati, bevande, piatti; chiusura
   del blocco), fixtures/ (payload con crea(collection, dati) che registra e cancella in afterEach anche dopo un errore,
   loggedPage, consoleWatcher, touch con la misura del tocco di docs/design/verifica/misura-tocco.md), reporter/ (scrive
   risultati.json e rapporto.md nel formato del README §7 con l'esito ERRORE-STRUMENTO separato dai conteggi dei difetti, e
   .next/e2e-progress.log con una riga per test), smoke/, README.md con i comandi, e uno script e2e:wire che verifica
   che ogni id di controllo dei JSON abbia un test o un motivo di NON PROVATO (per ora solo la struttura).
C. SUITE DI FUMO (e2e/smoke) con questi test: login una volta; apertura di /app con titolo e voci della barra laterale;
   misura del tocco a 390 px sulla home (nessun elemento interattivo sotto 44×44); console pulita; uno screenshot; UN TEST
   VOLUTAMENTE BLOCCATO (non risolve mai) che il runner deve uccidere al tempo massimo senza fermare il giro; UN TEST CHE CREA
   «verify-ui-fix-<giro>» e poi lancia un'eccezione; una prova automatica che in e2e/ non compaiono spawnSync, execSync,
   execFileSync, Atomics.wait, readSync.
D. ACCETTAZIONE (riporta ogni punto con il numero misurato): (1) pnpm e2e:smoke passa in meno di 60 secondi con la build
   riusata; (2) il test bloccato è ERRORE-STRUMENTO «tempo» e gli altri test sono eseguiti; (3) a fine giro i record
   verify-ui- sono ZERO anche dopo il test che lancia l'eccezione; (4) risultati.json e rapporto.md con ERRORE-STRUMENTO a
   parte; (5) un secondo avvio mentre uno è attivo viene rifiutato con il PID; (6) pnpm typecheck (compreso e2e) e pnpm lint
   sull'INTERO repo passano; (7) nessuna modifica a app/, components/, lib/, collections/ e scripts/ui-verify.
E. Scrivi docs/design/verifica/esiti/2026-10-19-T0/rapporto.md con lo spike, le misure e le scelte.
Non fare git. Rispondi in italiano con la tabella OK / FALLITO / NON PROVATO delle prove di accettazione.
```

**Quando Cursor ha scritto lo spike**: incollamelo; ti rispondo con «continua» (o con le correzioni). **Quando ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test prima del via libera. Commit `test(e2e): T0 — scheletro di Playwright Test, fixture, reporter e suite di fumo`, push, «push fatto».

### Passo T1a — Controlli comuni, console e screenshot: home, navigazione e Piatti

**Quando**: dopo T1b. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 60 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1a (controlli comuni, console e screenshot). Estendi e2e/ con i controlli comuni e gli screenshot di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 60 MINUTI. Precondizione: T0 accettato (git log mostra il commit di T0 su e2e/ e `pnpm e2e:smoke` passa in meno di 60
secondi); se manca, FERMATI. Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate home, navigazione e Piatti, per OGNI stato di `stati` e `stati_c1_c2` dei JSON e in TUTTI i progetti (profili e temi):
C1 (aspetto e testi), C2 e C2-mouse (aree di tocco), C3 (nessun lampo, cambio di sistema), console pulita e uno SCREENSHOT
<schermata>-<stato>-<profilo>-<tema>.png in docs/design/verifica/esiti/<data>-e2e/img/. Ogni test ha come titolo l'id del
controllo del JSON. La preparazione di uno stato (aprire un foglio, una conferma, un errore o un caricamento simulati) è una
funzione del test con UN'ASSERZIONE DI CONFERMA (l'elemento atteso è visibile); se non si può preparare, NON PROVATO con il
motivo. Gli stati con il database popolato («vuoto», «nuovo-senza-categorie») sono NON PROVATI con il motivo. Riusa, come
riferimento e non come copia, le logiche già verificate del vecchio lanciatore (fixture, selettori delle tendine con
`items`, attese di animazione). Misura il tocco con fixtures/touch; per taratura i risultati di C2 su Piatti devono
coincidere con quelli già noti (nessun FALLITO nuovo su Piatti).
ACCETTAZIONE (riporta i numeri): (1) la parte di suite di queste schermate finisce in meno di 10 minuti con 4 worker; (2) il
numero di screenshot è uguale a quello atteso, calcolato dal JSON; (3) zero ERRORE-STRUMENTO; (4) la suite di fumo passa in
meno di 60 secondi; (5) pnpm typecheck e pnpm lint sull'INTERO repo; (6) `ps` e `lsof` finali puliti e zero record verify-ui-.
Scrivi docs/design/verifica/esiti/<data>-T1a/rapporto.md con, per ogni controllo, OK / FALLITO / AVVISO / NON PROVATO /
ERRORE-STRUMENTO, il valore misurato e quello atteso (mai «—»), e il numero di screenshot per schermata.
Non fare git. Non toccare app/, components/, lib/, collections/, docs/design (fuori da verifica/esiti), i controlli JSON né
scripts/ui-verify. Rispondi in italiano con la tabella dei risultati.
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T1a — controlli comuni e screenshot di home, navigazione e Piatti`, push, «push fatto». 


### Passo T1c bis — Chiusura di T1c: fixture isolate, simulazioni dedicate, setup in-process

**Quando**: ora. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Prima, in un terminale**: `pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-` (pulisce i record rimasti dal giro incompleto). **Stima**: 60 minuti, con un checkpoint dopo 30 (solo Servizi); **tetto**: 120 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1c bis. Chiudi T1c: oggi la suite di Servizi e Menù
fissi dà 62 OK, 0 FALLITO, 8 ERRORE-STRUMENTO, 14 screenshot su 45 e non finisce in 10 minuti. Modifichi SOLO e2e/** (e package.json
solo per gli script e2e) e i rapporti sotto docs/design/verifica/esiti/. NON tocchi il vecchio lanciatore scripts/ui-verify, né
app/, components/, lib/, collections/. Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md (regole R1-R10);
docs/design/verifica/esiti/2026-10-19-T1c/rapporto.md; docs/design/verifica/controlli-6.6.json (schermate servizi e menu-fissi).

Cause già trovate (dalla chat di design, verificale):
- NOMI UGUALI TRA I WORKER: violano la regola R5. I record di prova devono chiamarsi verify-ui-<giro>-w<worker>-<nome>.
- SIMULAZIONI: gli stati «caricamento», «errore-caricamento» e «errore-azione» richiedono un server di SVILUPPO, perché
  APP_MENU_DEV_SIMULATE_* sono spente di proposito con NODE_ENV=production (lib/app/menu/devSimulate.ts: NON cambiarlo).
  Il next dev si avvia dentro il test e supera i 60 secondi.
- NON PROVATO a migliaia: i test saltano le combinazioni di profilo e tema invece di non generarle.
- Fumo di circa 2 minuti: setup e teardown lanciano `pnpm payload run` (processi separati) invece della Local API in-process.

FAI, in quest'ordine
1. FIXTURE ISOLATE (R5). Il nome di ogni record di prova contiene il giro e l'indice del worker (la fixture espone un metodo
   `nome('servizio')` che restituisce verify-ui-<giro>-w<n>-servizio). Ogni test crea i propri record con la fixture payload
   (Local API in-process, scope di worker) e li cancella in afterEach anche dopo un errore. I selettori usano il nome ESATTO
   (aria-label «Modifica {nome}», «Elimina {nome}»), senza `.first()` né blocchi di serializzazione (togli fixture-lock se non serve
   più). Le categorie seed condivise verify-ui-pranzo e verify-ui-sempre diventano anch'esse per giro e per worker.
2. SIMULAZIONI. Un progetto `simulazioni` seriale (un solo worker) con TRE server di sviluppo, avviati IN PARALLELO nel
   global-setup di quel progetto, FUORI dal tempo dei test, con un tempo massimo di avvio di 180 secondi e un riscaldamento
   (una visita a /app/menu/services, /app/menu/fixed e /app/menu/fixed/categories con il login) così il primo test non paga la
   compilazione: porta 3200 con APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS=3000 (stato «caricamento»), 3201 con
   APP_MENU_DEV_SIMULATE_LOAD_ERROR=1 («errore-caricamento»), 3202 con APP_MENU_DEV_SIMULATE_SAVE_ERROR=1 («errore-azione»).
   Solo spawn asincrono (mai spawnSync), attesa asincrona dell'URL con tempo massimo, chiusura in teardown e con SIGINT/SIGTERM,
   porte controllate a fine giro. I server di sviluppo si avviano SOLO quando gira questo progetto.
3. COMBINAZIONI. Genera i test SOLO per le combinazioni di profilo e tema previste dal JSON per quello stato (campo `profili` e
   `temi`, e `immagini.stati_con_riferimento` per gli screenshot): niente test saltati e niente NON PROVATO per combinazioni non
   applicabili. Gli stati con database popolato («vuoto», «nuovo-senza-categorie») sono UN solo NON PROVATO con il motivo.
4. SETUP IN-PROCESS. Sostituisci in global-setup e global-teardown ogni `pnpm payload run` con la Local API nello stesso processo
   (il caricatore tsx è già attivo; protezione assertDevDatabaseFromEnv; push dello schema disattivato). La suite di fumo deve
   finire in meno di 60 secondi di TEMPO REALE (setup e teardown compresi): misuralo con `time pnpm e2e:smoke` e riportalo.
5. CHECKPOINT dopo circa 30 minuti: esegui SOLO la parte di Servizi (`--grep` o il progetto) e riporta in una tabella: test
   eseguiti, OK, FALLITO, ERRORE-STRUMENTO, screenshot (atteso 17), tempo. Se ci sono ERRORE-STRUMENTO, correggili prima di
   passare a Menù fissi (atteso 28 screenshot).
ACCETTAZIONE (riporta i numeri): (1) `pnpm e2e:t1c` completo in meno di 10 minuti con 4 worker, DUE VOLTE di seguito con lo stesso
esito (prova dell'isolamento e della pulizia); (2) screenshot 45 su 45 (17 servizi e 28 menu-fissi, salvo gli stati
NON PROVATI per il database popolato, con il motivo); (3) ZERO ERRORE-STRUMENTO; (4) `time pnpm e2e:smoke` sotto 60 secondi
reali; (5) pnpm typecheck e pnpm lint sull'INTERO repo; (6) `ps` e `lsof` finali puliti (porte 3100, 3200, 3201, 3202) e zero
record verify-ui- (pnpm payload run e2e/scripts/count-verify-ui.ts); (7) nessun file fuori da e2e/, package.json e docs/design/
verifica/esiti/.
Aggiorna docs/design/verifica/esiti/2026-10-19-T1c/rapporto.md con le misure e, per OGNI controllo, OK / FALLITO / AVVISO /
NON PROVATO / ERRORE-STRUMENTO con valore misurato e atteso (mai «—»). Se ci sono FALLITO, la tua classificazione (difetto dell'app
o controllo dubbio). Non fare git. Se superi 120 minuti, FERMATI e riporta.
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e la ricerca delle chiamate vietate. Commit `test(e2e): T1c bis — fixture per worker, simulazioni dedicate, setup in-process; screenshot di Servizi e Menù fissi`, push (con gli screenshot: `git add e2e docs`), «push fatto». Poi faccio io il confronto visivo (C10).

### Passo T1b — Controlli comuni, console e screenshot: Vini, Distillati e Bevande

**Quando**: dopo T1c. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 60 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1b (controlli comuni, console e screenshot). Estendi e2e/ con i controlli comuni e gli screenshot di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 60 MINUTI. Precondizione: T0 accettato (git log mostra il commit di T0 su e2e/ e `pnpm e2e:smoke` passa in meno di 60
secondi); se manca, FERMATI. Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate Vini, Distillati e Bevande, per OGNI stato di `stati` e `stati_c1_c2` dei JSON e in TUTTI i progetti (profili e temi):
C1 (aspetto e testi), C2 e C2-mouse (aree di tocco), C3 (nessun lampo, cambio di sistema), console pulita e uno SCREENSHOT
<schermata>-<stato>-<profilo>-<tema>.png in docs/design/verifica/esiti/<data>-e2e/img/. Ogni test ha come titolo l'id del
controllo del JSON. La preparazione di uno stato (aprire un foglio, una conferma, un errore o un caricamento simulati) è una
funzione del test con UN'ASSERZIONE DI CONFERMA (l'elemento atteso è visibile); se non si può preparare, NON PROVATO con il
motivo. Gli stati con il database popolato («vuoto», «nuovo-senza-categorie») sono NON PROVATI con il motivo. Riusa, come
riferimento e non come copia, le logiche già verificate del vecchio lanciatore (fixture, selettori delle tendine con
`items`, attese di animazione). Misura il tocco con fixtures/touch; per taratura i risultati di C2 su Piatti devono
coincidere con quelli già noti (nessun FALLITO nuovo su Piatti).
ACCETTAZIONE (riporta i numeri): (1) la parte di suite di queste schermate finisce in meno di 10 minuti con 4 worker; (2) il
numero di screenshot è uguale a quello atteso, calcolato dal JSON; (3) zero ERRORE-STRUMENTO; (4) la suite di fumo passa in
meno di 60 secondi; (5) pnpm typecheck e pnpm lint sull'INTERO repo; (6) `ps` e `lsof` finali puliti e zero record verify-ui-.
Scrivi docs/design/verifica/esiti/<data>-T1b/rapporto.md con, per ogni controllo, OK / FALLITO / AVVISO / NON PROVATO /
ERRORE-STRUMENTO, il valore misurato e quello atteso (mai «—»), e il numero di screenshot per schermata.
Non fare git. Non toccare app/, components/, lib/, collections/, docs/design (fuori da verifica/esiti), i controlli JSON né
scripts/ui-verify. Rispondi in italiano con la tabella dei risultati.
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T1b — controlli comuni e screenshot di Vini, Distillati e Bevande`, push, «push fatto». 

### Passo T1c — Controlli comuni, console e screenshot: Servizi e Menù fissi

> **Esito (2026-10-19)**: 🔶 **non accettato**, struttura in repo (`0bb6847`). Controllato io: `pnpm typecheck` completo a 0 errori in un checkout pulito, ESLint a 0 errori, nessuna chiamata vietata in `e2e/`, nessun file fuori da `e2e/` e `docs/` salvo `package.json` (script `e2e:t1c`). Misure dell'agente: 62 OK, **0 FALLITO**, 8 ERRORE-STRUMENTO, 14 screenshot su 45, circa 11,4 minuti senza completare il giro (criterio: meno di 10 minuti, 45 screenshot, zero ERRORE-STRUMENTO). **Cause** (tutte dello strumento, nessun difetto dell'app): (1) **nomi dei record uguali tra i worker**, contro la regola R5 («`verify-ui-<giro>-w<worker>-<nome>`»): record duplicati e «strict mode violation» su Modifica ed Elimina; (2) gli stati «caricamento» ed «errore-caricamento» richiedono un `next dev` (le simulazioni sono spente con `NODE_ENV=production` per progetto) che si avvia dentro il test e supera i 60 secondi; (3) circa 1442 NON PROVATO sono combinazioni di profilo e tema che il test salta invece di non generare; (4) la suite di fumo impiega circa 2 minuti di tempo reale (criterio R8: meno di 60 secondi) perché setup e teardown lanciano `pnpm payload run`. Si chiude con T1c bis.

**Quando**: dopo T0 (è la prima schermata da verificare). **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 60 minuti. **Chiude V4** (passo 20).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1c (controlli comuni, console e screenshot). Estendi e2e/ con i controlli comuni e gli screenshot di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 60 MINUTI. Precondizione: T0 accettato (git log mostra il commit di T0 su e2e/ e `pnpm e2e:smoke` passa in meno di 60
secondi); se manca, FERMATI. Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate Servizi e Menù fissi, per OGNI stato di `stati` e `stati_c1_c2` dei JSON e in TUTTI i progetti (profili e temi):
C1 (aspetto e testi), C2 e C2-mouse (aree di tocco), C3 (nessun lampo, cambio di sistema), console pulita e uno SCREENSHOT
<schermata>-<stato>-<profilo>-<tema>.png in docs/design/verifica/esiti/<data>-e2e/img/. Ogni test ha come titolo l'id del
controllo del JSON. La preparazione di uno stato (aprire un foglio, una conferma, un errore o un caricamento simulati) è una
funzione del test con UN'ASSERZIONE DI CONFERMA (l'elemento atteso è visibile); se non si può preparare, NON PROVATO con il
motivo. Gli stati con il database popolato («vuoto», «nuovo-senza-categorie») sono NON PROVATI con il motivo. Riusa, come
riferimento e non come copia, le logiche già verificate del vecchio lanciatore (fixture, selettori delle tendine con
`items`, attese di animazione). Misura il tocco con fixtures/touch; per taratura i risultati di C2 su Piatti devono
coincidere con quelli già noti (nessun FALLITO nuovo su Piatti).
ACCETTAZIONE (riporta i numeri): (1) la parte di suite di queste schermate finisce in meno di 10 minuti con 4 worker; (2) il
numero di screenshot è uguale a quello atteso, calcolato dal JSON; (3) zero ERRORE-STRUMENTO; (4) la suite di fumo passa in
meno di 60 secondi; (5) pnpm typecheck e pnpm lint sull'INTERO repo; (6) `ps` e `lsof` finali puliti e zero record verify-ui-.
Scrivi docs/design/verifica/esiti/<data>-T1c/rapporto.md con, per ogni controllo, OK / FALLITO / AVVISO / NON PROVATO /
ERRORE-STRUMENTO, il valore misurato e quello atteso (mai «—»), e il numero di screenshot per schermata.
Non fare git. Non toccare app/, components/, lib/, collections/, docs/design (fuori da verifica/esiti), i controlli JSON né
scripts/ui-verify. Rispondi in italiano con la tabella dei risultati.
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T1c — controlli comuni e screenshot di Servizi e Menu fissi`, push, «push fatto». Poi faccio io il confronto visivo (C10) degli screenshot.

### Passo T2a — Flussi per schermata: Servizi e Menù fissi

**Quando**: dopo T1c. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 90 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T2a (flussi: Servizi e Menù fissi). Estendi e2e/ con i flussi di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 90 MINUTI. Precondizione: T1 delle stesse schermate accettato (rapporto con zero ERRORE-STRUMENTO); se manca, FERMATI.
Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate Servizi e Menù fissi, ogni controllo di tipo `flusso`, `attributi`, `testo`, `misura`, `assenza`, `presenza` e
`reindirizzamento` del JSON diventa un test con l'id del controllo come titolo. Il test legge `passi` e `atteso` del JSON,
ESEGUE L'AZIONE DALL'INTERFACCIA e poi CONTROLLA IL DATABASE con la fixture payload: persistenza (valori scritti uguali a
quelli letti, ordine, porzioni), cascata sulle eliminazioni e riga del registro con `riferimenti=N`, permessi (manager,
admin, super-admin; «utente senza ruolo» è NON PROVATO «coperto da scripts/verify-roles-8_3.ts», senza far fallire il
resto), formati dal server, traduzione inglese (con fallbackLocale: false e con ripiego). Riusa come riferimento, non come
copia, le logiche già verificate nel vecchio lanciatore. Tempo massimo di 60 secondi per test: oltre, ERRORE-STRUMENTO e
si prosegue. I test che modificano lo stato globale (conteggi della home) hanno il tag @esclusivo e girano per ultimi con un
solo worker. Un FALLITO ha SEMPRE valori misurati e attesi leggibili; se manca uno dei due è ERRORE-STRUMENTO.
ACCETTAZIONE (riporta i numeri): (1) zero ERRORE-STRUMENTO; (2) i controlli già noti come corretti tornano OK (servizi-righe-azioni, servizi-elimina-cascade-registro-permessi, menu-fissi-schede-percorsi, menu-fissi-ordine-piatti, menu-fissi-visibilita-categoria);
(3) ogni FALLITO ha misurato e atteso; (4) la parte di suite finisce in meno di 15 minuti con 4 worker; (5) la suite di fumo
passa in meno di 60 secondi; (6) pnpm typecheck e pnpm lint sull'INTERO repo; (7) `ps`, `lsof` e record verify-ui- puliti.
Scrivi docs/design/verifica/esiti/<data>-T2a/rapporto.md. Non fare git. Non toccare app/, components/, lib/, collections/,
docs/design (fuori da verifica/esiti), i controlli JSON né scripts/ui-verify. Rispondi in italiano con la tabella dei
risultati e, per ogni FALLITO, la tua classificazione (difetto dell'app o controllo dubbio).
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T2a — flussi di Servizi e Menu fissi`, push, «push fatto».

### Passo T2b — Flussi per schermata: Vini, Distillati e Bevande

**Quando**: dopo T1c e T2a. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 90 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T2b (flussi: Vini, Distillati e Bevande). Estendi e2e/ con i flussi di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 90 MINUTI. Precondizione: T1 delle stesse schermate accettato (rapporto con zero ERRORE-STRUMENTO); se manca, FERMATI.
Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate Vini, Distillati e Bevande, ogni controllo di tipo `flusso`, `attributi`, `testo`, `misura`, `assenza`, `presenza` e
`reindirizzamento` del JSON diventa un test con l'id del controllo come titolo. Il test legge `passi` e `atteso` del JSON,
ESEGUE L'AZIONE DALL'INTERFACCIA e poi CONTROLLA IL DATABASE con la fixture payload: persistenza (valori scritti uguali a
quelli letti, ordine, porzioni), cascata sulle eliminazioni e riga del registro con `riferimenti=N`, permessi (manager,
admin, super-admin; «utente senza ruolo» è NON PROVATO «coperto da scripts/verify-roles-8_3.ts», senza far fallire il
resto), formati dal server, traduzione inglese (con fallbackLocale: false e con ripiego). Riusa come riferimento, non come
copia, le logiche già verificate nel vecchio lanciatore. Tempo massimo di 60 secondi per test: oltre, ERRORE-STRUMENTO e
si prosegue. I test che modificano lo stato globale (conteggi della home) hanno il tag @esclusivo e girano per ultimi con un
solo worker. Un FALLITO ha SEMPRE valori misurati e attesi leggibili; se manca uno dei due è ERRORE-STRUMENTO.
ACCETTAZIONE (riporta i numeri): (1) zero ERRORE-STRUMENTO; (2) i controlli già noti come corretti tornano OK (vini-origine-cascata, distillati-paese-fuori-filtro, vini-elimina, bevande-modulo-inglese);
(3) ogni FALLITO ha misurato e atteso; (4) la parte di suite finisce in meno di 15 minuti con 4 worker; (5) la suite di fumo
passa in meno di 60 secondi; (6) pnpm typecheck e pnpm lint sull'INTERO repo; (7) `ps`, `lsof` e record verify-ui- puliti.
Scrivi docs/design/verifica/esiti/<data>-T2b/rapporto.md. Non fare git. Non toccare app/, components/, lib/, collections/,
docs/design (fuori da verifica/esiti), i controlli JSON né scripts/ui-verify. Rispondi in italiano con la tabella dei
risultati e, per ogni FALLITO, la tua classificazione (difetto dell'app o controllo dubbio).
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T2b — flussi di Vini, Distillati e Bevande`, push, «push fatto».

### Passo T2c — Flussi per schermata: Piatti e home

**Quando**: dopo T1c e T2a. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Stima**: 90 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T2c (flussi: Piatti e home). Estendi e2e/ con i flussi di alcune schermate.

REGOLE DEL PERCORSO DI TEST v2 (valgono sempre; leggile per intero in docs/design/verifica/percorso-test-v2.md):
nessuna chiamata sincrona che possa bloccare (R1), ogni attesa con tempo massimo e nessun waitForTimeout come attesa di
stato (R2), un test bloccato viene ucciso e il giro continua (R3), un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO e
non FALLITO (R4), dati di prova con nome univoco creati e cancellati dalla fixture (R5), avanzamento in
.next/e2e-progress.log (R6), un solo giro alla volta (R7), la suite di fumo sotto 60 secondi dopo ogni modifica a e2e/ (R8),
una sola chat modifica e2e/ alla volta e NESSUNA modifica al vecchio lanciatore scripts/ui-verify (R9), un passo che supera
il doppio della stima si ferma e riporta (R10). Esegui i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni).

Leggi nell'ordine, per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md;
docs/design/verifica/README.md, policy-test.md e misura-tocco.md; docs/design/verifica/controlli-6.6.json e controlli-8.2.json.

STIMA 90 MINUTI. Precondizione: T1 delle stesse schermate accettato (rapporto con zero ERRORE-STRUMENTO); se manca, FERMATI.
Modifichi SOLO e2e/** e i rapporti sotto docs/design/verifica/esiti/.

FAI: per le schermate Piatti e home, ogni controllo di tipo `flusso`, `attributi`, `testo`, `misura`, `assenza`, `presenza` e
`reindirizzamento` del JSON diventa un test con l'id del controllo come titolo. Il test legge `passi` e `atteso` del JSON,
ESEGUE L'AZIONE DALL'INTERFACCIA e poi CONTROLLA IL DATABASE con la fixture payload: persistenza (valori scritti uguali a
quelli letti, ordine, porzioni), cascata sulle eliminazioni e riga del registro con `riferimenti=N`, permessi (manager,
admin, super-admin; «utente senza ruolo» è NON PROVATO «coperto da scripts/verify-roles-8_3.ts», senza far fallire il
resto), formati dal server, traduzione inglese (con fallbackLocale: false e con ripiego). Riusa come riferimento, non come
copia, le logiche già verificate nel vecchio lanciatore. Tempo massimo di 60 secondi per test: oltre, ERRORE-STRUMENTO e
si prosegue. I test che modificano lo stato globale (conteggi della home) hanno il tag @esclusivo e girano per ultimi con un
solo worker. Un FALLITO ha SEMPRE valori misurati e attesi leggibili; se manca uno dei due è ERRORE-STRUMENTO.
ACCETTAZIONE (riporta i numeri): (1) zero ERRORE-STRUMENTO; (2) i controlli già noti come corretti tornano OK (i controlli di Piatti tutti OK in V2 quater);
(3) ogni FALLITO ha misurato e atteso; (4) la parte di suite finisce in meno di 15 minuti con 4 worker; (5) la suite di fumo
passa in meno di 60 secondi; (6) pnpm typecheck e pnpm lint sull'INTERO repo; (7) `ps`, `lsof` e record verify-ui- puliti.
Scrivi docs/design/verifica/esiti/<data>-T2c/rapporto.md. Non fare git. Non toccare app/, components/, lib/, collections/,
docs/design (fuori da verifica/esiti), i controlli JSON né scripts/ui-verify. Rispondi in italiano con la tabella dei
risultati e, per ogni FALLITO, la tua classificazione (difetto dell'app o controllo dubbio).
```

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e i test. Commit `test(e2e): T2c — flussi di Piatti e home`, push, «push fatto».

### Passo T3 — Confronto visivo (C10) di tutti gli stati

**Quando**: dopo T1c (Servizi e Menù fissi) e poi dopo T1a e T1b per le altre schermate. **Chi**: la chat di design (io). **Cosa**: confronto degli screenshot di `docs/design/verifica/esiti/<data>-e2e/img/` con i PNG di `docs/design/schermate/`, a 390 e 1280 px, in chiaro e scuro; ne esce un file `rilievi.md` con i P e gli A, e se ci sono P un prompt di correzione per Composer. **Alternativa da decidere** (non ora): automatizzare il confronto con un modello e una scheda di controllo fissa (struttura, testi, ordine, icone, aree di tocco); richiede una chiave API. **Per te**: committa gli screenshot (`git add docs/design/verifica/esiti`) e scrivimi «push fatto».

### Passo T4 — Pensionamento del vecchio lanciatore

**Quando**: dopo T2c e quando `pnpm e2e` eguaglia i controlli del vecchio lanciatore. **Incolla in Cursor**, in una chat nuova, un prompt che chiede: `pnpm ui:verify` come alias di `pnpm e2e`; rimozione di `scripts/ui-verify` tranne ciò che serve (`provision-user.ts`, `watch.sh` se ancora utile); aggiornamento di `README.md` e `policy-test.md` di docs/design/verifica e delle regole 02; prova che `pnpm e2e` passa; `pnpm typecheck` e `pnpm lint` sull'INTERO repo; nessuna modifica a `app/`, `components/`, `lib/`, `collections/`. **Stima**: 60 minuti; lo scrivo quando serve.

### Passo 21 — RL4/F4: rilievi di V4 e correzione dei P (solo se ci sono)

**Chi**: la chat di design (io).
**Cosa fai tu**: dopo che l'agente di verifica ha finito e tu hai pushato il suo rapporto, incollami qui il suo resoconto finale. Io leggo il rapporto, assegno i rilievi **P** (bloccano) e **A** (non bloccano), li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` e ti consegno lo zip con il file e il nome della `<CARTELLA>`. Se non ci sono P, il passo successivo parte subito.

**Passo F4 (solo se ci sono P)**

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F4: correzione dei rilievi P della verifica L2 V4. Fai solo
questo. Le regole di .cursor/rules si caricano da sole.

CARTELLA DEI RILIEVI = <INCOLLA QUI il nome della cartella che ti dà la chat di design, per esempio 2026-10-17-locale-prod>

LEGGI per intero:
- docs/design/verifica/esiti/<CARTELLA>/: il rapporto dell'agente e rilievi.md (i rilievi P assegnati dalla chat di
  design, uno per riga: id, valore misurato, valore atteso, schermata).
- Le specifiche della schermata interessata, sezioni «Testi» e «Layout»: docs/design/schermate/menu-fissi/spec.md, docs/design/schermate/servizi/spec.md

REGOLE
1. Correggi SOLO i rilievi P elencati in rilievi.md. Non toccare i rilievi A. Non cambiare controlli, soglie,
   specifiche né documenti di design (docs/design/**). Se un P ti sembra un controllo dubbio o una specifica
   sbagliata, dillo e non correggere.
2. PARTE A, solo proposta: per ogni P scrivi la causa che vedi nel codice e il file che toccherai. Poi FERMATI e
   aspetta il mio «procedi».
3. Dati: Local API con la sessione dell'utente (overrideAccess: false). Nessuna nuova dipendenza, nessuna
   migrazione. Componenti shadcn solo come da docs/design/installazione-componenti-ui.md.
4. Verifiche: L0 (pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/) e L1 dei soli controlli falliti:
   pnpm ui:verify --livello 1 --schermata <id> --controlli controlli-6.6.json (per la shell: --controlli
   controlli-8.2.json). Al massimo due giri; al terzo fermati e riportami. Non modificare mai i controlli.
5. Fermati e riferisci, senza aggirare, se serve un passaggio fuori dal codice o manca un ambiente. Mai produzione.
6. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased] con cosa era sbagliato e cosa è
   cambiato (comprensibile senza questa chat); commit locale (git add + git commit, messaggio che nomina la chat
   F4); MAI git push. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md
   segna la riga del passo 21 con «🔶 fatto, da controllare» (solo quella riga) nello stesso commit.
7. RISPOSTA FINALE: tabella «Esiti reali» con un rigo per ogni P: corretto / non corretto, con evidenza.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 22 — D6: controlli per Giorni speciali e Messaggio globale

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 22»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

### Passo 23 — VC5: l'agente implementa i controlli di Giorni speciali e Messaggio globale

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui IMPLEMENTI I CONTROLLI nel lanciatore, non
verifichi ancora nessuna schermata nuova. Istanza: VC5, prima della chat I5 della sottofase 6.6.

Prerequisito: i controlli di queste schermate li scrive la chat di design in docs/design/verifica/controlli-6.6.json.
Se una delle schermate indicate qui sotto NON è nel file, fermati e dimmelo: non scriverle tu.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md (sezione 6: ordine per ogni schermata nuova)
3. docs/design/verifica/controlli-6.6.json, SOLO le schermate: giorni-speciali, messaggio-globale; più i controlli comuni
   (NO-OVERRIDE, RICOMPILA-ASSENTE, RICOMPILA-PRESENTE) e dati_e_sicurezza.
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: docs/design/schermate/giorni-speciali/spec.md, messaggio-globale/spec.md

Poi:
A. Il lanciatore ha già il modulo scripts/ui-verify/lib/run-menu.mjs creato dal passo VC1, con la gestione di
   «stato_prova» e «rinviato_a», delle simulazioni APP_MENU_DEV_SIMULATE_* e dei dati di prova «verify-ui-…»:
   ESTENDILO, non crearne un altro. Per ogni controllo delle schermate indicate, trova se il lanciatore sa già
   eseguirlo (stesso tipo, stesso selettore). Elenca quelli che mancano.
B. Implementa i tipi di controllo che mancano (campo data nativo, controllo di sovrapposizione nel modulo, gruppi Prossimi e Passati con la data di oggi in Europe/Rome, pagina con «Salva modifiche» e «Togli il messaggio», indicatore di pubblicazione (in sviluppo con lo storage in memoria; stato «file non leggibile»)). Non cambiare nessun controllo, soglia o tolleranza dei
   file JSON; i testi attesi delle costanti si leggono da lib/, non si copiano. Se un controllo ti sembra sbagliato
   o impossibile, scrivilo come «controllo dubbio» e lascialo com'è.
C. Prova il cablaggio: pnpm lint e pnpm typecheck verdi; il lanciatore carica controlli-6.6.json e riconosce ogni
   id e tipo delle schermate indicate. Le schermate non ancora implementate (le fa la chat I5) danno NON PROVATO
   con l'evidenza «schermata non ancora implementata», senza errori del lanciatore. Non provare le schermate.
   Per i flussi che richiedono la schermata esistente (moduli, finestre, simulazioni): implementa tutto ciò che si
   può senza la pagina (id, tipo, lettura degli attesi da lib/, dati di prova, funzioni di supporto) ed elenca nel
   rapporto, sotto «Debito», i flussi che restano da completare: li completa ed esegue l'agente di verifica del
   passo V successivo, dopo la chat di implementazione (policy-test.md §6, ultimo capoverso).
D. Scrivi in docs/design/verifica/esiti/<AAAA-MM-GG>-controlli/ un breve rapporto: controlli già coperti, controlli
   aggiunti, controlli dubbi, NON PROVATO (con il motivo).

Non fare git (puoi leggere git status). Puoi modificare solo scripts/ui-verify/** e il rapporto; non toccare app/,
components/, lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in italiano, distinguendo
sempre OK, FALLITO, AVVISO e NON PROVATO.
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `test(ui-verify): controlli di Giorni speciali e Messaggio globale nel lanciatore (VC5)`

### Passo 24 — I5: Giorni speciali e Messaggio globale

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 24 (I5). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I5: schermate Giorni speciali (/app/menu/special-days) e Messaggio globale (/app/menu/message).

LEGGI
- docs/design/schermate/giorni-speciali/spec.md e messaggio-globale/spec.md, per intero, con i mockup.
- docs/design/decisioni-layout-app.md (D7, D8, D9, D10, D13, D14, A47, A48).
- docs/piano-sviluppo/fase-6-menu-digitale.md: 6.3 (giorni speciali) e 6.4; ADR-112 §3 (disponibilita.json).
- Codice: lib/menu/validateSpecialDayOverlap.ts (SPECIAL_DAY_OVERLAP_MESSAGE, specialDayScopesOverlap),
  lib/menu/specialDayDate.ts (todayRomeAsSpecialDayDate), collections/menu/specialDays.ts, globals/MenuGeneral.ts,
  lib/menu/access.ts (canUpdateMenuGeneralRequest), lib/menu/availability/ (gcsAvailabilityWriter.ts:
  resolveAvailabilityStorage e readCurrentObject; canonicalJson.ts: parseAvailabilityJsonFromGcs;
  buildAvailabilityDocument.ts: la regola di buildGlobalMessage, che non è esportata), app/(app)/app/(shell)/hours/
  (modello di pagina con «Salva modifiche» e «Annulla modifiche»).

COSA FARE
1. Giorni speciali: «Prossimi» (data crescente) e «Passati» (decrescente) con la data di oggi in Europe/Rome
   (todayRomeAsSpecialDayDate), due richieste con where e sort; interruttore «Attivo»; modulo con campo data nativo
   (l'App scrive sempre AAAA-MM-GG), ambito, caselle dei menù fissi raggruppate per categoria con badge, almeno un
   menù, messaggio con traduzione; controllo di sovrapposizione anticipato nel modulo con
   specialDayScopesOverlap e SPECIAL_DAY_OVERLAP_MESSAGE (il testo del server, non riscriverlo), che blocca il
   salvataggio e non conta i giorni disattivati né il giorno che si sta modificando; data passata ammessa con
   avviso non bloccante; conferma di eliminazione semplice. Nessuna scrittura di disponibilita.json.
2. Messaggio globale: pagina con un solo campo (globalMessage, italiano e inglese), nessun limite di lunghezza, i
   ritorni a capo diventano spazi; «Salva modifiche», «Annulla modifiche», «Togli il messaggio» con conferma.
3. Indicatore di pubblicazione: lettura LATO SERVER di disponibilita.json con resolveAvailabilityStorage e
   readCurrentObject + parseAvailabilityJsonFromGcs, solo in lettura; mostra «Menù pubblico aggiornato alle {HH:mm}»
   (updatedAt del file, Europe/Rome) e «In pubblicazione…» finché il testo del file non coincide con quello salvato
   (confronto con la regola di buildGlobalMessage: estraila o replicala in un helper esportato e testato). Se il
   file non è leggibile (storage non configurato o errore) la pagina va senza ora né «In pubblicazione…».
4. Accendi in navigazione le due voci (enabled: true) e aggiorna scripts/verify-lib-app-8_2.ts con le voci abilitate. Con tutte le otto voci accese i controlli nav-pannello-telefono (L2) diventano eseguibili.

NON FARE: «Ricompila» visibile, modifiche a hook o a disponibilita.json, scritture dirette sul file dalla schermata.

VERIFICHE: L0; L1 su `giorni-speciali,messaggio-globale`. In sviluppo prova la lettura del file con lo storage
in memoria (dichiaralo). La lettura sul bucket vero NON si prova qui: va nei NON PROVATO e nel passo 30 (L3).
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 25 — D7: controlli di chiusura (L2 completo e L3)

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 25»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

### Passo 26 — I6: chiusura della sottofase (solo verifica, documentazione e correzioni minime)

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 26 (I6). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I6: chiusura di 6.6 (solo verifica, documentazione e correzioni minime). NON eseguire l'import di produzione.

LEGGI
- docs/piano-sviluppo/fase-6-menu-digitale.md, 6.6 (Contenuto, Vincoli, checklist di chiusura) e 6.8.
- La sezione «Checklist di accettazione» (§9) di ognuna delle nove specifiche in docs/design/schermate/:
  piatti, vini, distillati, bevande, servizi, menu-fissi, giorni-speciali, messaggio-globale, integrazione.
- docs/design/verifica/policy-test.md; il CHANGELOG delle chat precedenti.

COSA FARE
1. Per ogni voce di ogni checklist §9 produci una riga: voce, come l'hai provata (comando, test, prova a mano),
   esito OK / FALLITO / NON PROVATO, evidenza. Le voci su «Ricompila» sono rinviate alla 6.5 (bandiera spenta):
   scrivile «NON PROVATO (rinviato alla 6.5)», non FALLITO.
2. Esegui tutti i verify:* della 6.1–6.4 e quelli nuovi di I0a e I0b; L0 completo; L1 su tutte le schermate del
   Menù (--schermata piatti,vini,distillati,bevande,servizi,menu-fissi,giorni-speciali,messaggio-globale più la
   shell e la home). Prerequisiti di ambiente: verify:menu-6_4 richiede pnpm dev avviato con le variabili
   d'ambiente dell'intestazione dello script (oltre al database di sviluppo); verify:menu-availability-final-proofs
   ha una parte dev (:3000, con le variabili del suo file) eseguibile, e una parte standalone (:3002) che in
   locale resta NON PROVATA perché manca MENU_AVAILABILITY_GCS_BUCKET (l'avvio production non usa IN_MEMORY): non
   insistere, la coprono i controlli sul file di disponibilità in produzione (passi 27 e 30).
3. Correggi solo difetti piccoli e chiari (testi, attributi); per il resto riportali, non risolverli.
4. CHANGELOG di sottofase 6.6: un solo riepilogo con Ufficiale / Percepito / Osservato per tutte le ambiguità
   delle chat precedenti (riprendile dalle voci già scritte); debiti: i NON PROVATO (compresi quelli rinviati alla 6.5) con il livello in cui
   si proveranno (L2, L3, 6.5).
5. Aggiorna la checklist di chiusura di 6.6 in fase-6 spuntando SOLO ciò che hai provato; lo stato resta «🔶 in
   corso» fino all'import di produzione.

NON FARE: import di produzione, deploy, modifiche alle specifiche.

VERIFICHE: quelle del punto 2. Risposta finale: la tabella completa delle checklist e l'elenco dei debiti.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 27 — M2: deploy in produzione e smoke

**Chi**: tu. Nessun prompt di Cursor.

**Che cos'è**: il deploy è **automatico**. Ogni push su `main` avvia il trigger Cloud Build (progetto `vma-vd`, regione `europe-west1`, servizio Cloud Run `vma-vd-backend-backoffice-git`; vedi `docs/operativo/cloud-run-produzione.md`). Non c'è un comando di deploy da lanciare, e la 6.6 non ha migrazioni: nessun passaggio sul database di produzione.

**Cosa fai**
1. Dopo il push della chat I6 (passo 26), in Google Cloud Console apri Cloud Build → Cronologia e controlla che la build del commit di I6 sia terminata con **successo**; in Cloud Run controlla che la revisione più recente serva il 100 % del traffico. Se la build fallisce, incollami l'errore del log.
2. Smoke (1 minuto, nessuna credenziale): `BASE_URL=<indirizzo pubblico dell'App, senza /app> pnpm ui:verify online --controlli controlli-8.2.json`
3. Scrivimi «deploy fatto» con l'hash del commit e incollami l'esito dello smoke.

### Passo 28 — V6: l'agente esegue L2 completo (tutte le schermate, WebKit, online senza credenziali)

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi. Istanza: V6, dopo la chat I6 e del deploy (passo 27).

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (i controlli del Menù) e docs/design/verifica/controlli-8.2.json
   (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: le nove specifiche in docs/design/schermate/: piatti, vini, distillati, bevande, servizi, menu-fissi, giorni-speciali, messaggio-globale, integrazione

Poi, in quest'ordine:
0. Riporta nel rapporto l'hash di HEAD e lo stato di git (solo lettura: git rev-parse --short HEAD, git status --short).
   Se git status non è pulito, fermati e dimmelo.
A. Il lanciatore ha già i controlli del Menù. Se nei rapporti dei passi VC (cartelle
   docs/design/verifica/esiti/<data>-controlli/) o nei rapporti V precedenti ci sono controlli ancora IN DEBITO o
   non completati, ora tutte le schermate esistono: IMPLEMENTALI tu in scripts/ui-verify/** ed ESEGUILI in questa
   verifica. Rifinisci anche nav-pannello-telefono (caso telefono-390-basso, con le otto voci accese), che VC1 ha
   lasciato come «controllo dubbio». Completa i controlli online nuovi del Menù previsti dal file dei controlli.
   Non cambiare i controlli JSON. Nel rapporto scrivi quali hai completato ed eseguito e quali no, e perché.
B. Esegui, su locale-dev (solo il controllo CONSOLE) e su locale-prod (tutti gli altri):
   pnpm ui:verify --livello 2 --controlli controlli-6.6.json   (tutto)
   pnpm ui:verify --livello 2 --controlli controlli-8.2.json   (shell e accesso)
   pnpm ui:verify --livello 2 --controlli controlli-8.5.json   (Orari)
C. Esegui i controlli «online-senza-credenziali» contro BASE_URL = <DOMINIO PUBBLICO DI CLOUD RUN: sostituiscilo con l'indirizzo con cui apri l'App in produzione, senza /app>, con il comando
   BASE_URL=<dominio> pnpm ui:verify online --controlli controlli-8.2.json
   Nessuna credenziale, nessun utente di prova sul dominio pubblico.
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README, sezione 7.
E. Cancella l'utente di prova e i dati «verify-ui-…» rimasti, e verifica con git status che i file nuovi siano solo
   quelli attesi.

Non fare git (puoi leggere git status). Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i
controlli. Rispondi in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore misurato e
quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come
«controllo dubbio».
```

**Quando Cursor ha finito**: incollami qui il suo resoconto finale. Il rapporto sta in `docs/design/verifica/esiti/<data>-<ambiente>/`: fai tu `git add -A` e un commit con il messaggio indicato sotto, poi il push, e scrivimi «push fatto». Io controllo e ti do il prompt di aggiornamento stato (§1.3), da incollare in una chat nuova di Composer.
**Messaggio di commit suggerito** (lo fai tu): `docs(verifica): rapporto L2 V6 (Menù completo)`

### Passo 29 — RL6/F6: rilievi di V6 e correzione dei P (solo se ci sono)

**Chi**: la chat di design (io).
**Cosa fai tu**: dopo che l'agente di verifica ha finito e tu hai pushato il suo rapporto, incollami qui il suo resoconto finale. Io leggo il rapporto, assegno i rilievi **P** (bloccano) e **A** (non bloccano), li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` e ti consegno lo zip con il file e il nome della `<CARTELLA>`. Se non ci sono P, il passo successivo parte subito.

**Passo F6 (solo se ci sono P)**

**Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (ha già le sue regole; **non** il Blocco comune).

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F6: correzione dei rilievi P della verifica L2 V6. Fai solo
questo. Le regole di .cursor/rules si caricano da sole.

CARTELLA DEI RILIEVI = <INCOLLA QUI il nome della cartella che ti dà la chat di design, per esempio 2026-10-17-locale-prod>

LEGGI per intero:
- docs/design/verifica/esiti/<CARTELLA>/: il rapporto dell'agente e rilievi.md (i rilievi P assegnati dalla chat di
  design, uno per riga: id, valore misurato, valore atteso, schermata).
- Le specifiche della schermata interessata, sezioni «Testi» e «Layout»: le specifiche delle schermate interessate in docs/design/schermate/

REGOLE
1. Correggi SOLO i rilievi P elencati in rilievi.md. Non toccare i rilievi A. Non cambiare controlli, soglie,
   specifiche né documenti di design (docs/design/**). Se un P ti sembra un controllo dubbio o una specifica
   sbagliata, dillo e non correggere.
2. PARTE A, solo proposta: per ogni P scrivi la causa che vedi nel codice e il file che toccherai. Poi FERMATI e
   aspetta il mio «procedi».
3. Dati: Local API con la sessione dell'utente (overrideAccess: false). Nessuna nuova dipendenza, nessuna
   migrazione. Componenti shadcn solo come da docs/design/installazione-componenti-ui.md.
4. Verifiche: L0 (pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/) e L1 dei soli controlli falliti:
   pnpm ui:verify --livello 1 --schermata <id> --controlli controlli-6.6.json (per la shell: --controlli
   controlli-8.2.json). Al massimo due giri; al terzo fermati e riportami. Non modificare mai i controlli.
5. Fermati e riferisci, senza aggirare, se serve un passaggio fuori dal codice o manca un ambiente. Mai produzione.
6. Chiusura: voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased] con cosa era sbagliato e cosa è
   cambiato (comprensibile senza questa chat); commit locale (git add + git commit, messaggio che nomina la chat
   F6); MAI git push. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md
   segna la riga del passo 29 con «🔶 fatto, da controllare» (solo quella riga) nello stesso commit.
7. RISPOSTA FINALE: tabella «Esiti reali» con un rigo per ogni P: corretto / non corretto, con evidenza.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.

### Passo 30 — M3/D9: L3, sessione reale su Cloud Run e giro su iPhone

**Chi**: tu e la chat di design. Nessun prompt di Cursor.

**Prerequisito**: il deploy del passo 27 è fatto, V6 (passo 28) e le sue correzioni (passo 29) sono chiusi.

**Parte D9, la fa la chat di design con il tuo browser**
1. Sul computer apri Chrome con l'estensione Claude collegata e accedi a `<indirizzo pubblico>/app` come manager.
2. Scrivimi «pronto». Io eseguo i controlli con sessione reale: Esci con clic vero, accesso all'Admin, i tre ruoli (manager, admin, utente senza ruolo), le righe `delete` nel registro attività dopo l'eliminazione di una voce di prova che creo e cancello io, e per il Messaggio globale la lettura di `disponibilita.json` lato server con l'ora mostrata. Non tocco dati veri.

**Parte M3, il giro su iPhone, la fai tu** (15 minuti, Safari, in chiaro e in scuro): la lista qui sotto. Scrivimi per ogni punto «ok» oppure cosa non va, con uno screenshot se serve.

1. Home «Oggi»: la riga «{N} piatti terminati» e il tocco sulla scheda «Menù».
2. Pannello di navigazione con le otto voci (su un iPhone con schermo basso le voci scorrono e restano fissi il blocco «Area App» e quello utente).
3. Piatti: interruttore «Terminato», occhio, cestino (tocco comodo, nessun tocco sbagliato); foglio dal basso con la tastiera aperta sul prezzo (tastiera decimale, i pulsanti restano visibili).
4. Vini: i menu a tendina, l'anno con la tastiera numerica, la cascata dell'origine.
5. Menù fissi: la vista «Scegli piatti» (scorrimento, caselle), le frecce, il tasto indietro tra le schede.
6. Giorni speciali: il selettore della data di iOS, il tema scuro dei controlli nativi.
7. Messaggio globale: la tastiera sull'area di testo, e dopo il salvataggio «Menù pubblico aggiornato alle…».
8. Un'eliminazione di una voce di prova con la conferma (testo leggibile, pulsanti raggiungibili).

### Passo 31 — I7: import di produzione 6.8 (sessione con passaggi esterni)

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto (che sostituisce la regola 6 «mai produzione» del Blocco comune).

È una sessione con passaggi esterni: Composer propone e prepara, **non esegue nulla in produzione senza il tuo «vai» per ogni passaggio**.

```text
PASSO 31 (I7). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I7: esecuzione in produzione dell'import di 6.8 (una volta sola, alla chiusura della 6.6, prima della 6.9).
Questa chat segue il BLOCCO COMUNE ma con questa eccezione: la regola 6 («mai produzione») è sostituita da quanto
scritto qui sotto, passaggio per passaggio.

LEGGI
- docs/piano-sviluppo/fase-6-menu-digitale.md, 6.8, sezione «Esecuzione in produzione» e checklist.
- docs/operativo/export-menu-vtn-backend.md, docs/operativo/cloud-sql-produzione.md.
- scripts/prod-db.sh, scripts/import-menu-vtn-backend.ts e scripts/import-menu-vtn-backend/; il report a secco
  esteso di I0b e le regole di normalizzazione fissate dopo il passo 6 (M1).

PARTE A (solo proposta): la sequenza esatta, con i comandi e i flag (incluso --allow-non-dev-database), e
quali passaggi sono ESTERNI (li fa Mirko): (1) snapshot del giorno, (2) report a secco sul database di produzione:
zero errori e conteggi coerenti, (3) backup su richiesta di Cloud SQL prima della scrittura, (4) --apply, (5)
controlli REST sui conteggi. Per ogni passaggio: cosa serve, cosa dimostra, come si torna indietro (in produzione
il ritorno è il ripristino da backup). Poi FERMATI.

PARTE B: un passaggio alla volta. Prima di ogni comando che tocca la produzione scrivi il comando e aspetta il mio
«vai». Dopo il report a secco FERMATI: se ci sono errori, non proseguire. Dopo il backup, aspetta la mia conferma
scritta che è completato. Dopo --apply esegui i controlli REST e riporta i conteggi accanto a quelli dello snapshot.
Mai credenziali in chat o nei file.

CHIUSURA: spunta in fase-6 6.6 la voce «esecuzione in produzione» e in 6.8 la sua; la 6.6 diventa ✅ solo se i
conteggi coincidono. CHANGELOG con gli esiti reali (anche parziali). Commit locale; il push è mio.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali» e commit locale): incollami qui la sua risposta finale, fai tu il push e scrivimi «push fatto». Cursor ha segnato la riga del passo 🔶 nel commit finale; io controllo il repo e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅.
In più: **prima di dare il «vai» a ogni comando che tocca la produzione, incollami il comando e aspetta il mio ok**; il backup di Cloud SQL lo fai tu e mi scrivi «backup fatto».

### Passo 32 — Dopo la 6.6: 6.9 e 6.5

Non c'è un prompt in questo documento: la 6.9 (scaffold del frontend) e la 6.5 (rebuild) hanno le loro sottofasi in `fase-6-menu-digitale.md`, e li preparo quando la 6.6 è chiusa (passo 31 ✅). La 6.5 accende la bandiera del pulsante «Ricompila il menù pubblico» e prova ciò che qui è NON PROVATO «rinviato alla 6.5»: vedi §7.

---

## 5. Riferimento: cosa fa la chat di design e quando

| Passo | Cosa produco | Contenuto |
|---|---|---|
| **D1** (prima di VC1 e della chat I1) | `controlli-6.6.json` (shell, home, navigazione, Piatti) e l'aggiornamento di `controlli-8.2.json` | Per la shell: otto voci con le icone, descrizione della scheda «Menù», riga di stato, regola del percorso più lungo (voce attiva e briciole per i percorsi della tabella di `integrazione/spec.md` §2). Per Piatti: dalla §9 della specifica, ogni controllo con `id`, tipo, selettore, atteso, `livello` (1 o 2) e `fonte`; stati, testi, misure (390 e 1280 px, chiaro e scuro) |
| **D3, D5, D6** | Lo stesso file, con le schermate aggiunte un gruppo alla volta | D3: Vini, Distillati, Bevande · D5: Servizi e Menù fissi · D6: Giorni speciali e Messaggio globale. Ognuno prima del suo VC |
| **D7** | Controlli di chiusura nello stesso file | L2 completo e L3 (sezione 8); i controlli online nuovi li completa V6 |
| **RL1, RL2, RL4, RL6** | `rilievi.md` accanto a ogni rapporto | Ogni FALLITO di L2 diventa **P** (blocca la chat successiva) o, se il controllo è sbagliato, lo correggo io nel JSON (con una voce nel CHANGELOG del file dei controlli); ogni AVVISO diventa **A** (non blocca). Per ogni P: id, valore misurato, valore atteso, schermata. Aggiorno le specifiche se un P rivela un difetto della specifica e non del codice |
| **D9** (L3) | Esito dei controlli con sessione reale su Cloud Run | Col tuo browser: Esci, Admin, ruoli (manager, admin, utente senza ruolo), registro attività con le righe `delete`, e per il Messaggio globale la lettura di `disponibilita.json` lato server con l'ora mostrata. Per i controlli che cancellano uso solo voci di prova create e poi eliminate da me, mai dati veri |

I controlli non si cambiano mai per farli passare: se uno è sbagliato lo correggo io. Lo faccio anche per gli id di `controlli-8.2.json` interessati dalla shell a otto voci.

---

---

## 6. Riferimento: L3, giro su iPhone vero (tuo, passo 30)

Un'ora in tutto, 15 minuti tuoi. Safari su iPhone, in chiaro e in scuro:

1. Home «Oggi»: la riga «{N} piatti terminati» e il tocco sulla scheda «Menù».
2. Pannello di navigazione con le otto voci (su un iPhone con schermo basso le voci scorrono e restano fissi il blocco «Area App» e quello utente).
3. Piatti: interruttore «Terminato», occhio, cestino (tocco comodo, nessun tocco sbagliato); foglio dal basso con la tastiera aperta sul prezzo (tastiera decimale, i pulsanti restano visibili).
4. Vini: i menu a tendina, l'anno con la tastiera numerica, la cascata dell'origine.
5. Menù fissi: la vista «Scegli piatti» (scorrimento, caselle), le frecce, il tasto indietro tra le schede.
6. Giorni speciali: il selettore della data di iOS, il tema scuro dei controlli nativi.
7. Messaggio globale: la tastiera sull'area di testo, e dopo il salvataggio «Menù pubblico aggiornato alle…».
8. Un'eliminazione di una voce di prova con la conferma (testo leggibile, pulsanti raggiungibili).

---

---

## 7. Dopo la 6.6

Ordine del piano (`fase-6` §6.9, §6.5): **6.9** (scaffold del frontend del menù, sul Firebase nuovo) e poi **6.5** (endpoint e trigger di Cloud Build). La 6.5 accende la bandiera del pulsante «Ricompila il menù pubblico» costruito in I1 e prova nella sua checklist ciò che qui è NON PROVATO con l'evidenza «rinviato alla 6.5»: pulsante presente nelle sette intestazioni (Piatti, Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali), assente nel Messaggio globale e in home, finestra di conferma, esito «avviata». Quel passo ha il suo L1 sulle sette schermate.
