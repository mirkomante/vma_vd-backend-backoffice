import type { AppSection, UserAccessFields } from './roles'

/**
 * Controllo centralizzato accesso alle sezioni dell'Area App.
 * L'enforcement per singola sezione verrà collegato dallo sviluppo di Fase 5 (prenotazioni)
 * e Fase 6 (menù digitale); nessuna route lo invoca ancora.
 */
export function canAccessSection(user: UserAccessFields, section: AppSection): boolean {
  // Stub intenzionale: mappatura appRole/adminRole → sezione da implementare con le rispettive fasi.
  void user
  void section
  return false
}
