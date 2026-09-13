---
stato: validato
---

# Fase 3 — Variante provider auth: Google OAuth (produzione)

> Istruzioni operative per la Parte A della sottofase **3.3** di `fase-3-deploy.md`. Da allegare insieme a `fase-3-deploy.md` nella chat dedicata a quella sottofase. Vedi anche `auth/01a-google-oauth.mdc` nel catalogo regole.

---

## 3.3 Parte A — Redirect URI e URL pubblico (umano, console GCP)

**Prerequisito**: servizio Cloud Run raggiungibile (§ 3.2 Parte C). Le credenziali OAuth di produzione sono già nel gestore di secret (§ 3.2 Parte B).

**Checklist per l'umano**:

1. **Recuperare l'URL pubblico del servizio** assegnato dal deploy (senza trailing slash), e impostarlo come variabile URL pubblico sul servizio (completando quanto lasciato placeholder in § 3.2 Parte C).

2. **Client OAuth di produzione** (se non già creato in § 3.2 Parte B): un Client OAuth **dedicato alla produzione**, distinto da quello di sviluppo, nello stesso progetto Google Cloud e stesso consent screen.

3. **Registrare le redirect URI di produzione** sul Client OAuth di produzione, una per ciascuna istanza (Admin e App), usando l'URL pubblico reale ottenuto al punto 1.

4. **Smoke test rapido post-configurazione**: verificare che le pagine di login (Admin e App) rispondano 200 prima di procedere allo spike completo (vedi checklist generica in `fase-3-deploy.md` § 3.3).

**Attenzione per il futuro** (solo da tenere a mente, nessuna azione ora): se in futuro verrà collegato un dominio personalizzato al posto dell'URL assegnato da Cloud Run, sia l'URL pubblico sia le redirect URI andranno registrate di nuovo con il nuovo dominio — ripetere questa sottofase.

---

Al termine, torna a `fase-3-deploy.md`, sottofase 3.3, e completa lo spike end-to-end della checklist generica lì elencata (login SSO Admin/App, cookie `HttpOnly`+`Secure`, login locale, rifiuto identità non autorizzata) prima di passare a 3.4.
