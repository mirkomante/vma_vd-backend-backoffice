# Segnalazione catalogo — un `admin` può promuoversi a `super-admin` con `update` su `users`

**Progetto:** `vma_vd-backend-backoffice`  
**Data:** 2026-10-04  
**Destinatario:** agente / maintainer del template (`cursor-payload-template`: `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`, `ADR-004-permessi-crud-utenti.md`, `fase-2-login.md`).  
**Origine:** audit di coerenza del progetto (HEAD `bb95fda`, rilievo F1), confermato rileggendo il codice. **Riprodotto a runtime il 2026-10-04** dalla chat di verifica, su una copia di lavoro con PostgreSQL locale: `PATCH /api/users/<id>` con `{"adminRole":"super-admin"}` eseguito da un `admin` restituisce 200 e il ruolo cambia (cookie firmato con il secret di prova; `PATCH` in blocco non provato).

---

## Sintomo

Un utente con `adminRole: admin` può portare sé stesso, o un altro admin, a `adminRole: super-admin` con un normale `update` della collection `users`. La matrice di `fase-2-login.md` dice che un admin non può assegnare `super-admin` solo per la riga `create`: per `update` la promozione non è coperta.

---

## Causa radice

1. Il pattern di `payload-pattern/04-…mdc` (§ «Pattern access control CRUD») dice: «Stessa struttura per `update` (senza `notSelf`…)». Per un admin la funzione restituisce quindi solo il filtro sul documento di **destinazione**, `{ adminRole: { not_equals: 'super-admin' } }`. Il filtro guarda lo stato **prima** dell'update e non dice nulla sul valore **in ingresso**.
2. Per `create` la stessa regola chiede di verificare `data.adminRole` in ingresso («`access.create` non ha un record su cui filtrare»). Per `update` il controllo equivalente manca nel pattern, nella matrice e nell'`ADR-004`.
3. Il campo `adminRole` non ha `access` per campo e nessun hook valida il valore in ingresso.
4. Aggravante (verificata dall'audit sui sorgenti di Payload 3.89.0, non riverificata qui): nell'aggiornamento **in blocco** (`PATCH /api/users?where=…`) Payload non passa `data` a `access.update` (`operations/update.js`, a differenza di `updateByID.js`). Un controllo scritto solo in `access.update` non copre quel percorso.
5. Nel template, `ADR-004` (decisione 3, `access.update`) dice che «ogni utente può modificare il proprio record»: letta alla lettera, senza escludere i campi di ruolo (`adminRole`, `appRole`, `active`, `loginMethod`), permette a qualunque utente di promuoversi. Nel progetto non avviene perché `usersUpdateAccess` richiede già uno staff admin, ma in un progetto che implementi la riga alla lettera sì. Il controllo sul valore in ingresso dei campi di ruolo va previsto per tutti gli attori, non solo per l'admin.

---

## Fix proposto (non ancora applicato nel progetto: lo attende dal catalogo)

Controllo in `beforeValidate` della collection `users`: copre sia l'update singolo sia quello in blocco; gli script con `overrideAccess` non hanno `req.user` e non ne sono toccati.

```ts
const incomingAdminRole = (data as UserWriteData | undefined)?.adminRole
const actor = req.user as UserAccessFields | null
if (
  actor &&
  incomingAdminRole === 'super-admin' &&
  actor.adminRole !== 'super-admin' &&
  (originalDoc as UserAccessFields | undefined)?.adminRole !== 'super-admin'
) {
  throw new ValidationError({
    collection: 'users',
    errors: [{ message: 'Solo un super-admin può assegnare il ruolo super-admin.', path: 'adminRole' }],
  })
}
```

---

## Cosa aggiornare nel template (checklist maintainer)

1. **`payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`**, § «Pattern access control CRUD»: per `update` il filtro `where` non sostituisce il controllo sul valore in ingresso di `adminRole`; il vincolo «un admin non-super non assegna `super-admin`» vale anche in `update` e va verificato in `beforeValidate` (copre l'aggiornamento in blocco).
2. **`ADR-004-permessi-crud-utenti.md`**: riga `update`, colonna admin: «sì, ma non può assegnare `adminRole: super-admin`» (come `create`).
3. **`fase-2-login.md`** (matrice e checklist): prova per ruolo: un admin che imposta `adminRole: super-admin` su sé stesso o su un altro admin è rifiutato, via REST (compreso `PATCH` con `where`) e via Local API con `overrideAccess: false`.
4. **`ADR-004-permessi-crud-utenti.md`**, decisione 3 (`access.update`): nessun attore, nemmeno su sé stesso, imposta `adminRole`, `appRole`, `active` o `loginMethod` oltre ciò che la matrice gli concede.

---

## Cosa **non** proporre come fix

- Solo una funzione `access.update` che legge `data`: non copre l'update in blocco.
- Nascondere `adminRole` nell'interfaccia: la REST resta aperta.
- `access.update` di campo riservato ai super-admin: è troppo largo, perché impedirebbe anche all'admin le modifiche legittime tra `none` e `admin`.

---

## Stato nel progetto reale

Il difetto è nel codice già in produzione (`lib/auth/userAccess.ts:73-82`, `collections/Users.ts:63-74` e hook `beforeValidate`, righe 186-230). Il rischio riguarda solo gli utenti con `adminRole: admin`. Finché la correzione non è applicata conviene non assegnare `adminRole: admin` a nuovi utenti e controllare chi lo ha oggi.

Il progetto traccia la correzione come `po-10`: la applica appena arriva dal catalogo, al più tardi nella sua Fase 8.3.
La segnalazione è scritta nel repo del progetto ma non risulta inviata al repo del template: l'invio è dell'umano (`po-10`). Finché la correzione non è applicata: elenco degli utenti con `adminRole: admin` verificato dall'umano e nessuna nuova assegnazione di `admin`.

---

## Osservazione correlata (F2) — da valutare

In `lib/auth/userAccess.ts` solo `canAccessAdminPanel` e `canAccessAppArea` controllano `active`; `isStaffAdminRequest` e `isSuperAdminRequest` no, e nemmeno le strategie JWT. Un utente disattivato con cookie ancora valido conserva i permessi via REST fino alla scadenza del token (predefinito 7200 secondi). Se quel file deriva dal template, valutare lo stesso helper unico che esclude gli utenti non attivi. Non verificato nel template.

---

## Evidenza nel repo reale

- `lib/auth/userAccess.ts:66,73-82` (solo `create` controlla `data.adminRole`)
- `collections/Users.ts:63-74` (campo `adminRole`), `:186-230` (hook `beforeValidate`)
- `audit-repo-2026-10-04.md`, rilievi F1 e F2

---

## Voce changelog catalogo suggerita

> **Security (permessi utenti):** the `update` access pattern for `users` filtered only the target document, so an `admin` could assign `adminRole: super-admin` to themselves or to another admin. Validate the incoming `adminRole` in a `beforeValidate` hook (it also covers bulk updates), and add the case to the CRUD matrix and to the role tests.
