import type { TextField, Validate } from 'payload'
import { text } from 'payload/shared'

/**
 * Nome localizzato obbligatorio solo nella lingua predefinita (ADR-108 / F-EN).
 * Nelle altre lingue accetta stringa vuota (riga DB NOT NULL con '').
 * La `validate` custom sostituisce quella predefinita del campo testo: delega a `text()` di Payload
 * con `required` attivo solo per `defaultLocale`.
 */
export const validateLocalizedRequiredName: Validate<string, unknown, unknown, TextField> = (
  value,
  options,
) => {
  const localization = options.req.payload.config.localization
  if (!localization) {
    return 'Configurazione localization mancante'
  }
  const defaultLocale = localization.defaultLocale
  const locale = options.req.locale ?? defaultLocale
  const requiredForLocale = locale === defaultLocale
  return text(value, {
    ...options,
    required: requiredForLocale,
  })
}
