import {
  CLOUDBUILD_API_BASE_URL,
  CLOUDBUILD_METADATA_TOKEN_URL,
  MENU_REBUILD_CLIENT_TIMEOUT_MS,
  MENU_REBUILD_BUILD_ID_UNAVAILABLE,
  MENU_REBUILD_RUN_BODY_JSON,
} from './constants'
import { extractBuildIdFromOperation } from './extractBuildIdFromOperation'

export type CloudBuildRunOutcome = {
  buildId: string
}

export type MetadataTokenResponse = {
  access_token?: string
}

export type CloudBuildClientDeps = {
  fetchFn: typeof fetch
  getAccessToken: () => Promise<string>
}

async function defaultGetAccessTokenFromMetadata(fetchFn: typeof fetch): Promise<string> {
  const res = await fetchFn(CLOUDBUILD_METADATA_TOKEN_URL, {
    headers: { 'Metadata-Flavor': 'Google' },
  })
  if (!res.ok) {
    throw new Error(`Token metadata: HTTP ${res.status}`)
  }
  const json = (await res.json()) as MetadataTokenResponse
  const token = json.access_token?.trim()
  if (!token) {
    throw new Error('Token metadata: access_token assente')
  }
  return token
}

const defaultDeps: CloudBuildClientDeps = {
  fetchFn: fetch,
  getAccessToken: () => defaultGetAccessTokenFromMetadata(fetch),
}

let deps: CloudBuildClientDeps = defaultDeps

export function setCloudBuildClientDepsForTests(overrides: Partial<CloudBuildClientDeps> | null): void {
  if (!overrides) {
    deps = defaultDeps
    return
  }
  deps = { ...defaultDeps, ...overrides }
}

export function getCloudBuildClientDepsForTests(): CloudBuildClientDeps {
  return deps
}

/**
 * Avvia un trigger Cloud Build (POST …/{resourceName}:run).
 */
export async function runMenuRebuildCloudBuildTrigger(
  triggerResourceName: string,
): Promise<CloudBuildRunOutcome> {
  const trimmed = triggerResourceName.trim()
  if (!trimmed) {
    throw new Error('Nome risorsa trigger vuoto')
  }

  const url = `${CLOUDBUILD_API_BASE_URL}/${trimmed}:run`
  const abort = new AbortController()
  const timer = setTimeout(() => abort.abort(), MENU_REBUILD_CLIENT_TIMEOUT_MS)

  let token: string
  try {
    token = await deps.getAccessToken()
  } catch (error) {
    clearTimeout(timer)
    throw error
  }

  let res: Response
  try {
    res = await deps.fetchFn(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: MENU_REBUILD_RUN_BODY_JSON,
      signal: abort.signal,
    })
  } catch (error) {
    clearTimeout(timer)
    throw error
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Cloud Build run: HTTP ${res.status}${text ? ` — ${text.slice(0, 200)}` : ''}`)
  }

  let json: unknown
  try {
    json = await res.json()
  } catch {
    return { buildId: MENU_REBUILD_BUILD_ID_UNAVAILABLE }
  }

  const extracted = extractBuildIdFromOperation(json)
  return { buildId: extracted ?? MENU_REBUILD_BUILD_ID_UNAVAILABLE }
}