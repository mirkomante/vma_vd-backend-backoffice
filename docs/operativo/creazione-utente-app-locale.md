---
stato: validato
---

# Creazione utente App con login locale (Admin Payload)

Nota operativa per la sottofase **2.6**. Il pannello `/admin` crea i record in `users`; il login avviene su `/app`.

## Perché il form Admin è diverso dal template Payload

Con `disableLocalStrategy` (necessario per SSO-only su `/admin/login`) Payload **non mostra** il blocco auth nativo «password / cambia password». Il progetto aggiunge un campo `password` esplicito in `collections/Users.ts`, visibile solo quando:

- **App Role** ≠ «Nessuno» (es. Manager), e
- **Login Method** = «Solo credenziali locali» o «SSO e locale».

## Procedura consigliata (test o produzione dati)

1. Email, **App Role** = Manager (o altro ruolo App futuro), **Login Method** = locale o misto.
2. Compilare **Password** e **Ripetere la password** (devono coincidere; policy: 8+ caratteri, maiuscola, minuscola, cifra).
3. Selezionare **Active** (default deselezionato, ADR-004): senza spunta l’utente non può entrare finché non è attivato esplicitamente; la verifica email è un passo separato.
4. Salvare → parte l’email di attivazione (Resend) con link `/app/login/verify?token=...`.
5. L’utente apre il link, poi accede su `/app/login` con email e password.

**Email Verified** non compare nel form: lo impostano gli hook (`emailVerified: false` finché non verifica). Non va spuntato a mano.

## Utenti solo SSO (Admin Workspace)

**Login Method** = «Solo SSO (Google)», **App Role** o **Admin Role** secondo policy. Nessun campo password. `emailVerified` resta implicitamente ok per il flusso SSO.

## Riferimenti

- Piano: `docs/piano-sviluppo/fase-2-login.md` §2.6, `fase-2-email-resend.md`
- Pattern auth: `.cursor/rules/payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`
