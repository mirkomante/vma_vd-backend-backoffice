---
stato: validato
---

# Credenziali Resend — email transazionali

Nota operativa per chi gestisce il backoffice. Copre la parte email della sottofase **2.6** di `docs/piano-sviluppo/fase-2-login.md` e `docs/piano-sviluppo/fase-2-email-resend.md`.

## Dove si trovano

- Dashboard: [https://resend.com](https://resend.com) → API Keys / Domains
- Variabili locali (non committate): `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME` in `.env`
- Placeholder committabili: `.env.example`

## Percorso mittente (decisione di §2.6)

Due percorsi legittimi, da scegliere prima di valorizzare `RESEND_FROM_ADDRESS`:

- **(a) Sandbox Resend** — `onboarding@resend.dev` (o equivalente mostrato in dashboard). Nessun DNS. Invia solo a indirizzi consentiti dal sandbox: basta a validare il flusso (attivazione, reset), non la deliverability reale. In Fase 3 (§3.2) va comunque verificato un dominio reale.
- **(b) Sottodominio dedicato verificato** — es. `mail.vietnamonamour.com`, mai il dominio radice. Isola la reputazione di invio e non tocca SPF/MX della posta aziendale. Permette di testare la deliverability già in sviluppo. Se il sottodominio non è quello finale di produzione, va sostituito in Fase 3.

`RESEND_FROM_NAME` deve essere riconoscibile (nome di progetto/brand), non un generico «No Reply».

## Sottodominio adottato (2026-09-20)

| Voce | Valore |
|---|---|
| Dominio in Resend | `mail.vietnamonamour.com` |
| `RESEND_FROM_ADDRESS` | `info@mail.vietnamonamour.com` |
| Stato dominio (2026-09-20) | Verified in dashboard Resend |
| `RESEND_FROM_NAME` | `Backoffice - Vietnamonamour` |

Stesso sottodominio previsto anche in produzione (Fase 3), salvo decisione contraria documentata.

## Cosa non fare

- Non committare la API key.
- Non usare il dominio radice come mittente.
- Non cambiare il from-address in produzione una volta scelto, salvo sostituzione pianificata del dominio in Fase 3.
