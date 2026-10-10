# Patch di `app/(app)/app-ui.css`

Modifiche da applicare **all'inizio della 8.2**, prima di installare i componenti. Vengono dalle decisioni di `decisioni-layout-app.md` (D4, sezione 1) e dal rilievo P1 della prova su Orari. `pnpm ui:check` verifica che siano presenti (controlli C1 e C2).

**Stato**: preparata il 2026-10-10 sul file del repo (commit `655707a`). Non cambiano la struttura del file né `@source`: solo i punti sotto.

## 1. `overflow-x: hidden` → `clip` (P1)

Con `overflow` impostato su `html` e `body`, il `body` diventa un contenitore di scorrimento e **`position: sticky` smette di funzionare rispetto alla finestra**: la barra in alto scorre via e la barra di salvataggio non si aggancia (misurato: dopo uno scorrimento di 600 px la barra in alto era a −600 px). Con `overflow-x: clip` non si crea un contenitore di scorrimento e le barre restano agganciate, senza scorrimento orizzontale.

In `@layer base`, regola `html, body`:

```css
/* prima */
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

/* dopo */
html,
body {
  max-width: 100vw;
  overflow-x: clip;
}
```

## 2. `color-scheme` esplicito (D4)

I controlli nativi del browser (campi ora e data, barre di scorrimento) devono seguire il tema scelto e non quello del sistema. Aggiungere dentro `@layer base`:

```css
:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}
```

## 3. Errore più scuro: `--destructive` chiaro (sezione 1 di `decisioni-layout-app.md`)

Nel blocco `:root`:

```css
/* prima */  --destructive: oklch(0.577 0.245 27.325);
/* dopo */   --destructive: oklch(0.505 0.21 22);
```

Il tema scuro (`.dark`) resta com'è.

## 4. `--sidebar-primary` neutro in tema scuro (D4)

In `.dark`, il valore di shadcn è un blu e rompe il tema neutro: il quadratino del blocco «Area App» diventava blu. Nel blocco `.dark`:

```css
/* prima */
--sidebar-primary: oklch(0.488 0.243 264.376);
--sidebar-primary-foreground: oklch(0.985 0 0);

/* dopo */
--sidebar-primary: oklch(0.922 0 0);
--sidebar-primary-foreground: oklch(0.205 0 0);
```

## 5. Classe personalizzata del pulsante Google: da rimuovere con la migrazione dell'accesso

In fondo al file ci sono `.google-oauth-login-button` e `.google-oauth-login-button:hover`, scritte con le variabili di Payload (`--theme-elevation-*`). Sono l'unica classe personalizzata di `(app)`. **Non si toccano in questa patch**: spariscono quando le pagine di accesso passano al componente `Button` (specifica di shell, accesso e home, 8.2). `pnpm ui:check` le segnala (C2) finché ci sono, ed è atteso.

## Verifica

- `pnpm ui:check`: i controlli C1 passano; C2 segnala solo `.google-oauth-login-button` fino alla migrazione dell'accesso.
- Con la barra in alto e, nelle schermate con modifiche, la barra di salvataggio: dopo uno scorrimento di 600 px restano agganciate (barra in alto con `top = 0`, barra di salvataggio con `bottom` uguale all'altezza della finestra).
- Nessuno scorrimento orizzontale a 360, 390 e 1280 px.
- `/admin` e `/` invariati (come nelle prove di 8.1: stessi hash dei CSS).
