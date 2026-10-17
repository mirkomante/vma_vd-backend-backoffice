import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

function resolveProjectFile(subpath) {
  const base = join(ROOT, subpath)
  if (existsSync(`${base}.ts`)) {
    return pathToFileURL(`${base}.ts`).href
  }
  if (existsSync(base)) {
    return pathToFileURL(base).href
  }
  return pathToFileURL(`${base}.ts`).href
}

/** Risolve `@/` e import relativi senza estensione verso `.ts` (node --experimental-strip-types). */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    return nextResolve(resolveProjectFile(specifier.slice(2)), context)
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (!/\.(ts|js|mjs|cjs|json)$/.test(specifier)) {
      try {
        return await nextResolve(specifier, context)
      } catch (error) {
        if (error?.code === 'ERR_MODULE_NOT_FOUND') {
          return nextResolve(`${specifier}.ts`, context)
        }
        throw error
      }
    }
  }

  return nextResolve(specifier, context)
}
