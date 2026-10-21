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
| **Agente di verifica** (implementa i controlli: VC; esegue L2: V) | 3, 8, 13, 15, 18, 20, 23, 28, 28b–28f | Solo il prompt del passo (ha già le sue regole; **non** il Blocco comune) |
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
| 20 | ✅ `853a1e5` | Solo il prompt del passo 20 | V4 | Agente di verifica | **L2 mirato** sui tipi nuovi: schede come percorsi, vista di scelta, conferme con cascade **(chiuso con F4 e T1e; coda: 21b e 21c, vedi 2.3)** | **L2** mirato | rapporto scritto |
| 21 | ✅ `22b66b8` | Solo il prompt del passo 21, se ci sono P | RL4/F4 | Design, Composer | Rilievi di V4 e correzione dei P | L0 + L1 dei falliti | nessun P aperto |
| 21b | ✅ `5615003` | Solo il prompt del passo 21b | F-TOCCO | Composer | **Area di tocco delle schede di Menù fissi (P8, ex A6) e filtro Stato dei cataloghi (A8, `items`)** | L0 + **L1** (obbligatorio) | tocco senza FALLITO; tre `Select` con `items`; tu pushi |
| 21c | ✅ `082ba3d`, `fab9f5d` | Solo il prompt del passo 21c | V-MF | Agente di verifica | **Prova di funzionamento di Menù fissi dopo F4** (nove controlli di flusso) più C2 delle schede; un solo giro, tetto 30 minuti | L1 mirato, motore esistente | nove controlli con esito misurato; C2 delle schede senza FALLITO; ambiente pulito |
| 22 | ✅ `eb774a4` | — | D6 | Design | Controlli per Giorni speciali e Messaggio globale | — | file pronto |
| 23 | 🔲 | Solo il prompt del passo 23 | VC5 | Agente di verifica | Implementa i controlli di Giorni speciali e Messaggio globale **(eliminato il 2026-10-20: i controlli di Giorni speciali e Messaggio globale si scrivono dentro V6, passo 28)** | lint e typecheck | tu committi e pushi |
| 24 | ✅ `77c07f3` | Blocco comune + prompt del passo 24 | I5 | Composer | **Giorni speciali e Messaggio globale** | L0 + **L1** `navigazione,shell` (i controlli delle due schermate nuove: NON PROVATO, li implementa V6) | L1 senza FALLITO nuovo; **eccezione di prova: push di Composer** |
| 24b | ✅ `e2b77c4` | Solo il prompt del passo 24b | I5 (coda) | Composer | **Correzioni di Giorni speciali e Messaggio globale dopo la revisione del 24** | L0; L1 su queste due schermate: NON PROVATO | revisione del patch senza rilievi; tu pushi |
| 24c | 🔶 chiuso con riserva `94ac9c6` | Solo il prompt del passo 24c | V-GM | Agente di verifica | **Nucleo di Giorni speciali e Messaggio globale in Playwright**: sei controlli richiesti, un giro, tetto 60 minuti (salda il debito del 24, policy-test §6) | L1 mirato, motore Playwright | sei controlli con esito misurato; zero ERRORE-STRUMENTO sul nucleo; ambiente pulito |
| 24d | 🔶 chiuso con riserva `36b35c8` | Solo il prompt del passo 24d | V-MF2 | Agente di verifica | **Nucleo di Menù fissi in Playwright, dopo il 24c**, più `giorni-speciali-attivazione`; primo atto: correggere due asserzioni del 24c e rimuovere `menuA`; limite DURO +100 righe di motore | L1 mirato, motore Playwright | controlli richiesti con esito misurato; zero ERRORE-STRUMENTO sul nucleo; ambiente pulito |
| 25 | ✅ `1f4b6c0` | — | D7 | Design | Controlli di chiusura: L2 completo e L3 in `controlli-6.6.json`; i controlli online nuovi li completa V6 | — | file pronto |
| 26 | 🔶 chiuso con riserva `9a4d8b7` | Blocco comune + prompt del passo 26 | I6 | Composer | **Chiusura**: tabella completa delle checklist di §9, tutti i `verify:*`, CHANGELOG di sottofase | L0 + L1 su tutte le schermate + `verify:*` | tabella senza FALLITO; tu pushi |
| 27 | ✅ `0ff8e15` | — (istruzioni del passo) | M2 | Tu | Deploy in produzione | **S** (smoke) | smoke verde |
| 28 | ✅ `f4a51dd` | Solo il prompt del passo 28 | V6a | Agente di verifica | **Backend e online, senza lanciatore**: `verify:menu-6_4`, `6_2` (diagnosi) e `final-proofs` con le variabili giuste; `scripts/online-smoke.mjs` con `on1`–`on6` e `on-menu-1`. Il resto di V6 sta in 28b–28f | backend e HTTP | tre criteri della scheda; tu committi |
| 28b | 🔶 chiuso con eccezione firmata `a587868` | Solo il prompt del passo 28b | V6b | Agente di verifica | **Nuclei rimasti di Giorni speciali e Messaggio globale** (eccezione firmata): dieci controlli; cinque sul server locale, quattro su server di sviluppo (:3200), `permessi` con l'evidenza di `verify:menu-6_1`. Tetto del motore 4.350 approvato; per il passo +200 | L2 mirato | tre criteri della scheda; tu committi |
| 28c | ✅ `352cd08` | Solo il prompt del passo 28c | V6c | Agente di verifica | **Meccanica rimasta** (obiettivo 1): sette controlli di Menù fissi, `vini-ordine-100` (101 record), la correzione di un'asserzione di `verify:menu-6_2` e la cancellazione del codice del server di sviluppo del 28b. Il motore non cresce | L2 mirato | tre criteri della scheda; tu committi |
| 28d | 🔶 chiuso con riserva `352cd08` | Solo il prompt del passo 28d | V6d | Agente di verifica | **Meccanica completata + UI = design**: primo atto di sei test (quattro asserzioni deboli del 28c e `piatti-ordine-100`); matrice C1/C2/C3 e screenshot di Vini, Distillati, Bevande, Giorni speciali e Messaggio globale; `menu-fissi-testi` e `-colonna-elenco`. Piatti, home, shell, navigazione, Servizi e Menù fissi non si rifanno (policy §4). Motore +300 (3.576), spec fino a 1.900 | L2 | tre criteri della scheda; tu committi |
| 28e | ❌ non si fa | — | V6e | — | **Stati di errore e di caricamento e passata WebKit**: decisione di Mirko del 2026-10-21 (policy §6): NON PROVATO senza scadenza; si riapre se i test umani rilevano problemi | — | — |
| 28f | 🔲 | Prompt da scrivere | V6f | Agente di verifica | **Pulizia**: cancellazione del lanciatore `scripts/ui-verify` (16 file di riferimento, demone dei dati di prova da portare in `e2e/`) e rapporto di chiusura di V6 | — | rapporto di V6 scritto; tu committi |
| 29 | ✅ `41b9092` | Solo il prompt del passo 29 | F6 | Composer | **Correzione dei cinque P** di `rilievi.md` (pulsanti della conferma a 44 px, piè di foglio, riga del messaggio, scheda a telefono, giorno in minuscolo), prova con i test Playwright esistenti e C2 sulle cinque schermate | L0 + test e2e | tabella senza P |
| 30 | 🔲 | — (istruzioni del passo) | M3/D9 | Tu, Design | **L3**: sessione reale su Cloud Run (io col tuo browser) e giro su iPhone vero (tu), §6 | **L3** | esito scritto; rilievi P chiusi |
| 31 | 🔲 | Blocco comune + prompt del passo 31 | I7 | Tu e Composer | **Import di produzione 6.8**: report a secco in produzione, backup su richiesta, `--apply`, controlli REST | verifica dei conteggi | conteggi coincidenti: **6.6 chiusa** (✅) |
| 32 | 🔲 | — | — | — | Dopo la 6.6: 6.9 (scaffold del frontend), poi 6.5 (accende «Ricompila» e ne prova il pulsante) | vedi sezione 9 | — |

**Ultimo aggiornamento**: 2026-10-20 (commit `41b9092`). **V6 chiusa (2026-10-21)**: 28 ✅, 28b e 28d chiusi con eccezione firmata, 28c ✅, 28e annullato, 29 ✅ con P1–P5 corretti e verificati nel codice e negli screenshot di Giorni speciali; resta il 28f. **Passo 28d chiuso con riserva; 28e annullato; rilievi P1–P5 e passo 29 (F6) scritti.** Il 28d è stato eseguito in due riprese: matrici 791 OK su 969, 9 FALLITO che sono un difetto solo; 13 coppie di screenshot confrontate con i mockup (24 non esaminate una per una). **Passo 28c (V6c) chiuso con riserva**: otto controlli e `verify:menu-6_2` OK, ma quattro asserzioni più deboli dell'atteso e Piatti senza prova del limite di 100: vanno come primo atto del 28d. **Opzione C approvata da Mirko (2026-10-21)**: la ripresa del 28b è annullata; console in sviluppo e file di disponibilità su server in memoria non si provano più (policy §6); V6 riscritta in quattro passi: 28c meccanica rimasta (prompt scritto), 28d e 28e UI = design, 28f cancellazione del lanciatore. **Passo 28b (V6b) chiuso con eccezione firmata**: sei controlli su dieci in regola (cinque OK più `permessi` con l'evidenza di `verify:menu-6_1`); il server di sviluppo non è diventato raggiungibile, quindi `giorni-speciali-console` è ERRORE-STRUMENTO e altri tre NON PROVATO; ripresa scritta (diagnosi fuori da Playwright, server avviato a mano sulla 3300). **Tetto del motore per V6 approvato da Mirko: 4.350 righe.** **Passo 28 (V6a) chiuso**: `verify:menu-6_4` OK; `6_2` FALLITO di classe (iv), difetto dello script e non dell'app; `final-proofs` dev OK e standalone NON PROVATO; smoke online `scripts/online-smoke.mjs` corretto dalla chat di design (la versione dell'agente accettava `0.0.0.0`). **Passo 27 (M2) chiuso**: smoke online fatto con `curl` (lanciatore in ERRORE-STRUMENTO, non rilanciato), nove rotte del Menù protette, deploy confermato da Mirko. **V6 riscritta**: spezzata in 28–28f, senza lanciatore; il vecchio prompt è tolto. Prima: **Passo 26 (I6) chiuso con riserva**: 3 OK / 0 FALLITO / 164 NON PROVATO su 167 voci di §9; `verify:menu-6_2` e `6_4` FALLITI (cause in scheda), L1 del lanciatore ERRORE-STRUMENTO su Home e navigazione, tre controlli di backend a V6. Prima: **Passo 25 (D7) chiuso**: sei voci nuove di `livello_3`, `ritardo_pubblicazione` definita, `on-menu-1` (online, livello 2); nessun controllo L2 nuovo per Giorni speciali e Messaggio globale (§9 già coperta). Prima: **Passo 24d eseguito, chiuso con riserva** (24 min 19 s, 0 ERRORE-STRUMENTO nel giro finale; 10 OK validi; due risultati non validi registrati NON PROVATO). Decisioni di Mirko: **nessun passo 24e**; **nessun nuovo passo di test prima di V6**, salvo un difetto trovato da Mirko usando l'app; **il vecchio lanciatore `scripts/ui-verify` si cancella a V6**; eccezione scritta verso V6 estesa a Menù fissi (policy §6). Corretto un ciclo infinito della pulizia dei dati di prova (`27ebdbd`). **Prossimo passo: 28f** (cancellazione del lanciatore, prompt da scrivere); poi i passi 30 (giro su iPhone e Cloud Run) e 31 (import). Il 23 è eliminato. I debiti A1–A12 e dello strumento sono in 2.3 e si chiudono in F6 (passo 29) e V6 (passo 28), che ricevono solo ciò che è L2 o è scritto in un'eccezione firmata.

**Regole dei controlli** (`policy-test.md` §5): un **FALLITO di L1 blocca la chiusura del passaggio**: si corregge e si rilanciano solo i controlli falliti, al massimo due giri, al terzo si ferma e si chiama la chat di design. Un **FALLITO di L2 è un rilievo P** e blocca la chat successiva. Un **AVVISO** non blocca e si registra come rilievo A. Un **NON PROVATO** non blocca ma va nei debiti con scritto in quale livello verrà provato. **S** (smoke) dopo ogni deploy. **Un controllo non implementato** nel lanciatore quando finisce una chat I rende L1 non eseguibile da chi implementa: lo dichiara e lo passa all'agente di verifica; mai una prova manuale chiesta a te al suo posto. Una modifica solo a documenti attiva solo L0; una solo al backend L0 più gli script `verify-*.ts`, non L1 (per questo le chat dei passi 4 e 5 non hanno L1).

---

### 2.1 Percorso di test v2 (dal 2026-10-19)

**Regola di ordinamento (2026-10-20)**: nel piano, tabelle e schede dei passi sono **sempre in ordine ascendente per identificativo** (1, 2, …, 20, 20b, …, 32 e, in fondo al file, la serie T: T0, T1a, T1b, T1c, T1d, T2a, …) così si trovano a colpo d'occhio. Se l'ordine di esecuzione è diverso, sta in una riga «Ordine di esecuzione», mai nell'ordine delle schede. Un passo nuovo prende il prossimo identificativo libero (per questo «T1c bis» è diventato **T1d**).

La verifica resta completa e i controlli dei file JSON restano la fonte di verità: cambia il motore (Playwright Test al posto del vecchio `ui:verify`). Descrizione, regole anti-blocco, esiti e criteri di accettazione: **`docs/design/verifica/percorso-test-v2.md`**. Il vecchio lanciatore è **congelato da subito** (regola R9): il passo 20g è stato annullato (vedi 2.2).

| Passo | Cosa | Stato | Decisione (2026-10-20) |
|---|---|---|---|
| **T0** | Spike e scheletro `e2e/` con suite di fumo | ✅ `76578ea` | **chiuso** |
| **T1a** | Controlli comuni e screenshot: home, navigazione, Piatti | non eseguito | **eliminato**: Piatti ha L2 e C10 chiusi (V2 quater), home e navigazione L1 OK; nulla del raggio largo è cambiato (policy-test §4) |
| **T1b** | Idem: Vini, Distillati, Bevande | non eseguito | **assorbito in T1e (Parte B)**: mai confrontati con le demo, è il rischio maggiore |
| **T1c** | Idem: Servizi e Menù fissi | 🔶 struttura in repo (`0bb6847`) | **chiuso**: assorbito da T1e (Parte A) |
| **T1d** | Chiusura di T1c (già «T1c bis») | 🔶 chiuso al tetto (`cf754c5`) | **chiuso**: le simulazioni passano a V6, il resto a T1e |
| **T1e** | Screenshot: Parte A Servizi e Menù fissi, Parte B Vini, Distillati e Bevande | ✅ `853a1e5` (81 file su 88 attesi) | **chiuso**: 7 stati mancanti per ERRORE-STRUMENTO (debito per V6) |
| **T2a** | Flussi di Servizi e Menù fissi | non eseguito | **eliminato**: già provati in 20d (22 flussi OK) e nei giri di V4 ter; F4 tocca solo la presentazione; i flussi non provati di Menù fissi (2.2) si provano in V6 |
| **T2b** | Flussi dei cataloghi | non eseguito | **eliminato**: provati in V3 e V3 bis; il resto a V6 |
| **T2c** | Flussi di Piatti e home | non eseguito | **eliminato**: provati in V2 quater |
| **T2d** | Flussi di Giorni speciali e Messaggio globale | non eseguito | **rinviato a V6** (passo 28): si scrivono dentro V6, dopo I5 e I6 |
| **T3** | Confronto visivo (C10) | ✅ fatto il 2026-10-20 su F4 e T1e | **chiuso**: nessun P aperto, rilievi A5–A12 in 2.3 |
| **T4** | Pensionamento del vecchio lanciatore | non eseguito | **rinviato a dopo V6** (non ora) |

**Regola di arresto (R10)**: un passo che supera il doppio della stima si ferma e riporta. **Ordine di esecuzione** (le righe e le schede sono sempre in ordine ascendente per identificativo; questo è l'ordine in cui si eseguono): applicare il pacchetto → **F4** (passo 21, Composer) → push → **T1e** (agente di verifica) → push → confronto visivo (C10, chat di design) → passi 22–26 (D6, I5, D7, I6; il 23 è eliminato) → V6 con la suite completa. **F4 e T1e non girano mai insieme** (la verifica costruisce l'app dalla stessa cartella).

**Pulizia prima di ogni giro (2026-10-20)**: `pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3100,3200,3201,3202,3203,31997 -sTCP:LISTEN | tail -n +2; rm -f .next/e2e.lock .next/ui-verify.lock` (se `lsof` stampa ancora qualcosa, `kill` del PID). Il guardiano del vecchio lanciatore: `zsh scripts/ui-verify/watch.sh 150 avviso`.

**Regole di chiusura (2026-10-20)**: (1) il passo 20 si chiude con F4 e T1e senza P aperti, non con T2a; (2) **un solo giro** di F4 più T1e: ciò che resta dopo diventa rilievo A o debito annotato, salvo difetti che impediscono l'uso; (3) i tre stati simulati (caricamento, errore di caricamento, errore dell'azione) sono NON PROVATO con il motivo e li riprova V6 dall'agente, non a mano; (4) criteri di accettazione al massimo tre, tutti sul risultato per l'app; tempi e perfezione dello strumento sono obiettivi, non motivi di rifiuto; (5) un esito L2 resta valido finché non cambia un file del raggio largo (policy-test §4), e non si fanno verifiche per scrupolo (§7); (6) **L1 a fine di ogni passo che tocca una schermata non si vieta MAI nei prompt** (policy-test §2 e §5: la regressione di P8 è nata perché il prompt di F4 lo vietava); (7) un FALLITO di un controllo è un rilievo **P**, non A (policy-test §5): gli A sono gli AVVISO e i difetti senza controllo.

### 2.2 Stato della serie 20 (aggiornato il 2026-10-19)

| Passo | Cosa | Stato | Note |
|---|---|---|---|
| 20 | V4: L2 di Servizi e Menù fissi | ✅ **chiuso** (2026-10-20), con la coda 21b e 21c | F4 (`22b66b8`) e T1e (`853a1e5`) senza P aperti. Verificato visivamente su Servizi, Menù fissi, Vini, Distillati e Bevande: P1–P7 corretti (titolo con sottotitolo, piè «Salva \| Annulla», titoli di sezione, schede a sottolineatura con l'azione dentro la scheda, etichetta «Attiva», «da 1 giorno speciale», interruttore a destra). **Non provato a runtime DOPO F4** (F4 ha riscritto circa 300 righe di `fixed-menu-form-sheet.tsx` e toccato i fogli di Servizi e dei cataloghi: la prova di 20d è precedente); li ha tentati **21c (V-MF)**: C2 delle schede OK, nove flussi NON PROVATO (esito in 21c); il diff di F4 conserva i gestori di salvataggio e annullamento dei sei fogli. Restano per V6: flussi di Menù fissi (`colonna-elenco`, `porzione-traduzione`, `servizi-piatti`, `elimina-*`, `persistenza`, `ordine-liste`, `nomi-accessibili`), i tre stati simulati, il bulk da 101, sette screenshot mancanti (vedi 2.3) |
| 20b | F-SEL: tendine facoltative | ✅ `ed64db5` | |
| 20c | F-TAB: schede con `Link` | ✅ `6ae1f34` | |
| 20d | V4 bis: helper Payload persistente e fix dei flussi | ✅ parziale `a7114d8` | 22 controlli OK; matrice e screenshot non fatti |
| 20e | VC-parallelo: avanzamento, matrice in parallelo | 🔶 chiuso con riserva `a35f8fe` | log e battito, limite su tutti i pacchetti; il blocco di fondo (chiamate sincrone) non risolto |
| 20f | V4 ter: Servizi e Menù fissi L2, regressione, screenshot | **eseguito due volte, risultati inutilizzabili** (`ff68c75`, `25fa77c`) | la prima volta si è bloccato; la seconda, in modalità legacy, ha dato 17 falsi FALLITO e **0 screenshot** (il lanciatore non ha il codice per salvarli) |
| 20g | VC-sync: ultima manutenzione del vecchio lanciatore | ❌ **annullato** | non vale la pena riparare un motore che si sostituisce: T0 + T1c danno gli screenshot di Servizi e Menù fissi in circa 2 ore e mezza, e senza lavoro buttato |

### 2.3 Debiti della 6.6 (rilievi A e debiti dello strumento, 2026-10-20)

**Revisione del 2026-10-20**: A6 diventa **P8** (policy-test §5: FALLITO è P) e A8 (alta, visibile) si chiude subito, entrambi in **21b**. Gli altri rilievi A non impediscono l'uso e si correggono **in F6 (passo 29)**, insieme ai P che troverà V6, prima del primo uso reale.

| Id | Dove | Cosa | Priorità |
|---|---|---|---|
| A1 | Moduli | Prezzo nel modulo senza due decimali («2», «30» invece di «2,00», «18,00»); vale anche per Piatti | media |
| A2 | Moduli | Etichette dei campi non rosse nello stato di errore (nel riferimento lo sono) | bassa |
| A3 | Conferma di eliminazione del menù fisso | L'app scrive il giorno della settimana («lunedì 1 giugno 2099»), il PNG no: si tiene l'app e si aggiorna il PNG | bassa |
| A4 | Intestazione del gruppo nell'elenco dei menù fissi | «N menù · Sempre» più scuro del riferimento | bassa |
| A5 | Scheda Categorie su desktop | L'etichetta «Attiva» accanto all'interruttore non compare da `md` in su (F4); il riferimento esiste solo a 390 px | da chiarire |
| **P8** (ex A6) | Menù fissi, schede (390 px) | **Area di tocco delle schede sotto 44 px**: 4 FALLITO C2 su `elenco` e `categorie`, chiaro e scuro, comparsi dopo F4 (prima C2 era OK; le schede ora sono testo con `px-1 pb-2`, circa 30 px). Per policy-test §5 un FALLITO è un rilievo **P**, non A. Estendere l'area di tocco (D6, `pointer-coarse`) senza cambiare l'aspetto | **P: chiuso da 21b** |
| A7 | Vini, Distillati, Bevande, moduli a 390 px | Capacità e Grado (Vini, Bevande) e Invecchiamento e Grado (Distillati) sono su due righe; nel riferimento sono **affiancati** anche a 390 px (la correzione di F-SEL usa il breakpoint `md`) | media |
| A8 | Vini, Distillati e Bevande, foglio dei filtri | Il filtro **Stato** mostra il valore grezzo «all» invece di «Tutti»: il `Select` non ha `items` (verificato nei tre cataloghi; Piatti lo ha). Visibile all'utente | **alta: chiuso da 21b** |
| A9 | Vini, foglio dei filtri | Regione e Denominazione disabilitate dicono «Tutte le regioni» e «Tutte le denominazioni»; nel riferimento «Scegli prima il paese» e «Scegli prima la regione» | bassa |
| A10 | Moduli | Titoli di sezione («Dati», «Categoria e visibilità», «Servizi») più grandi e pesanti che nel riferimento; in Distillati manca il titolo «Origine» prima di Tipologia e Paese | bassa |
| A11 | Modulo del menù fisso | «Aggiungi o togli piatti» senza l'icona «+» del riferimento; etichetta «Porzione» nera e più grande che nel riferimento | bassa |
| A12 | Modulo delle Bevande | Frase in più sotto Capacità e Grado («Un valore non in elenco resta finché non lo cambi.») che il riferimento non ha: toglierla o approvarla | bassa |

**Debiti dello strumento, per V6** (li svolge l'agente, non Mirko). **Primo compito di V6**: diagnosticare con traccia e screenshot al fallimento il timeout del flusso `menu-fissi-elimina-senza-uso` (pulsante «Elimina verify-ui-menu-libero» non trovato nel vecchio lanciatore; la fixture `menuCreateFixedMenuFixture` o la pagina), poi i nove flussi di Menù fissi. Un flusso che va in timeout deve diventare ERRORE-STRUMENTO per quel flusso e non fermare gli altri (oggi il giro si ferma). I giri del vecchio lanciatore riscrivono i file in `esiti/<data>-locale-prod/` anche quando muoiono (rumore nei commit). A8 non è stato verificato da L1 su Vini (guasto del daemon, ora corretto): lo vedono gli screenshot di V6. Elenco: (1) 7 screenshot mancanti per ERRORE-STRUMENTO: `scegli-piatti` (390 e 1280), `visibilita-categoria`, `visibilita-avviso` di Menù fissi, e `origine-senza-regioni`, `errore-geografia`, `errore-anno` di Vini; (2) gli stati `modulo-fondo` non scorrono fino in fondo (mostrano l'inizio del foglio); (3) il giro completo di T1e ha dato 116 ERRORE-STRUMENTO (preparazioni dei cataloghi e stati in parallelo di Menù fissi) e i suoi esiti non sono nel repo (ogni giro successivo sovrascrive `risultati.json`: salvarli in cartelle diverse); (4) i tre stati simulati di ogni schermata, il bulk da 101, e i flussi di Menù fissi non provati (2.2); (5) confronto visivo non fatto per Servizi a 1280 px, i moduli a 1280 px e gli stati in scuro dei cataloghi. (6) Nel passo 24 un giro L1 è rimasto fermo circa 11 minuti su `AMBIENTE goto /app/login` (il secondo giro è andato); e i 50 controlli di Giorni speciali e Messaggio globale non sono implementati nel vecchio lanciatore: V6 li implementa, compreso `messaggio-globale-pubblicazione` (serve `APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS` e un primo salvataggio). **Policy v2 §6**: i nove flussi di Menù fissi (21c) non possono più aspettare V6: il debito è scaduto e si salda nel passo 24d (nucleo di Menù fissi in Playwright, dopo il 24c; policy-test §6); il nucleo di Giorni speciali e Messaggio globale è stato eseguito dal 24c con le riserve scritte nella sua scheda.

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
5c. L1 della schermata toccata a fine passo è OBBLIGATORIO (policy-test §2): se il prompt non lo chiede, eseguilo comunque; i FALLITO di L1 bloccano la chiusura del passo (§5). L1 è il NUCLEO di otto controlli (policy v2, §3; regola ui/03-ui-test-policy.mdc, che dà anche il comando). Subito dopo L1 esegui `git checkout -- docs/design/verifica/esiti`. Se un controllo del nucleo non è eseguibile, il passo è 🔶 e non ✅ (§6).
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

### Passo 21 — RL4/F4: rilievi di V4 e correzione dei P (solo se ci sono)

> **Esito (2026-10-20)**: ✅ `22b66b8`. Controllato io: perimetro (14 file in `components/app/`, `lib/menu/` e CHANGELOG), `pnpm typecheck` (radice ed `e2e`) a 0 errori, ESLint senza errori, **102 test su 102** (due nuovi per P6). Confermato **visivamente** sugli screenshot di T1e: titolo con sottotitolo e piè «Salva \| Annulla» in tutti i fogli (anche Vini, Distillati e Bevande), titoli di sezione del modulo del menù fisso, schede a sottolineatura con il pulsante dentro la scheda, etichetta «Attiva» sotto l'interruttore, «Verrà tolto anche da 1 giorno speciale», interruttore a destra nel foglio della categoria.

> **F4 compilato (2026-10-20): UN SOLO prompt, senza Parte A.** Cartella dei rilievi `2026-10-19-T1c`. Perimetro: `components/app/**`, `lib/menu/**` (testi e funzioni di formato), `lib/app/**` se serve e i test di `lib/`. Perché senza Parte A: la verifica visiva successiva (T1e e C10) è già il controllo; un giro in meno. **Quando**: dopo aver applicato il pacchetto di chiusura. **Chi**: Composer (modifica l'app: **non gira insieme a T1e**). **Commit e push**: li fai tu.
>
> ```text
> Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F4 (unica): correzione dei rilievi P1-P7 del confronto visivo di
> Servizi e Menù fissi, con P1 e P2 estesi ai fogli dei cataloghi. Fai solo questo. Le regole di .cursor/rules si caricano da sole.
> Procedi direttamente: NESSUNA proposta preliminare. Se un punto richiede una scelta di design non coperta dalla specifica o dal
> PNG di riferimento, NON decidere: lascialo com'è e riportalo come rilievo A nella risposta finale.
>
> PERIMETRO: components/app/**, lib/menu/** (solo testi e funzioni di formato), lib/app/** se serve, test unitari di lib/ e una voce
> in docs/piano-sviluppo/CHANGELOG.md. VIETATO: docs/design/**, i controlli JSON, scripts/ui-verify/**, e2e/**, collections/**,
> dipendenze, migrazioni, comportamento dei dati (solo presentazione e testi). TETTO: 60 minuti; a 120 FERMATI e riporta.
>
> LEGGI per intero: docs/design/verifica/esiti/2026-10-19-T1c/rilievi.md (P1-P7 e A1-A4, e la sezione sui cataloghi); le specifiche
> servizi, menu-fissi, vini, distillati e bevande (sezioni «Testi» e «Layout»); i PNG di riferimento in docs/design/schermate/
> (servizi/390-modulo-chiaro.png, menu-fissi/390-chiaro.png, menu-fissi/390-categorie-chiaro.png, menu-fissi/390-modulo-chiaro.png,
> distillati/390-modulo-chiaro.png e così via).
>
> FAI
> 1. P1 (titolo dei fogli): in TUTTI i fogli di modifica di Vini, Distillati, Bevande, Servizi, Menù fissi e Categorie (cerca con grep
>    `SheetTitle` e il testo «Modifica ») il titolo è «Modifica vino», «Modifica distillato», «Modifica bevanda», «Modifica servizio»,
>    «Modifica menù fisso», «Modifica categoria» e il NOME va come sottotitolo grigio sotto il titolo, come in Piatti. Mai il nome
>    tra parentesi nel titolo.
> 2. P2 (piè dei fogli): in TUTTI gli stessi fogli i pulsanti sono «Salva» e «Annulla» affiancati, «Salva» a sinistra, agganciati al
>    fondo (stesso schema di Piatti e dei filtri: SheetFooter flex-row gap-2). Mai uno per riga.
> 3. P3 (titoli di sezione del modulo del menù fisso): «Dati», «Categoria e visibilità», «Piatti», «Servizi», «Disponibilità» sopra i
>    rispettivi gruppi, come nel riferimento menu-fissi/390-modulo-chiaro.png e nella specifica §6.
> 4. P4 (schede del menù fisso): le schede stanno sotto la descrizione, sono testo con una sottolineatura sotto quella attiva
>    (senza riquadro), poi la frase di conteggio, poi il pulsante «Nuovo menù fisso» / «Nuova categoria» a tutta larghezza su
>    telefono (a 1280 px sulla stessa riga della frase, a destra), DENTRO la scheda. Resta Link di next/link, role e aria-current.
> 5. P5 (scheda Categorie): sotto l'interruttore, sul telefono, l'etichetta «Attiva» (MENU_FISSI_CATEGORY_TOGGLE_LABEL esiste già).
> 6. P6: correggi pluralizeIt(count, 'giorno speciale', 'giorni speciali') in lib/menu/formatCascadeDeleteDescription.ts e aggiungi
>    un test per 1 e per 3 giorni («Verrà tolto anche da 1 giorno speciale: …», «… da 3 giorni speciali: …»).
> 7. P7 (foglio della categoria): nella riga «Disabilitata» il testo a sinistra e l'interruttore a destra, come in Servizi.
> Nessun useEffect con setState sincrono; ogni Select mantiene `items`; nessun comportamento cambia.
>
> TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) ogni P corretto nel codice, con file e riga prima e dopo; per P1 e P2 l'ELENCO di
> tutti i fogli corretti (devono essere sei); (b) `pnpm typecheck` (radice ed e2e) e `pnpm lint` sull'INTERO repo a 0 errori, `pnpm
> ui:check`, e test unitari di lib/ verdi, compreso quello nuovo di P6 (node --import ./scripts/node-test-resolve.mjs
> --experimental-strip-types --test); (c) nessun file fuori perimetro (git diff --name-only).
> NON lanciare nessun giro di ui:verify né di e2e. NON fare git: commit e push li fa l'utente.
> RISPOSTA FINALE: tabella P1-P7 con file/riga prima e dopo, elenco dei sei fogli di P1 e P2, esiti dei tre criteri, rilievi A.
> ```
>
> **Cosa fai tu**: incolla il prompt in una chat nuova di Cursor; quando ha risposto, incollami il resoconto (controllo io `tsc`, ESLint, test e diff); poi `git add -A && git commit -m "fix(app): F4 — P1-P7 del confronto visivo di Servizi e Menù fissi, fogli dei cataloghi" && git push`.

**Chi**: la chat di design (io).
**Cosa fai tu**: dopo che l'agente di verifica ha finito e tu hai pushato il suo rapporto, incollami qui il suo resoconto finale. Io leggo il rapporto, assegno i rilievi **P** (bloccano) e **A** (non bloccano), li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` e ti consegno lo zip con il file e il nome della `<CARTELLA>`. Se non ci sono P, il passo successivo parte subito.

> **Il modello generico qui sotto (con i segnaposto) NON si usa per questo giro: vale il prompt compilato qui sopra.**

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

### Passo 21b — F-TOCCO: area di tocco delle schede di Menù fissi e filtro Stato dei cataloghi

> **Esito (2026-10-20)**: ✅ `5615003`. Controllato io: perimetro (7 file in `components/app/{fixed-menus,wines,spirits,drinks}`, `lib/menu/catalog` e CHANGELOG), `pnpm typecheck` (radice ed `e2e`) a 0 errori, ESLint senza errori, **103 test su 103**, e nei tre fogli dei filtri **ogni `<Select` ha `items`** (Vini 5/5, Distillati 3/3, Bevande 3/3). P8: il contenitore delle schede non ha più `overflow-x-auto`, l'estensione dell'area di tocco è tutta sotto `pointer-coarse` (nessun cambio con il mouse), un solo `ui-check-allow` con il motivo; **misurato in 21c: C2 delle schede 4/4 OK**. A8: verificato da codice e test; L1 di Vini non eseguito (guasto del daemon, ora corretto): lo vedranno gli screenshot di V6. Nota: Composer ha creato il commit in locale nonostante «non fare git» (nessun danno, nessun push).

**Perché (2026-10-20)**: la revisione esterna ha trovato due errori nella chiusura del passo 20 e li ho verificati. (1) A6 non è un rilievo A: il controllo C2 è FALLITO (4 volte, dopo F4) e per policy-test §5 un FALLITO è un rilievo **P**; le schede di Menù fissi, ora testo con `px-1 pb-2`, misurano circa 30 px. (2) A8 è reale e visibile: nel foglio dei filtri di Vini, Distillati e Bevande il `Select` «Stato» non ha `items` (Piatti sì) e mostra «all». In più, il prompt di F4 vietava ogni giro di verifica, contro la policy (L1 a fine passo); la regressione di P8 è nata così: **in questo prompt L1 è obbligatorio**. **Quando**: ora, prima del 22. **Chi**: Composer (modifica l'app): **non gira insieme a 21c**. **Stima**: 45 minuti; **tetto**: 90. **Commit e push**: li fai tu.

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F-TOCCO: correzione di due rilievi: P8 (area di tocco delle schede
di Menù fissi) e A8 (filtro Stato dei cataloghi). Nient'altro. Le regole di .cursor/rules si caricano da sole.

PERIMETRO: components/app/fixed-menus/fixed-menus-shell.tsx; components/app/wines/wines-catalog-page.tsx,
components/app/spirits/spirits-catalog-page.tsx, components/app/drinks/drinks-catalog-page.tsx; un eventuale helper in
lib/menu/catalog/ con il suo test unitario; una voce in docs/piano-sviluppo/CHANGELOG.md. VIETATO: docs/design/**, i controlli JSON,
scripts/ui-verify/**, e2e/**, collections/**, dipendenze, migrazioni, qualunque altro componente o comportamento.

LEGGI: docs/design/verifica/esiti/2026-10-19-T1c/rilievi.md (sezione «Esito dopo F4 e T1e») e docs/piano-sviluppo/
esecuzione-6.6-prompt-e-controlli.md §2.3 (P8 e A8); docs/design/verifica/misura-tocco.md (come si misura e come si ottiene l'area di
tocco) e come lo fanno components/ui/switch.tsx e components/ui/checkbox.tsx (estensione invisibile con `pointer-coarse`).

FAI
1. P8: le due schede («Menù fissi», «Categorie») in fixed-menus-shell.tsx devono avere, con il tocco (`pointer-coarse`), un'area di
   tocco di almeno 44 px di altezza e di larghezza, SENZA cambiare l'aspetto (testo con sottolineatura sotto la scheda attiva, come nel
   riferimento menu-fissi/390-chiaro.png) e senza cambiare nulla con il mouse. Usa l'estensione invisibile (pseudo-elemento o
   padding negativo compensato), non un'altezza maggiore visibile. Restano Link di next/link, role, aria-selected e aria-current.
2. A8: nei tre fogli dei filtri il `Select` «Stato» riceve `items` (valore → etichetta: «Tutti», «Abilitati»/«Abilitate»,
   «Disabilitati»/«Disabilitate» secondo le etichette già nei copy di ogni schermata), come fa Piatti con filterStatusItems. Controlla
   TUTTI gli altri `Select` di quei tre fogli: devono avere `items`. Se serve, un helper condiviso in lib/menu/catalog/ con un test
   unitario che verifica la mappa.
3. Nessun'altra modifica. Ogni Select mantiene `items`; nessun useEffect con setState sincrono.

PARTE A, solo proposta: scrivi per P8 e A8 la causa che vedi nel codice, i file che toccherai e come otterrai l'area di tocco senza
cambiare l'aspetto. Poi FERMATI e aspetta il mio «procedi».

DOPO IL «PROCEDI»: implementa e poi VERIFICA, L1 OBBLIGATORIO (non è facoltativo e non si salta):
- L0: pnpm typecheck (radice ed e2e) e pnpm lint sull'INTERO repo a 0 errori, pnpm ui:check, test unitari di lib/.
- L1 di Menù fissi con il motore e2e: `pnpm e2e:t1c` filtrato su Menù fissi con --grep (leggi e2e/playwright.config.ts e il rapporto
  docs/design/verifica/esiti/2026-10-19-T1c/rapporto.md per la sintassi dei titoli). Atteso: C2 su `elenco` e `categorie` a 390 px
  (chiaro e scuro) senza FALLITO, e nessun FALLITO nuovo in C1 e C3. Gli ERRORE-STRUMENTO non sono FALLITO: riportali.
- L1 dei cataloghi, SOLO Vini (gli altri due hanno lo stesso codice): `pnpm ui:verify locale-prod --livello 1 --schermata vini
  --controlli controlli-6.6.json --profili telefono-390 --temi chiaro`, un giro, tetto 10 minuti; se si blocca, riportalo come
  ERRORE-STRUMENTO e non rilanciarlo.
Un solo giro di correzione dopo i FALLITO di L1; al secondo FERMATI e riporta. Il tetto totale è 90 minuti.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) P8: C2 delle schede di Menù fissi senza FALLITO a 390 px, chiaro e scuro, e aspetto
invariato (descrivi la tecnica usata); (b) A8: i tre `Select` Stato con `items`, nessun `Select` dei tre fogli di filtri senza `items`
(riporta il grep), test unitario verde, L1 di Vini senza FALLITO; (c) typecheck e lint dell'intero repo a 0 errori e nessun file fuori
perimetro (git diff --name-only). NON fare git: commit e push li fa l'utente.
RISPOSTA FINALE: tabella con file e riga prima e dopo per P8 e A8, esiti di L0 e di L1 (comando, numeri), elenco dei Select controllati.
```

**Cosa fai tu**: incolla il prompt in una chat nuova di Cursor; incollami la Parte A; rispondi «procedi» (con le mie correzioni, se ci sono); a fine lavoro incollami il resoconto (controllo io `tsc`, ESLint, test e diff); poi `git add -A && git commit -m "fix(app): F-TOCCO — area di tocco delle schede di Menù fissi (P8) e filtro Stato dei cataloghi (A8)" && git push`.

### Passo 21c — V-MF: prova di funzionamento di Menù fissi dopo F4

> **Esito (2026-10-20)**: ✅ chiuso con **nove flussi NON PROVATO** (`082ba3d`, `25369d0`, `fab9f5d`). (b) **C2 delle schede: 4/4 OK** (elenco e categorie, 390 px, chiaro e scuro). (c) Ambiente pulito (porte 3100–3203 e 31997 libere, `count-verify-ui` a zero). (a) Nove controlli: **mai partiti**. Prima il vecchio lanciatore si fermava con `menu-payload daemon exit 1 prima di :31997`; l'agente ha trovato la causa nello stderr (`listen EADDRINUSE 127.0.0.1:31997`). **Causa (la mia ipotesi sul push dello schema era sbagliata)**: `waitMenuPayloadDaemonReady()` iniziava sempre con `killOrphanMenuPayloadDaemons()`, che alla seconda chiamata nello stesso giro uccideva il daemon del giro corrente; il nuovo daemon trovava la porta ancora occupata. **Corretto in `fab9f5d`** (eccezione autorizzata, un solo file, `scripts/ui-verify/lib/menu-payload.mjs`, 11 righe: pulizia degli orfani una sola volta per processo e attesa di 10 secondi che la porta si liberi; controllato io: `node --check`, nessun'altra modifica). Dopo la correzione il daemon parte, ma il primo dei nove flussi, `menu-fissi-elimina-senza-uso`, va in timeout su `getByRole('button', { name: 'Elimina verify-ui-menu-libero' })` e il giro si ferma: **causa non determinata**; l'etichetta esiste (`aria-label={`Elimina ${itemName}`}` in `menu-content-row-actions.tsx`), gli screenshot di T1e salvano le due conferme di eliminazione con la stessa interfaccia, e questo flusso non è mai stato OK (stesso timeout in V4 ter, assente tra i 22 OK di 20d): è un problema del flusso o della sua fixture, non una regressione di F4. **Rischio residuo valutato**: nel diff di F4 i sei fogli hanno conservato `onSubmit`, `onOpenChange`, `applyPicker`, `setView` e `disabled={saving}` (cambiano solo l'ordine dei pulsanti e le classi), quindi il salvataggio non è stato toccato. Gli otto flussi restanti e questo vanno in V6.

**Perché (2026-10-20)**: F4 ha riscritto circa 300 righe di `fixed-menu-form-sheet.tsx` (160 aggiunte e 139 tolte) e toccato i fogli di Servizi e dei cataloghi; i flussi di Menù fissi non sono provati dopo F4 (la prova di 20d è precedente). **Quando**: **solo dopo il push di 21b** (la verifica costruisce l'app dalla stessa cartella: non gira mai insieme a Composer). **Chi**: agente di verifica. **Stima e tetto**: 30 minuti, **un solo giro**. **Motore**: il motore e2e per C2 delle schede (esiste); i nove controlli di flusso **esistono solo nel vecchio lanciatore** (`scripts/ui-verify/lib/run-menu-list-flows.mjs` e `run-menu-list-supplementary-flows.mjs`, congelato alla versione 3.9.0), che si usa **con `--solo`** senza modificarlo; il motore e2e non ha ancora test per questi flussi (T2a è stato eliminato) e scriverli è un lavoro nuovo che non si fa ora. Se un controllo del vecchio lanciatore si blocca, si riporta ERRORE-STRUMENTO con l'ultima riga del log e si passa al successivo.

**Prima, in un terminale**: `pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3100,3200,3201,3202,3203,31997 -sTCP:LISTEN | tail -n +2; rm -f .next/e2e.lock .next/ui-verify.lock` (se resta un listener sulla 3100, `kill` del suo PID). Per seguire il giro del vecchio lanciatore: `tail -f .next/ui-verify-progress.log`.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: V-MF. Obiettivo UNICO: provare il funzionamento di Menù
fissi dopo F4 e F-TOCCO, con UN SOLO giro, tetto 30 minuti. NON modifichi app/, components/, lib/, collections/, i controlli JSON né il
vecchio lanciatore (scripts/ui-verify): lo USI. Puoi creare solo i rapporti in docs/design/verifica/esiti/2026-10-20-V-MF/. Esegui
i comandi FUORI dalla sandbox di Cursor (tutte le autorizzazioni). NON fare git.

Leggi: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/esiti/2026-10-18-VCtempi/rapporto.md (come si usa --solo);
docs/design/verifica/controlli-6.6.json (schermata menu-fissi, i nove controlli sotto); e2e/README.md e il rapporto
docs/design/verifica/esiti/2026-10-19-T1c/rapporto.md.

FAI, in quest'ordine
1. C2 delle schede: `pnpm e2e:t1c` filtrato su Menù fissi con --grep (sintassi: e2e/playwright.config.ts e il rapporto di T1c). Atteso: C2
   su `elenco` e `categorie` a 390 px, chiaro e scuro, SENZA FALLITO (dopo F-TOCCO le schede hanno l'area di tocco estesa). Riporta le
   misure degli elementi sotto 44 px, se ce ne sono, con nome e dimensione.
2. I NOVE controlli di flusso con il vecchio lanciatore, `--solo`, un solo comando (profilo telefono-390, tema chiaro; notebook-1280
   solo per colonna-elenco): menu-fissi-colonna-elenco, menu-fissi-porzione-traduzione, menu-fissi-servizi-piatti,
   menu-fissi-elimina-usato, menu-fissi-elimina-senza-uso, menu-fissi-elimina-cascade-registro-permessi, menu-fissi-persistenza,
   menu-fissi-ordine-liste, menu-fissi-nomi-accessibili. Il lanciatore crea e cancella da solo i dati di prova (fixture, daemon Payload).
   Per ognuno: OK, FALLITO (con misurato e atteso, mai «—») o NON PROVATO con il motivo. Un FALLITO causato dallo strumento (selettore
   non trovato, eccezione, fixture assente, tempo) è ERRORE-STRUMENTO e NON un difetto dell'app: non correggerlo e non rilanciare.
3. Salva gli esiti in docs/design/verifica/esiti/2026-10-20-V-MF/ COPIANDO risultati.json e rapporto.md di ogni comando in file con un
   nome diverso per ogni giro (per esempio c2-e2e-risultati.json, flussi-risultati.json): NON sovrascrivere risultati.json di giri
   precedenti. Scrivi in quella cartella un rapporto.md con la tabella dei nove controlli, di C2 e dei tempi.
4. A fine giro: `ps` e `lsof` (porte 3100-3203) senza server, nessun worktree, e `pnpm payload run e2e/scripts/count-verify-ui.ts` deve dare
   {"total":0}; se non è zero, `pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-`.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) ognuno dei nove controlli ha un esito MISURATO (OK, FALLITO o NON PROVATO con il
motivo); (b) C2 delle schede di Menù fissi senza FALLITO; (c) ambiente pulito (porte e record verify-ui- a zero). Gli ERRORE-STRUMENTO si
riportano ma non rendono il passo non accettato; il tempo e la perfezione dello strumento sono obiettivi, non motivi di rifiuto. Se superi 30
minuti FERMATI e riporta quello che hai misurato.
RISPOSTA FINALE: tabella dei nove controlli e di C2 (OK / FALLITO / NON PROVATO / ERRORE-STRUMENTO, misurato e atteso), tempi, esito dei tre
criteri.
```

**Cosa fai tu**: pulizia nel terminale, poi il prompt in una chat nuova di Cursor (solo dopo il push di 21b); a fine lavoro incollami il resoconto; poi `git add -A && git commit -m "test(menu-fissi): V-MF — prova di funzionamento di Menù fissi dopo F4 e F-TOCCO" && git push`. **Se V-MF trova difetti dell'app**: un solo giro di correzione (te lo preparo io), poi si prosegue con il 22; ciò che resta diventa rilievo A annotato.

### Passo 22 — D6: controlli per Giorni speciali e Messaggio globale

> **Esito (2026-10-20)**: ✅ consegnato come pacchetto (`eb774a4`). `controlli-6.6.json` ottiene `giorni-speciali` (30 controlli, 15 stati) e `messaggio-globale` (20 controlli, 12 stati), con lo stesso formato di Servizi e Menù fissi; nessun controllo esistente è cambiato (diff in sola aggiunta, più le due specifiche in `fonti` e nella nota di apertura). Totale: 230 controlli nelle schermate (242 id con i 12 comuni). **NON PROVATO con il motivo**: gli stati con il database popolato (vuoto) e i tre stati simulati di ogni schermata (li riprova V6); «pubblicazione» di Messaggio globale (nessuna simulazione del ritardo di scrittura del file); la lettura del file sul bucket (L3, passo 30); l'accesso con utente senza ruolo; «Ricompila» (6.5). **Scelte di prova**: i giorni speciali non hanno un nome, quindi quelli di prova puntano solo a menù fissi di prova «verify-ui-…» (come già fa `scripts/cleanup-verify-ui-menu-fixtures.ts`); date attive lontane (2099 e 2001); i giorni vicini a oggi solo disattivati, perché non contano per la sovrapposizione; il Global `menu-general` si salva e si ripristina in try/finally. Il file `disponibilita.json` è leggibile solo in sviluppo con `MENU_AVAILABILITY_IN_MEMORY=1` (l'ora si vede solo lì; in `locale-prod` vale lo stato «file non leggibile»).

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 22»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

### Passo 23 — VC5: l'agente implementa i controlli di Giorni speciali e Messaggio globale

> **Decisione (2026-10-20)**: **ELIMINATO**. I controlli di Giorni speciali e Messaggio globale (passo 22) restano nei file JSON; si implementano dentro V6 (passo 28) con il motore disponibile, non in un passo a parte sul vecchio lanciatore. Durante I5 e I6 Composer usa l'L1 come ha sempre fatto.

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

> **Esito (2026-10-20)**: ✅ `77c07f3` (push di Composer, eccezione di prova) più le correzioni `e2b77c4` (passo 24b); `c5d1321` ripristina l'esito `2026-10-19-locale-prod` che il lanciatore aveva riscritto. Controllato io su `e2b77c4` (clone fresco, `pnpm install --frozen-lockfile --ignore-scripts`, `next typegen`): `pnpm typecheck` radice ed e2e 0 errori; ESLint sugli 8 file del 24b con `--max-warnings 0`: 0; test unitari di `lib/` 130/130 (Composer dichiarava 103); nessun `overrideAccess: true`; nessuna scrittura di `disponibilita.json` da Giorni speciali; nessun «Ricompila» in Messaggio globale; `lib/menu/availability/**`, `collections/`, `globals/`, `e2e/` e `scripts/` non toccati. **Rilievi della mia revisione sul codice di `77c07f3`** (scostamenti dalla specifica, non errori di verifica dell'agente), corretti in 24b: (1) un file non leggibile (storage assente, oggetto assente o non valido) era trattato come leggibile: «In pubblicazione…» e polling senza fine, e manca il prefisso «Messaggio salvato:»; (2) la sovrapposizione si calcolava solo su «Salva» e non in diretta; (3) nessun focus sui menù fissi mancanti. **NON PROVATO**: il comportamento delle due schermate nel browser (nessuna prova a mano in questo passo, nemmeno sull'istanza condivisa dello storage in memoria): lo prova V6; L1 delle due schermate: nessun controllo eseguito. **Eccezione di prova sul push**: il push di Composer ha funzionato con L0 e L1 verdi, ma i tre scostamenti e 15 file riscritti dal lanciatore in `esiti/` sono arrivati su `main`, e quindi a Cloud Build, prima del controllo della chat di design. L'esito del deploy lo annota Mirko; la decisione se tenere o no l'eccezione come regola è sua.

**Correzioni del 2026-10-20 al prompt** (dopo aver letto repo, policy e controlli di D6): (1) mancavano perimetro dei file, tetto di tempo e tre criteri di accettazione sul risultato per l'app; (2) i controlli delle due schermate (`controlli-6.6.json`) non erano tra le letture; (3) L1 «su `giorni-speciali,messaggio-globale`» non è eseguibile: il passo 23 è eliminato e il vecchio lanciatore (congelato) non ha un modulo per queste schermate, quindi ora L1 resta **obbligatorio** ma si fa su ciò che il lanciatore sa misurare (navigazione e shell, che le due voci accese toccano) e il resto è NON PROVATO con il motivo, senza prove manuali al suo posto (Blocco comune, regola 5); (4) le due schermate devono rispettare le simulazioni di sviluppo di `lib/app/menu/devSimulate.ts`, altrimenti V6 non può provarne gli stati simulati; (5) «Nuovo giorno speciale» preseleziona «Solo cena» (§7 punto 3); (6) la regola di `buildGlobalMessage` si **replica** in un helper nuovo con un test di coincidenza con `buildAvailabilityDocument`, senza toccare `lib/menu/availability/**` (così non serve `verify:menu-6_4`); (7) una domanda in Parte A sulla simulazione del ritardo di pubblicazione, senza implementarla senza il «procedi»; (8) **eccezione di prova sul push**, solo per questo passo (decisa da Mirko il 2026-10-20). Le assunzioni della §10 delle due specifiche sono confermate (2026-10-20).

**Quando**: ora. **Chi**: Composer (modifica l'app): **non gira insieme a nessun agente di verifica**. **Stima**: 120 minuti; **tetto**: 240. **Commit e push**: **ECCEZIONE DI PROVA solo per questo passo** (Mirko, 2026-10-20): Composer fa il commit e UN push su `origin main` a chiusura, alle condizioni scritte nel prompt; negli altri passi resta la regola «il push lo fa Mirko». Ogni push su `main` avvia Cloud Build (deploy automatico): il codice di I5 va quindi in deploy prima del mio controllo, ed è per questo che il push è condizionato a L0 a 0 errori e a L1 senza FALLITO nuovi.

**Incolla in Cursor**, in una chat nuova, nello stesso primo messaggio e in quest'ordine: **(1)** il Blocco comune (§3), **(2)** il prompt qui sotto.

```text
PASSO 24 (I5). Questo prompt segue il Blocco comune incollato qui sopra, nello stesso messaggio.

CHAT I5: schermate Giorni speciali (/app/menu/special-days) e Messaggio globale (/app/menu/message).

PERIMETRO. Puoi creare o modificare: app/(app)/app/(shell)/menu/special-days/** e app/(app)/app/(shell)/menu/message/** (pagine e
azioni); components/app/** (componenti nuovi delle due schermate, e la sola estrazione di ciò che le altre liste già condividono,
senza cambiarne il comportamento); lib/app/** e lib/menu/** FUORI da lib/menu/availability/** (helper puri con i loro test unitari),
in particolare lib/app/navigation.ts (solo le due voci) e lib/app/breadcrumb.ts se serve; scripts/verify-lib-app-8_2.ts; components/ui/**
solo se manca un componente elencato in §8 delle due specifiche (installazione come da docs/design/installazione-componenti-ui.md);
le voci di docs/piano-sviluppo/CHANGELOG.md, fase-6 e la riga del passo 24 come dice la Parte D. VIETATO: collections/**, globals/**,
hook, lib/menu/availability/** (buildAvailabilityDocument.ts compreso), docs/design/**, controlli JSON, scripts/ui-verify/**, e2e/**,
dipendenze, migrazioni, «Ricompila» visibile.

LEGGI
- docs/design/schermate/giorni-speciali/spec.md e messaggio-globale/spec.md, per intero, con i mockup.
- docs/design/verifica/controlli-6.6.json, SOLO le schermate giorni-speciali e messaggio-globale (e i controlli comuni): è come verranno
  misurate. NON modificarlo. I controlli di queste due schermate non sono ancora implementati nel lanciatore: li implementa l'agente
  di verifica in V6 (passo 28).
- docs/design/decisioni-layout-app.md (D7, D8, D9, D10, D13, D14, A47, A48).
- docs/piano-sviluppo/fase-6-menu-digitale.md: 6.3 (giorni speciali) e 6.4; ADR-112 §3 (disponibilita.json).
- Codice: lib/menu/validateSpecialDayOverlap.ts (SPECIAL_DAY_OVERLAP_MESSAGE, specialDayScopesOverlap), lib/menu/specialDayDate.ts
  (todayRomeAsSpecialDayDate), collections/menu/specialDays.ts, globals/MenuGeneral.ts, lib/menu/access.ts (canUpdateMenuGeneralRequest),
  lib/menu/availability/ (gcsAvailabilityWriter.ts: resolveAvailabilityStorage e readCurrentObject; canonicalJson.ts:
  parseAvailabilityJsonFromGcs; buildAvailabilityDocument.ts: la regola di buildGlobalMessage, che non è esportata),
  lib/app/menu/devSimulate.ts (le simulazioni di sviluppo), app/(app)/app/(shell)/hours/ (modello di pagina con «Salva modifiche» e
  «Annulla modifiche»), e come Servizi e Menù fissi (I4) gestiscono elenco, foglio, conferma e avvisi.

COSA FARE
1. Giorni speciali: «Prossimi» (data crescente) e «Passati» (decrescente) con la data di oggi in Europe/Rome
   (todayRomeAsSpecialDayDate), due richieste con where e sort; interruttore «Attivo»; modulo con campo data nativo (l'App scrive
   sempre AAAA-MM-GG), ambito, caselle dei menù fissi raggruppate per categoria con badge, almeno un menù, messaggio con traduzione;
   «Nuovo giorno speciale» apre il modulo con l'ambito «Solo cena» preselezionato e gli altri campi vuoti; controllo di sovrapposizione
   anticipato nel modulo con specialDayScopesOverlap e SPECIAL_DAY_OVERLAP_MESSAGE (il testo del server, non riscriverlo), che blocca il
   salvataggio e non conta i giorni disattivati né il giorno che si sta modificando; data passata ammessa con avviso non bloccante;
   conferma di eliminazione semplice. Nessuna scrittura di disponibilita.json.
2. Messaggio globale: pagina con un solo campo (globalMessage, italiano e inglese), nessun limite di lunghezza, i ritorni a capo
   diventano spazi (anche incollando), gli spazi ai bordi si tolgono al salvataggio; «Salva modifiche», «Annulla modifiche», «Togli il
   messaggio» con conferma (presente solo se c'è un messaggio salvato). Nessun pulsante «Ricompila» in questa schermata, mai.
3. Indicatore di pubblicazione: lettura LATO SERVER di disponibilita.json con resolveAvailabilityStorage e readCurrentObject +
   parseAvailabilityJsonFromGcs, solo in lettura; mostra «Menù pubblico aggiornato alle {HH:mm}» (updatedAt del file, Europe/Rome) e
   «In pubblicazione…» finché il testo del file non coincide con quello salvato. La regola di buildGlobalMessage la REPLICHI in un helper
   nuovo e testato (NON toccare buildAvailabilityDocument.ts), con un test unitario che ne prova la coincidenza con
   buildAvailabilityDocument per le quattro combinazioni italiano/inglese (entrambi, solo italiano, solo inglese, nessuno). Se il file non
   è leggibile (storage non configurato, errore, oggetto non valido o assente) la pagina va senza ora né «In pubblicazione…» e mostra
   «Messaggio salvato: «{testo}»»: non deve mai rompersi.
4. Simulazioni di sviluppo: le due schermate rispettano le variabili di lib/app/menu/devSimulate.ts (LOAD_ERROR, SAVE_ERROR,
   LOAD_DELAY_MS) come le altre schermate del Menù (caricamento, errore di caricamento, errore dell'azione; per l'interruttore «Attivo»
   un errore riporta l'interruttore com'era). Serve a V6 per provarli.
5. Accendi in navigazione le due voci (enabled: true) e aggiorna scripts/verify-lib-app-8_2.ts con le voci abilitate.
Funzioni pure in lib/ con test unitari: divisione in prossimi e passati con la data di oggi in Europe/Rome (comprese le ore a cavallo
della mezzanotte, con ora legale e solare), formato della data in lettere, anticipo del controllo di sovrapposizione, testi con
singolare e plurale, pulizia del testo del messaggio, riassunto del file pubblicato (null se non leggibile o non valido), testo effettivo
di un messaggio, formato dell'ora in Europe/Rome.

PARTE A, solo proposta: oltre a quanto chiede il Blocco comune, dimmi (1) come la pagina Messaggio globale condivide lo storage in
memoria di sviluppo con l'hook che scrive il file (stesso modulo? stessa istanza?), perché in sviluppo con MENU_AVAILABILITY_IN_MEMORY=1
il file è leggibile solo dopo la prima scrittura nel processo; (2) se conviene aggiungere in lib/app/menu/devSimulate.ts una simulazione
di sviluppo del RITARDO di scrittura del file (per esempio APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS, mai attiva con NODE_ENV=production)
per poter provare «In pubblicazione…»: NON aggiungerla senza il mio «procedi». Poi FERMATI.

DOPO IL «PROCEDI»: implementa e poi VERIFICA. L1 È OBBLIGATORIO e non si salta:
- L0: pnpm typecheck (radice ed e2e) e pnpm lint sull'INTERO repo a 0 errori, pnpm ui:check, test unitari di lib/, e il controllo
  NO-OVERRIDE (grep di overrideAccess: true nelle cartelle delle schermate) senza corrispondenze.
- L1 sulla navigazione e sulla shell (le due voci accese le toccano), UNO ALLA VOLTA, tetto 10 minuti ciascuno:
  `pnpm ui:verify locale-prod --livello 1 --schermata navigazione --controlli controlli-6.6.json` e
  `pnpm ui:verify locale-prod --livello 1 --schermata shell --controlli controlli-8.2.json`. Atteso: nessun FALLITO nuovo.
- L1 delle due schermate nuove: `pnpm ui:verify locale-prod --livello 1 --schermata giorni-speciali,messaggio-globale
  --controlli controlli-6.6.json`, un giro, tetto 10 minuti. I loro controlli non sono implementati nel lanciatore (passo 23 eliminato,
  scripts/ui-verify congelato: non modificarlo e non scrivere script di verifica nuovi). Riporta che cosa produce; ogni controllo senza
  esito misurato è NON PROVATO con il motivo «controlli non implementati nel lanciatore: li implementa V6 (passo 28)». Se il comando si
  blocca o fallisce per il lanciatore, riportalo come ERRORE-STRUMENTO e non rilanciarlo. Mai una prova manuale al posto di un controllo.
- Prove a mano da dev, dichiarate come tue e non come L1 o L2: un giorno di prova futuro e uno passato compaiono in «Prossimi» e in
  «Passati»; la sovrapposizione con un giorno attivo blocca il salvataggio con il testo del server; salvare e togliere il messaggio
  cambia il Global; con MENU_AVAILABILITY_IN_MEMORY=1 il riquadro mostra l'ora del file, senza storage mostra «Messaggio salvato:
  «{testo}»». Cancella i dati di prova «verify-ui-…» (i giorni di prova puntano a menù di prova: scripts/cleanup-verify-ui-menu-fixtures.ts
  li toglie) e ripristina il messaggio che c'era nel Global.
Un solo giro di correzione dopo i FALLITO di L1; al secondo FERMATI e riporta. Il tetto totale è 240 minuti: se lo superi FERMATI e
riporta a che punto sei.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) le due schermate funzionano come dice la specifica: Prossimi e Passati con la
data di oggi in Europe/Rome, sovrapposizione anticipata che blocca con il testo del server, campo data nativo con AAAA-MM-GG,
Messaggio globale con Salva, Annulla e Togli, a capo come spazi, indicatore con file leggibile e con file non leggibile, e i testi della
sezione «Testi» senza riscritture; (b) le due voci sono accese, nessun overrideAccess: true, nessuna scrittura di disponibilita.json
da Giorni speciali, nessun «Ricompila» visibile, e le simulazioni di sviluppo agiscono sulle due schermate; (c) typecheck e lint
dell'intero repo a 0 errori, test unitari dei nuovi helper verdi, L1 di navigazione e shell senza FALLITO nuovo, e nessun file fuori
perimetro (git diff --name-only).
GIT, ECCEZIONE DI PROVA SOLO PER QUESTO PASSO (decisa da Mirko il 2026-10-20; sostituisce la regola 7 del Blocco comune «MAI git push»):
dopo il commit locale della Parte D, SOLO se L0 è a 0 errori e L1 di navigazione e shell non ha FALLITO nuovi, esegui UN
`git push origin main` di quel commit. Mai --force, mai altri push, nessun altro comando git che cambi il repo (reset, stash, rebase,
checkout di file). Se la condizione non è soddisfatta o il push è rifiutato, NON riprovare e NON aggirare: fermati e riporta il
motivo. Nella risposta finale scrivi l'hash del commit, l'output del push e `git log origin/main --oneline -1` dopo il push.
RISPOSTA FINALE (Blocco comune, regola 8): tabella «Esiti reali» con comando e numeri di L0 e di L1, i NON PROVATO con il motivo,
le deviazioni dalla specifica, e l'elenco dei file toccati.
```

**Quando Cursor ha scritto la Parte A** (e aspetta il tuo «procedi»): incollami qui la sua proposta. Io ti rispondo con le correzioni e il «procedi» da incollare a Cursor.
**Quando Cursor ha chiuso** (tabella «Esiti reali»; commit e push li ha fatti Cursor, per l'eccezione di prova): incollami qui la sua risposta finale. Io faccio `git fetch` e `git log` per verificare che il commit sia davvero su origin, poi `tsc`, ESLint, test unitari e perimetro, e ti do il prompt di aggiornamento stato (§1.3) per segnare ✅. Se qualcosa non va ti preparo un pacchetto di correzione. L'esito del test («push da Composer: sì o no», e se il deploy automatico ha creato problemi) lo scriviamo nel CHANGELOG.

### Passo 24b — I5 (coda): correzioni di Giorni speciali e Messaggio globale

> **Esito (2026-10-20)**: ✅ `e2b77c4`, controllato io su un clone fresco: `pnpm typecheck` radice ed e2e 0 errori; ESLint sugli 8 file con `--max-warnings 0`: 0; test unitari di `lib/` 130/130 (due nuovi su `isPublishedGlobalMessageReadable`); nessun `overrideAccess: true`; perimetro rispettato (9 file, nessuno in `docs/design`). Il diff fa quanto dichiarato: il file non leggibile ora dà `ok: false` e la pagina non avvia né pubblicazione né polling; la sovrapposizione si calcola in diretta e «Salva» è disabilitato finché c'è (scelta di Composer: la specifica non lo vietava; il controllo `giorni-speciali-sovrapposizione` è aggiornato); focus sulla prima casella dei menù fissi. **NON PROVATO** (Composer): file non leggibile senza `MENU_AVAILABILITY_IN_MEMORY`, sovrapposizione in diretta e focus nel browser: li prova V6. L1 delle due schermate: nessun controllo eseguito, e un primo giro è rimasto fermo circa 11 minuti su `AMBIENTE goto /app/login` (debito 6 in 2.3). Nel prompt mancava la clausola «L1 bloccato → ERRORE-STRUMENTO senza rilancio»: è stata data a voce.

**Quando**: dopo il 24, in una chat nuova. **Chi**: Composer, senza Blocco comune. **Stima**: 60 minuti; **tetto**: 90. **Commit e push**: nessun push di Composer (l'eccezione valeva solo per il 24); il push lo fa Mirko dopo il mio controllo.

```text
PASSO 24b (coda di I5): correzioni a Giorni speciali e Messaggio globale. Rispondi in italiano.

PERIMETRO. Puoi modificare: components/app/global-message/**, components/app/special-days/**, lib/app/globalMessage/**, lib/app/specialDays/**,
lib/menu/globalMessage/**, lib/menu/specialDays/** (con i test) e una voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased].
VIETATO: tutto il resto, compreso docs/design/** e il piano. Niente dipendenze, niente migrazioni.

LEGGI: docs/design/schermate/messaggio-globale/spec.md (§2, §5, §6) e giorni-speciali/spec.md (§6, §7), e il codice del commit 77c07f3.

FAI
1. Messaggio globale, file non leggibile. «Non leggibile» vale anche per storage non configurato, oggetto assente o non valido: oggi
   readPublishedGlobalMessageForUi risponde ok:true con summary:null e la pagina lo tratta come leggibile. Correggi (per esempio: summary null →
   {ok:false}) così che: il riquadro mostri «Messaggio salvato: «{testo}»» senza ora; «In pubblicazione…» e il polling non partano mai con file non
   leggibile; con il file leggibile resti tutto come ora. Estrai la decisione in una funzione pura con test (null → non leggibile; summary → leggibile).
2. Giorni speciali, sovrapposizione IN DIRETTA: calcolala nel modulo da data, ambito, «Disattivato» e dal giorno in modifica, e mostrala sotto
   Ambito non appena data e ambito coincidono con un giorno attivo; sparisce subito se cambi data, ambito o attivi «Disattivato». Il salvataggio
   resta bloccato finché c'è. Mantieni il controllo su «Salva» come rete di sicurezza. Test della funzione che lo calcola.
3. Focus: se l'unico campo non valido è «menù fissi», il focus va alla prima casella (che resta in vista).
4. Togli il warning di lint (parametro date inutilizzato in lib/menu/specialDays/copy.ts, riga 77).

VERIFICHE: pnpm typecheck (radice ed e2e), pnpm lint sull'intero repo a 0 errori E 0 warning dei file toccati, pnpm ui:check, test unitari di lib/.
L1: un solo giro `pnpm ui:verify locale-prod --livello 1 --schermata giorni-speciali,messaggio-globale --controlli controlli-6.6.json` (atteso NON PROVATO,
controlli non implementati nel lanciatore). SUBITO DOPO esegui `git checkout -- docs/design/verifica/esiti`: il lanciatore scrive lì e non deve
restare nessuna modifica in docs/design. Tetto 60 minuti; a 90 FERMATI e riporta.

TRE CRITERI (riporta i numeri): (a) con il file non leggibile (senza MENU_AVAILABILITY_IN_MEMORY) il riquadro dice «Messaggio salvato: «{testo}»» e dopo
«Salva modifiche» non compaiono «In pubblicazione…» né richieste ripetute; (b) la sovrapposizione compare e sparisce in diretta sotto Ambito e blocca il
salvataggio, e con soli menù mancanti il focus va alla prima casella; (c) typecheck e lint a 0 errori e 0 warning, test verdi, e `git diff --name-only`
contiene solo file del perimetro (nessun file in docs/design).
GIT: NON fare git push e NON fare altri comandi git che cambiano il repo; il commit locale lo fai solo se serve a mostrare il diff, e lo dichiari.
RISPOSTA FINALE: tabella «Esiti reali» con comandi e numeri, i NON PROVATO con il motivo, l'elenco dei file toccati.
```

### Passo 24c — V-GM: nucleo di Giorni speciali e Messaggio globale in Playwright (coda del 24)

> **Esito (2026-10-20)**: 🔶 **chiuso con riserva** (`94ac9c6`). Durata del passo **7 minuti e 16 secondi** (giro di 12 secondi, commit `0c92a7d`), **0 ERRORE-STRUMENTO**, 0 FALLITO; esiti in `esiti/2026-10-20-24c/` (finita per sbaglio in `17f0275`, insieme alla decisione sul 24d: è una cartella nuova e resta). **6 OK**: `giorni-speciali-persistenza`, `giorni-speciali-sovrapposizione`, `giorni-speciali-elimina-registro-permessi`, `messaggio-globale-salvataggio`, `messaggio-globale-togli`, `messaggio-globale-file-non-leggibile`. **4 NON PROVATO nel giro** (motivo scritto nel test): i tre del nucleo `giorni-speciali-console`, `messaggio-globale-file-riceve-messaggio`, `messaggio-globale-permessi`, più `messaggio-globale-pubblicazione` (L2). **7 mai implementati, registrati NON PROVATO «tetto»** in `e2e/controlli/wire-registry.json`: `giorni-speciali-testi`, `-nomi-accessibili`, `-modulo-validazione`, `-attivazione`; `messaggio-globale-testi`, `-nomi-accessibili`, `-console`. Controllato io su un clone fresco di `17f0275` con i file dell'agente: `pnpm typecheck` radice ed e2e 0 errori; `ui:check` e `e2e:wire` OK; nessuna chiamata sincrona vietata né `force`; ESLint con `--max-warnings 0`: un warning (`menuA` inutilizzato); il giro non l'ho rieseguito (nessuna app né database). **Riserve**: (1) **limiti superati senza che l'agente si fermasse**: helper +353 su 250, totale +734 su 600, motore 3.044 su 3.000 (da qui i limiti duri della policy §9); (2) due asserzioni deboli, trovate leggendo il codice: la stabilità di 20 secondi di `file-non-leggibile` non è misurata (test da 0,5 s) e il `.first()` di `sovrapposizione` può scegliere il giorno disattivato; l'asserzione sul prefisso «Messaggio salvato:» copre invece il difetto del passo 24; (3) `findByID(...).catch(() => null)` tratta ogni errore come «cancellato»; (4) `managerUser` duplicato e una funzione morta (`expectSpecialDaySaveDisabled`). **Decisioni di Mirko**: eccezione scritta verso V6 per sette controlli (policy §6); `giorni-speciali-attivazione` nel 24d, perché nessun test del 24c attraversa l'interruttore dell'elenco; correzioni delle asserzioni come primo atto del 24d.

**Perché (2026-10-20)**: il 24 e il 24b sono ✅, ma i 51 controlli delle due schermate non sono stati eseguiti da nessuno (il passo 23 è eliminato e il lanciatore non li conosce) e il loro comportamento nel browser non è mai stato provato. Per la policy v2 (§6) è un debito con scadenza: **questo passo**, non V6. Il nucleo delle due schermate (otto controlli ciascuna, `livello: 1` in `controlli-6.6.json`) è il primo esempio di controlli di flusso in Playwright: il motore oggi ha solo la matrice `C1`/`C2`/`C3` e gli screenshot.

**Quando**: dopo il push del pacchetto «policy v2»; **mai insieme a una chat di Composer** (la verifica costruisce l'app dalla stessa cartella). **Chi**: agente di verifica, chat pulita. **Stima e tetto**: 60 minuti, **un solo giro completo**; a 120 minuti FERMATI e riporta (R10). **Motore**: Playwright; il lanciatore non si usa. **Limiti di dimensione**: massimo +600 righe in `e2e/` in tutto; **helper nuovi in `e2e/lib/`: massimo +250 righe; se serve di più, FERMATI** (gli helper sono motore, che ha un margine di 309 righe sulle 3.000 della policy §9).

**Controlli richiesti (sei)**: `giorni-speciali-persistenza`, `giorni-speciali-sovrapposizione`, `giorni-speciali-elimina-registro-permessi` (la parte con l'utente di prova; la matrice dei ruoli è già in `scripts/verify-roles-8_3.ts`), `messaggio-globale-salvataggio`, `messaggio-globale-togli`, `messaggio-globale-file-non-leggibile` (nel server di produzione locale non c'è il bucket: è proprio lo stato da provare). **Se avanza tempo**, in quest'ordine: `giorni-speciali-attivazione`, `giorni-speciali-modulo-validazione`, `*-testi`, `*-nomi-accessibili`, `C1` e `C2` sullo stato `elenco` di Giorni speciali e sulla pagina di Messaggio globale. **NON PROVATO con motivo**: `*-console` e `messaggio-globale-file-riceve-messaggio` (server di sviluppo con storage in memoria), `messaggio-globale-permessi` e la matrice dei ruoli (utenti diversi dal manager di prova), `messaggio-globale-pubblicazione` (L2, V6).

**Cosa fai tu**: apri una chat nuova di Cursor (agente di verifica) **dopo** aver pushato il pacchetto della policy v2 e senza altre chat attive; esegui in un terminale la pulizia della prima riga del prompt, poi incolla il prompt; a fine passo incollami qui la risposta finale. **Commit e push**: nessun push dell'agente; i file nuovi (due spec, helper, cartella degli esiti) li committi tu dopo il mio controllo.

```text
PASSO 24c (V-GM): nucleo di Giorni speciali e Messaggio globale in Playwright. Rispondi in italiano. Sei l'agente di verifica: PROVI l'app, non la modifichi.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3100,3200,3201,3202,3203,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a Composer.

PERIMETRO. Puoi creare o modificare: e2e/controlli/giorni-speciali.spec.ts e e2e/controlli/messaggio-globale.spec.ts (nuovi), helper NUOVI in
e2e/lib/special-days/ e e2e/lib/global-message/ (se riusi helper esistenti, solo aggiungendo, senza cambiarne il comportamento), le voci di
e2e/controlli/wire-registry.json strettamente necessarie, e una voce Tests in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]. VIETATO: app/, components/,
lib/, collections/, globals/ (se un test trova un difetto lo RIPORTI, non lo correggi), scripts/ui-verify/** (congelato), docs/design/** tranne la cartella nuova
degli esiti (E2E_ESITI), controlli-6.6.json, e2e/playwright.config.ts, dipendenze. Limite di dimensione: massimo +600 righe in e2e/ in tutto; helper nuovi in e2e/lib/: massimo +250 righe; se serve di più, FERMATI.

LEGGI: docs/design/verifica/policy-test.md (§3, §5, §9, §11) e percorso-test-v2.md (§3, §4 regole R1-R10), e2e/README.md, e2e/fixtures/index.ts (payload.crea,
payload.nome, registerCreated, managerEmail), e2e/lib/menu-list/payload-actions.ts, e2e/lib/cleanup-fixtures.ts, e2e/controlli/servizi-menu-fissi-matrix.spec.ts (modello
dei titoli: terminano con ` [profilo-tema]`), e i controlli di giorni-speciali e messaggio-globale in docs/design/verifica/controlli-6.6.json (campo atteso: è la tua
fonte, e le costanti di lib/ come SPECIAL_DAY_OVERLAP_MESSAGE si importano, non si copiano). Anche i file delle due specifiche in docs/design/schermate/.

FAI, in quest'ordine, fermandoti al tetto:
1. SEI CONTROLLI RICHIESTI, un test ciascuno, titolo `<id-del-controllo> [telefono-390-chiaro]` dentro test.describe('<schermata>') e commento `// control:<id>`:
   giorni-speciali-persistenza, giorni-speciali-sovrapposizione, giorni-speciali-elimina-registro-permessi (solo parte manager di prova + riga del registro),
   messaggio-globale-salvataggio, messaggio-globale-togli, messaggio-globale-file-non-leggibile. Azione dall'interfaccia, poi controllo del database con la Local API.
   Dati di prova: nomi da payload.nome(), giorni speciali che puntano SOLO a menù fissi di prova «verify-ui-…», date 2099 e 2001 (mai vicine a oggi se attivi).
   Messaggio globale: il Global menu-general si SALVA prima (italiano e inglese) e si RIPRISTINA in try/finally, anche se il test fallisce.
2. SE AVANZA TEMPO, nell'ordine: giorni-speciali-attivazione, giorni-speciali-modulo-validazione, i testi e i nomi accessibili delle due schermate, C1 e C2 sullo
   stato elenco di Giorni speciali e sulla pagina di Messaggio globale (riusa checkScrollOrizzontale e la fixture touch; nessuna preparazione di stati nuova).
3. NON PROVATO con motivo scritto nel test (test.skip con descrizione): console e file-riceve-messaggio (serve il server di sviluppo con storage in memoria),
   messaggio-globale-permessi e la matrice dei ruoli, messaggio-globale-pubblicazione (V6). Ogni controllo non fatto per il tetto: NON PROVATO «tetto di 60 minuti».
Regole del motore (R1-R10): nessuna chiamata sincrona in e2e/ (spawnSync, execSync, execFileSync, Atomics.wait, readSync), nessun waitForTimeout come attesa di uno
stato, nessun networkidle da solo, una eccezione fuori da un'asserzione è ERRORE-STRUMENTO, non FALLITO. Mentre scrivi puoi lanciare un singolo test con --grep; il giro
COMPLETO delle due spec è UNO SOLO, alla fine.

COMANDO DEL GIRO (conferma che funziona e riportalo, oppure riporta quello corretto): E2E_SUITE=controlli E2E_ESITI=2026-10-20-24c pnpm e2e --grep "giorni-speciali|messaggio-globale"
Avanzamento: tail -f .next/e2e-progress.log (una riga per test, scritta a fine test). Se un test si blocca, il runner lo uccide: non rilanciare l'intero giro.

VERIFICHE FINALI: pnpm typecheck (radice ed e2e) e pnpm lint sull'INTERO repo a 0 errori, pnpm ui:check, pnpm e2e:wire, e dopo il giro ps -wweo e lsof (porte 3100-3203 e
31997 libere) e `pnpm payload run e2e/scripts/count-verify-ui.ts` a zero. `git status --short` non deve mostrare nessun file di esito già versionato modificato.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) i sei controlli richiesti hanno un esito misurato (OK, FALLITO o AVVISO) oppure un NON PROVATO con motivo e scadenza;
(b) zero ERRORE-STRUMENTO sui controlli richiesti; (c) ambiente pulito: porte libere, zero record verify-ui-, Global menu-general ripristinato, nessun file versionato modificato.
I FALLITO dell'app NON sono un motivo per rifiutare il passo: sono il risultato. Per ognuno scrivi controllo, misurato, atteso, evidenza e gravità proposta (P o A secondo
policy-test §5), senza cambiare controlli, app o soglie per farlo sparire.
GIT: NON fare git (nessun commit, nessun push).
RISPOSTA FINALE: tabella «Esiti reali» (controllo, esito, secondi), tabella dei FALLITO con gravità proposta, i NON PROVATO con motivo, il comando L1 confermato, le righe
di e2e/ aggiunte, l'elenco dei file toccati e il percorso della cartella degli esiti.
```

### Passo 24d — V-MF2: nucleo di Menù fissi in Playwright, più attivazione e correzioni del 24c

> **Esito (2026-10-20)**: 🔶 **chiuso con riserva** (`36b35c8`; correzione della pulizia in `27ebdbd`). Durata **24 min 19 s**, 0 ERRORE-STRUMENTO nel giro finale, motore **3.144** righe (limite duro raggiunto: l'agente si è fermato; dopo la riparazione di `27ebdbd` 3.145), spec 1.057. **Giro A**: i sei del 24c e `giorni-speciali-attivazione`, tutti OK. **Giro B** (tre spec, 20 righe): 11 OK, 1 FALLITO, 8 NON PROVATO. **Valutazione della chat di design (lettura del codice, giro non rieseguito)**: **10 OK validi** (i sei del 24c, `giorni-speciali-attivazione`, `menu-fissi-persistenza`, `menu-fissi-elimina-usato`, `menu-fissi-elimina-cascade-registro-permessi`). **2 risultati non validi**: `menu-fissi-elimina-senza-uso` (FALLITO, proposto P dall'agente) è un difetto del test: `count()` subito dopo l'attesa dell'intestazione mentre l'elenco si carica dopo (`loading` iniziale vero), 0,4 s; non è P e non è dimostrato un difetto dell'app. `menu-fissi-nomi-accessibili` (OK) è vuoto: legge `innerText` (senza gli `aria-label`) in 0,1 s, prima del caricamento dell'elenco. **Decisioni di Mirko**: nessun passo 24e, nessuna rimisura; i due restano NON PROVATO (valore basso; i flussi ad alto costo sono coperti) e nel codice sono `fixme`; cartelle `24d/img` e `24d-cleanup` tolte. **Riserve**: (1) nel giro B intermedio (`esiti/2026-10-20-24d-B`) `menu-fissi-persistenza` ha avuto un ERRORE-STRUMENTO (click scaduto dopo 15 s) che il resoconto non citava: nel giro finale passa in 1,3 s, possibile instabilità; (2) il `--grep` del mio prompt includeva `menu-fissi` e quindi la matrice (511 test, giro abortito): corretto con i percorsi dei file; (3) il giro abortito ha lasciato 50 record `verify-ui-` e la pulizia non funzionava per un ciclo infinito in `findVerifyUiFixedMenuIds` (script e teardown): corretto in `27ebdbd`; (4) nell'esito committato c'erano 31 screenshot (7,4 MB) del giro abortito: tolti. Le motivazioni dei NON PROVATO stanno nel codice e nel registro, non nel rapporto (con `test.skip(titolo, fn)` il reporter scrive «saltato»).

**Perché (2026-10-20)**: salda il debito del 21c, scaduto per la policy (§6): F4 ha riscritto circa 300 righe del modulo di Menù fissi e i nove flussi non sono mai partiti. Scelta di Mirko (2026-10-20): **Playwright, non il vecchio lanciatore**. Il 24d porta con sé `giorni-speciali-attivazione` (nessun test del 24c attraversa l'interruttore «Attivo» dell'elenco) e, **come primo atto**, la correzione di due asserzioni deboli del 24c. **Condizione di partenza** (policy §6): soddisfatta, il 24c è durato 7 minuti e 16 secondi con zero ERRORE-STRUMENTO.

**Quando**: dopo il push del pacchetto che contiene questa scheda; **mai insieme a una chat di Composer**. **Chi**: agente di verifica, chat pulita. **Stima e tetto**: 60 minuti; a 120 FERMATI e riporta (R10). **Limiti di dimensione DURI** (policy §9): motore (`e2e` senza `controlli/` e `smoke/`) al massimo **3.144 righe** (oggi 3.044: crescita netta +100, **dopo** aver riunito gli helper duplicati); spec (`e2e/controlli/` e `e2e/smoke/`) al massimo **1.243 righe** (oggi 743: +500; questo secondo numero è una mia scelta, perché la policy fissa solo il limite del motore). **Raggiunto un limite, l'agente si ferma e risponde con quello che ha**.

**Controlli richiesti (dodici)**: i **sei del 24c** (da rilanciare dopo le correzioni), `giorni-speciali-attivazione`, e per Menù fissi `menu-fissi-elimina-senza-uso` (**il primo test nuovo**: è quello che non ha mai girato), `menu-fissi-persistenza`, `menu-fissi-elimina-usato`, `menu-fissi-elimina-cascade-registro-permessi` e `menu-fissi-nomi-accessibili`. Di `persistenza` e di `elimina-cascade-registro-permessi` si fa la parte con il manager di prova; la matrice dei ruoli è NON PROVATA con motivo, come nel 24c. **Se avanza tempo**, in quest'ordine: `menu-fissi-testi`, `menu-fissi-modulo-validazione`, `menu-fissi-disponibilita`. Quelli del nucleo di Menù fissi che non vengono fatti sono NON PROVATO «tetto» **e richiedono una nuova eccezione firmata da Mirko**: non passano in silenzio a V6. La console resta NON PROVATA (serve il server di sviluppo).

**Cosa fai tu**: apri una chat nuova di Cursor (agente di verifica) **dopo** aver pushato il pacchetto che contiene questa scheda, senza altre chat attive; esegui in un terminale la pulizia della prima riga del prompt; incolla il prompt; a fine passo incollami la risposta finale, **con la durata in minuti**. **Commit e push**: nessun push dell'agente; i file li committi tu dopo il mio controllo, e **se `git status --short` mostra file diversi da quelli che ti scrivo, ti fermi e me li incolli**.

```text
PASSO 24d (V-MF2): nucleo di Menù fissi in Playwright, più attivazione dei giorni speciali e correzioni del 24c. Rispondi in italiano. Sei l'agente di verifica: PROVI l'app, non la modifichi.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3100,3200,3201,3202,3203,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a Composer.

PERIMETRO. Puoi creare o modificare: e2e/controlli/menu-fissi.spec.ts (nuovo), e2e/controlli/giorni-speciali.spec.ts e messaggio-globale.spec.ts (solo le correzioni e
l'attivazione descritte sotto), e2e/lib/special-days/, e2e/lib/global-message/, un helper nuovo in e2e/lib/menu-fissi/ se serve, la riga `export` davanti a managerUser in
e2e/lib/menu-list/payload-actions.ts (nessun'altra modifica a quel file), e2e/controlli/wire-registry.json (togli le voci dei controlli che ora hanno un test), e una voce Tests in
docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]. VIETATO: app/, components/, lib/, collections/, globals/ (se un test trova un difetto lo RIPORTI, non lo correggi),
scripts/ui-verify/** (congelato), docs/design/** tranne le cartelle NUOVE degli esiti (E2E_ESITI), controlli-6.6.json, e2e/playwright.config.ts, dipendenze.
LIMITI DI DIMENSIONE, DURI: motore (e2e senza controlli/ e smoke/) al massimo 3.144 righe e spec (e2e/controlli/ e e2e/smoke/) al massimo 1.243 righe. Conta con:
  find e2e -type f \( -name '*.ts' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path 'e2e/controlli/*' -not -path 'e2e/smoke/*' | xargs cat | wc -l
  find e2e/controlli e2e/smoke -type f \( -name '*.ts' -o -name '*.mjs' \) | xargs cat | wc -l
Controllali dopo ogni file. RAGGIUNTO UN LIMITE: FERMATI e rispondi con quello che hai; ciò che manca è NON PROVATO «tetto». Non superarlo per finire.

LEGGI: docs/design/verifica/policy-test.md (§3, §5, §6 compreso «Passo 24d: regole già decise», §9, §11), il piano (scheda 24c e 24d), i file del 24c in e2e/ (le due spec e gli helper),
e2e/lib/menu-list/ (payload-actions.ts, ui-helpers.ts, ensure-fixtures.ts, prepare-state.ts), e i controlli di menu-fissi e di giorni-speciali in docs/design/verifica/controlli-6.6.json
(il campo atteso è la tua fonte; le costanti di lib/ si importano, non si copiano).

FAI, in quest'ordine:
A. PRIMO ATTO, prima di ogni test nuovo.
   A1. Riunisci gli helper: esporta managerUser da e2e/lib/menu-list/payload-actions.ts e importalo in e2e/lib/special-days/payload-helpers.ts togliendo il duplicato; sposta gli helper del Global
       (readMenuGeneralTexts e writeMenuGeneralTexts) da special-days/ a e2e/lib/global-message/; togli expectSpecialDaySaveDisabled se non è usata; togli menuA inutilizzato
       (giorni-speciali.spec.ts, riga 171). Poi ricontrolla le righe del motore.
   A2. messaggio-globale-file-non-leggibile: la verifica «nessuna richiesta ripetuta per 20 secondi» è vuota (expect.poll(...).toBe(...) è vera al primo controllo, il test dura 0,5 s). Rifalla con
       page.clock (Playwright 1.55.1): page.clock.install() PRIMA del caricamento, senza pauseAt, così il tempo scorre da solo; dopo il salvataggio page.clock.fastForward(20_000) e conta le
       richieste POST verso la pagina. Se il polling partisse, il test deve FALLIRE: provalo togliendo temporaneamente la condizione se puoi, oppure spiega come hai verificato che fallirebbe.
   A3. giorni-speciali-sovrapposizione: il .first() tra due giorni con la stessa data può scegliere quello disattivato e rendere vuota la prova «nessun conflitto con se stesso». Scegli la riga del
       giorno ATTIVO dal suo messaggio (non dalla posizione) e controlla nel database che l'id modificato sia quello attivo e che l'altro sia rimasto disattivato e invariato.
   A4. GIRO A, un solo comando, solo i sei: E2E_SUITE=controlli E2E_ESITI=2026-10-20-24d-A pnpm e2e --grep "giorni-speciali|messaggio-globale". Atteso: i sei di prima ancora OK.
B. TEST NUOVI, nell'ordine, un test per controllo, titolo `<id-del-controllo> [telefono-390-chiaro]` dentro test.describe, commento `// control:<id>`:
   B1. menu-fissi-elimina-senza-uso (IL PRIMO). Crea «verify-ui-menu-libero» (non usato da giorni speciali) con i helper esistenti; apri la pagina; cerca il pulsante «Elimina <nome>». Se NON si trova:
       prima allega al test uno screenshot, il DOM dell'elenco (testInfo.attach) e la traccia (trace on), poi fallisci con una ASSERZIONE `expect(...)` il cui messaggio comincia con
       «POSSIBILE DIFETTO DELL'APP:». Importante: il reporter classifica FALLITO solo gli errori di expect(); un'eccezione di selettore diventerebbe ERRORE-STRUMENTO, ed è proprio ciò che qui
       non vogliamo (deroga a R4). Se il pulsante si trova: finestra «Eliminare verify-ui-menu-libero?» con la sola «Non si può annullare.», «Indietro», poi elimina e controlla il database.
   B2. giorni-speciali-attivazione: crea un giorno attivo di prova; tocca l'interruttore «Attivo» DELL'ELENCO (non quello del modulo); avviso «Giorno speciale disattivato», riga attenuata con
       badge «Disattivato», disabled vero nel database con la Local API; tocca di nuovo: «Giorno speciale attivato», disabled falso.
   B3. menu-fissi-persistenza (parte manager): dalla pagina crea un menù con categoria, almeno due piatti in un ordine preciso, porzione e un servizio; rileggilo con la Local API (manager,
       overrideAccess false, depth 2) e controlla che i valori e l'ORDINE dei piatti coincidano; modificalo e rileggilo.
   B4. menu-fissi-elimina-usato e menu-fissi-elimina-cascade-registro-permessi (parte manager): menù usato da un giorno speciale; finestra «Eliminare … ?» con «Verrà tolto anche da 1 giorno speciale:
       {data}. Non si può annullare.»; «Indietro»; «Elimina»; nel database il menù non è più nel giorno speciale (cascade) e il registro ha la riga delete (area app, collection fixed-menus,
       detail «nome=…; riferimenti=N»).
   B5. menu-fissi-nomi-accessibili: nomi accessibili in italiano e nessuna delle stringhe inglesi elencate nel controllo.
   B6. SE AVANZA TEMPO: menu-fissi-testi, menu-fissi-modulo-validazione, menu-fissi-disponibilita.
C. NON PROVATO con motivo nel test (test.skip con descrizione): la console, la matrice dei ruoli di persistenza e cascade, tutto ciò che non hai fatto per il tetto («tetto»). Un controllo non fatto non
   sparisce: è NON PROVATO con il motivo.
Dati di prova: nomi da payload.nome(), giorni speciali che puntano SOLO a menù di prova «verify-ui-…», date 2099 (mai vicine a oggi se attivi). Regole del motore (R1-R10): nessuna chiamata sincrona in e2e/,
niente waitForTimeout come attesa di uno stato, niente networkidle da solo; un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO (tranne B1).

GIRO B, il finale, un solo comando, tutto: E2E_SUITE=controlli E2E_ESITI=2026-10-20-24d pnpm e2e e2e/controlli/giorni-speciali.spec.ts e2e/controlli/messaggio-globale.spec.ts e2e/controlli/menu-fissi.spec.ts (si passano i FILE: un --grep sul solo nome includerebbe anche la matrice servizi-menu-fissi-matrix.spec.ts, 511 test). Avanzamento: tail -f .next/e2e-progress.log (una riga
per test, scritta a fine test). Se un test si blocca il runner lo uccide: non rilanciare l'intero giro.

VERIFICHE FINALI: pnpm typecheck (radice ed e2e) e pnpm lint sull'INTERO repo a 0 errori (e 0 warning nei file che hai toccato), pnpm ui:check, pnpm e2e:wire, ps -wweo e lsof (porte 3100-3203 e 31997 libere),
`pnpm payload run e2e/scripts/count-verify-ui.ts` a zero, i due conteggi di righe, e `git status --short` senza nessun file di esito già versionato modificato.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) i dodici controlli richiesti hanno un esito misurato (OK, FALLITO o AVVISO) o un NON PROVATO con motivo; (b) zero ERRORE-STRUMENTO sui controlli richiesti
(B1 non trovato = FALLITO «POSSIBILE DIFETTO DELL'APP», non ERRORE-STRUMENTO); (c) ambiente pulito: porte libere, zero record verify-ui-, Global menu-general ripristinato, nessun file versionato modificato
oltre al perimetro. I FALLITO dell'app NON sono un motivo per rifiutare il passo: per ognuno scrivi controllo, misurato, atteso, evidenza e gravità proposta (P o A, policy §5), senza cambiare controlli, app o soglie.
GIT: NON fare git (nessun commit, nessun push).
RISPOSTA FINALE: tabella «Esiti reali» (controllo, esito, secondi) per il giro A e per il giro B, i FALLITO con gravità proposta, i NON PROVATO con motivo, i due conteggi di righe e se hai raggiunto un limite,
la DURATA DEL PASSO in minuti, quanti ERRORE-STRUMENTO, il comando dei due giri, l'elenco dei file toccati (con quelli nuovi) e il percorso delle cartelle degli esiti.
```

### Passo 25 — D7: controlli di chiusura (L2 completo e L3)

> **Esito (2026-10-20)**: chiuso con `1f4b6c0` (controllato nel repo: tre file, identici al pacchetto, genitore `7ab00a5`). **L2**: verificata la §9 di Giorni speciali (16 punti) e di Messaggio globale (14): già coperte da controlli esistenti, nessun controllo L2 nuovo per le due schermate. Aggiunti in `controlli-6.6.json`: la simulazione `ritardo_pubblicazione` (citata da `messaggio-globale-pubblicazione` senza essere definita) e il blocco `online-senza-credenziali` con `on-menu-1` (livello 2): le nove rotte del Menù senza sessione, nessun 404 né 5xx, reindirizzamento a `/app/login` senza 0.0.0.0 o localhost; lo implementa ed esegue V6. **L3**: sei voci nuove in `livello_3` (tre su iPhone, tre su Cloud Run). Sono il dettaglio delle voci 6, 7 e 8 del giro su iPhone (§6, passo 30, parte M3) e della parte D9 (registro `delete`, lettura di `disponibilita.json` con l'ora, ruoli); l'elenco di Mirko in §6 e nel passo 30 non cambia. Nessun id né livello dei controlli di schermata cambia (R14 invariata, 244 id in `e2e:wire`). **Non toccati**: scheda 28, A1–A12, debiti e eccezioni firmate. **Non verificato**: nessun controllo nuovo è stato eseguito.

**Chi**: la chat di design (io). **Niente da incollare in Cursor.**
**Cosa fai tu**: scrivimi «passo 25»; ti consegno un pacchetto (zip) e il messaggio di commit; tu applichi lo zip, fai commit e push e scrivi «push fatto».

### Passo 26 — I6: chiusura della sottofase (solo verifica, documentazione e correzioni minime)

> **Esito (2026-10-20)**: 🔶 **chiuso con riserva** (`9a4d8b7`; lavoro di Composer in `b674045` e `78dba31`, correzioni della chat di design in `9a4d8b7`). Passo solo documentale: nessun codice cambiato, quindi L1 non attivato dalla policy (§4). **L0** (riferito da Composer, non rieseguito dalla chat di design): `typecheck`, `lint` 0 errori, `ui:check`, unitari di `lib/` 130/130. **Verify** (database `vma_vd_dev`): `verify:menu-6_1` e `6_3` OK; `6_2` **FALLITO** (REST `fallback-locale=none`), **causa non determinata**: dopo l'ultimo OK noto del 18/10 nessuna modifica a collection, hook o dipendenze, e il blocco REST gira solo con `pnpm dev` acceso; `6_4` **FALLITO**, precondizione **dimostrata dal log** (impronte prima e dopo il roundtrip diverse, il `finally` sostituisce il primo errore con il conteggio); `final-proofs` **NON PROVATO** per ambiente. **Playwright** (tre file, nucleo): 10 OK / 10 NON PROVATO (eccezioni firmate verso V6), 0 ERRORE-STRUMENTO. **L1 del lanciatore**: Home ERRORE-STRUMENTO (blocco oltre 15 minuti), navigazione ERRORE-STRUMENTO (Chromium assente: causa probabile `PLAYWRIGHT_BROWSERS_PATH` del terminale di Cursor, non provata), le altre NON PROVATO. **Checklist §9 per voce** (`esiti/2026-10-20-I6/checklist-9.md`): 167 voci, 3 OK / 0 FALLITO / 164 NON PROVATO, calcolati con un comando; tre righe dichiarate OK da Composer sono passate a NON PROVATO perché la voce non era coperta per intero. **Riserve**: (1) tre controlli di backend riportati a V6: `6_4` a database allineato allo snapshot, diagnosi di `6_2` con `curl`, `final-proofs` con il dev avviato con le sue variabili; (2) in `verify-menu-6_4.ts` il `finally` nasconde il primo errore (stesso schema del 18/10; correzione in `scripts/`, fuori perimetro); (3) piatti dopo `6_4`: 25 nella prima sessione, 44 nella seconda, non spiegato; (4) `verify:menu-6_4` ha cancellato 35 piatti di prova dal database di sviluppo (confermati di prova da Mirko); (5) due errori della chat di design: il prompt non avvisava che `6_4` cancella e reimporta il contenuto, e per `final-proofs` indicava le variabili di `6_4`; (6) le evidenze di esiti sono state riscritte dopo il controllo (R13 passa solo con i file in staging). **Non toccati**: scheda 28, A1–A12, debiti dello strumento, eccezioni firmate.

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

> **Esito (2026-10-20)**: ✅ `0ff8e15` (ultimo commit al momento del deploy, indicato da Mirko; dopo il 24b i commit sono di sola documentazione). **Smoke**: il lanciatore (`ui:verify online`) è andato in **ERRORE-STRUMENTO**: fermo 191 s sul primo passo (`AMBIENTE goto /app/login`), interrotto da Mirko, terzo caso dopo il 21c e il 24; ha anche avviato il daemon locale `menu-payload`. Non rilanciato. I controlli `on1`–`on6` e `on-menu-1` sono richieste HTTP e sono stati fatti con `curl` sul dominio pubblico, senza credenziali: `on1` 200 e «Area App»; `on2` 307 verso `<dominio>/app/login`; `on3` 303 con `Location: /app/login` e `Set-Cookie: payload-token` con `Expires` uguale all'istante della richiesta (scaduto); `on4` 0 (conteggio sull'intera pagina, approssimato); `on5` un campo password e l'avviso; `on6` 200 e l'avviso; `on-menu-1` nove rotte con 307 verso `<dominio>/app/login`, nessun 404 né 5xx (la revisione in linea contiene quindi le due rotte nate nel passo 24). **Cloud Build e Cloud Run**: Mirko ha confermato «deploy ok» (dopo il push di `3002839`); la chat di design non ha accesso alla console né al sito. **Debito**: lo smoke senza lanciatore (`scripts/online-smoke.mjs`) è stato scritto nel passo 28.

**Chi**: tu. Nessun prompt di Cursor.

**Che cos'è**: il deploy è **automatico**. Ogni push su `main` avvia il trigger Cloud Build (progetto `vma-vd`, regione `europe-west1`, servizio Cloud Run `vma-vd-backend-backoffice-git`; vedi `docs/operativo/cloud-run-produzione.md`). Non c'è un comando di deploy da lanciare, e la 6.6 non ha migrazioni: nessun passaggio sul database di produzione.

**Cosa fai**
1. Dopo il push della chat I6 (passo 26), in Google Cloud Console apri Cloud Build → Cronologia e controlla che la build del commit di I6 sia terminata con **successo**; in Cloud Run controlla che la revisione più recente serva il 100 % del traffico. Se la build fallisce, incollami l'errore del log.
2. Smoke (1 minuto, nessuna credenziale): `BASE_URL=<indirizzo pubblico dell'App, senza /app> pnpm ui:verify online --controlli controlli-8.2.json`
3. Scrivimi «deploy fatto» con l'hash del commit e incollami l'esito dello smoke.

### Passo 28 — V6a: backend e online, senza lanciatore

> **Esito (2026-10-20)**: ✅ `f4a51dd` (commit di Mirko con il lavoro dell'agente; la correzione dello smoke fatta dalla chat di design è nel commit successivo). Database `vma_vd_dev`, conteggi invariati (44/0/0/90/38/13/3). `verify:menu-6_4` **OK** a database allineato: conferma che il FALLITO del passo 26 era una precondizione. `verify:menu-6_2` **FALLITO**, classe **(iv)** confermata dal codice: lo script scrive la descrizione inglese sullo stesso piatto (blocco F-EN, riga ~1632) e poi pretende che con `fallback-locale=none` sia vuota (righe ~1791–1796); la diagnosi REST mostra che l'app è corretta (`none`, `null` e `false` danno `null` per un piatto senza traduzione, senza parametro ricade sull'italiano; Payload: `createPayloadRequest.js` righe 43–51, `sanitizeFallbackLocale.js` righe 22–27). Non è un difetto dell'app: **A**, controllo dubbio, da correggere in `scripts/verify-menu-6_2.ts` (debito per F6). `final-proofs`: prove dev 1–2 OK con le variabili giuste; standalone `:3002` NON PROVATO (serve il bucket: passo 30). **Smoke online**: 7 su 7 OK sul dominio pubblico con la versione dell'agente; **difetto trovato dalla chat di design**: quella versione accettava qualunque `Location` che finisse con `/app/login`, quindi anche `http://0.0.0.0:3000/app/login` (provato contro un server finto: uscita 0); corretta (confronto esatto con `/app/login` o con l'origine di `BASE_URL`, timeout di 15 s, errore per singolo controllo), 81 righe, provata contro un server finto in otto casi; ESLint a zero warning, `ui:check`, `e2e:wire` e `typecheck` ok su copia pulita. **Non verificato**: la versione corretta non è stata rieseguita contro il dominio pubblico. Durata dichiarata dall'agente: circa 2 minuti, misurati dai conteggi alla chiusura delle porte e senza la scrittura dello script.

> **Scheda riscritta il 2026-10-20 dopo il passo 26** (policy v2 §9). Il vecchio prompt di V6 usava il lanciatore `ui:verify`: **non si incolla**. V6 è spezzata in 28–28f (vedi le schede e la sezione successiva): questa scheda è la prima parte, senza interfaccia e senza browser.

**Perché**: il passo 26 ha lasciato tre controlli di backend aperti (`verify:menu-6_4` a database allineato, `verify:menu-6_2` con una diagnosi mirata, `verify:menu-availability-final-proofs` con le sue variabili) e lo smoke online non gira più con il lanciatore (fermo 191 s sul primo passo nel passo 27). Qui si risolvono e si scrive lo smoke online come script a sé.

**Decisione di disegno** (chat di design, da confermare in sede di controllo): i controlli di sola richiesta HTTP non hanno bisogno di un browser. Lo smoke sta in `scripts/online-smoke.mjs` (Node, nessuna dipendenza), **fuori da `e2e/`**: non pesa sul motore (3.145 righe, soglia di revisione 3.200). La regola «controlli nuovi solo in Playwright» (policy §9) vale per i controlli di interfaccia.

**Quando**: ora; **mai insieme a una chat di Composer**. **Chi**: agente di verifica, chat pulita. **Stima e tetto**: 45 minuti; a 90 FERMATI e riporta (R10).

**Cosa fai tu**: apri una chat nuova di Cursor (agente di verifica), senza altre chat attive; esegui in un terminale la pulizia della prima riga del prompt; incolla **solo** il prompt; a fine passo incollami qui la risposta finale, con la durata in minuti. **Commit e push**: nessun git dell'agente; committi tu dopo il mio controllo. Se `git status --short` mostra file diversi da quelli che ti scrivo, ti fermi e me li incolli. **Messaggio di commit suggerito**: `test(online): passo 28 (V6a) — verify di backend riesaminati e smoke online senza lanciatore`.

```text
PASSO 28 (V6a): backend e online, senza lanciatore. Rispondi in italiano. Sei l'agente di verifica: PROVI, non modifichi l'app.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3000,3100,3200,3201,3202,3203,3002,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo server alla volta, mai insieme a Composer.

CONTESTO. Riporta git rev-parse --short HEAD e git status --short: il secondo deve essere vuoto, altrimenti FERMATI. Dominio pubblico (BASE_URL, senza /app):
https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app
Il lanciatore scripts/ui-verify è congelato e da cancellare più avanti: NON usarlo, NON rilanciarlo. Fatti già accertati, non rifarli: (1) verify:menu-6_4 fa per progetto un
round-trip che cancella e reimporta il contenuto del menù nel database di sviluppo; con il database non allineato allo snapshot il primo errore è «Impronta contenuto roundtrip» e il
finally lo sostituisce con il conteggio dei piatti; i piatti in più erano di prova (confermato da Mirko). (2) Il blocco REST di verify:menu-6_2 gira solo con pnpm dev acceso; dopo l'ultimo OK noto
(18/10) non sono cambiati collection, hook né dipendenze; il FALLITO è «REST fallback-locale=none: description doveva essere vuota» (scripts/verify-menu-6_2.ts, circa riga 1796).
(3) final-proofs va lanciato con il dev avviato con le variabili della SUA intestazione (file /tmp/vma-final-dev-*), non con quelle di 6_4. Mai produzione, salvo lo smoke online (solo
richieste senza credenziali); mai prod-db.sh; non stampare mai DATABASE_URL.

PERIMETRO. Puoi creare: scripts/online-smoke.mjs; la cartella NUOVA docs/design/verifica/esiti/<data di oggi, date +%F>-V6a/ con il solo rapporto.md (niente PNG, niente log). Puoi modificare:
package.json (SOLO l'aggiunta dello script "online:smoke": "node scripts/online-smoke.mjs"), docs/piano-sviluppo/CHANGELOG.md (una voce Tests, al massimo 25 righe). File temporaneo ammesso:
scripts/tmp-v6a-rest-locale.ts, da cancellare prima di finire. VIETATO: app/, components/, lib/, collections/, globals/, e2e/, scripts/verify-*.ts (se un verify ti sembra sbagliato, scrivilo
come «controllo dubbio», non correggerlo), scripts/ui-verify/**, docs/design/** fuori dalla cartella nuova degli esiti, controlli-*.json, dipendenze.
LIMITI DURI: scripts/online-smoke.mjs al massimo 120 righe; rapporto.md al massimo 120; CHANGELOG 25. Raggiunto un limite FERMATI e rispondi con ciò che hai.

FAI, in quest'ordine:
1. Controlla che il database sia vma_vd_dev (solo il nome). Riporta i conteggi di piatti, menù fissi, giorni speciali, vini, distillati, bevande e servizi (file temporaneo con la Local API).
2. verify:menu-6_4, UNA volta. Avvia pnpm dev con le variabili dell'intestazione di scripts/verify-menu-6_4.ts (IN_MEMORY, trace, mirror e sync in /tmp). Lancia pnpm verify:menu-6_4 con l'output
   salvato con tee in /tmp. Riporta l'esito, la PRIMA riga di errore (non solo l'ultima) e i conteggi prima e dopo. Atteso: OK se il database è allineato allo snapshot.
3. verify:menu-6_2, con dev acceso. Prima la diagnosi: con il file temporaneo crea un piatto «verify-ui-v6a-<tag>» con nome italiano e descrizione «Solo IT» (Local API, locale it), poi chiedi
   a GET /api/dishes/<id>?locale=en&depth=0 con ciascuno di questi parametri: nessuno, fallback-locale=none, fallback-locale=null, fallback-locale=false. Riporta name e description di ogni risposta.
   Cancella il piatto in try/finally. Poi leggi (sola lettura) come node_modules/payload interpreta il parametro fallback-locale e riporta file e riga. Poi lancia pnpm verify:menu-6_2 UNA volta.
   Classifica la causa con la prova: (iii) regressione dell'app, (iv) asserzione superata dal codice, (v) comportamento di Payload (parametro non onorato), (vi) altro o non determinata.
4. final-proofs: ferma il dev; riavvialo con le variabili dell'intestazione di scripts/verify-menu-availability-final-proofs.ts; lancia pnpm verify:menu-availability-final-proofs UNA volta.
   Il server standalone :3002 NON si avvia: se lo script si interrompe per :3002, è ambiente (NON PROVATO), non FALLITO. Ferma il dev.
5. Smoke online. Scrivi scripts/online-smoke.mjs: legge BASE_URL (obbligatoria; se manca esce con errore), usa fetch con redirect: 'manual' e NON invia mai credenziali né cookie. Una riga per controllo
   «OK|FALLITO <id> <misurato>», uscita 1 se c'è un FALLITO, nessuna scrittura su disco. Controlli e attesi (già osservati a mano sul dominio il 2026-10-20):
   on1 GET /app/login: 200 e testo «Area App». on2 GET /app: 307 con destinazione = BASE_URL + /app/login. on3 POST /app/logout senza cookie: 303, Location /app/login (relativa o con l'origine
   di BASE_URL), Set-Cookie payload-token con Expires non successiva alla richiesta. on4 GET /app/login/reset senza token: nessun <form>, <input> o <button> nel markup (approssimazione sull'intera pagina:
   scrivilo nel rapporto). on5 GET /app/login/reset?token=prova&resetFailed=1: campo name="password" e la frase GENERIC_RESET_FAILURE_MESSAGE. on6 GET /app/login/verify: 200 e la frase
   GENERIC_VERIFY_FAILURE_MESSAGE. on-menu-1 (docs/design/verifica/controlli-6.6.json, blocco online-senza-credenziali): per le nove rotte /app/menu, /app/menu/wines, /app/menu/spirits,
   /app/menu/drinks, /app/menu/services, /app/menu/fixed, /app/menu/fixed/categories, /app/menu/special-days, /app/menu/message: 3xx con destinazione BASE_URL + /app/login, mai 404 né 5xx,
   mai 0.0.0.0 né localhost. Le due frasi si ESTRAGGONO dal sorgente lib/auth/localEmail/messages.ts con una regex: non si copiano. Lancialo contro il dominio con
   BASE_URL=<dominio> pnpm online:smoke: atteso tutto OK. Prova NEGATIVA: con BASE_URL=http://127.0.0.1:9 deve dare errore o FALLITO, mai OK; riporta le due uscite.
6. Chiusura: pnpm typecheck (radice ed e2e) e pnpm lint a 0 errori (0 warning nei file toccati), pnpm ui:check, pnpm e2e:wire; ps e lsof con le porte 3000–3203, 3002 e 31997 libere;
   pnpm payload run e2e/scripts/count-verify-ui.ts a zero; cancella i file temporanei; git status --short: solo i file del perimetro. NON fare git.

TRE CRITERI (riporta i numeri): (a) 6_4, 6_2 e final-proofs hanno un esito misurato con la prima riga di errore e la classe di causa, oppure un NON PROVATO con motivo e livello; lo smoke online
ha un esito per ciascuno dei sette controlli; (b) zero ERRORE-STRUMENTO nei passi; (c) ambiente pulito: porte libere, dev fermo, zero record verify-ui-, nessun file di esito versionato modificato.
I FALLITO dell'app non sono un motivo per rifiutare il passo: si classificano P o A (policy-test §5) e non si modificano controlli, script di verify né app.
RISPOSTA FINALE: tabella «Esiti reali» (controllo, esito, prima riga di errore, classe di causa), i conteggi prima e dopo, le risposte della diagnosi REST per ciascun parametro, le due uscite
dello smoke (positiva e negativa), il numero di righe di scripts/online-smoke.mjs, l'elenco dei file toccati, il git status --short e la durata in minuti.
```

### Passo 28b — V6b: nuclei rimasti di Giorni speciali e Messaggio globale

> **Aggiornamento del 2026-10-21 (opzione C, firmata da Mirko)**: la **ripresa del 28b è annullata**. I quattro controlli su server di sviluppo (`giorni-speciali-console`, `messaggio-globale-console`, `-file-riceve-messaggio`, `-pubblicazione`) restano NON PROVATO per eccezione firmata, senza scadenza (policy §6); la prima ripresa (server a mano sulla 3300) non è stata committata e la sua causa del blocco iniziale resta non determinata. Il passo si chiude 🔶 con sei controlli su dieci in regola. Il prompt qui sotto è quello eseguito il 2026-10-20: **non si riesegue**.

> **Esito (2026-10-20)**: 🔶 **chiuso con riserva** (`a587868`; commit di Mirko con il lavoro dell'agente, fatto prima del controllo della chat di design). Dieci controlli: **OK** `giorni-speciali-testi`, `-nomi-accessibili`, `-modulo-validazione`, `messaggio-globale-testi`, `-nomi-accessibili` (nel giro ufficiale `messaggio-globale-testi` era FALLITO per un difetto del test, il messaggio non salvato; corretto e misurato OK da solo, **l'intero giro non è stato rieseguito**) e `messaggio-globale-permessi` (OK con evidenza `verify:menu-6_1`: manager, admin e super-admin riescono, l'utente senza ruolo è rifiutato con 403); **ERRORE-STRUMENTO** `giorni-speciali-console` (241 s di attesa di `http://localhost:3200/app/login`: il server di sviluppo avviato dall'helper non diventa raggiungibile; la causa non è nel rapporto, lo stack di Next è troncato); **NON PROVATO** (serie dopo il blocco) `messaggio-globale-console`, `-file-riceve-messaggio` e `-pubblicazione`. Il criterio (b) non è soddisfatto: il passo non è ✅. Limiti rispettati (misurati dalla chat di design): motore 3.302 su 3.345, spec 1.426 su 1.500. Controllo della chat di design su copia pulita di `a587868`: `typecheck` (con e2e), ESLint a zero warning sui sette file toccati, `ui:check` e `e2e:wire` ok; l'agente non aveva riportato questi esiti. Regola 4 («può fallire») provata solo per `modulo-validazione`. **Lacune da sistemare nella ripresa**: in un giro normale `dev-server.spec.ts` attende 240 s per ogni test se non trova un server, e il `global-setup` libera la 3200 a inizio giro. Durata dichiarata dall'agente circa 95 minuti, tentativi del server inclusi (stima 90). **Non verificato**: nulla dei quattro controlli su server di sviluppo.

> **Tetto del motore per V6: approvato da Mirko il 2026-10-20, 4.350 righe** (valutazione nella sezione successiva). Per questo passo: motore (`e2e` senza `controlli/` e `smoke/`) al massimo **3.345 righe** (oggi 3.145: +200) e spec (`e2e/controlli/` e `e2e/smoke/`) al massimo **1.500** (oggi 1.061). Limiti DURI: raggiunto uno, l'agente si ferma e risponde con quello che ha.

**Che cosa**: i dieci controlli del nucleo di Giorni speciali e Messaggio globale rimasti NON PROVATO verso V6 (eccezione firmata, policy §6). **Cinque** sul server di produzione locale già usato dal motore (`giorni-speciali-testi`, `-nomi-accessibili`, `-modulo-validazione`; `messaggio-globale-testi`, `-nomi-accessibili`). **Quattro** su un server di sviluppo avviato dal test sulla porta 3200 con l'helper `withMenuDevServer` di `e2e/lib/dev-menu-server.ts` (mai usato finora: va provato per primo): le due console (`giorni-speciali-console`, `messaggio-globale-console`) e, con `MENU_AVAILABILITY_IN_MEMORY=1`, `MENU_AVAILABILITY_MIRROR_FILE` e `APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS=8000` (`ritardo_pubblicazione`), `messaggio-globale-file-riceve-messaggio` e `messaggio-globale-pubblicazione`. Uno (`messaggio-globale-permessi`) **non richiede codice nuovo**: i permessi del Global per manager, admin, super-admin e utente senza ruolo sono già provati da `scripts/verify-menu-6_1.ts` (righe `update menu-general` e `negata (403)`), che si rilancia una volta e si cita come evidenza.

**Perché le regole sulle asserzioni**: nel 24c e nel 24d due risultati sono usciti non validi (un `count()` subito dopo l'attesa dell'intestazione, con l'elenco ancora in caricamento; un `innerText` letto senza gli `aria-label`) e una verifica di 20 secondi era vuota (`expect.poll` vera al primo controllo). Il prompt le scrive come regole.

**Quando**: dopo il push del pacchetto che contiene questa scheda; **mai insieme a una chat di Composer** e con **una sola chat che modifica `e2e/`** (R9). **Chi**: agente di verifica, chat pulita. **Stima e tetto**: 90 minuti; a 180 FERMATI e riporta (R10).

**Cosa fai tu**: apri una chat nuova di Cursor (agente di verifica) senza altre chat attive; nel terminale esegui la pulizia della prima riga del prompt; copia il prompt con `awk '/^### Passo 28b — V6b/{f=1} f&&/^\140\140\140text/{p=1;next} p&&/^\140\140\140/{exit} p' docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md | pbcopy` e incollalo **da solo** (il prefisso `PLAYWRIGHT_BROWSERS_PATH` per Playwright lo scrive il prompt, perché il terminale dell'agente non eredita il tuo); a fine passo incollami la risposta finale, con la durata in minuti. **Commit e push**: nessun git dell'agente; committi tu dopo il mio controllo, e se `git status --short` mostra file diversi da quelli che ti scrivo, ti fermi e me li incolli. **Messaggio di commit suggerito**: `test(e2e): passo 28b (V6b) — nuclei rimasti di Giorni speciali e Messaggio globale, console e file di disponibilità su server di sviluppo`.

```text
PASSO 28b (V6b): nuclei rimasti di Giorni speciali e Messaggio globale. Rispondi in italiano. Sei l'agente di verifica: PROVI l'app, non la modifichi.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3000,3100,3200,3201,3202,3203,3002,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a Composer.

CONTESTO. Riporta git rev-parse --short HEAD e git status --short (il secondo vuoto, altrimenti FERMATI). Il lanciatore scripts/ui-verify è congelato: NON usarlo. Policy: docs/design/verifica/policy-test.md
(§3, §5, §6 con l'eccezione firmata verso V6, §9, §11). Il database è vma_vd_dev (solo il nome, mai DATABASE_URL). Mai produzione.

PERIMETRO. Puoi creare: e2e/controlli/dev-server.spec.ts. Puoi modificare: e2e/controlli/giorni-speciali.spec.ts e messaggio-globale.spec.ts (sostituendo gli stub test.skip dei controlli che ora provi, e
aggiungendo i cinque test del server di produzione locale), e2e/lib/checks.ts, e2e/lib/dev-menu-server.ts (solo per esportare un avvio e uno stop, se serve), e2e/lib/special-days/ e e2e/lib/global-message/ (solo
aggiunte o spostamenti), e2e/controlli/wire-registry.json (togli le voci dei controlli che ora hanno un test con // control:<id>), una voce Tests in docs/piano-sviluppo/CHANGELOG.md (al massimo 30 righe) e la cartella
NUOVA degli esiti (E2E_ESITI). VIETATO: app/, components/, lib/, collections/, globals/, scripts/, e2e/playwright.config.ts, e2e/global-setup.ts, controlli-*.json, docs/design/** fuori dalla cartella nuova degli esiti,
dipendenze, qualunque cambio di soglie o di attesi. Se un controllo ti sembra sbagliato scrivilo come «controllo dubbio»: non lo cambi.
LIMITI DURI: motore (e2e senza controlli/ e smoke/) al massimo 3.345 righe; spec (e2e/controlli/ e e2e/smoke/) al massimo 1.500. Conta con:
  find e2e -type f \( -name '*.ts' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path 'e2e/controlli/*' -not -path 'e2e/smoke/*' | xargs cat | wc -l
  find e2e/controlli e2e/smoke -type f \( -name '*.ts' -o -name '*.mjs' \) | xargs cat | wc -l
Controllali dopo ogni file. RAGGIUNTO UN LIMITE: FERMATI e rispondi con ciò che hai; ciò che manca è NON PROVATO «tetto». Non superarlo per finire.

LEGGI: policy-test.md come sopra; il piano (schede 24c, 24d, 28b); percorso-test-v2.md (regole R1–R10); e2e/README.md; e2e/lib/dev-menu-server.ts, e2e/lib/login-dev.ts, e2e/lib/checks.ts, e2e/lib/special-days/, e2e/lib/global-message/;
le tre spec esistenti (giorni-speciali, messaggio-globale, menu-fissi); i dieci controlli in docs/design/verifica/controlli-6.6.json (il campo atteso e i passi sono la tua fonte; le costanti di lib/, per esempio
lib/menu/specialDays/copy.ts e lib/menu/globalMessage/copy.ts, si importano con '@/…', non si copiano); scripts/verify-menu-6_1.ts (righe 195–251) e le specifiche in docs/design/schermate/{giorni-speciali,messaggio-globale}/spec.md.

REGOLE SULLE ASSERZIONI (valgono per ogni test nuovo):
 (1) Mai count() o innerText subito dopo un goto: aspetta lo stato con asserzioni che attendono (toBeVisible, toHaveCount, toHaveText) PRIMA di leggere, e dichiara nel test su cosa aspetti.
 (2) I nomi accessibili si leggono dagli attributi aria-label (e da getByRole con name), non solo dal testo visibile.
 (3) Un expect.poll che può essere vero al primo controllo è vuoto: ogni attesa di un cambiamento confronta con un valore che prima era diverso.
 (4) Una verifica di assenza («nessuna richiesta», «nessun errore») deve poter fallire: provala una volta rompendo temporaneamente l'atteso (per esempio una stringa) e riporta che il test è diventato FALLITO, poi ripristina.
 (5) Nessuna chiamata sincrona in e2e/ (spawnSync, execSync, execFileSync, Atomics.wait, readSync), nessun waitForTimeout come attesa di uno stato, nessun networkidle da solo; un'eccezione fuori da un'asserzione è ERRORE-STRUMENTO.
 (6) Titoli dei test: `<id-del-controllo> [telefono-390-chiaro]` dentro test.describe e commento `// control:<id>`. Dati di prova con payload.nome(); giorni speciali che puntano SOLO a menù fissi «verify-ui-…», date 2099 e 2001.
     Il Global menu-general si SALVA prima (italiano e inglese) e si RIPRISTINA in try/finally, anche se il test fallisce.

FAI, in quest'ordine, fermandoti ai limiti:
A. PRIMO ATTO, il server di sviluppo. Con l'helper withMenuDevServer di e2e/lib/dev-menu-server.ts e loginAppOnBase di e2e/lib/login-dev.ts, in un test provvisorio avvia il server sulla porta 3200, accedi e carica
   /app/menu/message: nessuna pagina d'errore. L'helper non è mai stato usato: se non funziona, correggilo nel minimo (timeout di 240 secondi con test.setTimeout, ripulitura della porta); se dopo DUE tentativi non funziona,
   FERMATI e riporta l'errore. Poi togli il test provvisorio. Un solo server alla volta: i test su porta 3200 stanno nella stessa spec, in serie, e solo nel progetto telefono-390-chiaro (altrimenti due progetti
   avvierebbero due server sulla stessa porta).
B. Server di produzione locale (porta 3100), cinque test nelle due spec esistenti, un test per controllo:
   B1. giorni-speciali-testi e messaggio-globale-testi: titolo, descrizione, pulsanti, gruppi, riquadro e testi come da campo atteso, con le costanti di lib/ (singolare e plurale compresi per «1 giorno»/«N giorni»).
   B2. giorni-speciali-nomi-accessibili e messaggio-globale-nomi-accessibili: nomi in italiano e nessuna delle stringhe inglesi del controllo (Close, Edit, Delete, Remove, Save, Cancel, Add, Toggle) né nel testo né negli aria-label;
       un helper comune in e2e/lib/checks.ts (aspetta che l'elenco o la pagina siano caricati, poi legge gli attributi aria-label di main e dei dialoghi aperti).
   B3. giorni-speciali-modulo-validazione: i due passi del controllo, con richieste osservate (nessuna richiesta al server a modulo non valido), focus sul primo campo non valido e campo in vista.
C. Server di sviluppo sulla porta 3200, nella spec nuova e2e/controlli/dev-server.spec.ts (una describe per server, in serie):
   C1. Server normale (nessuna variabile oltre quelle dell'helper): giorni-speciali-console e messaggio-globale-console. Ascolta console (error e warning), pageerror e risposte con stato 4xx o 5xx PRIMA di navigare, esegui
       i passi del controllo (a 390 e poi a 1280 px nello stesso test, con page.setViewportSize) e verifica zero messaggi. Non filtrare nulla senza scriverne il motivo nel rapporto: ogni messaggio trovato si RIPORTA tale e quale
       (sorgente, testo) come FALLITO con gravità proposta, non si esclude per far passare.
   C2. Server con MENU_AVAILABILITY_IN_MEMORY=1, MENU_AVAILABILITY_MIRROR_FILE=<file in os.tmpdir(), cancellato in finally> e APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS=8000: messaggio-globale-file-riceve-messaggio e
       messaggio-globale-pubblicazione, SEMPRE dall'interfaccia (lo storage in memoria non è condiviso con il processo del test: se il file non risulta leggibile dopo il primo salvataggio, il controllo è FALLITO e lo riporti
       con questa evidenza, senza aggirarlo). Il file speculare si legge con asserzioni che attendono un valore diverso dal precedente (regola 3). Per la pubblicazione: subito dopo il secondo salvataggio il riquadro mostra il
       testo VECCHIO, «In pubblicazione…» e lo Spinner, a ritardo scaduto il testo nuovo senza «In pubblicazione…»; usa le costanti di lib/menu/globalMessage/copy.ts e nessun waitForTimeout.
D. messaggio-globale-permessi: lascia lo stub test.skip con la nota «coperto da verify:menu-6_1» e, DOPO il giro Playwright, esegui pnpm verify:menu-6_1 UNA volta (output con tee in /tmp). Riporta le righe
   «OK: <ruolo> update menu-general» e «negata (403)» per manager, admin, super-admin e utente senza ruolo. Esito del controllo: OK con evidenza «verify:menu-6_1» se le righe ci sono e lo script finisce a 0;
   altrimenti FALLITO con la prima riga di errore. Il passo di lettura del Global con overrideAccess: false lo copre il controllo comune NO-OVERRIDE (grep del controllo, riportane l'esito).
E. wire-registry.json: togli le voci dei controlli che ora hanno un test; lascia quelle con motivo (permessi) e controlla pnpm e2e:wire.
F. GIRO UNICO, un solo comando, tre FILE di spec (mai --grep sul solo nome):
   PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=$(date +%F)-V6b pnpm e2e e2e/controlli/giorni-speciali.spec.ts e2e/controlli/messaggio-globale.spec.ts e2e/controlli/dev-server.spec.ts
   (i test del progetto telefono-390-chiaro). Il prefisso PLAYWRIGHT_BROWSERS_PATH va messo davanti a OGNI comando Playwright che lanci (anche i test singoli): nel tuo terminale la variabile punta a una cache vuota. Avanzamento: tail -f .next/e2e-progress.log. Se un test si blocca il runner lo uccide: non rilanciare l'intero giro. Mentre scrivi puoi lanciare un singolo test
   con un percorso di file e --grep ristretto DENTRO lo stesso file. Nella cartella degli esiti tieni SOLO rapporto.md e risultati.json: cancella ogni img/ e ogni PNG.
G. VERIFICHE FINALI: pnpm typecheck (radice ed e2e) e pnpm lint a 0 errori (0 warning nei file toccati), pnpm ui:check, pnpm e2e:wire, ps -wweo e lsof (porte 3000–3203, 3002 e 31997 libere),
   pnpm payload run e2e/scripts/count-verify-ui.ts a zero, Global menu-general ripristinato (confronta i due testi prima e dopo), file speculare in /tmp cancellato, i due conteggi di righe,
   git status --short senza nessun file di esito già versionato modificato.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) i dieci controlli hanno un esito misurato (OK, FALLITO o AVVISO) oppure un NON PROVATO con motivo e livello (permessi: OK con evidenza verify:menu-6_1);
(b) zero ERRORE-STRUMENTO sui dieci; (c) ambiente pulito: porte libere, nessun server di sviluppo vivo, zero record verify-ui-, Global ripristinato, nessun file versionato modificato oltre il perimetro.
I FALLITO dell'app NON sono un motivo per rifiutare il passo: per ognuno scrivi controllo, misurato, atteso, evidenza e gravità proposta (P o A, policy §5), senza cambiare controlli, app o soglie.
GIT: NON fare git (nessun commit, nessun push).
RISPOSTA FINALE: tabella «Esiti reali» (controllo, esito, secondi) con i dieci controlli, i FALLITO con gravità proposta, i NON PROVATO con motivo, la prova «può fallire» della regola 4 per i test di validazione e di console,
l'esito di verify:menu-6_1 e del controllo NO-OVERRIDE, i due conteggi di righe e se hai raggiunto un limite, la DURATA DEL PASSO in minuti, quanti ERRORE-STRUMENTO, il comando del giro, l'elenco dei file toccati
(con quelli nuovi) e il percorso della cartella degli esiti.
```

### Passo 28c — V6c: meccanica rimasta (Menù fissi, limite di 100 record, verify:menu-6_2)

> **Chiusura (2026-10-21)**: ✅ `352cd08`. La riserva è sciolta: quattro asserzioni su cinque completate nel 28d (modulo-validazione, vini-ordine-100, disponibilita, piatti-ordine-100) e `porzione-traduzione` corretta in una riga (lettura inglese con ricaduta sull'italiano), che nel giro F6a è passato insieme agli altri flussi (riferito dall'agente: 29 OK, 0 FALLITO).

> **Esito (2026-10-21)**: 🔶 **chiuso con riserva** (`096e732`). Otto controlli e `verify:menu-6_2`: OK secondo l'agente (giro finale 13 s, 0 FALLITO, 0 ERRORE-STRUMENTO; il primo giro aveva 3 FALLITO e 1 ERRORE-STRUMENTO per difetti dei test, corretti). `verify:menu-6_2` OK: asserzione corretta con il valore esatto `EN desc <tag>` più il caso del piatto senza traduzione (`null`), non ammorbidita; quel piatto di prova si elimina dopo l'asserzione e non in `finally`, quindi se l'asserzione fallisse resterebbe nel database di sviluppo. Limiti rispettati (misurati dalla chat di design): motore 3.276 su 3.302, spec 1.545 su 1.550; tolte 393 righe del server di sviluppo. Controllo su copia pulita di `096e732`: `typecheck`, ESLint a zero warning sui file toccati, `ui:check` ed `e2e:wire` ok. **Quattro asserzioni più deboli dell'atteso** (riserva, da completare nel 28d): (1) `menu-fissi-modulo-validazione`: «le quattro forme del prezzo sono accettate» non è provato, perché dopo `fill` si controlla subito l'assenza di un errore che non c'era mai stato (serve salvare e verificare l'assenza dell'errore mentre gli altri ci sono); sono provate solo le forme rifiutate («abc», «18,555»); (2) `vini-ordine-100`: controlla avviso, pulsante e sparizione dell'avviso ma non conta le righe (100, poi 101) né l'ordine per nome; (3) `menu-fissi-porzione-traduzione`: `.first()` seguito da `toHaveCount(1)` è sempre vero, quindi «un campo SOLO per il piatto che ha la porzione» e il segnaposto non sono provati, e della lettura in inglese è provata solo la porzione; (4) `menu-fissi-disponibilita`: la categoria disabilitata non verifica che i menù restino collegati. **Piatti** ha un percorso di lista diverso (`dishes-page.tsx`, `limit: 100` in `dishes-actions.ts`): il test dei vini copre Vini, Distillati e Bevande ma non Piatti; `piatti-ordine-100` entra nel 28d. La prova «può fallire» dell'agente riguarda solo il conteggio degli errori obbligatori e il pulsante «Mostra altri vini»: non tocca i punti deboli. **Non verificato**: `pnpm lint` completo. Durata dichiarata dall'agente circa 10 minuti (stima 120).

> **Decisione di Mirko, opzione C (2026-10-21)**: la verifica serve a provare (1) che la meccanica funzioni e (2) che la UI corrisponda al design già validato, senza controlli ripetitivi per l'umano. La ripresa del 28b (console e file di disponibilità su server di sviluppo) è **annullata**: quei controlli non servono né a (1) né a (2) (vedi policy §6). Questo passo copre solo l'obiettivo (1).
>
> **Limiti DURI**: motore (`e2e` senza `controlli/` e `smoke/`) al massimo **3.302 righe, cioè non deve crescere** (oggi 3.302; il passo toglie codice del server di sviluppo non più usato); spec (`e2e/controlli/` e `e2e/smoke/`) al massimo **1.550** (oggi 1.426, e tolti 228 di `dev-server.spec.ts`). Tetto V6 invariato: 4.350.

**Che cosa**: (a) sette controlli di Menù fissi e uno di Vini in Playwright: i due risultati non validi del 24d rifatti bene (`menu-fissi-elimina-senza-uso`, `menu-fissi-nomi-accessibili`), i due del nucleo rimasti fermi per il tetto (`menu-fissi-modulo-validazione`, `menu-fissi-disponibilita`) e i flussi `menu-fissi-porzione-traduzione`, `menu-fissi-servizi-piatti`, `menu-fissi-ordine-liste`; il limite di 100 record (`vini-ordine-100`: 101 vini, «Mostrati 100 vini su 101», «Mostra altri vini»). (b) la correzione di **una** asserzione di `scripts/verify-menu-6_2.ts`, incoerente con lo script stesso (V6a: lo script scrive la descrizione inglese sul piatto e poi la pretende vuota con `fallback-locale=none`; l'app è corretta). (c) la rimozione del codice del server di sviluppo lasciato dal 28b (`dev-server.spec.ts`, `dev-menu-server.ts`, `mirror-file.ts`, il monitor di console in `checks.ts` e `loginAppOnBase` se senza altri usi), con le voci di `wire-registry.json` per i controlli tolti.

**Prima di partire, tu** (nel Terminale, nella cartella del repo): il tuo albero ha il lavoro non committato della ripresa annullata; lo scarti.
```
git status --short
```
Deve mostrare esattamente queste cinque righe (se ne vedi altre, FERMATI e incollamele):
```
 M docs/piano-sviluppo/CHANGELOG.md
 M e2e/controlli/dev-server.spec.ts
 D e2e/lib/dev-menu-server.ts
?? docs/design/verifica/esiti/2026-10-21-V6b-r1/
?? docs/design/verifica/esiti/2026-10-21-V6b-r2/
```
Poi:
```
git restore docs/piano-sviluppo/CHANGELOG.md e2e/controlli/dev-server.spec.ts e2e/lib/dev-menu-server.ts
rm -rf docs/design/verifica/esiti/2026-10-21-V6b-r1 docs/design/verifica/esiti/2026-10-21-V6b-r2
git pull
git status --short
```
L'ultimo comando non deve stampare nulla.

**Quando e chi**: dopo il push del pacchetto con questa scheda; agente di verifica, chat nuova, **mai insieme a Composer**, una sola chat che modifica `e2e/`. **Stima**: 120 minuti; a 240 FERMATI e riporta (R10). **Cosa fai tu**: pulizia (prima riga del prompt); copia il prompt con `awk '/^### Passo 28c/{f=1} f&&/^\140\140\140text/{p=1;next} p&&/^\140\140\140/{exit} p' docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md | pbcopy` e incollalo **da solo** (oppure incolla il testo che ti do in chat); a fine passo incollami la risposta finale con la durata. **Commit e push**: nessun git dell'agente; committi tu dopo il mio controllo. **Messaggio di commit suggerito**: `test(e2e): passo 28c (V6c) — meccanica rimasta di Menù fissi, limite di 100 record, verify:menu-6_2, via il codice del server di sviluppo`.

```text
PASSO 28c (V6c): meccanica rimasta di Menù fissi, limite di 100 record e verify:menu-6_2. Rispondi in italiano. Sei l'agente di verifica: PROVI l'app, non la modifichi.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3000,3100,3200,3201,3202,3203,3300,3002,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a Composer.

CONTESTO. Riporta git rev-parse --short HEAD e git status --short (il secondo vuoto, altrimenti FERMATI). Database vma_vd_dev (solo il nome, mai DATABASE_URL). Mai produzione. Lanciatore scripts/ui-verify: NON usarlo.
Obiettivo del passo: provare la MECCANICA delle funzioni (non la UI, che si prova in altri passi). Decisione di Mirko (2026-10-21): le console in sviluppo e il file di disponibilità su server in memoria NON si provano più (policy §6): non scrivere test per quelli.
Policy: docs/design/verifica/policy-test.md (§3, §5, §6, §9, §11). Piano: schede 24d e 28c.

PERIMETRO. Puoi creare: e2e/controlli/vini.spec.ts. Puoi modificare: e2e/controlli/menu-fissi.spec.ts; e2e/lib/ (aggiunte, spostamenti e CANCELLAZIONI); e2e/controlli/wire-registry.json; scripts/verify-menu-6_2.ts (SOLO l'asserzione descritta al punto D, al massimo 15 righe toccate);
docs/piano-sviluppo/CHANGELOG.md (una voce Tests, al massimo 25 righe); una cartella NUOVA di esiti (E2E_ESITI). CANCELLA: e2e/controlli/dev-server.spec.ts, e2e/lib/dev-menu-server.ts, e2e/lib/global-message/mirror-file.ts e, se non hanno altri usi (cercali con grep e riporta
le righe tolte), il monitor di console in e2e/lib/checks.ts (attachConsoleMonitor, consoleMonitorSummary, assertConsoleMonitorClean, ConsoleMonitor) e loginAppOnBase in e2e/lib/login-dev.ts. VIETATO: app/, components/, lib/, collections/, globals/, altri scripts/, e2e/playwright.config.ts, e2e/global-setup.ts,
e2e/lib/kill-ports.ts, controlli-*.json, dipendenze, attesi e soglie dei controlli. Se un controllo ti sembra sbagliato: «controllo dubbio», non lo cambi.
LIMITI DURI: motore (e2e senza controlli/ e smoke/) al massimo 3.302 righe e NON deve crescere (con le cancellazioni deve scendere); spec (e2e/controlli/ e e2e/smoke/) al massimo 1.550. Conta con:
  find e2e -type f \( -name '*.ts' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path 'e2e/controlli/*' -not -path 'e2e/smoke/*' | xargs cat | wc -l
  find e2e/controlli e2e/smoke -type f \( -name '*.ts' -o -name '*.mjs' \) | xargs cat | wc -l
Raggiunto un limite: FERMATI e rispondi con ciò che hai; ciò che manca è NON PROVATO «tetto».

LEGGI: e2e/README.md; percorso-test-v2.md (R1–R10); e2e/controlli/menu-fissi.spec.ts e giorni-speciali.spec.ts (modelli di test già validi); e2e/lib/checks.ts (assertNoForbiddenEnglishInUi); i sette controlli in docs/design/verifica/controlli-6.6.json (campi passi e atteso: sono la tua fonte;
le costanti di lib/ si importano con '@/…', non si copiano) e le specifiche docs/design/schermate/menu-fissi/spec.md e vini/spec.md.

REGOLE SULLE ASSERZIONI (valgono per ogni test): (1) mai count() o innerText subito dopo un goto: aspetta lo stato con asserzioni che attendono (toBeVisible, toHaveCount, toHaveText) PRIMA di leggere; (2) i nomi accessibili si leggono dagli aria-label, non solo dal testo; (3) un expect.poll che può essere vero al primo controllo è vuoto;
(4) ogni verifica di assenza deve poter fallire: provala una volta rompendo temporaneamente l'atteso, riporta il FALLITO e ripristina; (5) nessuna chiamata sincrona in e2e/, nessun waitForTimeout come attesa di uno stato; (6) titoli `<id-del-controllo> [telefono-390-chiaro]` (per vini-ordine-100: [notebook-1280-chiaro]) dentro test.describe e commento // control:<id>; dati di prova con payload.nome(),
nomi «verify-ui-…», eliminati in try/finally anche se il test fallisce.

FAI, in quest'ordine:
A. PULIZIA: cancella i file elencati sopra. In wire-registry.json: TOGLI le voci dei controlli che ora hanno un test vero (menu-fissi-elimina-senza-uso, -nomi-accessibili, -modulo-validazione, -disponibilita); AGGIUNGI le voci «NON PROVATO: eccezione firmata da Mirko 2026-10-21, policy §6 (riduzione di V6)» per giorni-speciali-console, messaggio-globale-console, messaggio-globale-file-riceve-messaggio e messaggio-globale-pubblicazione, e usa lo stesso testo per menu-fissi-console; la voce di menu-fissi-testi resta, con motivo «28d (UI = design)».
   Controlla pnpm typecheck e pnpm e2e:wire subito dopo.
B. MENÙ FISSI (e2e/controlli/menu-fissi.spec.ts), nell'ordine: (1) menu-fissi-elimina-senza-uso: oggi è test.fixme con un count() senza attesa; rifallo con asserzioni che attendono il pulsante «Elimina <nome>»; in deroga a R4 del percorso v2, se dopo la correzione il pulsante non si trova, riportalo come POSSIBILE DIFETTO DELL'APP (con traccia di Playwright e DOM dell'elenco), non come
   ERRORE-STRUMENTO; (2) menu-fissi-nomi-accessibili: oggi test.fixme che legge innerText: rifallo con l'helper assertNoForbiddenEnglishInUi dopo aver atteso che l'elenco sia caricato (almeno una riga visibile); (3) menu-fissi-modulo-validazione; (4) menu-fissi-disponibilita; (5) menu-fissi-porzione-traduzione; (6) menu-fissi-servizi-piatti; (7) menu-fissi-ordine-liste (il controllo ha solo l'atteso: crea tre
   nomi che distinguono maiuscole, accenti e ordine alfabetico, e verifica l'ordine sia nella pagina sia nella lettura con la Local API). Sostituisci gli stub test.skip/fixme con i test veri. Usa i modelli già validi del file e di giorni-speciali.spec.ts.
C. VINI (e2e/controlli/vini.spec.ts, nuovo): vini-ordine-100 come da controllo (porta a 101 il numero TOTALE dei vini: il database di sviluppo ne ha già circa 90, crea solo quelli che mancano, con nomi «verify-ui-vini-bulk-NNN», e li elimini in try/finally; poi controlla che il conteggio finale sia quello iniziale). Leggi components/app/menu/catalog/ e lib/ e riporta se Piatti,
   Distillati e Bevande usano lo STESSO componente e lo STESSO limite di 100 (file e riga): serve a dire se un solo test copre i quattro cataloghi.
D. verify:menu-6_2: in scripts/verify-menu-6_2.ts lo script scrive la descrizione inglese «EN desc <tag>» sullo stesso piatto (circa riga 1632) e più avanti (circa righe 1791–1796) pretende che con fallback-locale=none la descrizione sia vuota. Diagnosi di V6a: per un piatto SENZA traduzione inglese, fallback-locale=none, null e false danno null e senza parametro ricade sull'italiano; l'app è corretta.
   Correggi SOLO l'asserzione: con none la REST deve restituire la descrizione inglese che lo script ha scritto (il valore esatto), non vuota; se il fixture lo permette aggiungi il caso senza traduzione, che deve dare null. Poi lancia pnpm verify:menu-6_2 UNA volta con pnpm dev acceso (le variabili sono nell'intestazione dello script; il dev va in un TERMINALE PERSISTENTE, un comando con & nella shell
   del tool muore subito dopo «Ready»; fermalo dopo). Atteso: OK. Se fallisce, riporta la PRIMA riga di errore e la classe di causa.
E. GIRO UNICO, tre FILE (mai --grep sul solo nome), con la cartella esiti $(date +%F)-V6c, solo rapporto.md e risultati.json (cancella ogni img/ e PNG):
   PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=$(date +%F)-V6c pnpm e2e e2e/controlli/menu-fissi.spec.ts e2e/controlli/vini.spec.ts
   (il prefisso va davanti a OGNI comando Playwright). Avanzamento: tail -f .next/e2e-progress.log. Se un test si blocca il runner lo uccide: non rilanciare il giro intero; per un singolo test usa il file e un --grep ristretto dentro lo stesso file.
F. VERIFICHE FINALI (riporta gli esiti): pnpm typecheck (radice ed e2e), pnpm lint a 0 errori e 0 warning nei file toccati, pnpm ui:check, pnpm e2e:wire; ps -wweo e lsof (porte 3000–3203, 3300, 3002 e 31997 libere, nessun next dev vivo); pnpm payload run e2e/scripts/count-verify-ui.ts a zero; conteggio dei vini uguale a prima del test;
   i due conteggi di righe (e quante righe hai tolto); git status --short con SOLO i file del perimetro e senza file di esito versionato modificato.

TRE CRITERI (riporta i numeri): (a) gli otto controlli (sette di Menù fissi più vini-ordine-100) hanno un esito misurato (OK, FALLITO o AVVISO) oppure un NON PROVATO con motivo e livello, e verify:menu-6_2 ha il suo esito; (b) zero ERRORE-STRUMENTO; (c) ambiente pulito come in F. I FALLITO dell'app non sono un motivo per rifiutare il passo: ognuno con controllo, misurato, atteso,
evidenza e gravità proposta (P o A, policy §5), senza cambiare controlli, app o soglie. GIT: NON fare git.
RISPOSTA FINALE: tabella «Esiti reali» (controllo, esito, secondi) con gli otto controlli e verify:menu-6_2; i FALLITO con gravità proposta; la prova «può fallire» della regola 4 per modulo-validazione e vini-ordine-100; la risposta alla domanda dei cataloghi (stesso componente e limite?); i due conteggi di righe e le righe tolte; il comando del giro; l'elenco dei file toccati,
cancellati e creati; il percorso della cartella degli esiti; il git status --short; la DURATA in minuti; quanti ERRORE-STRUMENTO.
```

### Passo 28d — V6d: completamento della meccanica del 28c e UI = design (cataloghi, Giorni speciali, Messaggio globale)

> **Esito (2026-10-21)**: 🔶 **chiuso con riserva** (`0dd2736` e `352cd08`; ripresa eseguita dopo che il primo giro aveva superato i limiti, motore 3.997). Stato finale: motore 4.046 su 4.100, spec 1.976 su 2.000. **Meccanica**: `modulo-validazione` (le quattro forme del prezzo, con prova «può fallire»), `vini-ordine-100` (ordine per gruppo di tipologia), `piatti-ordine-100`, `disponibilita`, `testi` e `colonna-elenco` OK; `porzione-traduzione` FALLITO per un difetto del test (lettura inglese con `fallbackLocale: false`, riga 485: il nome vuoto è il risultato atteso con quel parametro), corretto in una riga e da provare nel passo 29; la parte UI del test (un campo «Porzione» inglese con segnaposto italiano) era già OK. **Matrici** (969 prove): 791 OK, 9 FALLITO, 19 NON PROVATO, 150 ERRORE-STRUMENTO. Distillati e Bevande puliti (180 OK ciascuno). I 9 FALLITO sono un solo difetto (P1: pulsanti della conferma a 42 px). Gli ERRORE-STRUMENTO sono quasi tutti sei stati non preparabili (20 prove ciascuno): Vini `origine-senza-regioni`, `errore-geografia`, `errore-anno`; Giorni speciali `modulo-inglese-aperto`, `data-passata`; Messaggio globale `inglese-aperto` (eccezione firmata, policy §6). **Screenshot**: 37 prodotti, 13 MB, fuori dal repository; la chat di design ne ha confrontate 13 coppie con i mockup e ha scritto 5 P e 7 A in `esiti/2026-10-21-V6d-rilievi/rilievi.md`. Pulizia: `count-verify-ui` a zero (4 record residui ripuliti), baseline dei dati invariata. L'agente aveva classificato P due difetti del test e indicato la causa dei FALLITO senza misure; i misurati sono stati ricostruiti dai risultati. **Non verificato**: 24 coppie di screenshot non esaminate una per una; `pnpm lint` completo.

> **Perché è più piccolo del previsto** (policy §4: un esito L2 resta valido finché non cambia un file del raggio largo). **Non si rifanno**: Piatti (L2 del V2, e dopo `0c0f4e8` non è cambiato nessun file di `components/app/dishes`), home e shell (L2 del V1, nessun file di `components/app/shell` o della home cambiato), navigazione (`L1 navigazione,shell` del passo 24), Servizi e Menù fissi (matrice C1/C2/C3 e screenshot del T1e). **Si fanno**: Vini, Distillati e Bevande (la matrice non è mai stata eseguita sui cataloghi; `F-TOCCO` ha aggiunto il filtro «Stato» dopo gli screenshot del T1e), Giorni speciali e Messaggio globale (schermate nuove, mai passate da matrice né da screenshot).
>
> **Limiti DURI** (V6 resta sotto il tetto di 4.350 di motore): motore (`e2e` senza `controlli/` e `smoke/`) al massimo **3.576 righe** (oggi 3.276: +300); spec (`e2e/controlli/` e `e2e/smoke/`) al massimo **1.900** (oggi 1.545). Raggiunto un limite l'agente si ferma: ciò che manca è NON PROVATO «tetto», nell'ordine inverso delle priorità qui sotto.

**Che cosa**: (A) primo atto, **meccanica**: le quattro asserzioni più deboli del 28c (`menu-fissi-modulo-validazione`, `vini-ordine-100`, `menu-fissi-porzione-traduzione`, `menu-fissi-disponibilita`) più `piatti-ordine-100`. (B) matrice C1/C2/C3 sui tre cataloghi. (C) matrice su Giorni speciali e Messaggio globale. (D) screenshot degli stati dei mockup di cataloghi (solo `elenco`, `filtri`, `filtri-attivi`, dove è cambiato il filtro «Stato», più i tre mancanti di Vini), Giorni speciali e Messaggio globale. (E) `menu-fissi-testi` e `menu-fissi-colonna-elenco`. Il **confronto con i PNG dei mockup lo faccio io**, tu non guardi nulla.

**Quando e chi**: dopo il push del pacchetto con questa scheda; agente di verifica, chat nuova, **mai insieme a Composer**, una sola chat che modifica `e2e/`. **Stima**: 150 minuti; a 300 FERMATI e riporta (R10). **Cosa fai tu**: pulizia (prima riga del prompt); incolla il prompt **da solo**; a fine passo incollami la risposta finale con la durata; poi **carica in chat lo zip degli screenshot** che l'agente ti indica (sta fuori dal repository, sul Desktop). **Commit e push**: nessun git dell'agente; committi tu dopo il mio controllo. **Messaggio di commit suggerito**: `test(e2e): passo 28d (V6d) — meccanica completata, matrice e screenshot di cataloghi, Giorni speciali e Messaggio globale`.

```text
PASSO 28d (V6d): completamento della meccanica del 28c e UI = design (cataloghi, Giorni speciali, Messaggio globale). Rispondi in italiano. Sei l'agente di verifica: PROVI l'app, non la modifichi.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3000,3100,3200,3201,3202,3203,3300,3002,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a Composer.

CONTESTO. Riporta git rev-parse --short HEAD e git status --short (il secondo vuoto, altrimenti FERMATI). Database vma_vd_dev (solo il nome, mai DATABASE_URL). Mai produzione. Lanciatore scripts/ui-verify: NON usarlo. Policy: docs/design/verifica/policy-test.md (§3, §4, §5, §6, §9, §11). Piano: schede 28c e 28d.
Obiettivi: (1) la MECCANICA delle funzioni e (2) la UI = i mockup già validati dall'umano. Non provare console in sviluppo né file di disponibilità su server in memoria (eccezione firmata, policy §6). NON rifare Piatti, home, shell, navigazione, Servizi e Menù fissi (esiti ancora validi, policy §4: vedi scheda 28d).

PERIMETRO. Puoi creare: e2e/controlli/piatti.spec.ts; una spec di matrice per cataloghi, Giorni speciali e Messaggio globale modellata su e2e/controlli/servizi-menu-fissi-matrix.spec.ts (condividi i corpi dei test tramite un helper in e2e/lib/ invece di duplicarli); i moduli di preparazione degli stati (modellati su e2e/lib/menu-list/prepare-state.ts e e2e/lib/catalog/prepare-state.ts) per Giorni speciali e Messaggio globale; una spec di screenshot per Giorni speciali e Messaggio globale (modello catalog-screenshots.spec.ts).
Puoi modificare: e2e/controlli/menu-fissi.spec.ts, e2e/controlli/vini.spec.ts, e2e/controlli/catalog-screenshots.spec.ts, e2e/lib/ (aggiunte, spostamenti, cancellazioni), e2e/controlli/wire-registry.json, docs/piano-sviluppo/CHANGELOG.md (una voce Tests, al massimo 30 righe), cartelle NUOVE di esiti (E2E_ESITI).
VIETATO: app/, components/, lib/, collections/, globals/, scripts/, e2e/playwright.config.ts, e2e/global-setup.ts, e2e/lib/kill-ports.ts, controlli-*.json, dipendenze, attesi e soglie dei controlli. Se un controllo ti sembra sbagliato: «controllo dubbio», non lo cambi.
LIMITI DURI: motore (e2e senza controlli/ e smoke/) al massimo 3.576 righe; spec (e2e/controlli/ e e2e/smoke/) al massimo 1.900. Conta con:
  find e2e -type f \( -name '*.ts' -o -name '*.mjs' \) -not -path '*/node_modules/*' -not -path 'e2e/controlli/*' -not -path 'e2e/smoke/*' | xargs cat | wc -l
  find e2e/controlli e2e/smoke -type f \( -name '*.ts' -o -name '*.mjs' \) | xargs cat | wc -l
Controllali dopo ogni blocco di lavoro. RAGGIUNTO UN LIMITE: FERMATI e rispondi con ciò che hai; ciò che manca è NON PROVATO «tetto». Priorità, dalla più alta: A, B, C, D, E, F.

LEGGI: e2e/README.md; percorso-test-v2.md (R1–R10); e2e/controlli/servizi-menu-fissi-matrix.spec.ts, catalog-screenshots.spec.ts, menu-fissi.spec.ts, vini.spec.ts, giorni-speciali.spec.ts, messaggio-globale.spec.ts; e2e/lib/checks.ts, matrix-projects.ts, theme.ts, screenshot-frame.ts, menu-list/ e catalog/ (states, prepare-state, config);
docs/design/verifica/controlli-6.6.json (schermate vini, distillati, bevande, giorni-speciali, messaggio-globale: i campi stati_c1_c2 e immagini.stati_con_riferimento, e i controlli comuni C1, C2, C3), docs/design/verifica/misura-tocco.md, e docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md (schede 24d e 28c).

REGOLE SULLE ASSERZIONI (valgono per ogni test): (1) mai count() o innerText subito dopo un goto: aspetta lo stato con asserzioni che attendono PRIMA di leggere; (2) i nomi accessibili si leggono dagli aria-label; (3) un expect.poll o un'asserzione che può essere vera prima che il cambiamento avvenga è vuota (un «non c'è l'errore» va provato DOPO aver provocato la validazione, con un'altra prova che la validazione sia girata); (4) ogni verifica di assenza deve poter fallire: provala una volta rompendo temporaneamente l'atteso;
(5) nessuna chiamata sincrona in e2e/, nessun waitForTimeout come attesa di uno stato; (6) titoli `<id-del-controllo> [profilo-tema]` dentro test.describe e commento // control:<id>; dati di prova con payload.nome(), nomi «verify-ui-…», eliminati in try/finally; giorni speciali solo su menù fissi «verify-ui-…», date 2099 e 2001; il Global menu-general si salva prima e si ripristina in try/finally.
(7) In una matrice ogni test dichiara lo stato, prepara lo stato con assertPrepared e verifica che sia visibile (assertStateVisible) PRIMA di misurare: una misura su una pagina non pronta è ERRORE-STRUMENTO, non un OK.

FAI, in quest'ordine:
A. PRIMO ATTO, meccanica (giro 1: menu-fissi.spec.ts vini.spec.ts piatti.spec.ts):
   A1. menu-fissi-modulo-validazione: oggi «le quattro forme del prezzo sono accettate» NON è provato (dopo fill si controlla subito l'assenza di un errore che non c'era mai stato). Per ognuna delle forme valide (18, 18,5, 18,50, 18.50): compila, premi «Salva», e verifica che l'errore del prezzo NON compaia mentre almeno un altro errore (per esempio «Scegli una categoria.») compare, a prova che la validazione è girata. Le forme rifiutate («abc», «18,555») restano.
   A2. vini-ordine-100: aggiungi il conteggio delle righe (esattamente 100 prima di «Mostra altri vini», il totale dopo) e l'ordine per nome dei primi record con Intl.Collator('it', { sensitivity: 'base' }) (non con il comparatore dell'app, per non fare una prova tautologica).
   A3. menu-fissi-porzione-traduzione: il menù di prova deve avere almeno DUE piatti; nella traduzione inglese il numero di campi «Porzione» deve essere ESATTAMENTE uno (quello del piatto con la porzione italiana) e il suo segnaposto deve essere la porzione italiana; la lettura in inglese senza traduzione ricade sull'italiano anche per nome e descrizione. (Il vecchio .first() con toHaveCount(1) era sempre vero: toglilo.)
   A4. menu-fissi-disponibilita: dopo aver disabilitato la categoria, leggi con la Local API che i menù della categoria restano collegati (stessa categoria, stesso numero di menù) e che dopo la riabilitazione lo sono ancora.
   A5. piatti-ordine-100 (e2e/controlli/piatti.spec.ts, nuovo, [notebook-1280-chiaro]): come vini-ordine-100 ma per Piatti (percorso di lista diverso: components/app/dishes/dishes-page.tsx, limit 100 in app/(app)/app/(shell)/menu/dishes-actions.ts): porta il numero TOTALE dei piatti a 101 (il database ne ha circa 44: crea solo quelli che mancano, «verify-ui-piatti-bulk-NNN», elimina in try/finally e controlla il conteggio finale), righe 100 poi totale, avviso e pulsante come da controllo piatti-ordine-100 nel JSON, ordine per nome.
   Per A1 e A2 la regola 4: rompi temporaneamente l'atteso (per esempio metti '18,555' tra i valori validi; per i vini aspetta 99 righe), riporta il FALLITO, ripristina.
B. MATRICE DEI CATALOGHI (giro 2): estendi la matrice a vini, distillati e bevande con gli stati di stati_c1_c2 che non siano simulati, vuoti o da bulk (nonProvatoReason di e2e/lib/catalog/states.ts li esclude: aggiungi matrixStates come per menu-list). Controlli: C1 (scroll orizzontale a 390 e 1280, chiaro e scuro), C2 (tocco minimo 44 px a 390 chiaro e scuro; altezza con il mouse a 1280), C3 (classe del tema, assenza di lampo a scuro, cambio del tema di sistema) con gli stessi progetti e le stesse funzioni di checks.ts della matrice di Servizi e Menù fissi. Uno stato che non riesci a preparare è NON PROVATO con il motivo, non ERRORE-STRUMENTO silenzioso.
C. MATRICE DI GIORNI SPECIALI E MESSAGGIO GLOBALE (giro 2): lo stesso per gli stati di stati_c1_c2 che si raggiungono senza simulazioni (Giorni speciali: elenco, modulo, modulo-menu, modulo-inglese-aperto, nuovo, nuovo-errori, sovrapposizione, data-passata, elimina; Messaggio globale: elenco, modificato, inglese-aperto, file-non-leggibile, nessun-messaggio, togli). Niente stati con pubblicazione, errore-caricamento, caricamento lento e errore-azione: sono simulati (28e) o eccezione firmata.
D. SCREENSHOT (giro 3): dove il controllo comune lo richiede, salva gli screenshot degli stati con riferimento in e2e (immagini.stati_con_riferimento) per: vini, distillati e bevande SOLO gli stati elenco, filtri e filtri-attivi (il filtro «Stato» è cambiato dopo gli screenshot del T1e) e, per vini, anche origine-senza-regioni, errore-geografia ed errore-anno; Giorni speciali e Messaggio globale TUTTI gli stati con riferimento che si raggiungono (non i simulati). Nomi file come screenshotFileName di e2e/lib/*/states.ts, così si abbinano ai PNG di riferimento di docs/design/schermate/<schermata>/.
   A fine giro SPOSTA la cartella img/ FUORI dal repository: mv docs/design/verifica/esiti/<cartella>/img "$HOME/Desktop/v6d-screenshots" (una sottocartella per schermata), poi crea lo zip: cd "$HOME/Desktop" && zip -rq v6d-screenshots.zip v6d-screenshots e riporta la dimensione. Se supera 25 MB converti i file in JPEG qualità 85 con sips e rifai lo zip. Nella cartella degli esiti restano SOLO rapporto.md e risultati.json: niente img/ né PNG.
E. MENU FISSI (giro 1 o 3): menu-fissi-testi (titolo, descrizione, pulsanti, testi dei gruppi come da campo atteso, con le costanti di lib/) e menu-fissi-colonna-elenco (misura come da controllo, con il dato 137 px e il minimo 100 px del modello piatti-colonna-elenco se il controllo li richiama). Togli le loro voci dal wire-registry.json.
F. SOLO se restano righe nei limiti: per Menù fissi gli screenshot mancanti scegli-piatti (390 e 1280), visibilita-categoria e visibilita-avviso, dove prepareMenuListState supporta lo stato (altrimenti NON PROVATO con motivo).
G. GIRI. Il prefisso PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright va davanti a OGNI comando Playwright; ogni giro ha la sua cartella E2E_ESITI=$(date +%F)-V6d-gN (N = 1, 2, 3) con solo rapporto.md e risultati.json. Comandi, sempre con i FILE e senza --grep sul solo nome:
   giro 1: E2E_SUITE=controlli pnpm e2e e2e/controlli/menu-fissi.spec.ts e2e/controlli/vini.spec.ts e2e/controlli/piatti.spec.ts
   giro 2: E2E_SUITE=controlli pnpm e2e <la spec di matrice nuova>
   giro 3: E2E_SUITE=controlli pnpm e2e e2e/controlli/catalog-screenshots.spec.ts <la spec di screenshot nuova>
   Avanzamento: tail -f .next/e2e-progress.log. Se un test si blocca il runner lo uccide: non rilanciare il giro intero; per un singolo test usa il file e un --grep ristretto dentro lo stesso file. I FALLITO sono risultati: riporta per ognuno schermata, stato, profilo e tema, controllo, misurato, atteso, evidenza e gravità proposta (P o A, policy §5); non cambiare controlli, app o soglie.
H. VERIFICHE FINALI (riporta gli esiti): pnpm typecheck (radice ed e2e), pnpm lint a 0 errori e 0 warning nei file toccati, pnpm ui:check, pnpm e2e:wire; ps -wweo e lsof (porte 3000–3203, 3300, 3002 e 31997 libere, nessun next dev vivo); pnpm payload run e2e/scripts/count-verify-ui.ts a zero; i conteggi di vini, piatti, distillati e bevande uguali a prima dei test; Global menu-general ripristinato; i due conteggi di righe; git status --short con SOLO i file del perimetro e senza file di esito versionato modificato né img/ nel repository.

TRE CRITERI (riporta i numeri): (a) i sei punti di A hanno un esito misurato; per le matrici ogni schermata ha il conteggio OK, FALLITO, NON PROVATO (con motivo) e ERRORE-STRUMENTO per stato e progetto, e gli screenshot sono quelli del piano (prodotti su attesi); (b) ERRORE-STRUMENTO al massimo 3 per schermata e nessuno in A; se ne superi 3 FERMATI su quella schermata; (c) ambiente pulito come in H.
I FALLITO dell'app non sono un motivo per rifiutare il passo. GIT: NON fare git.
RISPOSTA FINALE: tabella «Esiti reali» di A1–A5 (esito, secondi) con la prova della regola 4 per A1 e A2; per ogni schermata (vini, distillati, bevande, giorni-speciali, messaggio-globale) i conteggi della matrice per C1, C2, C3; l'elenco dei FALLITO con gravità proposta; i NON PROVATO con motivo; il numero di screenshot prodotti e mancanti per schermata, il percorso e la dimensione dello zip; menu-fissi-testi e menu-fissi-colonna-elenco; i due conteggi di righe e se hai raggiunto un limite; i tre comandi dei giri; l'elenco dei file toccati, cancellati e creati; le cartelle degli esiti; il git status --short; la DURATA in minuti; quanti ERRORE-STRUMENTO.
```

### Passi 28e–28f — il resto di V6 (indicazioni; i prompt si scrivono uno alla volta)

Ogni passo è una chat nuova dell'agente di verifica, con i **suoi tre criteri** e **un solo obiettivo**. Il prompt lo scrive la chat di design dopo l'esito del precedente. In tutti: `PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright` davanti a ogni comando Playwright; il server di sviluppo, quando serve, si avvia a mano su una porta fuori da `E2E_PORTS` (3300) in un **terminale persistente**; esiti in una cartella nuova per giro; nessun lanciatore; i FALLITO sono risultati (P o A), non si cambiano controlli né app; **limiti di righe duri**; non si fa mai git dall'agente.

**Decisione di Mirko sul motore (2026-10-20): approvato il tetto duro di 4.350 righe di motore per tutto V6.** Dopo l'opzione C la crescita prevista è molto minore: il motore è sceso con la pulizia del 28c (3.276) e i limiti per passo sono 28d +300 (3.576), 28e +250, 28f 0 (scende). Ogni prompt fissa il suo limite duro; raggiunto un limite l'agente si ferma.

| Passo | Obiettivo | Controlli e ambiente |
|---|---|---|
| ~~**28e**~~ | **Non si fa** (decisione di Mirko, 2026-10-21; si riapre se i test umani rilevano problemi) | Era: stati di errore e di caricamento, uno per tipo di schermata, e passata WebKit; vedi policy §6 |
| **28f** | Pulizia: cancellazione del lanciatore `scripts/ui-verify` | 16 file di riferimento fuori dagli esiti (regole `.cursor`, `package.json`, documenti di design e di piano, `e2e/lib/menu-payload-run.ts` e `e2e/lib/menu-list/states.ts`, che usano ancora il demone dei dati di prova `scripts/ui-verify/menu-payload.ts`: va portato in `e2e/` prima di cancellare). Nessun test nuovo; rapporto di chiusura di V6 |

**Ordine e regole**: 28c → 28d → 28e → 28f, poi il passo 29 (rilievi e correzioni) solo se un giro produce FALLITO. Un esito L2 resta valido finché non cambia un file del raggio largo (policy §4): ciò che 28–28e provano non si rifà. Lo stato vuoto e «accesso senza ruolo» restano NON PROVATO (li copre `scripts/verify-roles-8_3.ts`). Se un passo supera il doppio della stima (R10) si ferma e riporta.

### Passo 29 — F6: correzione dei cinque rilievi P della verifica V6d

> **Esito (2026-10-21)**: ✅ `41b9092` (Composer, circa 32 minuti, base `69fafbc`). P2, P3, P4, P5 corretti come da rilievo; **P1 era una misura sbagliata**: lo zoom di apertura della finestra portava la scala al 95 % mentre C2 misurava (288×44 → 274×42), non un difetto dell'app; corretto togliendo lo zoom da `components/ui/alert-dialog.tsx` e passando i pulsanti a `size="lg"` (deviazione D6 annotata in `installazione-componenti-ui.md`; errore di classificazione della chat di design). Verificato: `typecheck`, ESLint a zero warning, `ui:check`, `e2e:wire`, 130 test di `lib/`; giro (a) 29 OK, 2 skipped, 0 FALLITO; giro (b) C2 163 OK, 0 FALLITO; screenshot di Giorni speciali confrontati con i mockup. Limite di 80 righe di app superato (107): dichiarato dall'agente, non bloccante. Esiti in `esiti/2026-10-21-F6a`, `-F6b`, `-F6c`. **Non verificato dalla chat di design**: i test Playwright e `pnpm lint` completo (i numeri dei giri sono dell'agente).

> **Riscritto il 2026-10-21.** I rilievi li ha già assegnati la chat di design (`docs/design/verifica/esiti/2026-10-21-V6d-rilievi/rilievi.md`): cinque P e sette A. Il prompt non ha segnaposti, **non ha Parte A** (perimetro chiuso e cause già lette nel codice: per risparmiare un giro; si ferma da solo se la causa è diversa) e **non usa il lanciatore** (L1 con i test Playwright già esistenti). Include anche la prova del test `menu-fissi-porzione-traduzione`, corretto nel pacchetto del 2026-10-21 (una lettura inglese con `fallbackLocale: false` dava un nome vuoto: difetto del test).

**Chi**: Composer, chat nuova, **mai insieme a un agente di verifica**. **Quando**: dopo il push del pacchetto che contiene questa scheda e i rilievi. **Cosa fai tu**: pulizia (prima riga del prompt); incolla **solo** il prompt qui sotto (non il Blocco comune); a fine passo incollami la risposta finale, poi carica `~/Desktop/v6f-screenshots.zip` (lo crea Composer, sta fuori dal repository). Il commit lo fa Composer in locale; il push lo fai tu dopo il mio controllo.

```text
Sei Composer nel repository VMA VD (Payload CMS e Next.js). Chat F6: correzione dei cinque rilievi P della verifica V6d. Fai solo questo. Le regole di .cursor/rules si caricano da sole. Rispondi in italiano.

PRIMA, in un terminale: pkill -f "next dev"; pkill -f "menu-payload"; lsof -nP -iTCP:3000,3100,3200,3201,3202,3203,3300,3002,31997 -sTCP:LISTEN | tail -n +2;
rm -f .next/e2e.lock .next/ui-verify.lock  (se lsof stampa ancora qualcosa, kill del PID). Un solo giro alla volta, mai insieme a un agente di verifica.

LEGGI per intero: docs/design/verifica/esiti/2026-10-21-V6d-rilievi/rilievi.md (P1–P5 con misurato e atteso, e gli A che NON si toccano); docs/design/schermate/giorni-speciali/spec.md (sezioni «Testi» e «Layout»); i mockup docs/design/schermate/giorni-speciali/390-chiaro.png, 390-modulo-chiaro.png, 390-elimina-chiaro.png, 1280-chiaro.png; docs/design/verifica/misura-tocco.md.
Riporta git rev-parse --short HEAD e git status --short (il secondo vuoto, altrimenti FERMATI). Mai produzione. Lanciatore scripts/ui-verify: NON usarlo.

REGOLE
1. Correggi SOLO P1–P5. Non toccare gli A, i controlli, le soglie, le specifiche, docs/design/**, e2e/, scripts/. Nessuna nuova dipendenza, nessuna migrazione, nessun colore o misura fuori dai token, nessuna eccezione ui-check-allow. Se un P ti sembra un controllo dubbio o una specifica sbagliata, dillo e non correggerlo.
2. NIENTE Parte A. Se la causa che trovi nel codice è diversa da quella scritta in rilievi.md, o serve toccare altro, FERMATI e riportalo PRIMA di scrivere.
3. LIMITE DURO: al massimo 80 righe di codice dell'app (components/, app/, lib/) toccate in totale; oltre FERMATI.
4. Cause già lette: P1 i pulsanti «Indietro» e «Elimina»/«Togli» della finestra di conferma misurano 274×42 (cerca il componente con grep di «Indietro» in components/app e components/ui/alert-dialog.tsx; un solo punto di correzione se è lo stesso; Servizi e Menù fissi risultavano conformi al T1e: capisci perché e riporta la differenza). P2 components/app/special-days/special-day-form-sheet.tsx riga ~300: il piè di foglio usa `flex w-full flex-col gap-2 sm:flex-row sm:justify-end`; gli altri fogli usano SheetFooter con `flex-row gap-2` e «Salva» a sinistra, «Annulla» a destra (come il mockup). P3 la riga «Messaggio: …» della tabella non è troncata: tronca con i puntini dentro la colonna Data. P4 nella scheda a telefono azioni (interruttore «Attivo», matita, cestino) devono stare su UNA riga e non andare a capo. P5 il giorno della settimana va in minuscolo dentro le frasi («di domenica 12 luglio 2099», sottotitolo «mercoledì 8 luglio 2099»); nell'elenco resta maiuscolo come nel mockup.
5. VERIFICHE (nessun lanciatore): L0: pnpm typecheck, pnpm lint, pnpm ui:check e i test unitari di lib/ (node --import ./scripts/node-test-resolve.mjs --experimental-strip-types --test $(git ls-files 'lib/**/*.test.ts')). Poi i test Playwright già esistenti, con il prefisso PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright davanti a OGNI comando:
   (a) flussi: PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=$(date +%F)-F6a pnpm e2e e2e/controlli/giorni-speciali.spec.ts e2e/controlli/messaggio-globale.spec.ts e2e/controlli/menu-fissi.spec.ts e2e/controlli/vini.spec.ts e2e/controlli/piatti.spec.ts
       Atteso: tutti OK, compreso menu-fissi-porzione-traduzione (il test è già corretto: se fallisce, riporta MISURATO e ATTESO; non cambiarlo).
   (b) tocco: PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=$(date +%F)-F6b pnpm e2e e2e/controlli/catalog-matrix.spec.ts e2e/controlli/giorni-messaggio-matrix.spec.ts --grep C2
       Atteso: i 9 FALLITO C2 di prima (Vini, Distillati, Bevande, Giorni speciali, Messaggio globale: «Indietro» e «Elimina»/«Togli» a 42 px) diventano OK; gli ERRORE-STRUMENTO (stati che la matrice non riesce a preparare: vini origine-senza-regioni, errore-geografia, errore-anno; giorni-speciali modulo-inglese-aperto, data-passata; messaggio-globale inglese-aperto) restano invariati e NON sono regressioni.
   (c) schermate: PLAYWRIGHT_BROWSERS_PATH=$HOME/Library/Caches/ms-playwright E2E_SUITE=controlli E2E_ESITI=$(date +%F)-F6c pnpm e2e e2e/controlli/special-global-screenshots.spec.ts
       A fine giro SPOSTA img/ FUORI dal repository: mv docs/design/verifica/esiti/<cartella>/img "$HOME/Desktop/v6f-screenshots", poi cd "$HOME/Desktop" && zip -rq v6f-screenshots.zip v6f-screenshots e riporta la dimensione (sopra 25 MB converti in JPEG qualità 85 con sips). Nelle cartelle degli esiti restano SOLO rapporto.md e risultati.json: niente img/ né PNG.
   Al massimo due giri per ogni comando: al terzo FERMATI e riportami. Non modificare mai i test, i controlli o le soglie. Subito dopo, git checkout -- docs/design/verifica/esiti se un giro ha toccato file versionati.
6. FERMATI e riferisci, senza aggirare, se serve un passaggio fuori dal codice o manca un ambiente.
7. CHIUSURA. Prima del commit: pnpm typecheck e pnpm lint sull'INTERO repo. Voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]: cosa era sbagliato e cosa è cambiato, comprensibile senza questa chat. Commit locale (git add + git commit, messaggio che nomina la chat F6); MAI git push. Nella tabella degli stati di docs/piano-sviluppo/esecuzione-6.6-prompt-e-controlli.md segna la riga del passo 29 con «🔶 fatto, da controllare» (solo quella riga) nello stesso commit.
8. RISPOSTA FINALE: tabella «Esiti reali» con un rigo per P1–P5 (corretto o non corretto, con evidenza: file e righe toccati); i tre giri (a), (b), (c) con i conteggi OK, FALLITO e ERRORE-STRUMENTO; la differenza trovata per P1 tra le schermate nuove e Servizi e Menù fissi; il numero di righe di codice dell'app toccate; il percorso e la dimensione dello zip; git show --stat del commit; la DURATA in minuti.
```

**Quando Composer ha chiuso**: incollami qui la risposta finale e carica `~/Desktop/v6f-screenshots.zip`. Io controllo il commit con clone fresco, confronto gli screenshot di Giorni speciali con i mockup (P2–P5), e ti do il pacchetto di stato che chiude V6 (28b–28d e 29).

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

## 8. Serie T — Percorso di test v2 (schede in ordine ascendente: T0, T1a, T1b, T1c, T1d, T2a, T2b, T2c, T3, T4)

Tabella e ordine di esecuzione: sezione 2.1. Regole, architettura e criteri: `docs/design/verifica/percorso-test-v2.md`.

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

> **Decisione (2026-10-20)**: **ELIMINATO**. Piatti ha L2 e confronto visivo chiusi (V2 quater); home e navigazione hanno L1 OK; dopo di allora nessun file del raggio largo è cambiato (policy-test §4). Non eseguire.

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

### Passo T1b — Controlli comuni, console e screenshot: Vini, Distillati e Bevande

> **Decisione (2026-10-20)**: **ASSORBITO in T1e, Parte B**. Vini, Distillati e Bevande non hanno mai avuto un confronto con le demo (i loro screenshot del 18 ottobre sono precedenti a F3 e F-SEL e quelli dei fogli sono stati scattati a metà animazione). Non eseguire questa scheda.

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

> **Decisione (2026-10-20)**: **CHIUSO**: la struttura è in repo; gli screenshot di Servizi e Menù fissi li produce T1e (Parte A). Non rieseguire.

> **Esito (2026-10-19)**: 🔶 **non accettato**, struttura in repo (`0bb6847`). Controllato io: `pnpm typecheck` completo a 0 errori in un checkout pulito, ESLint a 0 errori, nessuna chiamata vietata in `e2e/`, nessun file fuori da `e2e/` e `docs/` salvo `package.json` (script `e2e:t1c`). Misure dell'agente: 62 OK, **0 FALLITO**, 8 ERRORE-STRUMENTO, 14 screenshot su 45, circa 11,4 minuti senza completare il giro (criterio: meno di 10 minuti, 45 screenshot, zero ERRORE-STRUMENTO). **Cause** (tutte dello strumento, nessun difetto dell'app): (1) **nomi dei record uguali tra i worker**, contro la regola R5 («`verify-ui-<giro>-w<worker>-<nome>`»): record duplicati e «strict mode violation» su Modifica ed Elimina; (2) gli stati «caricamento» ed «errore-caricamento» richiedono un `next dev` (le simulazioni sono spente con `NODE_ENV=production` per progetto) che si avvia dentro il test e supera i 60 secondi; (3) circa 1442 NON PROVATO sono combinazioni di profilo e tema che il test salta invece di non generare; (4) la suite di fumo impiega circa 2 minuti di tempo reale (criterio R8: meno di 60 secondi) perché setup e teardown lanciano `pnpm payload run`. Si chiude con T1d.

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

### Passo T1d — Chiusura di T1c (già «T1c bis»): fixture isolate, simulazioni dedicate, setup in-process

> **Decisione (2026-10-20)**: **CHIUSO**: il resto passa a T1e (screenshot) e a V6 (simulazioni). Non rieseguire.

> **Esito finale di T1d (2026-10-20)**: 🔶 **chiuso al tetto** (`cf754c5`, circa 90 minuti dall'inizio); il resto passa a **T1e**. Controllato io: `pnpm typecheck` completo a 0 errori, ESLint senza errori, nessuna chiamata vietata, nessun file fuori da `e2e/` e `docs/`. **Meglio**: fumo in **8,75 secondi** (criterio: 60), fixture per worker, nessun test saltato senza motivo, `assertPrepared` per le preparazioni; checkpoint di Servizi: **162 OK, 0 ERRORE-STRUMENTO**, 1 FALLITO. **Non accettato**: giro completo non fatto (nessun doppio giro sotto 10 minuti, screenshot non prodotti: nessun PNG nel commit, giri di Menù fissi non eseguiti). **Il FALLITO** (`@sim/ servizi/errore-caricamento`, timeout su «Impossibile caricare») non è un difetto dell'app: la pagina Servizi mostra l'errore quando `shouldSimulateMenuLoadError()` è vero, e il titolo corrisponde (`Impossibile caricare i servizi`); il problema è che la variabile non arriva al server di prova. **Deviazione che non accetto**: per avere più dev server insieme l'agente ha usato `git worktree add --detach` (`e2e/lib/sim-worktree.ts`): copie del repository senza `.env` (ignorato da git), probabile causa dell'errore, con registrazioni di worktree da ripulire; il Seguito 1 chiedeva un solo dev server per gruppo, in sequenza. T1e lo rifà in modo semplice.

> **Esito del primo giro (2026-10-20)**: 🔶 **non accettato** (`05619f5`). Controllato io: `pnpm typecheck` completo a 0 errori in un checkout pulito, ESLint senza errori, nessuna chiamata vietata in `e2e/`, nessun file fuori da `e2e/`, `docs/` e `package.json`. **Fatto**: fixture per worker con `nome()` (R5), setup e teardown in-process, `time pnpm e2e:smoke` in **10 secondi** (criterio: 60), test solo per le combinazioni previste. **Misure**: giro completo 392 s, 409 OK, 73 «falliti», **28 screenshot su 45**; checkpoint di Servizi 159 s, 141 OK, 1 FALLITO, 1 ERRORE-STRUMENTO. **Il FALLITO di Servizi non è un difetto dell'app**: i pulsanti della conferma misurano 274×42 e 274/288 e 42/44 valgono entrambi 0,95, la scala dell'animazione di apertura (`zoom-in` al 95 %); la misura avviene prima della fine dell'animazione (è già successo nel vecchio lanciatore, risolto allora con una misura «stabile»); `fixtures/touch.ts` non aspetta le animazioni. **Scoperta dell'agente**: Next.js consente un solo `next dev` per repository, quindi tre server paralleli per le simulazioni non si possono avere.
>
> **Seguito 1 (da incollare nella stessa chat, 2026-10-20)**:
>
> ```text
> Continua T1d in questa chat, con queste correzioni (diagnosi della chat di design).
> 1. C2 sulle conferme di eliminazione: il FALLITO 274×42 NON è un difetto dell'app: 274/288 e 42/44 valgono 0,95, la scala
>    dell'animazione di apertura della finestra (zoom-in al 95 %). La misura avviene prima della fine dell'animazione. In
>    fixtures/touch.ts, e in ogni misura su finestre, fogli e menu, aspetta prima che le animazioni dell'elemento siano finite:
>    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)))) più un
>    frame (requestAnimationFrame), e solo dopo misura. Atteso: 288×44.
> 2. Simulazioni: un solo next dev per repository, quindi NON un server per stato. Raggruppa per CONFIGURAZIONE in quattro gruppi
>    seriali, ciascuno con UN dev server avviato una volta (fuori dal tempo dei test, tempo massimo 180 secondi, riscaldamento con
>    login e visita delle rotte): (a) APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS=3000, tutti gli stati «caricamento» di tutte le schermate
>    coperte; (b) APP_MENU_DEV_SIMULATE_LOAD_ERROR=1, tutti gli «errore-caricamento»; (c) APP_MENU_DEV_SIMULATE_SAVE_ERROR=1, tutti
>    gli «errore-azione»; (d) nessuna simulazione: i controlli di console in sviluppo. In totale QUATTRO avvii del dev server per
>    l'intera suite, mai uno per stato; chiusura sicura (SIGINT, SIGTERM e teardown) e porte controllate.
> 3. Disciplina degli esiti (R4): 73 falliti sono troppi e dici che molti sono di strumento o di preparazione. Un'eccezione fuori
>    da un'asserzione (selettore non trovato, preparazione non riuscita, timeout) è ERRORE-STRUMENTO, NON FALLITO. FALLITO solo con
>    misurato e atteso entrambi definiti e diversi. Nel rapporto raggruppa i 73 per causa con una tabella (stato, controllo, causa,
>    classificazione) e riclassificali nel reporter.
> 4. Menù fissi: sistema la preparazione degli stati (visibilita-categoria, visibilita-avviso, scegli-piatti, eliminato e quelli
>    che risultano in errore) con un'asserzione di conferma; se uno stato non si può preparare, NON PROVATO con il motivo.
> 5. Accettazione invariata: due giri di fila sotto 10 minuti con lo stesso esito, 45 screenshot (17 servizi e 28 menu-fissi, salvo
>    gli stati NON PROVATI per il database popolato), zero ERRORE-STRUMENTO, fumo sotto 60 secondi, typecheck e lint dell'intero
>    repo, ps e lsof puliti. Tetto: 120 minuti totali dall'inizio di T1d; a 120 FERMATI e riporta. Non fare git.
> ```

**Quando**: ora. **Incolla in Cursor**, in una chat nuova: **solo il prompt qui sotto** (non il Blocco comune). **Prima, in un terminale**: `pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-` (pulisce i record rimasti dal giro incompleto). **Stima**: 60 minuti, con un checkpoint dopo 30 (solo Servizi); **tetto**: 120 minuti.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1d. Chiudi T1c: oggi la suite di Servizi e Menù
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

**Quando Cursor ha finito**: incollami il resoconto; eseguo io `tsc`, ESLint e la ricerca delle chiamate vietate. Commit `test(e2e): T1d — fixture per worker, simulazioni dedicate, setup in-process; screenshot di Servizi e Menù fissi`, push (con gli screenshot: `git add e2e docs`), «push fatto». Poi faccio io il confronto visivo (C10).


### Passo T1e — Screenshot per il confronto visivo: Servizi, Menù fissi e cataloghi

> **Esito (2026-10-20)**: ✅ `853a1e5`. Controllato io: `pnpm typecheck` a 0 errori, ESLint senza errori, nessuna chiamata vietata, nessun worktree, nessun file fuori da `e2e/`, `docs/` e `package.json`. **81 screenshot su 88 attesi** (Servizi 13/13, Distillati 16/16, Bevande 16/16, Menù fissi 18/22, Vini 18/21); i fogli ora si vedono scorsi alla sezione (`modulo-piatti`, `modulo-servizi`). Giro di Servizi: 155 OK, 0 FALLITO; il giro completo ha dato 116 ERRORE-STRUMENTO e **4 FALLITO sul tocco delle schede di Menù fissi** (A6). Confronto visivo: vedi `esiti/2026-10-19-T1c/rilievi.md` e 2.3.

**Perché (2026-10-20)**: il confronto visivo sui 28 screenshot di Servizi e Menù fissi ha trovato sette difetti veri dell'app; Vini, Distillati e Bevande non hanno **mai** avuto un confronto con le demo, e quelli del 18 ottobre non servono (precedenti a F3 e F-SEL; i fogli sono stati scattati a metà animazione). Questo passo produce gli screenshot che mancano per **tutte e cinque le schermate**, dopo F4. **Tre criteri**, non sette; tempi e perfezione dello strumento sono obiettivi. Simulazioni (caricamento, errore di caricamento, errore dell'azione): NON PROVATO, le riprova V6. **Quando**: dopo F4 (passo 21), **con F4 già pushato** e Composer fermo. **Chi**: agente di verifica; **non gira insieme a F4**. **Stima**: 90 minuti; **tetto**: 120.

**Prima, in un terminale** (pulizia dei worktree e dei server rimasti da T1d):
```
cd /Users/mirko/Documents/GitHub/vma_vd-backend-backoffice; pkill -f "next dev"; for w in $(git worktree list --porcelain | awk '/^worktree /{print $2}' | grep sim-isolates); do git worktree remove --force "$w"; done; git worktree prune; git worktree list; lsof -nP -iTCP:3100,3200,3201,3202,3203 -sTCP:LISTEN | tail -n +2; rm -f .next/e2e.lock
```
Se resta un listener sulla 3100, `kill` del suo PID. Poi **incolla in Cursor**, in una chat nuova, **solo il prompt qui sotto**:

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Istanza: T1e. Obiettivo UNICO: salvare gli screenshot degli stati con
riferimento di Servizi, Menù fissi, Vini, Distillati e Bevande, perché la chat di design li confronti con le demo. Modifichi SOLO
e2e/** (e package.json solo per gli script e2e) e i rapporti sotto docs/design/verifica/esiti/. NON tocchi scripts/ui-verify (il vecchio
lanciatore è congelato), né app/, components/, lib/, collections/. Esegui i comandi FUORI dalla sandbox di Cursor (tutte le
autorizzazioni). Per i giri lunghi usa il background (`nohup … > .next/e2e-run.out 2>&1 &`) e segui .next/e2e-progress.log.

Leggi per intero: .cursor/rules/ui/02-ui-verifica-agente.mdc; docs/design/verifica/percorso-test-v2.md; docs/design/verifica/esiti/
2026-10-19-T1c/rapporto.md e rilievi.md; docs/design/verifica/controlli-6.6.json (campi `stati` e `immagini.stati_con_riferimento` delle
schermate servizi, menu-fissi, vini, distillati e bevande).
SITUAZIONE (verificata dalla chat di design): la suite di Servizi dà 162 OK, 0 ERRORE-STRUMENTO; ci sono 28 screenshot di Servizi e
Menù fissi; per gli stati di un foglio lo screenshot mostra l'inizio del modulo invece della sezione; per i cataloghi non esiste
ancora nessun test in e2e/ (la preparazione degli stati è nel vecchio lanciatore: scripts/ui-verify/lib/run-catalog.mjs,
catalog-config.mjs, catalog-ui-helpers.mjs: leggili come riferimento di COSA fare e riscrivi i test in e2e/, NON importarli).
F4 è appena stato applicato: i fogli ora hanno titolo con sottotitolo e piè «Salva | Annulla» affiancati; aggiorna le asserzioni
che cercavano «Modifica servizio (nome)» e simili.

PARTE A (Servizi e Menù fissi, 45 minuti):
1. Rimuovi l'approccio con `git worktree` (e2e/lib/sim-worktree.ts, e2e/lib/sim-dev-servers.ts, il testIgnore su .sim-isolates e ogni
   riferimento); `git worktree list` deve mostrare solo il principale. Togli dalla suite gli stati simulati («caricamento»,
   «errore-caricamento», «errore-azione») e i controlli di console in sviluppo: NON PROVATO, motivo «le riprova V6 con un dev server
   alla volta». Nessun dev server in questo passo.
2. Per OGNI stato con file di riferimento (immagini.stati_con_riferimento) salva uno screenshot per OGNI combinazione elencata, con il
   nome <schermata>-<stato>-<profilo>-<tema>.png in docs/design/verifica/esiti/2026-10-19-T1c/img/ (sovrascrivi i vecchi). Per gli stati
   di un FOGLIO (modulo-piatti, modulo-servizi, scegli-piatti, visibilita-categoria, visibilita-avviso, modulo-inglese-aperto, modulo-fondo)
   fai scorrere il foglio fino alla sezione dello stato (scrollIntoView) e aspetta le animazioni (document.getAnimations()) PRIMA dello
   screenshot. Ogni preparazione ha un'asserzione di conferma; se uno stato non si può preparare, NON PROVATO con il motivo. «vuoto»,
   «categorie-vuoto» e «nuovo-senza-categorie» sono NON PROVATO (database popolato).
PARTE B (Vini, Distillati e Bevande, 45 minuti, solo se la parte A è chiusa entro 60 minuti totali; altrimenti FERMATI):
3. Per ognuna delle tre schermate, un test per ogni stato con file di riferimento, con la stessa regola degli screenshot di sopra
   (nome, cartella <data>-T1c/img, foglio scorso alla sezione, animazioni finite). Stati NON PROVATI con il motivo: «caricamento»,
   «errore-caricamento», «errore-azione» (le riprova V6), «vuoto» (database popolato), «piu-di-100-…» (serve il bulk da 101, lo fa V6).
   Le fixture sono isolate per worker (nome verify-ui-<giro>-w<n>-…) e cancellate dalla fixture. Gli stati con una preparazione
   difficile (cascata dell'origine, errori di anno e di geografia) sono preparati dall'interfaccia con un'asserzione di conferma; se non
   riesce entro 10 minuti per stato, NON PROVATO con il motivo e si passa oltre.
4. Gli errori dello strumento sono ERRORE-STRUMENTO e non bloccano la consegna degli screenshot: elencali nel rapporto con la causa.
   Il global-setup chiude i server `next` rimasti sulle porte 3100 e 3200-3203 prima di partire; il global-teardown chiude l'intero
   albero dei processi del server di produzione.

TRE CRITERI DI ACCETTAZIONE (riporta i numeri): (a) screenshot salvati per tutti gli stati con riferimento che non sono NON PROVATI, per
OGNI schermata, con il conteggio atteso (dal JSON) e quello salvato, e i fogli scorsi fino alla sezione; (b) i controlli già OK
(162 OK di Servizi) restano OK in un giro completo e nessun FALLITO nuovo dell'app; (c) ambiente pulito a fine giro: `ps` e `lsof`
(porte 3100-3203) senza server, nessun worktree, zero record verify-ui- (pnpm payload run e2e/scripts/count-verify-ui.ts).
In più `pnpm typecheck` e `pnpm lint` sull'INTERO repo. Scrivi il rapporto in docs/design/verifica/esiti/2026-10-19-T1c/rapporto.md
(per ogni stato: salvato / NON PROVATO con il motivo / ERRORE-STRUMENTO con la causa; per ogni controllo OK / FALLITO con misurato e
atteso, mai «—»). NON fare git: commit e push li fa l'utente. Se superi 120 minuti totali, FERMATI e riporta.
RISPOSTA FINALE: tabella per schermata (stati attesi / salvati / NON PROVATI / ERRORE-STRUMENTO), esito dei tre criteri, elenco degli
screenshot mancanti con il motivo.
```

**Cosa fai tu**: incolla il prompt in una chat nuova di Cursor (solo dopo il push di F4); quando ha finito incollami il resoconto, poi `git add -A && git commit -m "test(e2e): T1e — screenshot di Servizi, Menù fissi e cataloghi per il confronto visivo" && git push`. Il confronto visivo lo faccio io.

### Passo T2a — Flussi per schermata: Servizi e Menù fissi

> **Decisione (2026-10-20)**: **ELIMINATO**: già provati in 20d (22 flussi OK) e nei giri di V4 ter; F4 tocca solo la presentazione; i flussi non provati di Menù fissi (vedi 2.2) li prova V6. Non eseguire.

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

> **Decisione (2026-10-20)**: **ELIMINATO**: già provati in V3 e V3 bis (flussi veri dei cataloghi OK); il resto a V6. Non eseguire.

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

> **Decisione (2026-10-20)**: **ELIMINATO**: già provati in V2 quater. Non eseguire.

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

> **Decisione (2026-10-20)**: **si chiude con T1e**: la chat di design confronta gli screenshot nuovi (Servizi, Menù fissi e cataloghi, a 390 e 1280 px, chiaro e scuro dove ci sono i riferimenti); i P residui non bloccanti diventano rilievi A annotati come debito.

**Quando**: dopo T1c (Servizi e Menù fissi) e poi dopo T1a e T1b per le altre schermate. **Chi**: la chat di design (io). **Cosa**: confronto degli screenshot di `docs/design/verifica/esiti/<data>-e2e/img/` con i PNG di `docs/design/schermate/`, a 390 e 1280 px, in chiaro e scuro; ne esce un file `rilievi.md` con i P e gli A, e se ci sono P un prompt di correzione per Composer. **Alternativa da decidere** (non ora): automatizzare il confronto con un modello e una scheda di controllo fissa (struttura, testi, ordine, icone, aree di tocco); richiede una chiave API. **Per te**: committa gli screenshot (`git add docs/design/verifica/esiti`) e scrivimi «push fatto».

### Passo T4 — Pensionamento del vecchio lanciatore

> **Decisione (2026-10-20)**: **RINVIATO a dopo V6**, non ora.

**Quando**: dopo T2c e quando `pnpm e2e` eguaglia i controlli del vecchio lanciatore. **Incolla in Cursor**, in una chat nuova, un prompt che chiede: `pnpm ui:verify` come alias di `pnpm e2e`; rimozione di `scripts/ui-verify` tranne ciò che serve (`provision-user.ts`, `watch.sh` se ancora utile); aggiornamento di `README.md` e `policy-test.md` di docs/design/verifica e delle regole 02; prova che `pnpm e2e` passa; `pnpm typecheck` e `pnpm lint` sull'INTERO repo; nessuna modifica a `app/`, `components/`, `lib/`, `collections/`. **Stima**: 60 minuti; lo scrivo quando serve.
