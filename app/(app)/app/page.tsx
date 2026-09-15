/**
 * Placeholder Fase 1 — verifica Tailwind (sottofase 1.4).
 * Il path URL `/app` non coincide con la cartella di progetto `app/` (route group `(app)`).
 */
export default function AppHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <p className="rounded-lg bg-emerald-600 px-4 py-2 text-lg font-semibold text-white shadow-md">
        Tailwind attivo — Area App (placeholder)
      </p>
      <p className="max-w-md text-center text-sm text-zinc-600">
        Pagina temporanea per la chiusura della Fase 1; il login e le funzionalità operative
        arrivano in Fase 2.
      </p>
    </main>
  )
}
