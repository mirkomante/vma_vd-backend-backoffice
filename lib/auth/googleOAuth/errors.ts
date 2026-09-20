/** Errore interno per rifiuto login OAuth; il messaggio non va esposto all’utente. */
export class OAuthLoginRejectedError extends Error {
  constructor() {
    super('OAuth login rejected')
    this.name = 'OAuthLoginRejectedError'
  }
}
