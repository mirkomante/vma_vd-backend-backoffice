# Esecuzione della 6.6: ordine completo, prompt e controlli

**Stato**: approvato da Mirko il 2026-10-16 (i tre punti della sezione 1 sono confermati). Passo D1 consegnato il 2026-10-16: `controlli-6.6.json` (home, navigazione, Piatti) e `controlli-8.2.json` v4. La regola di lavoro resta quella di `00-come-eseguire-il-piano.md`.

**Cosa contiene**: la tabella unica con l'ordine completo (sezione 2), i prompt per Composer (sezioni 4, 5 e 6) e quello che fa la chat di design e quando (sezione 7). I controlli sono quelli già in vigore: `docs/design/verifica/policy-test.md` (L0, L1, L2, L3, S) e `docs/piano-sviluppo/00-come-eseguire-il-piano.md` (una chat per sottofase, chiusura con Ufficiale / Percepito / Osservato, commit locale e push a mano).

**Come si usa**: si procede riga per riga della tabella. Ogni prompt di implementazione si incolla **dopo** il «Blocco comune» (sezione 3) in una **chat nuova** di Composer. Dopo ogni chat tu fai il push e io controllo il repo, come per i pacchetti di design.

---

## 1. Punti da confermare prima di partire

1. **«Ricompila il menù pubblico» durante la 6.6.** La 6.5 (endpoint, Cloud Build, trigger) viene **dopo** la 6.6 e dopo la 6.9 (`fase-6` §6.5, §6.9). Quindi in 6.6 il pulsante e la sua finestra di conferma si costruiscono come componente, ma restano **dietro un'unica bandiera spenta** (non compaiono nelle schermate) finché la 6.5 non li accende. Un pulsante visibile che non fa nulla è peggio di uno assente. Conseguenza: i controlli sulla presenza del pulsante (`integrazione/spec.md` §10, punto 10) si spostano alla 6.5. Le specifiche già approvate restano come sono: descrivono il risultato finale. **Confermato.** Conseguenza che ho aggiunto io (**assunzione da confermare**): finché la bandiera è spenta, gli avvisi di salvataggio e di eliminazione non nominano il pulsante («Per vederlo sul menù pubblico serve «Ricompila…»») e hanno solo il titolo, così il manager non legge il nome di un pulsante che non c'è; gli avvisi di abilitazione, disabilitazione e «terminato» non cambiano (`integrazione/spec.md` §5).
2. **Un solo file dei controlli**, `docs/design/verifica/controlli-6.6.json`, a cui aggiungo le schermate una alla volta (sezione 7). Il lanciatore sceglie di default l'ultimo file della cartella, quindi nei comandi si indica sempre `--controlli controlli-6.6.json`.
3. **Ordine dei controlli per ogni gruppo di schermate** (`policy-test.md` §6, la regola esiste già): (a) la chat di design consegna i controlli; (b) **l'agente di verifica li implementa nel lanciatore, in una chat pulita, PRIMA della chat di implementazione**; (c) la chat di implementazione fa L0 e L1 con i controlli già pronti; (d) se c'è un trigger, l'agente fa L2 dopo. Una schermata senza i suoi controlli non si implementa. Per questo la tabella ha i passi **VC** prima di ogni chat I.
4. **Controlli della shell**: i controlli di `controlli-8.2.json` assumono cinque voci e la vecchia descrizione della scheda «Menù». Dopo la chat I1 fallirebbero a torto: li aggiorno io prima di I1 (passo D1) e li implementa l'agente (VC1).
5. **Riga di registro**: `area` e `detail` della riga `delete` li propone Composer nella Parte A della chat I0a (come lo fanno gli altri hook di `lib/activityLog/`); se serve toccare il campo `detail` nell'Admin, lo propone senza farlo.
6. **Import di produzione 6.8**: è una sessione a sé con un passaggio esterno (backup di Cloud SQL), dopo la chiusura della 6.6. La chat I6 **non** lo esegue.

---

## 2. Tabella unica: l'ordine completo

Sigle: **R** revisione di regola; **I** implementazione (Composer); **VC** l'agente di verifica implementa i controlli nel lanciatore (chat pulita, prima della chat I); **V** l'agente esegue L2 (chat pulita); **D** controlli scritti dalla chat di design; **RL** rilievi P e A della chat di design dopo un V; **F** correzione dei P (Composer); **M** passo tuo. Una chat di implementazione segue sempre il «Blocco comune».

| # | Sigla | Chi | Cosa | Controlli | Si passa al successivo quando |
|---|---|---|---|---|---|
| 1 | R0 | Composer (chat breve) | Revisione di asse di `.cursor/rules/ui/01-ui-app-invarianti.mdc` contro `02` e `03` (§4.0) | revisione, nessun codice | nessuna contraddizione, o corretta |
| 2 | D1 | Design | `controlli-6.6.json` con shell, home, navigazione e Piatti; aggiorno `controlli-8.2.json` per le otto voci (§7) | — | tu committi e pushi i file |
| 3 | VC1 | Agente di verifica | Implementa nel lanciatore i controlli di D1 (§5, VC) | lint e typecheck; i controlli si caricano e le pagine assenti danno NON PROVATO | tu committi e pushi |
| 4 | I0a | Composer | Permessi di cancellazione, registro, matrici (§4.1) | L0 + `verify:menu-6_2`, `6_3`, `6_4`, `availability-final-proofs` | tabella degli esiti senza FALLITO; tu pushi |
| 5 | I0b | Composer | Formati dei campi e import (§4.2) | L0 + test unitari + `verify:menu-6_2` + idempotenza dell'import | idem |
| 6 | M1 | Tu | Report a secco esteso sullo snapshot e mi mandi le forme di anno, grado, invecchiamento | — | non blocca; prima del passo 31 |
| 7 | I1 | Composer | Fondamenta UI e integrazione (§4.3) | L0 + **L1** `shell,home` | L1 verde; tu pushi |
| 8 | V1 | Agente di verifica | **L2** su shell, home, navigazione (§5, V1) | **L2** | rapporto scritto; tu committi |
| 9 | RL1 | Design | Leggo il rapporto: rilievi P e A (§7) | — | nessun P aperto |
| 10 | F1 | Composer | Correzione dei P di V1 (§6), solo se ce ne sono | L0 + L1 dei soli controlli falliti | P chiusi |
| 11 | I2 | Composer | **Piatti** (§4.4) | L0 + **L1** `piatti` | L1 verde; tu pushi |
| 12 | D3 | Design | Controlli per Vini, Distillati, Bevande, in parallelo con la chat I2 | — | file pronto prima del passo 15 |
| 13 | V2 | Agente di verifica | **L2** su Piatti (primo elenco, primo modulo, primo foglio) più regressione shell e home (§5, V2) | **L2** | rapporto scritto |
| 14 | RL2/F2 | Design, Composer | Rilievi di V2 e correzione dei P. Con il primo elenco completo si ricalibrano i tempi, si rivedono i trigger e si segna «validata» la policy (`policy-test.md` §9, punto 4) | L0 + L1 dei falliti | nessun P aperto |
| 15 | VC3 | Agente di verifica | Implementa i controlli di Vini, Distillati, Bevande (§5, VC) | lint e typecheck | tu committi e pushi |
| 16 | I3 | Composer | **Vini, Distillati, Bevande** (§4.5) | L0 + **L1** `vini,distillati,bevande` | L1 verde; tu pushi |
| 17 | D5 | Design | Controlli per Servizi e Menù fissi, in parallelo con la chat I3 | — | file pronto prima del passo 18 |
| 18 | VC4 | Agente di verifica | Implementa i controlli di Servizi e Menù fissi (§5, VC) | lint e typecheck | tu committi e pushi |
| 19 | I4 | Composer | **Servizi e Menù fissi** con Categorie (§4.6) | L0 + **L1** `servizi,menu-fissi` | L1 verde; tu pushi |
| 20 | V4 | Agente di verifica | **L2 mirato** sui tipi nuovi: schede come percorsi, vista di scelta, conferme con cascade (§5, V4) | **L2** mirato | rapporto scritto |
| 21 | RL4/F4 | Design, Composer | Rilievi di V4 e correzione dei P | L0 + L1 dei falliti | nessun P aperto |
| 22 | D6 | Design | Controlli per Giorni speciali e Messaggio globale | — | file pronto |
| 23 | VC5 | Agente di verifica | Implementa i controlli di Giorni speciali e Messaggio globale (§5, VC) | lint e typecheck | tu committi e pushi |
| 24 | I5 | Composer | **Giorni speciali e Messaggio globale** (§4.7) | L0 + **L1** `giorni-speciali,messaggio-globale` | L1 verde; tu pushi |
| 25 | D7 | Design | Controlli di chiusura: L2 completo e L3 in `controlli-6.6.json`; i controlli online nuovi li completa V6 | — | file pronto |
| 26 | I6 | Composer | **Chiusura**: tabella completa delle checklist di §9, tutti i `verify:*`, CHANGELOG di sottofase (§4.8) | L0 + L1 su tutte le schermate + `verify:*` | tabella senza FALLITO; tu pushi |
| 27 | M2 | Tu | Deploy in produzione | **S** (smoke) | smoke verde |
| 28 | V6 | Agente di verifica | **L2 completo**: tutte le schermate, profili, temi, WebKit, più i controlli online senza credenziali (§5, V6) | **L2** | rapporto scritto |
| 29 | RL6/F6 | Design, Composer | Rilievi di V6 e correzione dei P | L0 + L1 dei falliti | nessun P aperto |
| 30 | M3/D9 | Tu, Design | **L3**: sessione reale su Cloud Run (io col tuo browser) e giro su iPhone vero (tu), sezione 8 | **L3** | esito scritto; rilievi P chiusi |
| 31 | I7 | Tu e Composer | **Import di produzione 6.8** (§4.9): report a secco in produzione, backup su richiesta, `--apply`, controlli REST | verifica dei conteggi | conteggi coincidenti: **6.6 chiusa** (✅) |
| 32 | — | — | Dopo la 6.6: 6.9 (scaffold del frontend), poi 6.5 (accende «Ricompila» e ne prova il pulsante) | vedi sezione 9 | — |

**Regole dei controlli** (`policy-test.md` §5): un **FALLITO di L1 blocca la chiusura del passaggio**: si corregge e si rilanciano solo i controlli falliti, al massimo due giri, al terzo si ferma e si chiama la chat di design. Un **FALLITO di L2 è un rilievo P** e blocca la chat successiva. Un **AVVISO** non blocca e si registra come rilievo A. Un **NON PROVATO** non blocca ma va nei debiti con scritto in quale livello verrà provato. **S** (smoke, `pnpm ui:verify online`) dopo ogni deploy. **Un controllo non implementato** nel lanciatore quando finisce una chat I rende L1 non eseguibile da chi implementa: lo dichiara e lo passa all'agente di verifica; mai una prova manuale chiesta a te al suo posto. Una modifica solo a documenti attiva solo L0; una solo al backend L0 più gli script `verify-*.ts`, non L1 (per questo le chat I0a e I0b non hanno L1).

---

## 3. Blocco comune (da incollare all'inizio di ogni prompt di implementazione)

```text
BLOCCO COMUNE: vale per tutte le chat di implementazione della sottofase 6.6.

Sei Composer nel repository VMA VD (Payload CMS e Next.js). Lavori sulla sottofase 6.6 di
docs/piano-sviluppo/fase-6-menu-digitale.md, che si esegue in più chat; questa è UNA di quelle chat e fa solo
quello che il prompt dice. Le regole di .cursor/rules si caricano da sole.

REGOLE
1. Leggi per intero, prima di scrivere codice, i documenti elencati nel prompt. Non assumere nulla oltre la
   documentazione: quello che non è scritto, chiedilo. Non modificare i documenti di design
   (docs/design/schermate/**, docs/design/decisioni-layout-app.md, docs/design/verifica/controlli-*.json):
   le possiede la chat di design. Se trovi un conflitto tra specifica e codice, dichiaralo in Parte A e annotalo
   come deviazione in Parte D.
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
   controllo della schermata non è ancora implementato nel lanciatore, L1 non è eseguibile da te: dichiaralo e
   fermati, senza prove manuali al suo posto. Se un L1 fallisce, correggi e rilancia solo i controlli falliti;
   al terzo giro fermati e riportami.
6. FERMATI e riferisci, senza aggirare, se: un pacchetto non si installa o genera conflitti; serve un passaggio
   fuori dal codice (database, credenziali, deploy); un ambiente non c'è. Mai produzione: niente
   scripts/prod-db.sh, niente credenziali di produzione, niente utenti di prova su Cloud SQL.
7. PARTE D, chiusura. Stato della 6.6 in fase-6 e in 00-piano-generale.md: «🔶 in corso» (diventa ✅ solo dopo
   l'import di produzione). Voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]: per ogni ambiguità
   risolta scrivi Ufficiale (cosa prevedeva il piano), Percepito (la lettura che hai dichiarato in Parte A),
   Osservato (cosa è successo davvero); esiti di test anche negativi o parziali. Deviazioni annotate nel file di
   fase, sottofase 6.6. Commit locale (git add + git commit, messaggio che nomina la chat); MAI git push.
8. RISPOSTA FINALE: tabella «Esiti reali» (cosa hai eseguito, comando, OK / FALLITO / NON PROVATO, evidenza),
   poi deviazioni, poi punti aperti. Non dichiarare fatto ciò che non hai provato.
```

---

## 4. Prompt di implementazione

### 4.0 R0: revisione della regola UI (chat breve, passo 1)

Non usa il Blocco comune: è la revisione di asse prevista dal processo per ogni regola locale modificata.

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

### 4.1 I0a: Parte 0, permessi di cancellazione e registro (passo 4)

```text
[incolla prima il BLOCCO COMUNE]

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

### 4.2 I0b: formati dei campi e import (passo 5)

```text
[incolla prima il BLOCCO COMUNE]

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

### 4.3 I1: fondamenta UI e integrazione (passo 7)

```text
[incolla prima il BLOCCO COMUNE]

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
   nome in italiano, data in lettere). Niente anticipazioni di cose usate da una sola schermata.
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

### 4.4 I2: Piatti (passo 11)

```text
[incolla prima il BLOCCO COMUNE]

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
5. Azioni del server nel modello di hours/actions.ts, con la sessione dell'utente e overrideAccess: false.
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

### 4.5 I3: Vini, Distillati, Bevande (passo 16)

```text
[incolla prima il BLOCCO COMUNE]

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
5. Tutti: ogni select facoltativo ha la voce per svuotarlo; un valore già salvato e fuori elenco resta visibile e
   salvabile; Paesi e regioni nei menu a tendina filtrati NELLA QUERY (solo enabled), non solo nascosti.
6. Accendi in navigazione le tre voci (enabled: true) e aggiorna scripts/verify-lib-app-8_2.ts con le voci abilitate.

NON FARE: altre schermate, modifica dei formati (sono di I0b), «Ricompila» visibile.

VERIFICHE: L0; L1 su `vini,distillati,bevande`. Per «Mostra altri vini» crea nel database di sviluppo 101 vini di
prova e poi eliminali (dichiaralo nella risposta); mai dati di prova in produzione.
```

### 4.6 I4: Servizi e Menù fissi (passo 19)

```text
[incolla prima il BLOCCO COMUNE]

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

NON FARE: Giorni speciali, «Ricompila» visibile, eliminazione delle categorie, modifiche allo schema.

VERIFICHE: L0; L1 su `servizi,menu-fissi`. Prove a mano da dev (dichiarale): eliminare un servizio e un menù fisso di
prova fa sparire i collegamenti; un piatto in un menù fisso non si elimina; la rotta /app/menu/fixed/categories
apre la scheda giusta e le briciole sono corrette.
```

### 4.7 I5: Giorni speciali e Messaggio globale (passo 24)

```text
[incolla prima il BLOCCO COMUNE]

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
in memoria (dichiaralo). La lettura sul bucket vero NON si prova qui: va nei NON PROVATO e nel passo L3.
```

### 4.8 I6: chiusura della sottofase (passo 26)

```text
[incolla prima il BLOCCO COMUNE]

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
   shell e la home).
3. Correggi solo difetti piccoli e chiari (testi, attributi); per il resto riportali, non risolverli.
4. CHANGELOG di sottofase 6.6: un solo riepilogo con Ufficiale / Percepito / Osservato per tutte le ambiguità
   delle chat precedenti (riprendile dalle voci già scritte); debiti: i NON PROVATO (compresi quelli rinviati alla 6.5) con il livello in cui
   si proveranno (L2, L3, 6.5).
5. Aggiorna la checklist di chiusura di 6.6 in fase-6 spuntando SOLO ciò che hai provato; lo stato resta «🔶 in
   corso» fino all'import di produzione.

NON FARE: import di produzione, deploy, modifiche alle specifiche.

VERIFICHE: quelle del punto 2. Risposta finale: la tabella completa delle checklist e l'elenco dei debiti.
```

### 4.9 I7: import di produzione 6.8 (passo 31)

È una sessione con passaggi esterni: Composer propone e prepara, **non esegue nulla in produzione senza il tuo «vai» per ogni passaggio**.

```text
CHAT I7: esecuzione in produzione dell'import di 6.8 (una volta sola, alla chiusura della 6.6, prima della 6.9).
Questa chat segue il BLOCCO COMUNE ma con questa eccezione: la regola 6 («mai produzione») è sostituita da quanto
scritto qui sotto, passaggio per passaggio.

LEGGI
- docs/piano-sviluppo/fase-6-menu-digitale.md, 6.8, sezione «Esecuzione in produzione» e checklist.
- docs/operativo/export-menu-vtn-backend.md, docs/operativo/cloud-sql-produzione.md.
- scripts/prod-db.sh, scripts/import-menu-vtn-backend.ts e scripts/import-menu-vtn-backend/; il report a secco
  esteso di I0b e le regole di normalizzazione fissate dopo il mio passo M1.

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

---

## 5. Prompt dell'agente di verifica (chat pulita)

Una **chat nuova** di Cursor con Composer, che non ha scritto il codice. Regola: `.cursor/rules/ui/02-ui-verifica-agente.mdc`. Due modelli: **VC** (implementa i controlli nel lanciatore, prima di una chat I) e **V** (esegue L2, dopo). Si incolla il modello e si sostituiscono i campi `<…>`.

### VC: l'agente implementa i controlli (prima delle chat I)

Le schermate non esistono ancora: il lanciatore deve saper eseguire i controlli, e li prova solo come caricamento e cablaggio.

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Qui IMPLEMENTI I CONTROLLI nel lanciatore, non
verifichi ancora nessuna schermata.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md (sezione 6: ordine per ogni schermata nuova)
3. docs/design/verifica/controlli-6.6.json, SOLO le schermate: <ID DELL'ISTANZA>
   (per VC1 anche la shell aggiornata di docs/design/verifica/controlli-8.2.json)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: <ELENCO DELLE SPECIFICHE DELL'ISTANZA>

Poi:
A. Leggi scripts/ui-verify/run.mjs e scripts/ui-verify/lib/. Per ogni controllo delle schermate indicate, trova se il
   lanciatore sa già eseguirlo (stesso tipo di controllo, stesso selettore). Elenca quelli che mancano.
   Il modello è il modulo per schermata scripts/ui-verify/lib/run-orari.mjs (agganciato da run.mjs): per il Menù
   crea un modulo analogo (per esempio scripts/ui-verify/lib/run-menu.mjs) e agganciaglielo. I valori attesi della
   shell oggi sono anche scritti nel codice (scripts/ui-verify/lib/engine.mjs, riga circa 535, e run.mjs: home-testi,
   shell-menu-voci, shell-segnaposto): in VC1 portali a quelli di controlli-8.2.json v4 (descrizione della scheda
   Menù, titolo «Oggi», voci della navigazione lette da lib/app/navigation.ts con enabled vero). Gestisci anche:
   «stato_prova» e «rinviato_a» (esito NON PROVATO con l'evidenza «rinviato alla 6.5»: gli esiti ammessi restano
   OK, FALLITO, AVVISO e NON PROVATO, non esiste un esito RINVIATO); il profilo telefono-390-basso; le
   simulazioni APP_MENU_DEV_SIMULATE_* e i dati di prova «verify-ui-…» di dati_e_sicurezza (creati e cancellati
   in try/finally, solo sviluppo); il comando NO-OVERRIDE; `--controlli controlli-6.6.json` con `--schermata`.
B. Implementa i tipi di controllo che mancano (per esempio: modulo con select, finestra di conferma con elenco,
   scheda a percorsi, vista di scelta dentro un foglio, riga di stato della home, campo data nativo, lettura di
   testi attesi da lib/). Non cambiare nessun controllo, soglia o tolleranza dei file JSON; i testi attesi delle
   costanti si leggono da lib/, non si copiano. Se un controllo ti sembra sbagliato o impossibile, scrivilo come
   «controllo dubbio» e lascialo com'è.
C. Prova solo il cablaggio: pnpm lint e pnpm typecheck verdi; il lanciatore carica controlli-6.6.json, riconosce
   ogni id e tipo delle schermate indicate; sulle pagine che non esistono ancora l'esito è NON PROVATO, senza errori
   del lanciatore. Non provare le schermate (non ci sono).
D. Scrivi in docs/design/verifica/esiti/<AAAA-MM-GG>-controlli/ un breve rapporto: controlli già coperti, controlli
   aggiunti, controlli dubbi, NON PROVATO.

Non fare git. Puoi modificare solo scripts/ui-verify/** e, se serve, il rapporto; non toccare app/, components/,
lib/, docs/design (fuori da verifica/esiti), né i controlli. Rispondi in italiano, distinguendo sempre OK,
FALLITO, AVVISO e NON PROVATO.
```

| Istanza | Prima di | Schermate nel JSON | Specifiche |
|---|---|---|---|
| **VC1** | I1 | `shell`, `home`, `piatti` | `integrazione`, `shell`, `piatti` |
| **VC3** | I3 | `vini`, `distillati`, `bevande` | le tre |
| **VC4** | I4 | `servizi`, `menu-fissi` | `servizi`, `menu-fissi`, `integrazione` |
| **VC5** | I5 | `giorni-speciali`, `messaggio-globale` | le due |

### V: l'agente esegue L2 (dopo le chat I)

```text
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md e docs/design/verifica/policy-test.md
3. docs/design/verifica/controlli-6.6.json (i controlli del Menù) e docs/design/verifica/controlli-8.2.json
   (shell e accesso, per la regressione)
4. docs/design/verifica/misura-tocco.md
5. Le specifiche, solo per capire i controlli: <ELENCO DELLE SPECIFICHE DELL'ISTANZA>

Poi, in quest'ordine:
A. Lanciatore: scripts/ui-verify/run.mjs implementa già i controlli (passo VC). Se un controllo del perimetro
   non è implementato, scrivilo NON PROVATO e segnalalo: completarlo spetta a una chat VC, non a questa. Deve
   passare pnpm lint e pnpm typecheck se tocchi il lanciatore (solo per i controlli online nuovi di V6).
B. Esegui <COMANDI DELL'ISTANZA> su locale-dev (solo il controllo CONSOLE) e su locale-prod (tutti gli altri).
C. Esegui i controlli «online-senza-credenziali» contro BASE_URL = <DOMINIO PUBBLICO DI CLOUD RUN>, solo se è stato
   fatto un deploy dopo l'ultimo commit; altrimenti scrivili come NON PROVATO. Nessuna credenziale, nessun
   utente di prova sul dominio pubblico.
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README, sezione 7.
E. Cancella l'utente di prova e verifica con git status che i file nuovi siano solo quelli attesi.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli.
Rispondi come da regola, in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO, con il valore
misurato e quello atteso per ogni FALLITO. Se un controllo ti sembra sbagliato o impossibile, non cambiarlo:
scrivilo come «controllo dubbio».
```

| Istanza | Dopo | Specifiche (punto 5) | Comandi (punto B) |
|---|---|---|---|
| **V1** | I1 | `integrazione`, `shell` | `pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata shell,home`, e una seconda esecuzione con `--controlli controlli-8.2.json --schermata shell` per la regressione (il lanciatore legge un file per volta) |
| **V2** | I2 | `piatti`, `integrazione` | `pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata piatti,shell,home` (shell e home sono id di `controlli-6.6.json`) |
| **V4** | I4 | `menu-fissi`, `servizi`, `integrazione` | `pnpm ui:verify --livello 2 --controlli controlli-6.6.json --schermata menu-fissi,servizi` (tipi nuovi: schede come percorsi, vista di scelta, conferme con cascade) |
| **V6** | I6 e deploy | tutte le nove | `pnpm ui:verify --livello 2 --controlli controlli-6.6.json` (tutto) e poi `pnpm ui:verify online --controlli controlli-8.2.json` (i controlli online senza credenziali; quelli del Menù li aggiunge D7) |

---

## 6. Prompt di correzione dei rilievi P (Composer)

Si usa dopo ogni V, solo se ci sono rilievi **P**. Io li scrivo in `docs/design/verifica/esiti/<cartella>/rilievi.md` (sezione 7) e li committi con il rapporto.

```text
[incolla prima il BLOCCO COMUNE, tranne le regole 2 (Parte A) e 7 (stato), che qui non servono]

CHAT F: correzione dei rilievi P di una verifica L2.

LEGGI
- docs/design/verifica/esiti/<CARTELLA>/rapporto (il rapporto dell'agente) e rilievi.md (i P assegnati dalla
  chat di design, uno per riga: id, valore misurato, valore atteso, schermata).
- La specifica della schermata interessata, sezione «Testi» e «Layout».

COSA FARE: correggi SOLO i rilievi P elencati in rilievi.md. Non toccare i rilievi A. Non cambiare controlli,
soglie o specifiche. Se un P ti sembra un controllo dubbio, dillo e non correggere.

VERIFICHE: L0 e L1 dei soli controlli falliti (pnpm ui:verify --livello 1 --schermata <id> --controlli
controlli-6.6.json); al massimo due giri, al terzo fermati.

CHIUSURA: voce in CHANGELOG con cosa era sbagliato e cosa è cambiato (senza il contesto della chat); commit locale;
niente push. Risposta: tabella «Esiti reali» per ogni P: corretto / non corretto, con evidenza.
```

---

## 7. Cosa fa la chat di design e quando

| Passo | Cosa produco | Contenuto |
|---|---|---|
| **D1** (prima di VC1 e della chat I1) | `controlli-6.6.json` (shell, home, navigazione, Piatti) e l'aggiornamento di `controlli-8.2.json` | Per la shell: otto voci con le icone, descrizione della scheda «Menù», riga di stato, regola del percorso più lungo (voce attiva e briciole per i percorsi della tabella di `integrazione/spec.md` §2). Per Piatti: dalla §9 della specifica, ogni controllo con `id`, tipo, selettore, atteso, `livello` (1 o 2) e `fonte`; stati, testi, misure (390 e 1280 px, chiaro e scuro) |
| **D3, D5, D6** | Lo stesso file, con le schermate aggiunte un gruppo alla volta | D3: Vini, Distillati, Bevande · D5: Servizi e Menù fissi · D6: Giorni speciali e Messaggio globale. Ognuno prima del suo VC |
| **D7** | Controlli di chiusura nello stesso file | L2 completo e L3 (sezione 8); i controlli online nuovi li completa V6 |
| **RL1, RL2, RL4, RL6** | `rilievi.md` accanto a ogni rapporto | Ogni FALLITO di L2 diventa **P** (blocca la chat successiva) o, se il controllo è sbagliato, lo correggo io nel JSON (con una voce nel CHANGELOG del file dei controlli); ogni AVVISO diventa **A** (non blocca). Per ogni P: id, valore misurato, valore atteso, schermata. Aggiorno le specifiche se un P rivela un difetto della specifica e non del codice |
| **D9** (L3) | Esito dei controlli con sessione reale su Cloud Run | Col tuo browser: Esci, Admin, ruoli (manager, admin, utente senza ruolo), registro attività con le righe `delete`, e per il Messaggio globale la lettura di `disponibilita.json` lato server con l'ora mostrata. Per i controlli che cancellano uso solo voci di prova create e poi eliminate da me, mai dati veri |

I controlli non si cambiano mai per farli passare: se uno è sbagliato lo correggo io. Lo faccio anche per gli id di `controlli-8.2.json` interessati dalla shell a otto voci.

---

## 8. L3: giro su iPhone vero (tuo, passo 30)

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

## 9. Dopo la 6.6

Ordine del piano (`fase-6` §6.9, §6.5): **6.9** (scaffold del frontend del menù, sul Firebase nuovo) e poi **6.5** (endpoint e trigger di Cloud Build). La 6.5 accende la bandiera del pulsante «Ricompila il menù pubblico» costruito in I1 e prova nella sua checklist ciò che qui è NON PROVATO con l'evidenza «rinviato alla 6.5»: pulsante presente nelle sette intestazioni (Piatti, Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali), assente nel Messaggio globale e in home, finestra di conferma, esito «avviata». Quel passo ha il suo L1 sulle sette schermate.
