# ADR — Divisione dell'area di gestione

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 2 (`fase-2-login.md`, schema permessi granulari ed eventuale `admin.hidden` condizionale per ruolo) → Fase 5 (Sistema prenotazioni) e Fase 6 (Menù digitale) — `arco-07`, `arco-08` di `piano.yaml`. Arco cross-cutting: sblocca lo schema permessi di Fase 2 da cui dipende l'intero sviluppo di backoffice a valle.

## Contesto

L'assunto iniziale — "i manager non entrano mai in `/admin`" — è stato rivisto in sessione (`riepilogo-sessione-preview-e-aree-gestione.md` §2). Il backend Payload serve tre superfici di gestione ben distinte: contenuti dei due siti esterni (testi, pagine, media), gestione del menù digitale (piatti, disponibilità) e gestione delle prenotazioni ristorante. Serve decidere se tutte e tre condividono un'unica area, e se sì quale, prima che Fase 2 possa fissare lo schema permessi e prima che possa partire lo sviluppo reale di Fase 5 e Fase 6.

La decisione qui presa era rimasta parzialmente aperta in quattro punti tecnici (Bucket D — `riepilogo-sessione-bucket-d.md` §1/§3/§4), tutti ora chiusi e incorporati in questo ADR: comunicazione `(app)` ↔ Payload, autenticazione condivisa `/admin` ↔ `/app`, permessi granulari sui Global.

## Decisione

1. **Gestione contenuti CMS dei siti** (testi, pagine, media di vietnamonamour.com e villadoree.com) → Admin nativo di Payload, `(payload)`/`/admin`. I manager vi accedono con ruolo dedicato, ristretto alle sole collection/global pertinenti ai due siti.
2. **Gestione menù digitale** e **gestione prenotazioni ristorante** → web app dedicate, mobile-first, nel backoffice `(app)`/`/app`, costruite su misura con shadcn/ui (stack fisso di catalogo) — non nell'Admin nativo.
3. **Amministratori di sistema** → accesso completo sia a `(payload)` sia a `(app)`.
4. **Comunicazione `(app)` ↔ Payload**: nessuna deviazione dal default di catalogo (`payload-pattern/01-architettura.mdc`) — stesso progetto/deploy. Lato server via **Local API in-process**; lato client via REST/GraphQL same-origin (nessun CORS, nessun token Bearer, nessun secondo deploy). Distinto dal form pubblico di prenotazione e da menu.vietnamonamour.com, che restano REST+token perché processi realmente separati da Payload.
5. **Autenticazione condivisa**: lo schema `adminRole`/`appRole` (`ADR-001-schema-ruoli-baseline.md`) copre nativamente sia `/admin` sia `/app` tramite la stessa sessione Payload (cookie httpOnly) — nessun secondo login necessario. "Non cumulabili" nella baseline si riferisce al singolo campo `select`, non a mutua esclusione tra i due campi: un utente con `adminRole: admin` **e** `appRole: manager` valorizzati insieme è previsto e coerente.
6. **Permessi granulari sui Global**: coperti dal meccanismo nativo di Payload — funzione `access` a livello di Global e di singolo campo, anche annidato nei tab — già convenzionato e già applicato alle Collection del menù, nessuna funzionalità custom necessaria. Applicazione concreta confermata: `impostazioni-vma`/`impostazioni-villadoree` con read+update pieno per il manager; `impostazioni-sistema` con granularità campo-per-campo (sezione orari/chiusure di competenza manager, il resto — mittenti Resend, riferimento Google Calendar, contatti notifiche staff, slot integrazioni future — di competenza admin/super-admin). La struttura a tab dettagliata di `impostazioni-sistema` resta da progettare (fase-7.1, bloccata), ma il criterio granulare è già fissato da questo ADR.
7. **Terminologia route group confermata**: `(payload)` riservato e auto-generato; `(app)` con perimetro ristretto a menù digitale e prenotazioni (non più contenuti dei siti); "backoffice" resta etichetta di prodotto/UI, non un quarto route group tecnico.

## Alternative considerate

- **Assunto iniziale — un'unica web app di backoffice per tutto** (contenuti + menù + prenotazioni, manager mai in `/admin`) — scartato: poggiava su tre motivazioni, tutte superate in sessione. L'obiettivo di un'unica app era comunque impossibile, perché menù e prenotazioni richiedono UX mobile-first che l'Admin nativo non offre. L'UX migliore per i manager non è bloccante per la sola gestione contenuti. La separazione tra amministratori di sistema e manager è ottenibile per permessi/ruolo dentro `/admin`, senza bisogno di un'area fisicamente separata. Costruire un CMS ad-hoc per i contenuti dei due siti ricostruirebbe gratuitamente ciò che Payload Admin già fornisce — validazione campi, editor rich text, gestione upload/media, relation picker, draft/publish con versioning, permessi riflessi in UI, localizzazione — costo non giustificato per due siti vetrina.
- **REST + token anche per `(app)` ↔ Payload**, come se fosse un deployment separato — scartata: nessun elemento nei riepiloghi già chiusi giustifica di scalare o deployare `(app)` indipendentemente da Payload; il default di catalogo (stesso progetto/deploy) resta valido senza deviazioni motivate.

## Conseguenze

Fase 2 eredita l'obbligo di uno schema permessi granulare (ruolo manager ristretto su collection/global specifiche) e — punto aperto non bloccante, da chiudere in fase di specifica — l'eventuale `admin.hidden` condizionale per ruolo, per nascondere dalla sidebar di `/admin` le collection/global di menù e prenotazioni al manager, evitando due strade verso lo stesso dato.

L'intero sviluppo di Fase 5 (prenotazioni) e Fase 6 (menù) eredita l'architettura `(app)` via Local API same-project: nessuna necessità di gestire CORS, token Bearer o un secondo deploy per queste due aree, a differenza del form pubblico di prenotazione e del menù SSG pubblico, che restano REST+token per motivi distinti e invariati.

La granularità campo-per-campo su `impostazioni-sistema` resta bloccata nel dettaglio (dipende da fase-7.1, struttura a tab ancora da progettare), ma il criterio — orari/chiusure a manager, resto ad admin/super-admin — è già vincolante e non sarà rimesso in discussione quando quella sessione si sbloccherà.

Il perimetro effettivo di `(frontend)` resta esplicitamente non risolto da questo ADR — punto aperto, da chiarire quando si affronterà quel tema.
