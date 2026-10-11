import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '../../..')

/** Estrae stringhe export const NAME = '...' dai file lib (apostrofi tipografici inclusi). */
export function loadAuthMessages() {
  const login = readFileSync(join(ROOT, 'lib/auth/loginMessages.ts'), 'utf8')
  const local = readFileSync(join(ROOT, 'lib/auth/localEmail/messages.ts'), 'utf8')
  const pick = (src, name) => {
    const re = new RegExp(`export const ${name}\\s*=\\s*['\`]([^'\`]+)['\`]`)
    const m = src.match(re)
    if (!m) throw new Error(`Costante ${name} non trovata`)
    return m[1]
  }
  return {
    GENERIC_LOGIN_FAILURE_MESSAGE: pick(login, 'GENERIC_LOGIN_FAILURE_MESSAGE'),
    GENERIC_FORGOT_PASSWORD_SENT_MESSAGE: pick(local, 'GENERIC_FORGOT_PASSWORD_SENT_MESSAGE'),
    GENERIC_VERIFY_FAILURE_MESSAGE: pick(local, 'GENERIC_VERIFY_FAILURE_MESSAGE'),
    GENERIC_RESET_FAILURE_MESSAGE: pick(local, 'GENERIC_RESET_FAILURE_MESSAGE'),
    VERIFY_SUCCESS_MESSAGE: pick(local, 'VERIFY_SUCCESS_MESSAGE'),
    RESET_SUCCESS_MESSAGE: pick(local, 'RESET_SUCCESS_MESSAGE'),
  }
}
