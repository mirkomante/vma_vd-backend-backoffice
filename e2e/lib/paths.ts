import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const E2E_DIR = fileURLToPath(new URL('..', import.meta.url))
export const REPO_ROOT = join(E2E_DIR, '..')
export const NEXT_DIR = join(REPO_ROOT, '.next')
export const E2E_LOCK = join(NEXT_DIR, 'e2e.lock')
export const E2E_RUN_META = join(NEXT_DIR, 'e2e-run.json')
export const E2E_STORAGE_STATE = join(NEXT_DIR, 'e2e-storage-state.json')
export const E2E_BUILD_CACHE = join(NEXT_DIR, 'e2e-build.json')
export const E2E_PROGRESS_LOG = join(NEXT_DIR, 'e2e-progress.log')
export const E2E_ESITI_DIR = join(REPO_ROOT, 'docs/design/verifica/esiti/2026-10-19-T0')
