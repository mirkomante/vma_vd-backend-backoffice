# Verifica mirata della 7.0b e di ADR-116

- **Repository**: `mirkomante/vma_vd-backend-backoffice`, `main`
- **SHA di HEAD verificato**: `4e736b050be633ae8cc82cdcf7070856a6d9f190`. Due commit sopra `b7f6092`: `248b517` («registra fase-7.0b e ADR-116») e `4e736b0` («sposta il report in docs/audit»).
- **Data**: 2026-10-05 · **Modalità**: sola lettura. Nel clone di HEAD `git status` è pulito. Le prove sono in un secondo clone (`v6-run`) con PostgreSQL 16 locale (produzione: 18), Node 24.21.0, pnpm 11.18.0 e variabili fittizie.
- **Il codice non è cambiato** [L]: `git diff b7f6092 HEAD --name-only` elenca 9 file, tutti in `docs/`.
- **Legenda**: [L] letto · [E] eseguito · [D] dedotto. Gravità: **B** bloccante · **P** da correggere prima della fase interessata · **A** da annotare.

---

## Giudizi

**Cursor può eseguire la 7.0b? Sì con riserve.** Le riserve sono due rilievi P, da correggere prima di avviarla: il passo 4 non è eseguibile sul database di sviluppo (T1) e il passo 7 chiede di modificare un file che non contiene il vincolo (T2). Con un database di prova vuoto per il passo 4, l'esito coincide con il report.

**ADR-116 coerente? No, per un solo punto.** Le convenzioni coincidono con il report (§ 2.3 e § 2.5) e non contraddicono il piano. Manca la correzione di una frase sul codice: `asUserAccessFields` non è «l'unico punto da cambiare alla migrazione» e i 15 usi di `TypedUser` non sono in `collections` né in `globals` (T3).

---

## 1. Esecuzione della 7.0 e poi della 7.0b nel clone

Ho applicato la 7.0 come scritta (F2 `isActiveUser` e le quattro funzioni, F9 `pool.max: 3`, F10 `graphql ^16.8.1` e `graphQL.disable`, F26 script `typecheck`; la parte documentale di F9 no). Poi i passi 1–5 e 8 della 7.0b. Il passo 6 (runtime con credenziali) e la parte «Produzione» non sono eseguibili qui.

| Prova | Report (baseline `bb95fda`) | Clone: 7.0 + 7.0b | Coincide |
|---|---|---|---|
| Lockfile dopo la 7.0 | n/d | 44+/44− (88 righe); controllo normalizzato: **18** righe | Sì (come scrive la 7.0) |
| `pnpm install` con 3.90.2 | OK | OK | Sì |
| Lockfile della 7.0b | +464/−265 | **+464/−265** (729 righe) | Sì, identico |
| `git diff package.json` (7.0b) | n/d | 14 righe di diff: 7 tolte, 7 aggiunte (i sette pacchetti) | Sì |
| `pnpm peers check` | solo `graphql` non soddisfatto | «No peer dependency issues found» | **No, come previsto**: con `^16.8.1` è pulito |
| `generate:types` (con variabili OAuth) | +2 righe | +2 righe (`resetPasswordRequestedAt` in `User` e `UsersSelect`) | Sì |
| `migrate:create` | un solo `ADD COLUMN` | `ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;` | Sì |
| `migrate` · `payload migrate:down` · `migrate` | OK | OK; la colonna sparisce e ricompare | Sì |
| `pnpm typecheck` | `tsc` OK | exit 0 | Sì |
| `pnpm lint` | n/d | 0 errori, 12 avvisi (8 della 7.0 + 4 nella nuova migrazione) | n/d |
| `pnpm build` (font sostituiti nel clone) | OK | OK, `BUILD_EXIT=0` | Sì |
| Avvio del build | route identiche alla 3.89.0 | `/admin/login` 200, `/app/login` 200, `/api/users/me` 200, `/api/users` anonimo 403, `POST /api/graphql` **404** | Sì |

**Con `graphql ^16` cambia qualcosa rispetto al report?** Sì, una cosa sola [E]: `peers check` è pulito (il report lo dava con `graphql` non soddisfatto). Lockfile, tipi, migrazione e build restano uguali. Con `graphQL.disable` `POST /api/graphql` risponde 404.

**I passi sono eseguibili come scritti?**
- Passi 1, 2, 3, 5 e 8: **sì** [E]. `pnpm migrate:down` non esiste come script (`package.json` ha `migrate`, `migrate:status`, `migrate:create`), ma il Ripristino scrive `pnpm payload migrate:down`, che funziona [E].
- Passo 4: **no** sul database di sviluppo (T1).
- Passo 7: **a metà** (T2).
- Passo 6 e Produzione: non eseguiti.

## 2. Affermazioni della 7.0b che non stanno nel report

| Affermazione | Esito |
|---|---|
| Ordine 7.0 → 7.0b → 7.1 | **Regge** [L][E]. La 7.0b usa `pnpm typecheck` e `graphql ^16` della 7.0 (`arco-49`); la 7.0 non ha migrazioni; le migrazioni successive vengono dopo la 7.0b. `piano.yaml`, `00-piano-generale.md` e `fase-7` coincidono. |
| Vincolo hard a `>= 3.90.0` solo alla chiusura | **Giusta nel principio** [D]: alzarlo prima renderebbe il repo non conforme al proprio vincolo. Il testo del passo 7 ha il problema T2. |
| Migrazione su Cloud SQL prima del push | **Coerente** col principio 3 di `fase-7` [L]. La colonna è additiva e nullable e la 3.89.0 ci gira: `seed:super-admin` con 3.89.0 su un DB con la colonna presente ha creato l'utente (`NODE_ENV=production`, senza push) [E]. Il caso inverso (codice 3.90.2 senza colonna) non l'ho provato: [D] errore sulle query di `users`. |
| Ripristino | **Regge** [E]: `migrate:down` e `migrate` provati; la 3.89.0 non contiene `authVersion` nel suo `dist` (grep di una sessione precedente), quindi non lo usa. Non ho provato il login con un token della 3.90.2 su una 3.89.0. |

## 3. ADR-116

**Coerente con il report e con il piano** [L]:
- Le convenzioni coincidono con § 2.5 del report (`overrideAccess` e `depth` espliciti, `versions` esplicito, niente nuovo `TypedUser`, API rimosse, `payload run`). Il criterio di migrazione e i requisiti (Node ≥ 24.15.0, Next ≥ 16.2.6, TypeScript ≥ 6.0.3, oggi `^5`) coincidono con § 2.2 e § 2.5.
- ADR-112 pone già `depth` «quanto basta» (riga 20), quindi non contraddice. `overrideAccess: false` è già in `fase-6` (principio 5 e riga 353). `fase-4` usa `versions: { drafts: true }` (riga 127) e `fase-6` dice «nessuna bozza» (riga 196), cioè `versions: false`.
- Nessuna API vietata compare nel piano fuori dai principi (grep).
- `authorship` non è nei tipi di configurazione di 3.90.2 [E]: l'incognita «non verificato» dell'ADR si chiude, e la convenzione non lo richiede.

**La frase sul codice è sbagliata** (T3). Dettaglio in § 4.

## 4. Nuovi rilievi

| ID | Gravità | Dove | Evidenza e correzione |
|---|---|---|---|
| **T1** | **P (prima della 7.0b)** | `fase-7:112` (passo 4) | [E] Ho allineato un DB con `next dev` su 3.89.0 (`payload_migrations` contiene `dev|-1`) e lanciato `payload migrate` dal clone 3.90.2: si ferma su «It looks like you've run Payload in dev mode … data loss will occur. Would you like to proceed? (y/N)»; con stdin chiuso nulla viene applicato (timeout, exit 124). [L] `cloud-sql-produzione.md:63` descrive lo stesso su `vma_vd_dev`, che `fase-1` dice allineato con `push`. Il passo dice «database locale con le migrazioni già applicate». **Correzione**: usare per il passo 4 e per la prova di `migrate:down` un database vuoto creato apposta e migrato con `pnpm migrate`; il database di sviluppo resta per il passo 6, dove il `push` aggiunge la colonna da solo. |
| **T2** | **P (prima della 7.0b)** | `fase-7:115` (passo 7), checklist `fase-7:134` | [L] Il passo e la checklist chiedono di alzare il vincolo «in `piano.yaml` e in `00-piano-generale.md`». In `00-piano-generale.md` non compare né `3.73` né la parola «vincolo» (grep). Il vincolo è in `piano.yaml:55`, in `.cursor/rules/stack/01a-db-postgres.mdc` (regola di catalogo, da non toccare), in `fase-1-db-postgres.md:21` (voce storica già spuntata) e in `tracciamento-processo-adr-dag.md`. **Correzione**: indicare solo `piano.yaml` (`meta.vincoli_hard`) oppure dire in quale riga di `00-piano-generale.md` va aggiunto. |
| **T3** | **P (prima di accettare ADR-116, e comunque prima della 7.1)** | `ADR-116` Decisione 1, 4º punto | [E] `grep` sul codice: le 15 righe con `TypedUser` sono in **4 file, tutti in `lib/`** (`activityLog/resolveAuthContext.ts`, `auth/googleOAuth/callbackEndpoint.ts`, `auth/jwt/isolatedJwtAuthStrategies.ts`, `auth/localLogin/completeLocalLoginSession.ts`); in `collections` e `globals` ce ne sono 0. [L] `asUserAccessFields(user: unknown)` non importa né usa `TypedUser`: non è il punto da cambiare. Esistono inoltre 8 cast diretti `as UserAccessFields` fuori da quella funzione (6 in `collections/Users.ts`, 1 in `callbackEndpoint.ts`, 1 in `lastLocalSuperAdmin.ts`); solo `Users.ts:57` riguarda `req.user`. **Correzione**: scrivere che alla migrazione si cambiano i 4 file di `lib/auth` e `lib/activityLog`; la regola per il codice nuovo («usare `asUserAccessFields(req.user)`») resta realizzabile. |

## 5. Regressioni e conteggi

Riprodotti [E]: archi **52** (nessun duplicato, nessun arco verso nodi inesistenti, nessun ciclo) · punti aperti: `po-10` e `po-11` · ogni arco `decisione` ha il suo ADR in `adr_da_scrivere` (16 voci, ADR-116 `proposta`) · ordine di esecuzione identico in `piano.yaml` e in `00-piano-generale.md` (4.0 → 7.0 → 7.0b → 7 → 8 → 6 → poi 4.x e 5) · riferimenti: nessuno nuovo; restano quelli già noti (regole di catalogo, ADR-111, ADR-114, `fase-5`, da scrivere) · CHANGELOG: le nuove voci descrivono solo documenti, nessuna voce su codice non cambiato · `docs/audit/payload-upgrade-2026-10-04.md` è identico al mio report (`diff` vuoto).

---

## Rinviati e aperti (aggiornata)

Le righe di verifica-5 restano com'erano (S1 era già chiuso). Si aggiungono:

| Voce | Fase | Responsabile |
|---|---|---|
| T1, T2: correggere il testo dei passi 4 e 7 | prima della 7.0b | **Pianificatore** |
| T3: correggere la frase di ADR-116 | prima di accettare ADR-116 / 7.1 | **Pianificatore** |
| Accettazione di ADR-116 (oggi `proposta`; i principi di `fase-6/7/8` lo citano già) | prima della 7.1 | **Umano** |
| `fase-6/7/8`: «API che la guida dichiara rimossa» elenca `useAPIKey`, che la guida cambia ma non rimuove | — | A, pianificatore |
| `fase-4:196`: l'opzione `api-clients` non dice più come si autentica senza `useAPIKey` | 4.3A (ADR-111) | A, pianificatore |
| `00-piano-generale.md:105` («Prossimo passo») nomina `po-10` ma non `po-11` | — | A, pianificatore |
| Prove a runtime della 7.0b: passo 6 (Google Admin, login locale App, attivazione, forgot e reset) | 7.0b | **Cursor**; credenziali: **umano** |
| Login reali dopo il deploy; `authVersion` nelle strategie isolate (già rinviato) | dopo 7.0b; `po-11` | **Umano**; **Cursor** |

**Non verificato**: passo 6 della 7.0b e parte «Produzione»; Google OAuth, invio con Resend, Postgres 18, Cloud SQL, Cloud Build; il caso «codice 3.90.2 senza colonna»; il login con un token 3.90.2 su 3.89.0.

**Limiti dell'ambiente**: nel clone di prova ho sostituito le font di Google dei due layout (rete bloccata nel sandbox); il repo non è stato toccato. Il codice della 7.0 nel clone l'ho scritto io seguendo il testo del passo, non è quello di Cursor.
