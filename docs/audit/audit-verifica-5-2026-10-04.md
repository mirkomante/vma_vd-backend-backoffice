# Conferma di S1 — chiusura formale

- **Repository**: `mirkomante/vma_vd-backend-backoffice`, `main`
- **SHA di HEAD verificato**: `241b26263d75981513129a4313207fcd95d5ec0b` (coincide; un solo commit sopra `116033b`: «applica S1 e chiude la verifica finale»)
- **Data**: 2026-10-04 · **Modalità**: sola lettura sul repo (`git status` pulito); prove in una copia di lavoro con PostgreSQL 16 locale.
- **Il codice non è cambiato** [L]: `git diff 116033b HEAD --name-only` elenca solo file in `docs/`.
- **Legenda**: [L] letto · [E] eseguito.

---

## Giudizi

**Cursor può partire dalla 7.0? Sì.**

**Versione condivisa? Sì.** Non resta nessun rilievo B o P.

---

## 1. S1 — la voce di checklist è eseguibile come scritta? Sì [E]

`fase-8:92` ora ha email verificata, controllo positivo e rifiuto dopo la promozione. L'ho eseguita passo per passo nella copia di lavoro, con il codice di R1 e di 5-bis applicato (come lo scriverebbe Cursor in 8.3):

| Passo di `fase-8:92` | Esito |
|---|---|
| (1) creare un utente `adminRole: none`, `appRole: manager`, `loginMethod: local`, con password | `POST /api/users` → 201 |
| prima della verifica dell'email | `POST /api/users/login/app` → 302 a `/app/login?authFailed=1` (conferma che senza il passo (2) la prova non dimostrerebbe nulla) |
| (2) `update users set email_verified = true where email = '…'` | funziona |
| (3) controllo positivo con `curl … --data-urlencode` | 302 a `/app` |
| (4) `PATCH` a `adminRole: admin`, `loginMethod: sso` | 200; `hash` e `salt` restano (`has_hash = t`) |
| (5) stesso `curl`, `appRole: manager` e poi `appRole: none` | entrambi 302 a `/app/login?authFailed=1` |
| (6) eliminazione | 200, 0 righe |

Nota senza gravità: il testo non dice chi esegue il `PATCH` (serve il cookie di un admin o super-admin): in pratica quello del punto (1) o dell'Admin.

## 2. Le note A portate nel piano: fedeli? Sì [L]

| Mia nota (verifica-4, tabella «Rinviati e aperti») | Nel piano | Esito |
|---|---|---|
| Riga A «Solo Admin» di `fase-2-login.md:65` non più esatta | `fase-8:77` (punto 4): «Correggere anche l'etichetta della riga A…» | Fedele |
| Checklist 2.6 senza il controllo su `adminRole` | `fase-8:77`: «aggiungere alla checklist di 2.6 il controllo `adminRole !== 'none'`…» | Fedele |
| Commento di `appLoginChecks.ts` («il confronto password fallisce da solo») falso dopo R1 | `fase-8:79`, ultima frase | Fedele (cita il commento esatto) |
| Email «Account creato» senza avviso su `allowApp` | `fase-8:151`: «…l'accesso all'App con Google richiede… `allowApp` vero…; l'email non lo garantisce» | Fedele: documenta il limite senza imporre di cambiare il testo dell'email, che era il mio livello A |

Anche `CHANGELOG` e `00-piano-generale.md:105` descrivono correttamente il giro (la voce di CHANGELOG su verifica-4 riporta il mio giudizio: unico P residuo S1, poi versione condivisa).

## 3. Conteggi [E]

Archi **50**, nessun duplicato, nessun arco verso nodi inesistenti, nessun ciclo · punti aperti: solo `po-10` · riferimenti rotti: nessuno (restano `fase-2.10`, `fase-3.3`, `fase-3.4`, sottofasi dei file di catalogo) · ordine di esecuzione identico in `piano.yaml` e `00-piano-generale.md` (4.0 → 7.0 → 7 → 8 → 6) · `docs/audit/audit-verifica-4-2026-10-04.md` coincide con il mio file.

## 4. Nuovi rilievi

**Nessun rilievo B o P.**

---

## Rinviati e aperti (aggiornata)

**Cambia una sola riga rispetto a verifica-4: S1 è chiuso (rimosso).** Il resto resta com'era.

| Voce | Fase | Responsabile |
|---|---|---|
| Azione umana su produzione: elenco degli admin attuali; nessun nuovo admin | prima della 7.0 | **Umano** |
| Conferma della regola di avvio («da confermare dall'umano») | prima della 7.0 | **Umano** |
| Invio della segnalazione F1/R1 al template | entro la fine della Fase 7 | **Umano**; **template** (risposta) |
| Registrazione dell'accettazione di ADR-115 | prima di 6.4 | **Umano** |
| Valori reali di `max_connections` e `--max-instances` | 7.0 (sezione operativa) | **Umano** |
| F27: `riepilogo-sessione-bucket-c.md` assente | — | **Umano** |
| Prove a runtime del codice non ancora scritto (7.0, 4.1 `draft`, 4.2 Redirects, 7.4, 8.3) | fasi indicate | **Cursor** |
| Commento di `appLoginChecks.ts` da aggiornare | 8.3 | **Cursor** |
| Matrice e checklist 2.6 di `fase-2-login.md`; nota `allowApp` in 8.4 | 8.3, 8.4 | **Cursor** (eseguono le note già scritte) |
| ADR-111, ADR-114, `fase-5-sistema-prenotazioni.md` | 4.3A / prima di 5.2 / quando arriva | **Pianificatore** |
| Verifica in produzione di login locale ed email (8.6) | dopo 6.6 e 8.5 | **Umano** (`po-03`) |

**Non verificato**: `pnpm build` (font di Google non raggiungibili), login Google SSO, interfaccia Admin (prove via REST), CLI di shadcn.

Per la conferma di S1 non servono altri giri sulle Fasi 7 e 8.
