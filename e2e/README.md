# Verifica e2e Area App (Playwright Test)

Motore v2 descritto in `docs/design/verifica/percorso-test-v2.md`.

## Comandi

```bash
pnpm e2e:smoke    # suite di fumo (~60 s, progetto telefono-390-chiaro)
pnpm e2e          # tutti i progetti definiti in playwright.config.ts
pnpm e2e:wire     # cablaggio id controlli ↔ test / NON PROVATO
pnpm typecheck    # include e2e/tsconfig.json
```

## Avanzamento

```bash
tail -f .next/e2e-progress.log
```

## Esiti

`docs/design/verifica/esiti/<data>-T0/` — `rapporto.md`, `risultati.json`, screenshot in `img/`.

## Variabili

- `PAYLOAD_DISABLE_PUSH=1` — niente push schema interattivo durante i test (impostata dal config).
- Un solo giro: lock in `.next/e2e.lock` (PID).
