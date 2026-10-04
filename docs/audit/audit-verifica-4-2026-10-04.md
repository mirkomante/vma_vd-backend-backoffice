# Chiusura — conferma della versione condivisa del piano

- **Repository**: https://github.com/mirkomante/vma_vd-backend-backoffice, ramo `main`
- **SHA di HEAD verificato**: `116033b87c24ffd6744b05a968082b9dc09ed133` (coincide con quello atteso; un solo commit sopra `7a5d537`: «applica le correzioni della verifica finale (R1-R7)»)
- **Data**: 2026-10-04
- **Modalità**: sola lettura sul repo (`git status` pulito dopo ogni prova). Le esecuzioni sono in una copia di lavoro con PostgreSQL 16 locale e Node 22.
- **Il codice non è cambiato** [L]: `git diff 7a5d537 HEAD --name-only` elenca solo file in `docs/`.
- **Legenda**: **[L]** letto · **[E]** eseguito nel mio sandbox · **[D]** dedotto.

---

## 0. Giudizi

**Cursor può partire dalla 7.0? Sì.** Le riserve del giro precedente (R3) sono tutte recepite: `PAYLOAD_SECRET`, `--data-urlencode` per l'email, l'`id` del secondo utente, la pulizia di `jar1.txt`/`jar2.txt`, il comando esatto dell'azione umana (`fase-7:48`, `:73`). Ho rieseguito il comando dell'azione umana nella forma scritta (`./scripts/prod-db.sh -- psql "<url>" -c "select email, admin_role, active from users where admin_role = 'admin';"`, con un URL locale e la porta del proxy cambiata): il wrapper e la query funzionano [E]. Restano due cose che non sono difetti del testo: l'azione umana su produzione la fa l'umano; `pnpm build` non l'ho potuto riprodurre (font di Google non raggiungibili) e resta un'affermazione del pianificatore in `fase-7:46`.

**Versione condivisa? Quasi: no, manca una frase nella checklist di 8.3 (S1, P).** Il resto è concordato. S1 non ferma né la 7.0–7.4 né la 8.1–8.2 (per la regola di avvio condivisa). Applicata S1, la versione è condivisa.

---

## 1. R1–R7

| ID | Stato | Evidenza |
|---|---|---|
| R1 | RECEPITO COME PROPOSTO | `fase-8:79` (5-bis, ultima parte); `:92` (nuova voce di checklist). Dettaglio in §2. |
| R2 | RECEPITO COME PROPOSTO | `fase-8:78`: «La regola vive in un solo punto: `canAccessSection` richiama `canAccessAppArea` (5-bis)…» |
| R3 | RECEPITO COME PROPOSTO | `fase-7:48`, `:73` (prerequisito `PAYLOAD_SECRET`; avvio del server dopo i passi 1–4; `--data-urlencode`; `id` nel JSON di `/api/users/me`; punto (8) pulizia dei cookie; comando esatto) |
| R4 | RECEPITO COME PROPOSTO | `fase-7:216`: «La prova rilegge il valore con un admin (o dal database)… scartato in silenzio» |
| R5 | RECEPITO COME PROPOSTO | `ADR-115:12`: «gli errori di scrittura del file di disponibilità (6.4)» |
| R6 | RECEPITO COME PROPOSTO | `fase-8:91` (prerequisito `allowApp`); `:191` (prova dell'admin dopo `/app/login` e con la sessione dell'Admin) |
| R7 | RECEPITO COME PROPOSTO | `fase-8:83`: una sola frase («Il controllo si applica in questa sottofase con il codice della segnalazione… arrivi o no la risposta del template») |

---

## 2. R1 nel dettaglio

**Il testo di 5-bis e la nuova voce di checklist sono eseguibili come scritti?** Sì, nel senso che il codice richiesto è univoco: `assertUserAllowedForAppLocalLogin` (`appLoginChecks.ts:18-27`) rifiuta ogni utente con `adminRole` diverso da `none`. L'ho applicato nella copia di lavoro e provato [E]:

| Caso | Esito misurato |
|---|---|
| Admin con `hash` residuo, `appRole: none`, password giusta su `POST /api/users/login/app` | **rifiutato** (302 a `/app/login?authFailed=1`) |
| Stesso utente con `appRole: manager` | **rifiutato** |
| Utente App con `adminRole: none`, `appRole: manager`, `loginMethod: local`, email verificata | **accettato** (302 a `/app`) |
| Utente App `sso-and-local` | **accettato** |
| Super-admin di bootstrap su `POST /api/users/login/local` (`/admin/login/local`) | **accettato** (302 a `/admin`): usa un altro endpoint e `bootstrapCredential*` |
| Super-admin di bootstrap sull'endpoint locale dell'App | **rifiutato**: già così oggi (non ha `hash`) |
| Impostare una password a un admin (`loginMethod: sso`) | 400 `Con metodo di accesso solo SSO non è possibile impostare una password locale.` (guardia già esistente) |

La regola non toglie l'accesso locale a nessun caso legittimo: `assertUserAllowedForAppLocalLogin` è usata solo da `appEndpoint.ts:54` [L, grep]; il bootstrap non vi passa.

**Contraddizioni?** Nessuna.
- **Con ADR-004 e con `localPasswordGuard`**: la nuova regola usa lo stesso criterio `adminRole !== 'none'` (`localPasswordGuard.ts:59,89`) e chiude l'unico percorso che lo aggirava (credenziali residue dopo una promozione) [E].
- **Con ADR-113 §4**: «solo `appRole: manager` può usare il login locale»; un utente con `adminRole: manager` non può avere credenziali locali, e ora non può usarle nemmeno se le aveva [L].
- **Con `fase-2-login.md`** [L, letto ora]: la matrice dei casi di creazione (`:63-70`) non ha una riga «login locale App». Le due righe pertinenti sono coerenti con R1: B (`:66`, admin con `appRole ≠ none`: «SSO obbligato per tutto il record») e D (`:68`, solo App locale: `adminRole: none`, l'unico caso con password). La checklist di 2.6 (`:173` e seguenti) descrive il flusso «ricerca utente → verifica password → verifica `active` → sessione» e non cita il controllo su `adminRole`. Il punto 4 di 8.3 (`fase-8:77`) chiede solo di aggiungere il caso del manager; non copre la nuova regola né l'etichetta «Solo Admin» della riga A (`:65`), che con 5-bis non è più esatta (l'admin ha accesso all'App). Sono due A, in tabella.
- **Con la 8.4** (`fase-8:151`): l'email «Account creato» cita l'indirizzo dell'App per `adminRole` admin o super-admin: coerente con 5-bis. Un A: l'email non dice che il dominio deve avere `allowApp` (R6 lo copre solo nella 8.3).

### S1 — la voce di checklist non prova nulla se l'email non è verificata (P, 8.3)

**Evidenza.** [L] `appLoginChecks.ts:23-25` rifiuta anche un utente con `emailVerified === false`. [E] Un utente App creato dall'Admin parte con `emailVerified` falso: con un utente non verificato `POST /api/users/login/app` risponde 302 a `?authFailed=1` **per qualunque password e per qualunque regola**. La voce di `fase-8:92` («è rifiutato… creando l'utente con `adminRole: none` e promuovendolo dopo») non chiede né la verifica dell'email né un controllo positivo prima della promozione: «rifiutato» è indistinguibile dal rifiuto per email non verificata, anche se il controllo di R1 non fosse scritto. È la stessa classe di M1 (prova che sembra riuscita senza provare nulla).

**Correzione proposta (testo esatto).** In `fase-8` §8.3, sostituire la voce di `:92` con:

> - [ ] Un utente con `adminRole` diverso da `none` e `hash`/`salt` residui (creato come utente App con login locale e poi promosso con `loginMethod: sso`) è rifiutato da `POST /api/users/login/app`, con `appRole: manager` e con `appRole: none`. Procedura sul database di sviluppo: (1) creare dall'Admin un utente `adminRole: none`, `appRole: manager`, `loginMethod: local`, con password; (2) **verificare l'email** (link di attivazione, oppure in sviluppo `update users set email_verified = true where email = '…'`): senza, ogni login dell'App è rifiutato e la prova non dimostra nulla; (3) **controllo positivo**: `curl -i -X POST http://localhost:3000/api/users/login/app --data-urlencode 'email=…' --data-urlencode 'password=…'` risponde 302 a `/app`; (4) promuoverlo con `PATCH` a `adminRole: admin` e `loginMethod: sso` (la password non viene toccata, `hash` e `salt` restano); (5) lo stesso `curl` ora risponde 302 a `/app/login?authFailed=1`, con `appRole: manager` e dopo averlo portato a `appRole: none`; (6) eliminare l'utente di prova (audit R1).

---

## 3. Fedeltà di segnalazione F1 e regola di avvio

- **Osservazione R1 nella segnalazione** (`segnalazione…:80`): fedele a quanto ho scritto. Descrive il percorso (utente App locale → `adminRole: admin` e `loginMethod: sso` → `hash`/`salt` restano → entra su `/app`), cita il commento del file («il confronto password fallisce da solo»), richiama ADR-004 e l'invariante, propone di rifiutare ogni `adminRole` diverso da `none` con lo stesso messaggio generico e dichiara «non verificato nel template». Una precisazione di attribuzione corretta: «verificato… dalla chat di verifica». Nulla da correggere.
- **Regola di avvio** (`00-piano-generale.md:105`): fedele al mio affinamento («non restano rilievi B né P che riguardano quella sottofase o quelle che la precedono nell'ordine di esecuzione; i P su sottofasi successive si correggono prima di avviarle; i rilievi A… nella tabella «Rinviati e aperti»»), con la dicitura «da confermare dall'umano». Il rimando allo stato condiviso punta a `docs/audit/audit-verifica-3-2026-10-04.md` §7, che è la tabella da aggiornare con questo report (§5).

---

## 4. Conteggi (riproduzione)

| Verifica | Esito |
|---|---|
| Archi | **50**, nessun duplicato, nessun arco verso nodi inesistenti, nessun ciclo [E] |
| Archi `decisione` senza ADR / archi `output` con `adr` | nessuno / nessuno [E] |
| Punti aperti | solo `po-10` (`piano.yaml:1053`) [E] |
| Riferimenti rotti (`arco-NN`, `po-NN`, `fase-N.M`) | nessuno; restano `fase-2.10`, `fase-3.3`, `fase-3.4`, sottofasi dei file di catalogo [E] |
| Ordine di esecuzione | identico in `piano.yaml` e `00-piano-generale.md`: 4.0 → 7.0 → 7 → 8 → 6 → (4.1–4.4, 5) [E] |
| CHANGELOG | `CHANGELOG:69` («Correzioni dalla verifica finale») descrive solo modifiche a documenti, tutte presenti nel diff; nessuna voce su codice cambiato [L] |
| Copia archiviata del report precedente | `docs/audit/audit-verifica-3-2026-10-04.md` coincide con il mio file (0 differenze) [E] |

---

## 5. Stato condiviso

### Concordato

**Nessun cambiamento rispetto a `audit-verifica-3-2026-10-04.md` §7**: tutte le voci restano valide (F1, F2, F3, F4, F5/N5, F7, F9/N4, F10, F12, F19, F24, F26, 7.4, N13, regola di chiusura). Una voce si **rafforza**:

| Voce | Cambiamento |
|---|---|
| Login locale dell'App | **Aggiunta.** Il login locale dell'App è solo per `adminRole: none`; rifiutato per ogni altro valore, anche con `hash` residuo; provato su otto casi (§2) [E]. Testo in `fase-8:79`. |

### Rinviati e aperti

| Voce | Fase | Responsabile |
|---|---|---|
| **S1**: prova di R1 con email verificata e controllo positivo | prima della 8.3 | **Pianificatore** (testo); **Cursor** (prova) |
| Azione umana su produzione: elenco degli admin attuali; nessun nuovo admin | prima della 7.0 | **Umano** |
| Invio della segnalazione F1/R1 al template | entro la fine della Fase 7 | **Umano**; **template** (risposta) |
| Conferma della regola di avvio («da confermare dall'umano») | prima della 7.0 | **Umano** |
| Registrazione dell'accettazione di ADR-115 («da registrare») | prima di 6.4 | **Umano** |
| Valori reali di `max_connections` e `--max-instances` | 7.0 (sezione operativa) | **Umano** |
| F27: `riepilogo-sessione-bucket-c.md` assente | — | **Umano** |
| Prove a runtime del codice non ancora scritto (7.0, 4.1 `draft`, 4.2 Redirects, 7.4, 8.3) | fasi indicate | **Cursor** |
| ADR-111, ADR-114, `fase-5-sistema-prenotazioni.md` | 4.3A / prima di 5.2 / quando arriva | **Pianificatore** |
| Verifica in produzione di login locale ed email (8.6) | dopo 6.6 e 8.5 | **Umano** (`po-03`) |
| *A:* `fase-2-login.md:65` (riga A «Solo Admin») non più esatta dopo 5-bis | 8.3, punto 4 | Pianificatore |
| *A:* `fase-2-login.md:173` (checklist 2.6) senza il controllo su `adminRole` | 8.3, punto 4 | Pianificatore |
| *A:* il commento di `appLoginChecks.ts` («il confronto password fallisce da solo») resta falso dopo R1 | 8.3 | Cursor |
| *A:* email «Account creato» per admin (`fase-8:151`) senza avviso su `allowApp` | 8.4 | Pianificatore |
| *A:* nessun arco `fase-8.3 → fase-8.5` per la regola di `canAccessAppArea` (la dipendenza c'è già: `arco-34`) | — | nessuno (nota) |

---

## 6. Non verificato

`pnpm build` (font di Google non raggiungibili); login Google SSO; interfaccia Admin (le prove sono via REST); azione umana su produzione (provata solo sul database locale); `PATCH` in blocco di F1 prima della correzione; CLI di shadcn. Il resto di `fase-2-login.md` oltre alla matrice e a 2.6, `fase-1`, `fase-3`, `docs/operativo/*` e i riepiloghi del Project non sono stati riletti (non toccati da questo commit).

---

**Dopo questo non servono altri giri di verifica sulle Fasi 7 e 8**, a una condizione: che il pianificatore applichi S1 (una voce di checklist in `fase-8:92`). Se S1 non fosse applicata, il rischio è una prova di sicurezza che risulta verde senza provare nulla; non impedisce di partire dalla 7.0 né dalla 8.2. Quello che resta da provare sono prove a runtime di Cursor, non verifiche sul piano.
