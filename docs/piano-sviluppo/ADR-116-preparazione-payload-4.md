# ADR — Preparazione a Payload 4: convenzioni in 3.x e criterio di migrazione

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0).

**Stato**: proposta
**Data**: 2026-10-04
**Arco di decisione**: `arco-50` (`fase-7.0b` → `fase-7.1`) e punto aperto `po-11`. Le convenzioni valgono per tutto il codice nuovo dalla 7.1 in poi (Fasi 7, 8, 6, poi 4 e 5). Fonte: `docs/audit/payload-upgrade-2026-10-04.md` § 2.

## Contesto

- Payload 4 esiste solo come canary (`4.0.0-canary.37`, 2026-09-24): nessuna beta, RC o stabile, nessuna data ufficiale. `payload-oauth2` (peer `payload ^3`) non dichiara supporto alla 4.
- La guida di migrazione 3 → 4 annuncia rotture che cambiano il comportamento **senza errori di compilazione**: `overrideAccess` falso di default nella Local API, `depth` di default 1, versioni attive di default su collection e Global, authorship attivo di default, tipi utente cambiati (`TypedUser` → `User`), JWT con `authVersion`.
- Le Fasi 7, 8 e 6 scrivono molto codice sulla Local API e su collection nuove: ogni chiamata o collection senza opzione esplicita cambierebbe comportamento in silenzio alla migrazione.
- L'aggiornamento alla 3.90.2 resta nella linea 3.x e **non** è oggetto di questa decisione (è la `fase-7.0b`).

## Decisione

1. **Convenzioni nel codice nuovo, in 3.x**:
   - `overrideAccess` sempre esplicito in ogni chiamata della Local API: `true` per script e seed, `false` con `user` quando si agisce per conto di un utente;
   - `depth` sempre esplicito nelle query;
   - `versions` esplicito (`false` o la configurazione voluta) su ogni collection e Global nuovi;
   - nessun nuovo import di `TypedUser`: il cast dei campi custom dell'utente passa da `asUserAccessFields` (`lib/auth/userAccess.ts`), l'unico punto da cambiare alla migrazione. I 15 usi esistenti (in `lib`, `collections`, `globals`) si portano su quel punto quando si toccano, e comunque alla migrazione;
   - nessuna delle API che la guida della 4 segnala come rimosse o cambiate: `useAPIKey`, `lexicalHTML` e `HTMLConverterFeature`, `typescriptSchema`, `allowLocalizedWithinLocalized`, `min`/`max` su relationship e upload, `afterOperation` con `operation: 'read'`;
   - script come file separati eseguiti con `payload run`; nessun `config.bin`.
2. **Criterio di migrazione alla 4**: solo quando esiste una **RC o una stabile**, dopo la chiusura delle Fasi 7, 8 e 6. Prima, una prova su ramo con la canary per chiudere due incognite: (a) i JWT con `disableLocalStrategy: { enableFields: true }`; (b) la compatibilità di `payload-oauth2`. Requisiti della 4: Node ≥ 24.15.0, Next ≥ 16.2.6, TypeScript ≥ 6.0.3 (oggi `^5`).
3. **Registrazione**: punto aperto `po-11` («prima di avviare la migrazione alla 4»), chiuso quando una RC o una stabile esiste e la prova su ramo ha dato esito.

## Alternative considerate

- **Passare alla canary adesso** — scartata: nessuna beta né RC, `payload-oauth2` senza supporto dichiarato, JWT incerto, interfaccia con modifiche non documentate.
- **Non fare nulla fino alla 4** — scartata: le rotture silenziose (`overrideAccess`, `depth`, `versions`) si prevengono con convenzioni a costo quasi nullo; correggerle dopo costa una revisione di tutto il codice delle Fasi 7, 8 e 6.

## Conseguenze

- `fase-6`, `fase-7` e `fase-8` riportano le convenzioni nei «Principi trasversali»; `fase-4` e `fase-5` le riceveranno quando arrivano.
- In `fase-4` §4.3 l'opzione `api-clients` con `useAPIKey` non è più proponibile: `ADR-111` sceglie un meccanismo che non la usa.
- Nessuna regola di catalogo viene modificata.
- **Non verificato** (dal report): `payload run` nella 4; `authorship` già presente in 3.x; il comportamento di `disableLocalStrategy` con `enableFields` nella 4; le sezioni della guida lette solo nei titoli (storage, `useLocale`, adapter del router, `lexicalHTML`).
