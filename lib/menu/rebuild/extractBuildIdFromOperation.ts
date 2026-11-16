/**
 * Estrae l'id build dalla risposta `Operation` di triggers.run (metadata.build.id).
 */
export function extractBuildIdFromOperation(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return null
  }
  const metadata = (body as { metadata?: unknown }).metadata
  if (!metadata || typeof metadata !== 'object') {
    return null
  }
  const build = (metadata as { build?: unknown }).build
  if (!build || typeof build !== 'object') {
    return null
  }
  const id = (build as { id?: unknown }).id
  if (typeof id !== 'string' || id.trim() === '') {
    return null
  }
  return id.trim()
}