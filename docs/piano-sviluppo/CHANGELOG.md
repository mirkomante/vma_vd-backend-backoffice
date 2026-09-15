# Changelog

Tutte le modifiche rilevanti a questo progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/). Versionamento semplificato legato alle fasi del progetto, non SemVer in senso stretto:
- **MINOR** (0.X.0): chiusura di una fase.
- **PATCH** (0.0.X): correzioni o modifiche minori dentro una fase già in corso.

Ogni voce sotto `[Unreleased]` va aggiunta prima di ogni commit (vedi `core/04-changelog-commit.mdc`), non a posteriori. Quando tutte le sottofasi di una fase risultano ✅, la sezione `[Unreleased]` va convertita nella versione corrispondente.

## [Unreleased]

### Added

- Fase 1.1: progetto Next.js (App Router, TypeScript strict, pnpm) inizializzato nella root del repo con `create-next-app` (`--no-tailwind`, nessun Payload). Stack scaffold: Next.js 16.3.5, React 19.2.8; `packageManager` impostato a `pnpm@11.18.0`.

### Changed

- Rinumerati i 9 ADR di progetto da `ADR-001`...`ADR-009` a `ADR-101`...`ADR-109` per eliminare la collisione di numerazione con le ADR di catalogo (`ADR-001-schema-ruoli-baseline.md`, `ADR-002-isolamento-istanze-sso.md`, `ADR-003-login-locale-app-default.md`, citate in `fase-2-login.md`). Rename puro: nessun contenuto decisionale modificato, nessuno stato cambiato (tutti restano `accettata`). Aggiornati i riferimenti incrociati in tutti i 9 file ADR, in `piano.yaml` (campi `file:` e note), in `.cursor/rules/core/01-proporzionalita.mdc` e in `fase-3-cloud-gcp.md`. `fase-2-login.md` non modificato (resta la versione di catalogo, non più ambigua con la nuova numerazione).

### Fixed

- Rimossa da `ADR-102-divisione-area-di-gestione.md` §5 una nota di disambiguazione testuale (catalogo vs progetto) resa superflua dalla rinumerazione sopra.


### Tests

- Fase 1.1: `pnpm dev` — server pronto su `http://localhost:3000`, `GET /` → 200; `pnpm exec tsc --noEmit` senza errori.
