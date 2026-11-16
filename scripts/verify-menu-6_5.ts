/**
 * Verifica fase 6.5 I1 — richiede vma_vd_dev (`DATABASE_URL` locale).
 * Nessuna chiamata a Google Cloud: client Cloud Build finto via dipendenze iniettabili.
 *
 *   pnpm verify:menu-6_5
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { MENU_REBUILD_BUILD_ID_UNAVAILABLE, MENU_REBUILD_TRIGGER_NAME_ENV } from '@/lib/menu/rebuild/constants'
import { setCloudBuildClientDepsForTests } from '@/lib/menu/rebuild/cloudBuildClient'
import {
  handleMenuRebuildPost,
  setMenuRebuildHandlerDepsForTests,
} from '@/lib/menu/rebuild/menuRebuildEndpoint'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'
import {
  countRebuildStartedRows,
  deleteVerifyRebuildStartedRows,
  getVerifyRecords,
  makePayloadRequest,
  record,
  VERIFY_6_5_EMAIL_PREFIX,
} from './verify-menu-6_5-lib'

const TEST_PASSWORD = 'Verify6_5!AaBbCc'
const TEST_RUN_ID = Date.now().toString(36)
const FAKE_TRIGGER = `projects/vma-vd/locations/europe-west1/triggers/verify-6_5-${TEST_RUN_ID}`

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

const createdUserIds: number[] = []

async function createTestUser(
  payload: PayloadInstance,
  data: Pick<User, 'email' | 'adminRole' | 'appRole'> & { withLocalPassword?: boolean },
): Promise<User> {
  const loginMethod = data.withLocalPassword ? ('local' as const) : ('sso' as const)
  const created = await payload.create({
    collection: 'users',
    depth: 0,
    overrideAccess: true,
    data: {
      email: data.email,
      adminRole: data.adminRole,
      appRole: data.appRole,
      active: true,
      emailVerified: true,
      loginMethod,
      ...(data.withLocalPassword
        ? { password: TEST_PASSWORD, passwordConfirm: TEST_PASSWORD }
        : {}),
    },
  })
  createdUserIds.push(created.id)
  return created as User
}

async function deleteTestUsers(payload: PayloadInstance): Promise<void> {
  for (const id of createdUserIds.splice(0)) {
    try {
      await payload.delete({
        collection: 'users',
        id,
        depth: 0,
        overrideAccess: true,
      })
    } catch {
      // ignora se già eliminato
    }
  }
}

async function parseResponse(res: Response): Promise<{ status: number; json: { status?: string; buildId?: string } }> {
  const json = (await res.json().catch(() => ({}))) as { status?: string; buildId?: string }
  return { status: res.status, json }
}

async function latestRebuildStartedDetail(payload: PayloadInstance): Promise<string | null> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { eventType: { equals: 'systemAction' } },
        { detail: { contains: 'rebuild-started:' } },
      ],
    },
  })
  const row = found.docs[0] as { detail?: string; user?: unknown } | undefined
  if (!row?.detail) {
    return null
  }
  if (row.user != null && row.user !== '') {
    throw new Error('systemAction rebuild-started non deve avere utente')
  }
  return row.detail
}

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()

  const payload = await getPayload({ config })

  let clientCallCount = 0
  let injectableNow = new Date('2026-11-16T12:00:00.000Z')

  const prevTrigger = process.env[MENU_REBUILD_TRIGGER_NAME_ENV]
  process.env[MENU_REBUILD_TRIGGER_NAME_ENV] = FAKE_TRIGGER

  setMenuRebuildHandlerDepsForTests({
    getNow: () => injectableNow,
    runTrigger: async () => {
      clientCallCount += 1
      return { buildId: `fake-build-${clientCallCount}` }
    },
  })

  setCloudBuildClientDepsForTests({
    fetchFn: async () => {
      throw new Error('verify-6_5: fetch Cloud Build non atteso')
    },
    getAccessToken: async () => {
      throw new Error('verify-6_5: token metadata non atteso')
    },
  })

  try {
    await deleteVerifyRebuildStartedRows(payload)
    clientCallCount = 0

    // (a) senza sessione → 401
    {
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, undefined))
      const { status, json } = await parseResponse(res)
      if (status !== 401 || json.status !== 'unauthorized') {
        throw new Error(`(a) atteso 401 unauthorized, ottenuto ${status} ${JSON.stringify(json)}`)
      }
      record('(a) senza sessione', '401 unauthorized')
    }

    const noAppUser = await createTestUser(payload, {
      email: `${VERIFY_6_5_EMAIL_PREFIX}no-app-${TEST_RUN_ID}@example.test`,
      adminRole: 'manager',
      appRole: 'none',
    })

    // (b) utente senza accesso App → 403
    {
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, noAppUser))
      const { status, json } = await parseResponse(res)
      if (status !== 403 || json.status !== 'forbidden') {
        throw new Error(`(b) atteso 403 forbidden, ottenuto ${status}`)
      }
      record('(b) senza accesso App', '403 forbidden')
    }

    const managerUser = await createTestUser(payload, {
      email: `${VERIFY_6_5_EMAIL_PREFIX}manager-${TEST_RUN_ID}@example.test`,
      adminRole: 'none',
      appRole: 'manager',
      withLocalPassword: true,
    })

    const adminUser = await createTestUser(payload, {
      email: `${VERIFY_6_5_EMAIL_PREFIX}admin-${TEST_RUN_ID}@example.test`,
      adminRole: 'admin',
      appRole: 'none',
    })

    // (c) manager → 202 + systemAction
    {
      clientCallCount = 0
      await deleteVerifyRebuildStartedRows(payload)
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const { status, json } = await parseResponse(res)
      if (status !== 202 || json.status !== 'started' || !json.buildId) {
        throw new Error(`(c) atteso 202 started, ottenuto ${status}`)
      }
      const detail = await latestRebuildStartedDetail(payload)
      if (!detail?.includes('rebuild-started:') || !detail.includes(json.buildId)) {
        throw new Error(`(c) detail registro atteso con id build, ottenuto ${detail}`)
      }
      if (clientCallCount !== 1) {
        throw new Error(`(c) client finto doveva essere chiamato 1 volta, ${clientCallCount}`)
      }
      record('(c) manager', `202, detail ${detail}`)
    }

    // (d) admin → 202 + systemAction
    {
      clientCallCount = 0
      await deleteVerifyRebuildStartedRows(payload)
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, adminUser))
      const { status, json } = await parseResponse(res)
      if (status !== 202 || json.status !== 'started') {
        throw new Error(`(d) atteso 202, ottenuto ${status}`)
      }
      const detail = await latestRebuildStartedDetail(payload)
      if (!detail?.includes(json.buildId ?? '')) {
        throw new Error('(d) detail registro senza buildId')
      }
      if (clientCallCount !== 1) {
        throw new Error(`(d) client chiamate=${clientCallCount}`)
      }
      record('(d) admin', `202, ${detail}`)
    }

    // (e) secondo avvio entro 120 s → already-started
    {
      clientCallCount = 0
      await deleteVerifyRebuildStartedRows(payload)
      const first = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const firstParsed = await parseResponse(first)
      if (firstParsed.status !== 202) {
        throw new Error(`(e) primo avvio atteso 202, ${firstParsed.status}`)
      }
      const detail = await latestRebuildStartedDetail(payload)
      const found = await payload.find({
        collection: ACTIVITY_LOG_SLUG,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        sort: '-createdAt',
        where: { detail: { equals: detail ?? '' } },
      })
      const createdAt = (found.docs[0] as { createdAt?: string })?.createdAt
      if (!createdAt) {
        throw new Error('(e) createdAt mancante sulla riga rebuild-started')
      }
      injectableNow = new Date(new Date(createdAt).getTime() + 1_000)
      const rowsBeforeSecond = await countRebuildStartedRows(payload)
      const second = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const secondParsed = await parseResponse(second)
      if (secondParsed.status !== 200 || secondParsed.json.status !== 'already-started') {
        throw new Error(`(e) atteso 200 already-started, ${secondParsed.status}`)
      }
      if (clientCallCount !== 1) {
        throw new Error(`(e) client non doveva essere richiamato: chiamate=${clientCallCount}`)
      }
      const rowsAfterSecond = await countRebuildStartedRows(payload)
      if (rowsAfterSecond !== rowsBeforeSecond) {
        throw new Error('(e) aggiunta riga systemAction non attesa')
      }
      record('(e) debounce 120s', '200 already-started, client=1, nessuna riga nuova')
    }

    // (f) variabile assente → 503
    {
      clientCallCount = 0
      delete process.env[MENU_REBUILD_TRIGGER_NAME_ENV]
      const rowsBefore = await countRebuildStartedRows(payload)
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const parsed = await parseResponse(res)
      process.env[MENU_REBUILD_TRIGGER_NAME_ENV] = FAKE_TRIGGER
      if (parsed.status !== 503 || parsed.json.status !== 'unavailable') {
        throw new Error(`(f) atteso 503 unavailable, ${parsed.status}`)
      }
      if (clientCallCount !== 0) {
        throw new Error('(f) client non doveva essere chiamato')
      }
      const rowsAfter = await countRebuildStartedRows(payload)
      if (rowsAfter !== rowsBefore) {
        throw new Error('(f) riga systemAction non attesa')
      }
      record('(f) variabile assente', '503, nessuna riga')
    }

    // (g) client fallisce → 502
    {
      clientCallCount = 0
      await deleteVerifyRebuildStartedRows(payload)
      setMenuRebuildHandlerDepsForTests({
        getNow: () => injectableNow,
        runTrigger: async () => {
          clientCallCount += 1
          throw new Error('verify-6_5 simulated cloud build failure')
        },
      })
      const rowsBefore = await countRebuildStartedRows(payload)
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const parsed = await parseResponse(res)
      if (parsed.status !== 502 || parsed.json.status !== 'error') {
        throw new Error(`(g) atteso 502 error, ${parsed.status}`)
      }
      if (clientCallCount !== 1) {
        throw new Error('(g) client doveva essere invocato una volta')
      }
      const rowsAfter = await countRebuildStartedRows(payload)
      if (rowsAfter !== rowsBefore) {
        throw new Error('(g) nessuna riga attesa')
      }
      setMenuRebuildHandlerDepsForTests({
        getNow: () => injectableNow,
        runTrigger: async () => {
          clientCallCount += 1
          return { buildId: `fake-build-${clientCallCount}` }
        },
      })
      record('(g) client fallisce', '502, nessuna riga')
    }

    // (h) risposta senza id → 202 id non disponibile
    {
      clientCallCount = 0
      await deleteVerifyRebuildStartedRows(payload)
      setMenuRebuildHandlerDepsForTests({
        getNow: () => injectableNow,
        runTrigger: async () => {
          clientCallCount += 1
          return { buildId: MENU_REBUILD_BUILD_ID_UNAVAILABLE }
        },
      })
      const res = await handleMenuRebuildPost(makePayloadRequest(payload, managerUser))
      const parsed = await parseResponse(res)
      if (parsed.status !== 202 || parsed.json.buildId !== MENU_REBUILD_BUILD_ID_UNAVAILABLE) {
        throw new Error(`(h) atteso 202 con id non disponibile, ${JSON.stringify(parsed)}`)
      }
      const detail = await latestRebuildStartedDetail(payload)
      if (!detail?.includes(MENU_REBUILD_BUILD_ID_UNAVAILABLE)) {
        throw new Error(`(h) detail atteso id non disponibile, ${detail}`)
      }
      record('(h) senza id build', `202, ${detail}`)
    }

    const failed = getVerifyRecords().filter((r) => !r.ok)
    if (failed.length > 0) {
      throw new Error(`verify:menu-6_5: ${failed.length} controlli FALLITI`)
    }
    console.log('verify:menu-6_5: controlli superati')
  } finally {
    setMenuRebuildHandlerDepsForTests(null)
    setCloudBuildClientDepsForTests(null)
    if (prevTrigger === undefined) {
      delete process.env[MENU_REBUILD_TRIGGER_NAME_ENV]
    } else {
      process.env[MENU_REBUILD_TRIGGER_NAME_ENV] = prevTrigger
    }
    await deleteVerifyRebuildStartedRows(payload)
    await deleteTestUsers(payload)
    if (typeof payload.db?.destroy === 'function') {
      await payload.db.destroy()
    }
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`verify:menu-6_5 non riuscita: ${message}`)
  process.exit(1)
}