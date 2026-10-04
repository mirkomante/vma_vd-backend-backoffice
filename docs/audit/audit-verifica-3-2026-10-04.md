# Verifica finale — verso una versione condivisa del piano

- **Repository**: https://github.com/mirkomante/vma_vd-backend-backoffice, ramo `main`
- **SHA di HEAD verificato**: `7a5d537c7b78589111094a06cd6bbacb3bf072f5` («completa M2 (segnalazione F1 riprodotta) e attribuzione in 7.0»), discendente di `b075dd90e4f1459a6029d9bdf968a31342745098` (verificato: `b075dd9` è antenato di HEAD)
- **Intervallo controllato**: `2471059..7a5d537` (`git diff 2471059 HEAD -- docs/piano-sviluppo`)
- **Data**: 2026-10-04
- **Modalità**: sola lettura sul repo. Le esecuzioni sono in una copia di lavoro (`/home/claude/v4w`, Node 22, PostgreSQL 16 locale). Nessuna modifica al repo, nessun commit.
- **Il codice non è cambiato** [V]: `git diff 2471059 HEAD --name-only` elenca solo file in `docs/`.
- **Legenda**: **[L]** letto nel repo a HEAD · **[E]** eseguito nel mio sandbox · **[V]** verificato sui sorgenti di Payload 3.89.0 · **[D]** dedotto.

---

## 0. Giudizi

**Cursor può partire dalla 7.0? Sì, con riserve.** Ho rieseguito la prova dell'utente disattivato di §7.0 così come ora è scritta, curl compresi [E]: funziona. Le riserve sono tutte di livello A (una sola correzione di testo, R3) più un'azione dell'umano prima di iniziare. Nessun rilievo B o P riguarda la 7.0.

**Versione condivisa? No, ma manca poco.** Mancano:
1. **R1** (P, sulla 8.3): il punto 5-bis dice che il login locale «resta escluso per gli admin (ADR-004)», ma nel codice l'esclusione è solo per costruzione. L'ho eseguito: un utente con `adminRole: admin` e `hash` residuo entra su `/app` con la password locale [E]. Va aggiunto un controllo esplicito (testo in §6). È un paragrafo.
2. **La registrazione di ADR-115** («[da registrare]»): decisione dell'umano, non mia.

Con R1 applicato il piano è condiviso. Per il resto non vedo disaccordi sostanziali.

**Regola di chiusura: la condivido, con un affinamento.** Il testo proposto («Cursor parte quando non restano B o P sul percorso 7.0→7.4 e 8.1→8.5») è troppo largo: un P su una sottofase lontana (come R1 sulla 8.3) bloccherebbe la 7.0 senza motivo. Per definizione un P è «da correggere *prima della fase interessata*». Formulazione proposta:

> Cursor parte da una sottofase quando non restano B né P che riguardano quella sottofase o quelle che la precedono nell'ordine di esecuzione. I P su sottofasi successive si correggono prima di avviarle. I A si raccolgono nella tabella «Rinviati e aperti».

Applicandola: 7.0 → 7.4 e 8.1 → 8.2 possono partire ora; la 8.3 (e quindi 8.4 e 8.5, che ne dipendono) parte dopo R1.

---

## 1. M1–M14 e le cinque condizioni di N13

| ID | Stato | Evidenza | Nota |
|---|---|---|---|
| M1 | RECEPITO COME PROPOSTO | `fase-7:73` | Prerequisiti, ordine, controllo positivo, cookie, riavvio, eliminazione: tutti presenti. Eseguito: §2. Restano tre ritocchi (R3). |
| M2 | RECEPITO COME PROPOSTO (completato nel commit finale) | `fase-7:73` («verificato dalla chat di verifica il 2026-10-04 a `2471059`»); `segnalazione…:6` («Riprodotto a runtime il 2026-10-04 dalla chat di verifica… `PATCH` in blocco non provato»); `fase-8:83` («l'8.3 non si chiude senza la prova») | Le tre parti sono giuste. Ho riprodotto il 200 prima della correzione e F1 a runtime [E] (§2). L'attribuzione è corretta. `fase-7:46` («Verificato dal pianificatore… `pnpm build` riuscito») resta un'affermazione del pianificatore che non ho potuto riprodurre (font di Google non raggiungibili): non la contesto, la segnalo in §9. |
| M3 | RECEPITO COME PROPOSTO | `fase-8:79` (5-bis); `fase-8:91` | Regola coerente con ADR-113 §3 e con 8.4; con un buco sul login locale (R1) e un duplicato con il punto 5 (R2). |
| M4 | RECEPITO COME PROPOSTO | `fase-7:205`, `:215` | La lista dei campi di sistema coincide con la mia misura [E]: §2. |
| M5 | RECEPITO COME PROPOSTO | `fase-7:203`, `:216` | Realizzabile in 3.89.0 [E]: §2. |
| M6 | RECEPITO COME PROPOSTO | `piano.yaml:983` | `arco-38` ora in `adr_da_scrivere` (ADR-113). |
| M7 | RECEPITO COME PROPOSTO | `piano.yaml:854` (`arco-48`) | |
| M8 | RECEPITO COME PROPOSTO | `ADR-115:38-41`; `fase-6:328` | Punti 8 e 9 spostati in «Precisazioni (2026-10-04)… **[da registrare]**»; `availability-write-failed` presente; checklist 6.4 aggiornata. |
| M9 | RECEPITO COME PROPOSTO | `fase-8:51` | |
| M10 | RECEPITO COME PROPOSTO | `fase-7:151`, `:158` | |
| M11 | RECEPITO COME PROPOSTO | `fase-7:94` | |
| M12 | RECEPITO COME PROPOSTO | `piano.yaml:20-21` | |
| M13 | RECEPITO COME PROPOSTO | `fase-7:64` | Verificato: 18 righe `<`/`>`, 32 con le intestazioni dei blocchi [E, già misurato nel giro precedente]. |
| M14 | RECEPITO COME PROPOSTO | `fase-8:150` | |

**Le cinque condizioni di N13**

| # | Condizione | Stato | Evidenza |
|---|---|---|---|
| 1 | Azione umana prima della 7.0 (elenco degli admin) | RECEPITO | `fase-7:48`. Query valida sullo schema [E]. Manca il comando esatto di esecuzione (R3). |
| 2 | Invio della segnalazione con una scadenza | RECEPITO | `piano.yaml:1057` («entro la fine della Fase 7»); `po-10.responsabile`: `piano.yaml:1056` |
| 3 | Nessun nuovo admin fino alla correzione | RECEPITO | `fase-7:48`; `piano.yaml:1057`; `segnalazione…:70` |
| 4 | 8.3 incondizionata | RECEPITO | `fase-8:83` (ultima frase), `:89` |
| 5 | Prova anche per `PATCH` in blocco | RECEPITO | `fase-8:83`, `:89` |

---

## 2. Cosa ho rieseguito, e con che esito

### 2.1 §7.0, prova dell'utente disattivato, come ora è scritta [E]

Copia di HEAD, database vergine, `.env` con `PAYLOAD_SECRET`, `DATABASE_URL` locale, `APP_PUBLIC_URL`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` fittizi. Passi 1–4 di §7.0 applicati nella copia (F2, come scritto), poi:

| Passo di §7.0 | Esito |
|---|---|
| (1) due `pnpm seed:super-admin` | Entrambi creati. Password debole: `Seed super-admin non riuscito: La password deve contenere almeno 8 caratteri.` (exit 1). |
| (2) `pnpm dev`; `curl -c … -d 'email=…' --data-urlencode 'password=…'` | Due 302 verso `/admin`, un cookie ciascuno. |
| (3) controllo positivo prima della disattivazione | `/api/users/me` mostra l'utente; `/api/users`, `/api/activity-log`, `/api/globals/settings` → **200**. |
| (4) disattivazione via `PATCH` con `jar1.txt` | **200**. L'`id` l'ho preso dal JSON di `/api/users/me` del punto 3. |
| (5) dopo | `jar2`: **403** sulle tre; `jar1`: **200** sulle tre. |
| (6) riavvio dopo modifiche a `access` | Nel mio ordine il server è partito **dopo** la modifica, quindi non è servito. Il giro precedente ha mostrato che senza riavvio i 200 restano. |
| (7) eliminazione del secondo | `DELETE /api/users/<id>` → **200**; resta solo il bootstrap. |

**I prerequisiti elencati bastano a Cursor?** Quasi. Mancano `PAYLOAD_SECRET` (sempre presente in un `.env` funzionante, ma non elencato) e un avviso: `jar1.txt`/`jar2.txt` finiscono nella cartella corrente e **non sono ignorati da `.gitignore`** [E: `git check-ignore` non li riconosce]. Tutto in R3 (A).

### 2.2 La query dell'azione umana [E]

`select email, admin_role from users where admin_role = 'admin';` eseguita sul database dello schema reale: nessun errore (0 righe sul database di prova, che ha solo super-admin). Tabella `users` e colonna `admin_role` coincidono con la migrazione iniziale. Ho letto ma non eseguito il percorso di produzione: `scripts/prod-db.sh` esegue il comando dopo `--` (`:37`) e `docs/operativo/cloud-sql-produzione.md:32` dà la stringa per `psql` via proxy (porta 5433); `psql` non legge il `.env`.

### 2.3 Fase 8 §8.3, punto 5-bis [E][L]

Applicata la regola nella copia (`canAccessAppArea`: attivo e (`adminRole` admin o super-admin, oppure `appRole: manager`)). Risultati:

| Caso | Risultato | Coerenza |
|---|---|---|
| `adminRole: manager` senza `appRole` | falso [L: regola] | Coerente con ADR-113 §3 (l'App è del manager `appRole`; nell'Admin entra con 8.3 punto 2). |
| `adminRole: manager` con `appRole: manager` | vero (per `appRole`) | Il login locale resta vietato da `localPasswordGuard.ts:59` (`adminRole !== 'none'`) **solo se si imposta una password**: vedi R1. |
| utente disattivato | falso (`isActiveUser`) | Coerente con F2 e con 8.3 punto 10. |
| super-admin con `appRole: none` | vero | Login Google su `/app/login` richiede anche il dominio con `allowApp` in «Identità autorizzate» (`allowList.ts:42`) [L]: non scritto nella checklist (R6). Il login Google non l'ho provato. |
| **login locale di un admin** | **non escluso in modo esplicito** | **Vedi sotto: R1.** |

**Il caso del login locale di un admin** [E]. `appEndpoint.ts:54` chiama `assertUserAllowedForAppLocalLogin` (che guarda solo `canAccessAppArea` e `emailVerified`) e poi `verifyLocalPassword` su `hash`/`salt`. Non c'è nessun controllo su `adminRole` né su `loginMethod`. Percorso: creo un utente App con login locale (`appRole: manager`, password), lo promuovo con `PATCH` a `adminRole: admin` e `loginMethod: sso` (`assertLocalPasswordAllowed` lo ammette perché non passa una password) → `hash` resta nel database. Poi:
- **HEAD, `appRole: manager`**: `POST /api/users/login/app` → **302 `/app`**: un admin entra con la password locale. È un difetto già presente, indipendente da 5-bis.
- **HEAD, `appRole: none`**: 302 a `/app/login?authFailed=1` (rifiutato).
- **Con 5-bis applicata, `appRole: none`**: **302 `/app`**: la regola proposta allarga l'esposizione allo stesso caso.
- Un admin che non ha mai avuto password: rifiutato (302 a `?authFailed=1`) anche con 5-bis, perché senza `hash` la verifica fallisce.

ADR-004 e `01-autenticazione-invarianti.mdc` («Nessun utente Admin diverso dal/dai super-admin di bootstrap può avere credenziali locali») sono violati in questo percorso. Il testo «Il login locale resta escluso per gli admin (ADR-004)» di 5-bis è quindi vero solo per costruzione.

### 2.4 Fase 7 §7.4 [E]

Prova con un Global di prova `impostazioni-sistema` (tab non nominati, campi `weeklyClosedDays` e `bnb` nella tab Orari e `googleCalendarId` con `access.read`/`access.update` riservati allo staff; `access.read: () => true`; `access.update` per staff e `appRole: manager` attivi):

| Prova | Esito misurato |
|---|---|
| Lettura anonima, chiavi | `["bnb","createdAt","globalType","id","updatedAt","weeklyClosedDays"]`: **coincide** con il testo di `fase-7:205` e `:215` («chiavi della tab… più `id`, `createdAt`, `updatedAt` e `globalType`»). `googleCalendarId` assente. |
| Lettura del manager | stesse chiavi: non vede `googleCalendarId`. |
| `update` del manager su `weeklyClosedDays` e `googleCalendarId` insieme | **OK**: `weeklyClosedDays` aggiornato; `googleCalendarId` **scartato in silenzio** (risposta senza il campo; database invariato). |
| `update` dell'admin su `googleCalendarId` | OK. |
| `update` anonimo | «Non sei autorizzato» (403). |

«Scrittura a livello di Global» (`access.update` del Global più `access.update` per campo) è quindi **realizzabile in 3.89.0** e il comportamento è «scartato», non «rifiutato». La checklist (`fase-7:216`) dice «scartato o rifiutato»: va bene, ma la prova va fatta rileggendo il valore con un admin, non guardando la risposta (R4).

### 2.5 La correzione di F1 della segnalazione [E]

Aggiunto alla copia l'hook della segnalazione (`beforeValidate` di `users`). Con un admin (cookie firmato con il secret di prova):
- `PATCH /api/users/<id>` con `{"adminRole":"super-admin"}` su sé stesso → **400** «Solo un super-admin può assegnare il ruolo super-admin.» (`adminRole` invariato);
- `PATCH /api/users?where[email][equals]=…` (**in blocco**) con lo stesso corpo → **400** `Impossibile aggiornare 1 su 1 User.` (`adminRole` invariato);
- il super-admin può promuovere lo stesso utente (**200**).

Quindi il codice di riferimento della segnalazione funziona sui due percorsi che la 8.3 richiede di provare. Non ho eseguito il `PATCH` in blocco **prima** della correzione (il difetto per quel percorso resta dedotto dal sorgente).

### 2.6 Altri comandi di §7.0 già verificati nel giro precedente

Lockfile con i due `sed` (18 righe modificate, tutte di `graphql`), `POST /api/graphql` (200 prima, 404 dopo), `pnpm peers check`, `pool.max: 3`, `typecheck` su clone pulito: nel testo non sono cambiati in modo sostanziale (`fase-7:64`, `:61`, `:75`); non li ho ripetuti.

---

## 3. Disaccordi tra me e il pianificatore

**Uno solo ancora aperto: R1.** Posizioni:

- **Pianificatore (`fase-8:79`)**: il login locale resta escluso per gli admin per ADR-004; la regola 5-bis basta.
- **Mia**: non basta, perché nessun codice vieta il login locale quando `hash` è presente. Prova eseguita (§2.3). Il testo finale proposto è in §6 (R1).

Gli altri punti li chiudo come segue.

| Punto | Mia posizione | Evidenza |
|---|---|---|
| F1 fuori dalla 7.0 | **Concordo**, con le cinque condizioni, tutte nel repo (§1). Il codice di riferimento funziona per `PATCH` singolo e in blocco (§2.5). | `fase-7:48`, `piano.yaml:1053-1057`, `fase-8:83,89` |
| ADR-115, «Precisazioni» | **Contenuto corretto e coerente** con 4.4, 5.3, 6.4 e 6.5. Una riga da allineare (R5): `ADR-115:12` dice ancora che il piano registra «la riscrittura del file di disponibilità da Cloud Scheduler», mentre la Precisazione 2 dice che le riscritture riuscite non si registrano. L'accettazione («da registrare») è dell'umano. | `ADR-115:12`, `:38-41`; `fase-6:328`, `:397`; `fase-4:238`, `:246` |
| N4 | **Confermo**: nessun numero. Non ho trovato una fonte ufficiale per `db-f1-micro`; la documentazione di Cloud SQL dice solo che il valore dipende dalla memoria. | `fase-7:61` |
| N5 | **Confermo**: due istanze del plugin, una per sito (verificato nel giro precedente: `from` è `unique`; `buildConfig` produce le due collection con `relationTo` proprio e `access` sovrascritti). I nomi `redirects-vma` e `redirects-villadoree` vanno bene. | `fase-4:169`, `:176` |

Coerenza di ADR-115 con i testi delle sottofasi [L]:

| Sottofase | Testo | Chiave di `detail` | Coerente |
|---|---|---|---|
| 6.4 | `fase-6:328`: «voci di sistema per il reset e per gli errori di scrittura del file» | `availability-reset`, `availability-write-failed` | Sì |
| 6.5 | `fase-6:397`: avvio del rebuild con l'id della build in `detail` | `rebuild-started` | Sì |
| 4.4 Parte A | `fase-4:238,246`: esito della revalidation come `systemAction`, id dell'evento in `detail` | `revalidation` | Sì |
| 5.3 | non scritto (nota in `piano.yaml:166`; `ADR-115` Conseguenze) | `anonymization` | Sì; nessun dato personale (`ADR-115:19`) |

---

## 4. Coerenza finale (conteggi riprodotti)

| Verifica | Esito |
|---|---|
| Archi | **50**, nessun id duplicato, nessun arco verso nodi inesistenti, nessun ciclo [E] |
| Archi `decisione` non coperti da un ADR in `adr_da_scrivere` | nessuno [E] |
| Archi `output` con `adr` valorizzato | nessuno [E] |
| Punti aperti | solo `po-10` [E] |
| Riferimenti rotti (`arco-NN`, `po-NN`, `fase-N.M`) | nessuno; restano `fase-2.10`, `fase-3.3`, `fase-3.4`, sottofasi dei file di catalogo [E] |
| Ordine di esecuzione | **identico** in `piano.yaml:44-49` e `00-piano-generale.md:40-45` (4.0 → 7.0 → 7 → 8 → 6 → 4.1–4.4 e 5) [L] |
| CHANGELOG | `CHANGELOG:66-67` descrive solo modifiche a documenti; le ho riscontrate tutte nel diff. Nessuna voce su codice cambiato [L] |
| Copia archiviata | `docs/audit/audit-verifica-2-2026-10-04.md` coincide con il mio file (0 differenze) [E] |

---

## 5. Prontezza finale

| Sottofase | Verdetto | Riserve (A rinviati) o blocchi |
|---|---|---|
| **7.0** | **PRONTA CON RISERVE** | R3 (testo della prova, `PAYLOAD_SECRET`, `jar*.txt`, comando dell'azione umana). Azione umana prima di iniziare (`fase-7:48`). `pnpm build` non riprodotto da me. |
| **7.1** | **PRONTA** | Il testo chiede già di verificare la tab senza campi e di fermarsi. La migrazione la genero senza problemi [E, giro precedente]. |
| **7.2** | **PRONTA** | |
| **7.3** | **PRONTA** | |
| **7.4** | **PRONTA CON RISERVE** | R4 (la prova del manager si fa rileggendo il valore). |
| **8.1** | **PRONTA CON RISERVE** | I nomi dei campi della CLI di shadcn non li ho potuti verificare (`fase-8:51` chiede già di verificarli). |
| **8.2** | **PRONTA CON RISERVE** | Tre passaggi da confermare con l'umano prima del codice (`fase-8:102`): per disegno. R2 (non duplicare la regola di accesso). |
| **8.3** | **NON PRONTA** | **R1 (P)**: controllo esplicito sul login locale degli admin. Dopo R1: pronta con riserve (R2, R6, A). |
| **8.4** | **PRONTA CON RISERVE** | Dipende dalla 8.3 (R1). Il testo dell'email è coerente con 5-bis. |
| **8.5** | **PRONTA CON RISERVE** | Dipende dalla 8.3 (R1). R6 (prova dell'admin: dominio con `allowApp`). |

---

## 6. Nuovi rilievi

Gravità: **B** bloccante · **P** da correggere prima della fase interessata · **A** da annotare.

| ID | Gr. | Dove | Evidenza | Correzione proposta (testo esatto) |
|---|---|---|---|---|
| **R1** | **P (prima della 8.3)** | `fase-8:79` (5-bis), `:91`; `lib/auth/localLogin/appLoginChecks.ts:18-27`, `appEndpoint.ts:54,60` | [E] §2.3: con 5-bis, un admin con `hash` residuo e `appRole: none` entra su `/app` con la password locale; già oggi vale per `appRole: manager`. [L] Né `assertUserAllowedForAppLocalLogin` né `appEndpoint.ts` guardano `adminRole` o `loginMethod`; `localPasswordGuard.ts:59,89` vieta solo di *impostare* una password. | **In `fase-8` §8.3, sostituire l'ultima frase di 5-bis** («Il login locale resta escluso per gli admin (`ADR-004`).») con: «Il login locale dell'App è **solo per utenti con `adminRole: none`**: `assertUserAllowedForAppLocalLogin` (`lib/auth/localLogin/appLoginChecks.ts`) rifiuta ogni utente con `adminRole` diverso da `none`, qualunque sia `appRole`, con lo stesso messaggio generico (`ADR-004`; stessa regola `adminRole !== 'none'` di `localPasswordGuard.ts`). Oggi non è vero (verificato il 2026-10-04): un utente creato come utente App con login locale e poi promosso ad `adminRole: admin` con `loginMethod: sso` conserva `hash` e `salt` e entra su `/app` con la password locale; con la regola di 5-bis lo stesso varrebbe anche con `appRole: none`.» **Aggiungere alla checklist di 8.3**, dopo `fase-8:91`: «- [ ] Un utente con `adminRole` diverso da `none` e `hash`/`salt` residui (creato come utente App con login locale e poi promosso con `loginMethod: sso`) è rifiutato da `POST /api/users/login/app`, con `appRole: manager` e con `appRole: none`; la prova si fa su un database di sviluppo, creando l'utente con `adminRole: none` e promuovendolo dopo.» |
| R2 | A (8.3) | `fase-8:78` (5), `:79` (5-bis) | [L] Lo stesso predicato è scritto due volte (punto 5 per `canAccessSection`, 5-bis per `canAccessAppArea`): rischia due implementazioni (`stack/01-stile-codice.mdc`: «niente logica duplicata»). | In `fase-8` §8.3 punto 5, sostituire «falso altrimenti.» con: «falso altrimenti. La regola vive in un solo punto: `canAccessSection(user, section)` richiama `canAccessAppArea(user)` (5-bis) per tutte e tre le sezioni (nessuna distinzione per sezione: il manager è unico, `ADR-113` §3).» |
| R3 | A (7.0) | `fase-7:48`, `:73` | [E] Passi funzionanti. [L] Mancano: `PAYLOAD_SECRET` tra i prerequisiti; l'`id` del secondo utente; la pulizia di `jar1.txt` e `jar2.txt` (non ignorati da `.gitignore`); il comando esatto dell'azione umana. [D] `-d 'email=…'` decodifica `+` come spazio (`URLSearchParams` in `parseLoginBody.ts`): un'email con `+` fallirebbe. | `fase-7:73`: (a) nei prerequisiti, dopo «`DATABASE_URL`…»: «`PAYLOAD_SECRET` valorizzato;»; (b) al punto (2): «Avviare `pnpm dev` **dopo** aver applicato i passi 1–4 di questa sottofase (se era già avviato, riavviarlo)» e sostituire `-d 'email=<email 1>'` con `--data-urlencode 'email=<email 1>'` (e così per il secondo); (c) al punto (3), in coda: «L'`id` del secondo è nel JSON di `/api/users/me`.»; (d) nuovo punto (8): «Eliminare `jar1.txt` e `jar2.txt`: contengono cookie di sessione e non sono ignorati da `.gitignore`.» `fase-7:48`: sostituire con «…(`./scripts/prod-db.sh -- psql "postgresql://vma-vd-user@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable" -c "select email, admin_role, active from users where admin_role = 'admin';"`, con il proxy acceso; `psql` chiede la password dell'utente DB e non legge il `.env`)…». |
| R4 | A (7.4) | `fase-7:216` | [E] §2.4: l'`update` del manager su un campo non consentito è **scartato in silenzio**: la risposta non lo contiene e il valore resta com'era. Una prova che guarda solo la risposta non distingue «scartato» da «salvato». | `fase-7:216`, in coda: «La prova rilegge il valore con un admin (o dal database) dopo l'`update` del manager: deve essere quello di prima; sulla tab Orari e chiusure è quello nuovo. Un campo vietato è scartato in silenzio in 3.89.0 (verificato il 2026-10-04): non ci si aspetta un errore.» |
| R5 | A (ADR-115) | `ADR-115:12`, `:38-41` | [L] Il contesto elenca ancora «la riscrittura del file di disponibilità da Cloud Scheduler» tra le azioni da registrare; la Precisazione 2 dice che le riscritture riuscite non si registrano. | `ADR-115:12`: sostituire «il reset di «terminato» e la riscrittura del file di disponibilità da Cloud Scheduler (6.4)» con «il reset di «terminato» e gli errori di scrittura del file di disponibilità (6.4)». |
| R6 | A (8.3, 8.5) | `fase-8:91`, `:190` | [L] Il login Google sull'App richiede che il dominio abbia `allowApp` vero (`allowList.ts:42`). Le due prove (super-admin senza `appRole`; admin che modifica gli Orari) non lo dicono. [D] Un admin entrato dall'Admin ha già una sessione valida per `/app`: non serve un secondo login (`ADR-102` §5); il punto 8.2 non deve richiedere una strategia specifica. | `fase-8:91`, in coda: «Prerequisito: il dominio dell'utente di prova ha `allowApp` vero in «Identità autorizzate».» `fase-8:190`, in coda: «La prova dell'admin si fa sia dopo un login su `/app/login` sia con la sessione aperta dall'Admin: `canAccessSection` è l'unica guardia, nessuna rotta richiede una strategia di login specifica.» |
| R7 | A (8.3) | `fase-8:83` | [L] Dopo il commit finale il punto 9 contiene due frasi che si sovrappongono («Si applica qui la correzione appena arriva dal catalogo, al più tardi in questa sottofase.» e «l'8.3 non si chiude senza la prova, anche se il template non ha ancora risposto»). Non si contraddicono, ma lasciano margine di lettura. | Sostituire le due frasi con: «Il controllo si applica in questa sottofase con il codice della segnalazione (§ «Fix proposto»; verificato su `PATCH` singolo e in blocco il 2026-10-04); l'8.3 non si chiude senza la prova, arrivi o no la risposta del template.» |

---

## 7. Stato condiviso

### Concordato (riferimento: non si ridiscute)

| Voce | Posizione concordata | Evidenza |
|---|---|---|
| F1, difetto | Un `admin` può promuoversi a `super-admin` con `PATCH /api/users/<id>`: **riprodotto** il 2026-10-04 [E]. Il `PATCH` in blocco è un percorso distinto in cui `access.update` non riceve `data` [V]. | `segnalazione…:6` |
| F1, correzione | Hook `beforeValidate` della segnalazione: respinge `PATCH` singolo e in blocco; il super-admin può promuovere [E]. Si applica in 8.3, incondizionata. Resta fuori dalla 7.0. | `fase-8:83,89`; `po-10` |
| F2 | `isActiveUser` e le cinque funzioni in 7.0; utente disattivato con cookie valido: 200 prima, 403 dopo [E]. Il dev server va riavviato dopo ogni modifica a `access`. | `fase-7:52-58,73` |
| F3 | Un campo senza `access.read` è leggibile da chiunque superi l'accesso del Global [V]; ogni campo non pubblico dichiara `access.read`. La risposta anonima contiene le chiavi di Orari e chiusure più `id`, `createdAt`, `updatedAt`, `globalType` [E]. | `fase-7:205,215` |
| F4 | `users` non ha `useAPIKey`; la scelta del token per le bozze è di ADR-111. | `fase-4:196,205` |
| F5 / N5 | Redirects: due istanze del plugin, una per sito; lettura pubblica; scrittura riservata agli admin con `overrides.access`. | `fase-4:169,175-176` |
| F7 | ADR-115: `user` facoltativo, `systemAction`, `detail` con chiave di azione da elenco chiuso; migrazione additiva come primo passo di 6.4. | `ADR-115`; `fase-6:300,328` |
| F9 / N4 | `pool.max: 3`; nessun numero scritto per `max_connections` né `--max-instances`; si leggono sull'istanza. | `fase-7:60-61` |
| F10 | `graphql ^16.8.1`, `graphQL.disable: true`, route non eliminate; lockfile: 18 righe modificate, tutte di `graphql`; `POST /api/graphql` 404; `peers check` pulito. | `fase-7:62-65,74` |
| F12 | `specialOnly` non in 6.2; il congelamento vieta ridenominazioni e rimozioni, non le aggiunte. | `fase-6:272` |
| F19 | Due secret per scopo: `SCHEDULER_SECRET_AVAILABILITY` e `SCHEDULER_SECRET_ANONYMIZATION`. | `ADR-105:73-75`; `fase-6:68-69` |
| F24 | Con `versions.drafts` e lettura pubblica, `?draft=true` espone le bozze [V]; `access.read` restituisce `{_status: {equals: 'published'}}` per i non autorizzati; prova in 4.1. | `fase-4:140,145` |
| F26 | Script `typecheck` = `next typegen && tsc --noEmit`; funziona su clone pulito [E]. | `fase-7:67` |
| 7.4 | Scrittura: `access.update` del Global ammette staff e manager `appRole`; i campi non consentiti sono scartati in silenzio [E]. | `fase-7:203,216` |
| N13 | F1 fuori dalla 7.0, con le cinque condizioni (§1). | `piano.yaml:1053-1057` |
| Regola di chiusura | Con l'affinamento di §0. | — |

### Rinviati e aperti

| Voce | Fase | Responsabile |
|---|---|---|
| **R1**: controllo esplicito sul login locale degli admin | prima della 8.3 | **Pianificatore** (testo); **Cursor** (codice e prova in 8.3) |
| R2, R6, R7 | 8.3, 8.5 | Pianificatore (testo) |
| R3, R4, R5 | 7.0, 7.4, ADR-115 | Pianificatore (testo) |
| Registrazione di ADR-115 («da registrare») | prima di 6.4 | **Umano** |
| F1/`po-10`: elenco degli admin attuali e invio della segnalazione al template | prima della 7.0 / entro la fine della Fase 7 | **Umano**; **template** (risposta) |
| Valori reali di `max_connections` e `--max-instances` | 7.0 (sezione operativa) | **Umano** |
| F27: `riepilogo-sessione-bucket-c.md` assente | — | **Umano** |
| Prove a runtime del codice non ancora scritto (7.0, 4.1 `draft`, 4.2 Redirects, 7.4, 8.3) | fasi indicate | **Cursor** |
| ADR-111 (contratto con i siti; token delle bozze) | 4.3 Parte A | **Pianificatore** |
| ADR-114 (CORS e abuso del form) | prima di 5.2 | **Pianificatore** |
| `fase-5-sistema-prenotazioni.md` | quando arriva | **Pianificatore** (voci già in `piano.yaml:162-178`) |
| Verifica in produzione di login locale ed email (8.6) | dopo 6.6 e 8.5 | **Umano** (`po-03`) |
| Rilettura delle Fasi 4, 5 e 6 al loro turno | al loro turno | **Chi verifica** |

---

## 8. Un ulteriore giro di verifica avrebbe senso?

**Per la 7.0 → 8.2: no.** Le istruzioni sono state eseguite (7.0), le affermazioni su Payload sono state provate (7.4, F1, F2, F10) e i punti aperti sono testi di poche righe. Cercare altri rilievi sullo stesso materiale darebbe rilievi A di forma, non di sostanza.

**Quello che un altro giro potrebbe ancora trovare, in ordine di valore:**
1. **Una sola correzione mirata (R1)**, da rileggere quando il pianificatore l'avrà applicata: verificare che il testo sia eseguibile e che non crei una nuova contraddizione con 8.4 e con la matrice di `fase-2-login.md` (non letta in questo giro nella parte della matrice). Basta un diff.
2. **Cose che non so se esistano**: nel materiale non letto (`fase-1`, `fase-2`, `fase-3`, la maggior parte di `docs/operativo/`, i riepiloghi del Project) può esserci un'incoerenza con le correzioni, ma non c'è motivo di aspettarsela.
3. **Il confronto tra ciò che Cursor scrive e ciò che il piano chiede**: dopo l'esecuzione della 7.0, rileggere il suo CHANGELOG (voci Tests) contro la checklist. È una verifica sul prodotto, non sul piano, e sarebbe utile.

**Quello che un giro sul piano non può trovare** (resta «da provare a runtime da Cursor»): `pnpm build` in produzione; il login Google SSO; la CLI di shadcn con Tailwind v4; il rendering Admin di un Global con tab vuote; il comportamento di `admin.hidden` per ruolo; due istanze del plugin Redirects con un database; il `PATCH` in blocco prima della correzione; il comportamento delle migrazioni di ADR-115; tutto ciò che richiede GCP o Firebase.

**Consiglio**: nessun altro giro di verifica sulle Fasi 7 e 8 oltre alla rilettura di R1. Le Fasi 6, 4 e 5 si riguardano quando arrivano, come proposto. Un controllo utile dopo la 7.0 è sul prodotto (CHANGELOG di Cursor contro la checklist), non sul piano.

---

## 9. Non verificato, e perché

- **`pnpm build`**: non eseguito (font di Google non raggiungibili). `fase-7:46` («`pnpm build` riuscito») resta un'affermazione del pianificatore.
- **Login Google SSO** (Admin e App): non provato; per le prove ho usato il login locale (`/api/users/login/local`) e, per F1, un JWT firmato con il secret di prova.
- **Interfaccia Admin**: la disattivazione l'ho fatta via REST, non dall'interfaccia; il rendering di un Global con tab vuote non l'ho verificato.
- **`PATCH` in blocco prima della correzione di F1**: non provato (provato solo dopo).
- **Esecuzione dell'azione umana su produzione**: non possibile da qui; ho verificato la query sullo schema e letto `scripts/prod-db.sh` e la nota operativa.
- **CLI di shadcn** (8.1): non verificata (registry non raggiungibile).
- **Matrice di `fase-2-login.md`** (aggiornamento previsto in 8.3 punto 4), **ADR-004 del template** (letto nel giro precedente a `461f54e`), `fase-1`, `fase-3`, `docs/operativo/*` (salvo `cloud-sql-produzione.md`), riepiloghi del Project: non riletti.
- **Fasi 4, 5, 6 oltre le parti toccate dalle correzioni**: non ricontrollate (come da regola di chiusura).
