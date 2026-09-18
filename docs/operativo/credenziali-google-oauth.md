---
stato: validato
---

# Credenziali Google OAuth (SSO Admin e App)

Nota operativa interna per chi gestisce autenticazione e deploy. Copre la sottofase **2.3** di `docs/piano-sviluppo/fase-2-login.md` e la variante `docs/piano-sviluppo/fase-2-auth-google-oauth.md`. Le integrazioni plugin (2.4 / 2.5) useranno gli stessi nomi di variabile e i path callback indicati sotto.

## Dove sono i segreti

| Ambiente | Dove | Cosa |
| -------- | ---- | ---- |
| **Sviluppo locale** | File `.env` nella root del repo ( **non** committato; vedi `.gitignore`) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| **Produzione** | Google Cloud Secret Manager sul servizio Cloud Run (Fase 3, `fase-3-cloud-gcp.md`) | Client OAuth **dedicato alla produzione** (distinto da quello di sviluppo), stesso consent screen / progetto GCP |

Valori reali **mai** nel codice sorgente, nei commit Git né in Payload. `.env.example` contiene solo placeholder.

## Console Google Cloud

1. [Google Cloud Console](https://console.cloud.google.com/) → progetto del team (creare o riusare uno esistente).
2. **APIs & Services → OAuth consent screen**
   - Preferibile **Internal** se esiste un’organizzazione Google Workspace (solo account dell’organizzazione).
   - **External** se non c’è Workspace organizzativo; il codice non cambia tra Internal ed External (stessi scope, client e redirect).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Tipo: **Web application**.
   - Un solo client di **sviluppo** può servire entrambe le istanze SSO (Admin e App): registrare **due** Authorized redirect URIs sullo stesso client.

### Scope OAuth

- `openid`
- `email`
- `profile`

(In configurazione plugin equivalgono agli scope Google standard `userinfo.email` / `userinfo.profile`.)

### Authorized redirect URIs — sviluppo locale

Base URL app in locale: `http://localhost:3000` (allineare `NEXT_PUBLIC_URL` in `.env`).

Path scelti per l’isolamento Admin/App (ADR catalogo isolamento istanze SSO; implementazione in 2.4 / 2.5 con `payload-oauth2`):

| Istanza | `strategyName` (previsto) | Redirect URI da registrare in GCP |
| ------- | ------------------------- | --------------------------------- |
| Admin (`/admin`) | `google-admin` | `http://localhost:3000/api/users/oauth/google-admin/callback` |
| App (`/app`) | `google-app` | `http://localhost:3000/api/users/oauth/google-app/callback` |

Authorized JavaScript origins (consigliato per locale): `http://localhost:3000`.

### Produzione

Redirect URI con l’URL pubblico reale del servizio (Fase 3, `fase-3-auth-google-oauth.md`), **client OAuth separato** da quello di sviluppo, stessa coppia di path (`google-admin` / `google-app`) sul dominio di produzione.

## Variabili d’ambiente (sviluppo)

Copiare da `.env.example` e valorizzare in `.env`:

- `NEXT_PUBLIC_URL` — base pubblica dell’app (locale: `http://localhost:3000`, senza slash finale).
- `GOOGLE_CLIENT_ID` — Client ID del client Web OAuth di **sviluppo**.
- `GOOGLE_CLIENT_SECRET` — Client secret associato.

Dopo averle impostate, la sottofase 2.3 si considera chiusa lato repo; l’integrazione plugin resta 2.4 / 2.5.

## Rotazione e accesso

- Chi modifica le credenziali deve aggiornare `.env` locale (dev) o i secret in GCP (prod) e verificare che i redirect URI in console corrispondano ancora ai path sopra.
- In caso di leak del client secret: revocare il secret in console, generarne uno nuovo, aggiornare `.env` / Secret Manager, **non** committare il nuovo valore.
