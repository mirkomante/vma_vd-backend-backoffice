/**
 * Verifica fase 6.4 — richiede vma_vd_dev e `pnpm dev` (salvo VERIFY_MENU_6_4_SKIP_DEV=1).
 * Login/logout REST obbligatori (salvo VERIFY_MENU_6_4_SKIP_LOGIN=1).
 *
 *   pnpm verify:menu-6_4
 *   pnpm verify:menu-6_4:migrate   # vma_vd_migr ricreato
 */
import config from '@payload-config'
import { getPayload, type CollectionSlug } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { logSystemAction } from '@/lib/activityLog/logSystemAction'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import { buildAvailabilityDocument } from '@/lib/menu/availability/buildAvailabilityDocument'
import {
  SCHEDULER_AVAILABILITY_SECRET_HEADER,
  SCHEDULER_SECRET_AVAILABILITY_ENV,
} from '@/lib/menu/availability/constants'
import { setAvailabilityStorageForTests } from '@/lib/menu/availability/gcsAvailabilityWriter'
import { loadMenuAvailabilityState } from '@/lib/menu/availability/loadMenuAvailabilityState'
import {
  boundaryInstantRome,
  listServiceStartBoundariesBetween,
} from '@/lib/menu/availability/serviceBoundaries'
import { dishAvailabilityStatus } from '@/lib/menu/availability/mapItemStatus'
import { resetAllDishesSoldOut } from '@/lib/menu/availability/resetDishesSoldOut'
import {
  formatBoundaryDetailSuffix,
  loadSchedulerBoundaryState,
} from '@/lib/menu/availability/schedulerState'
import {
  runSchedulerAvailabilityTick,
  serviceRowsFromGlobal,
} from '@/lib/menu/availability/runSchedulerTick'
import { syncMenuAvailabilityFile } from '@/lib/menu/availability/syncMenuAvailabilityFile'
import { createMemoryAvailabilityStorage } from '@/lib/menu/availability/testMemoryStorage'
import { validateAvailabilityDocument } from '@/lib/menu/availability/validateAvailabilityDocument'
import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  MENU_GENERAL_SLUG,
  MENU_SERVICES_SLUG,
} from '@/lib/menu/constants'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'
import {
  combinedImportContentFingerprintHash,
  fingerprintImportContentCollections,
} from './lib/import-menu-content-fingerprint'
import { runImportContentRoundtrip } from './lib/run-import-content-roundtrip'
import {
  assertDishStatusMatchesDb,
  appPublicUrl,
  assertDevServerReachable,
  extractPayloadTokenFromSetCookie,
  formatSetCookieForLog,
  forbiddenInProcess,
  importBulkContext,
  postScheduler,
  record,
  SCHEDULER_FORBIDDEN,
  SCHEDULER_OK,
  snapshotCounts,
  snapshotExists,
  wrapStorageFailingOnWrite,
} from './verify-menu-6_4-lib'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_PASSWORD = 'Verify6_4!AaBbCc'
const TEST_SCHEDULER_SECRET = 'verify-6_4-scheduler-secret-fixed-length-48chars!!'

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>
type CreatedRef = { collection: CollectionSlug; id: number | string }

function track(created: CreatedRef[], collection: CollectionSlug, id: number | string): void {
  created.push({ collection, id })
}

async function deleteProbeSystemActions(
  payload: PayloadInstance,
  options?: { includeResetLogs?: boolean },
): Promise<void> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 200,
    overrideAccess: true,
    where: { eventType: { equals: 'systemAction' } },
  })
  for (const row of found.docs) {
    const detail = (row as { detail?: string | null }).detail ?? ''
    const isProbe =
      detail.includes('verify-6_4') ||
      detail.includes('Verify64') ||
      detail.includes('availability-write-failed') ||
      detail.includes('availability-realigned')
    const isReset = detail.includes('availability-reset')
    if (!isProbe && !(options?.includeResetLogs && isReset)) {
      continue
    }
    await payload.delete({ collection: ACTIVITY_LOG_SLUG, id: row.id, overrideAccess: true, depth: 0 })
  }
}

async function findLatestDetailPrefix(
  payload: PayloadInstance,
  prefix: string,
): Promise<string | null> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 20,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [
        { eventType: { equals: 'systemAction' } },
        { detail: { contains: prefix } },
      ],
    },
  })
  const row = found.docs[0] as { detail?: string | null } | undefined
  return row?.detail ?? null
}

async function deleteAuthLogsForUser(
  payload: PayloadInstance,
  userId: number | string,
): Promise<void> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 50,
    overrideAccess: true,
    where: { user: { equals: userId } },
  })
  for (const row of found.docs) {
    await payload.delete({
      collection: ACTIVITY_LOG_SLUG,
      id: row.id,
      overrideAccess: true,
      depth: 0,
    })
  }
}

async function runRestLoginLogoutProbe(
  payload: PayloadInstance,
  onUserId: (id: number | string) => void,
): Promise<void> {
  const loginEmail = `verify64-${TEST_RUN_ID}@example.test`
  const created = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: loginEmail,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  const user = await payload.update({
    collection: 'users',
    id: created.id,
    overrideAccess: true,
    depth: 0,
    data: {
      loginMethod: 'local',
      emailVerified: true,
      password: TEST_PASSWORD,
      passwordConfirm: TEST_PASSWORD,
    },
  })
  onUserId(user.id)

  const loginRes = await fetch(`${appPublicUrl()}/api/users/login/app`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: loginEmail, password: TEST_PASSWORD }),
    redirect: 'manual',
  })
  const loginLocation = loginRes.headers.get('location') ?? ''
  record('login REST status', `${loginRes.status} (atteso 302)`)
  record('login REST Set-Cookie', formatSetCookieForLog(loginRes))
  record('login REST Location', loginLocation)

  if (loginRes.status !== 302 || loginLocation.includes('authFailed')) {
    throw new Error(
      `login/app fallito (${loginRes.status} ${loginLocation}). Stesso DATABASE_URL e PAYLOAD_SECRET su pnpm dev?`,
    )
  }

  const token = extractPayloadTokenFromSetCookie(loginRes)
  const loginLog = await findLatestAuthLog(payload, 'login', user.id)
  if (!loginLog?.user) {
    throw new Error('Registro attività: manca voce login con user valorizzato')
  }
  record('registro login', `id=${loginLog.id} user=${String(loginLog.user)}`)

  const logoutRes = await fetch(`${appPublicUrl()}/api/users/logout`, {
    method: 'POST',
    headers: {
      Cookie: `payload-token=${token}`,
      Accept: 'application/json',
    },
  })
  record('logout REST', `${logoutRes.status} (atteso 200)`)
  if (logoutRes.status !== 200) {
    throw new Error(`logout atteso 200, ricevuto ${logoutRes.status}`)
  }

  const logoutLog = await findLatestAuthLog(payload, 'logout', user.id)
  if (!logoutLog?.user) {
    throw new Error('Registro attività: manca voce logout con user valorizzato')
  }
  record('registro logout', `id=${logoutLog.id} user=${String(logoutLog.user)}`)
}

async function findLatestAuthLog(
  payload: PayloadInstance,
  eventType: 'login' | 'logout',
  userId: number | string,
): Promise<{ id: number | string; user: unknown } | null> {
  const found = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 5,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [{ eventType: { equals: eventType } }, { user: { equals: userId } }],
    },
  })
  const row = found.docs[0] as { id: number | string; user?: unknown } | undefined
  if (!row) {
    return null
  }
  return { id: row.id, user: row.user }
}

async function main(): Promise<void> {
  const skipDev = process.env.VERIFY_MENU_6_4_SKIP_DEV === '1'
  const skipLogin = process.env.VERIFY_MENU_6_4_SKIP_LOGIN === '1'
  if (skipDev) {
    console.warn(
      '\n*** VERIFY_MENU_6_4_SKIP_DEV=1: prove REST e dev server SALTATE (non valido per commit) ***\n',
    )
    record('flag SKIP_DEV', 'attivo — prove REST saltate')
  } else {
    await assertDevServerReachable()
  }

  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  const created: CreatedRef[] = []
  let createdUserId: number | string | null = null
  const memory = createMemoryAvailabilityStorage()
  setAvailabilityStorageForTests(memory)
  process.env.MENU_AVAILABILITY_GCS_BUCKET = 'verify-local-bucket'

  const globalBefore = await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  const settingsBefore = await payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  await deleteProbeSystemActions(payload)

  const countsBefore = await snapshotCounts(payload)
  const activityLogBefore = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })

  let importContentReference: string | null = null

  try {
    if (snapshotExists()) {
      const roundtrip = await runImportContentRoundtrip(payload, memory)
      record('import contenuto prima wipe', roundtrip.beforeCombined)
      record('import contenuto dopo reimport', roundtrip.afterCombined)
      record('import bulk scritture file (roundtrip iniziale)', `${roundtrip.writeCount} (atteso 1)`)
      if (roundtrip.beforeCombined !== roundtrip.afterCombined) {
        throw new Error(
          `Impronta contenuto roundtrip: prima=${roundtrip.beforeCombined} dopo=${roundtrip.afterCombined}`,
        )
      }
      if (roundtrip.writeCount !== 1) {
        throw new Error(`Import roundtrip: scritture attese 1, ricevute ${roundtrip.writeCount}`)
      }
      importContentReference = roundtrip.afterCombined
      record('import contenuto riferimento', importContentReference)
    } else {
      record('import contenuto roundtrip', `non provato (snapshot assente)`)
    }

    // --- Validatore + DST spring (già in 6.4) ---
    const springGap = boundaryInstantRome('2026-03-29', '02:30')
    if (!springGap) {
      throw new Error('boundaryInstantRome 2026-03-29 02:30 null')
    }
    record('orari DST primavera 2026-03-29 02:30', springGap.toISOString())

    const fallGap = boundaryInstantRome('2026-10-25', '02:30')
    record('orari DST autunno 2026-10-25 02:30', fallGap?.toISOString() ?? 'null')

    const services = [
      { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
      { name: 'dinner' as const, startTime: '19:30', endTime: '22:30' },
    ]
    const boundariesSample = listServiceStartBoundariesBetween(
      new Date('2026-10-12T08:00:00.000Z'),
      new Date('2026-10-13T11:00:00.000Z'),
      services,
    )
    record(
      'orari confini campione 12–13 ott',
      boundariesSample.map((b) => b.instant.toISOString()).join(', '),
    )

    const sundayBoundary = boundaryInstantRome('2026-10-12', '12:30')
    record(
      'orari riposo settimanale (confine domenica calcolato)',
      sundayBoundary?.toISOString() ?? 'null (lista confini non filtra giorni chiusi)',
    )
    const closureDayBoundary = boundaryInstantRome('2026-01-01', '12:30')
    record(
      'orari chiusura annuale (confine 1 gen calcolato)',
      closureDayBoundary?.toISOString() ?? 'null (lista confini non filtra chiusure)',
    )

    const state = await loadMenuAvailabilityState(payload)
    const validation = validateAvailabilityDocument(buildAvailabilityDocument(state, new Date()))
    if (!validation.ok) {
      throw new Error(validation.errors.join('; '))
    }

    const cat = await payload.create({
      collection: DISH_CATEGORIES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      data: { name: `Verify64 Cat ${TEST_RUN_ID}` },
    })
    track(created, DISH_CATEGORIES_SLUG, cat.id)

    memory.reset()
    const dish = await payload.create({
      collection: DISHES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      data: {
        name: `Verify64 Dish ${TEST_RUN_ID}`,
        price: 10,
        category: cat.id,
        soldOut: false,
      },
    })
    track(created, DISHES_SLUG, dish.id)
    record('riscrittura create', `scritture=${memory.getWriteCount()} (atteso 1)`)
    if (memory.getWriteCount() !== 1) {
      throw new Error('create write count')
    }

    memory.reset()
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { soldOut: true },
    })
    const afterSoldOut = await payload.findByID({
      collection: DISHES_SLUG,
      id: dish.id,
      depth: 0,
      overrideAccess: true,
    })
    assertDishStatusMatchesDb(memory.getRawContent(), dish.id, afterSoldOut as never)
    record(
      'sync soldOut hook vs DB post-commit',
      `file=${dishAvailabilityStatus(afterSoldOut as never)} DB soldOut=${(afterSoldOut as { soldOut?: boolean }).soldOut}`,
    )
    record('riscrittura soldOut', `scritture=${memory.getWriteCount()} (atteso 1)`)

    setAvailabilityStorageForTests(wrapStorageFailingOnWrite(memory))
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { soldOut: false },
    })
    const failDetail = await findLatestDetailPrefix(payload, 'availability-write-failed:')
    if (!failDetail?.startsWith('availability-write-failed:')) {
      throw new Error('Manca availability-write-failed')
    }
    record('scrittura fallita (salvataggio OK)', `detail=${failDetail}`)
    setAvailabilityStorageForTests(memory)

    memory.reset()
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { price: 11 },
    })
    record('riscrittura solo prezzo', `scritture=${memory.getWriteCount()} (atteso 0)`)
    if (memory.getWriteCount() !== 0) {
      throw new Error('price write count')
    }

    memory.reset()
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { name: `Verify64 Dish renamed ${TEST_RUN_ID}` },
    })
    record('riscrittura solo nome', `scritture=${memory.getWriteCount()} (atteso 0)`)

    memory.reset()
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { disabled: true },
    })
    record('riscrittura disabled', `scritture=${memory.getWriteCount()} (atteso 1)`)

    const service = await payload.create({
      collection: MENU_SERVICES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      data: { name: `Verify64 Service ${TEST_RUN_ID}`, price: 5 },
    })
    track(created, MENU_SERVICES_SLUG, service.id)
    memory.reset()
    await payload.delete({
      collection: MENU_SERVICES_SLUG,
      id: service.id,
      depth: 0,
      overrideAccess: true,
    })
    created.pop()
    record('riscrittura delete', `scritture=${memory.getWriteCount()} (atteso 1)`)

    const msgIt = `Verify64 global ${TEST_RUN_ID}`
    memory.reset()
    await payload.updateGlobal({
      slug: MENU_GENERAL_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { globalMessage: msgIt },
      locale: 'it',
    })
    const stateAfterGlobal = await loadMenuAvailabilityState(payload)
    const parsedGlobal = memory.getRawContent()
      ? (JSON.parse(memory.getRawContent()!) as { globalMessage?: { it?: string } })
      : {}
    const hasMsg =
      stateAfterGlobal.globalMessageIt.includes(msgIt) ||
      (parsedGlobal.globalMessage?.it?.includes(msgIt) ?? false)
    record('riscrittura globalMessage', `scritture=${memory.getWriteCount()} (atteso 1); nel file=${hasMsg}`)

    // --- Riconciliazione + registro realigned ---
    const stale = buildAvailabilityDocument(
      { ...state, dishes: [{ id: 999999, disabled: true, soldOut: false }] },
      new Date('2020-01-01T00:00:00.000Z'),
    )
    await memory.writeObject(JSON.stringify(stale), 'application/json')
    memory.resetWriteCount()
    await syncMenuAvailabilityFile(payload, { logRealignOnDiff: true })
    const realignDetail = await findLatestDetailPrefix(payload, 'availability-realigned:')
    record('riconciliazione file diverso', `scritture=${memory.getWriteCount()}; detail=${realignDetail}`)
    memory.resetWriteCount()
    await syncMenuAvailabilityFile(payload, { logRealignOnDiff: true })
    record('riconciliazione file uguale', `scritture=${memory.getWriteCount()} (atteso 0)`)

    // --- Import bulk (pattern suppress) ---
    memory.reset()
    for (let i = 0; i < 3; i += 1) {
      const c = await payload.create({
        collection: DISH_CATEGORIES_SLUG,
        locale: 'it',
        depth: 0,
        overrideAccess: true,
        context: importBulkContext,
        data: { name: `Verify64 Bulk ${TEST_RUN_ID}-${i}` },
      })
      track(created, DISH_CATEGORIES_SLUG, c.id)
    }
    const writesMidBulk = memory.getWriteCount()
    await syncMenuAvailabilityFile(payload)
    record(
      'import bulk suppress',
      `scritture durante create=${writesMidBulk} (atteso 0); sync finale=${memory.getWriteCount()} (atteso 1)`,
    )

    // --- Scheduler ticks (Local API) ---
    await deleteProbeSystemActions(payload, { includeResetLogs: true })
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { soldOut: true },
    })
    const tickBaseline = await runSchedulerAvailabilityTick(payload, new Date())
    record(
      'primo tick baseline',
      `reset=${tickBaseline.resetPerformed} baseline=${tickBaseline.baselineRecorded}`,
    )
    const dishAfterBaseline = await payload.findByID({
      collection: DISHES_SLUG,
      id: dish.id,
      depth: 0,
      overrideAccess: true,
    })
    record(
      'primo tick soldOut',
      (dishAfterBaseline as { soldOut?: boolean }).soldOut ? 'ancora true' : 'azzerrato (errore)',
    )

    await deleteProbeSystemActions(payload)
    const tickMid = await runSchedulerAvailabilityTick(payload, new Date())
    record('reset registro cancellato mid-servizio', `reset=${tickMid.resetPerformed} (atteso false)`)

    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        services: [
          { name: 'lunch', startTime: '12:30', endTime: '14:30' },
          { name: 'dinner', startTime: '19:30', endTime: '22:30' },
        ],
      },
    })
    const settingsDoc = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    const svcRows = serviceRowsFromGlobal(settingsDoc)
    const lunchStart = svcRows.find((r) => r.name === 'lunch')?.startTime ?? '12:30'
    const dinnerStart = svcRows.find((r) => r.name === 'dinner')?.startTime ?? '19:30'
    const anchorMonday = boundaryInstantRome('2026-10-06', lunchStart)
    if (!anchorMonday) {
      throw new Error('anchorMonday null')
    }
    await payload.update({
      id: dish.id,
      collection: DISHES_SLUG,
      depth: 0,
      overrideAccess: true,
      data: { soldOut: true },
    })
    const afterDinner = boundaryInstantRome('2026-10-13', dinnerStart)
    const tickNow = afterDinner
      ? new Date(afterDinner.getTime() + 60 * 60 * 1000)
      : new Date('2026-10-13T18:00:00.000Z')
    const boundsSkipped = listServiceStartBoundariesBetween(
      anchorMonday,
      tickNow,
      svcRows as never,
    )
    if (boundsSkipped.length === 0) {
      throw new Error('Job saltato: nessun confine nella finestra di test')
    }
    const lastBoundary = boundsSkipped[boundsSkipped.length - 1]
    const cleared = await resetAllDishesSoldOut(payload)
    await logSystemAction(payload, {
      detail: `availability-reset: ok; ${formatBoundaryDetailSuffix(
        lastBoundary.instant,
        lastBoundary.service,
        lastBoundary.romeDate,
      )}; cleared=${cleared}`,
    })
    record(
      'job saltato (più confini → un reset)',
      `confini=${boundsSkipped.length} cleared=${cleared} boundary=${lastBoundary.instant.toISOString()}`,
    )
    const dishAfterSkip = await payload.findByID({
      collection: DISHES_SLUG,
      id: dish.id,
      depth: 0,
      overrideAccess: true,
    })
    record(
      'job saltato soldOut dopo reset',
      (dishAfterSkip as { soldOut?: boolean }).soldOut === false ? 'azzerrato' : 'ancora true',
    )
    const schedAfterLog = await loadSchedulerBoundaryState(payload)
    record(
      'lettura stato registro dopo reset sintetico',
      schedAfterLog.kind === 'known' ? schedAfterLog.boundaryIso : 'non provato',
    )

    const nowTick = new Date('2026-10-13T18:00:01.000Z')
    const tickA = await runSchedulerAvailabilityTick(payload, nowTick)
    const tickB = await runSchedulerAvailabilityTick(payload, nowTick)
    record(
      'due tick ravvicinati',
      `tick1 reset=${tickA.resetPerformed} tick2 reset=${tickB.resetPerformed} (atteso false sul secondo)`,
    )

    // --- Endpoint REST ---
    if (skipDev) {
      record('endpoint REST', 'non provato (SKIP_DEV)')
      record('activity-log anonimo REST', 'non provato (SKIP_DEV)')
      record('login/logout REST', 'non provato (SKIP_DEV)')
    } else {
      const serverSecret = process.env[SCHEDULER_SECRET_AVAILABILITY_ENV]?.trim()
      if (!serverSecret) {
        record(
          'endpoint REST (dev senza SCHEDULER_SECRET in .env)',
          'configurare secret uguale a TEST_SCHEDULER_SECRET per prove REST complete',
        )
      } else {
        const wrong = await postScheduler('wrong-secret-value')
        record('endpoint secret errato', `${wrong.status} body=${wrong.body}`)
        const absent = await postScheduler(null)
        record('endpoint secret assente', `${absent.status} body=${absent.body}`)
        const short =
          serverSecret.length > 4 ? serverSecret.slice(0, serverSecret.length - 4) : 'x'
        const lenDiff = await postScheduler(short)
        record('endpoint secret lunghezza diversa', `${lenDiff.status} body=${lenDiff.body}`)

        for (const [label, res] of [
          ['errato', wrong],
          ['assente', absent],
          ['lunghezza', lenDiff],
        ] as const) {
          if (res.status !== 403 || res.body !== SCHEDULER_FORBIDDEN) {
            throw new Error(`403 body non identico (${label})`)
          }
        }
        forbiddenInProcess('missing-config')

        const soldBeforeReject = (await payload.findByID({
          collection: DISHES_SLUG,
          id: dish.id,
          depth: 0,
          overrideAccess: true,
        })) as { soldOut?: boolean }
        await postScheduler('wrong')
        const soldAfterReject = (await payload.findByID({
          collection: DISHES_SLUG,
          id: dish.id,
          depth: 0,
          overrideAccess: true,
        })) as { soldOut?: boolean }
        record(
          'endpoint rifiuto non modifica piatti',
          `soldOut prima=${soldBeforeReject.soldOut} dopo=${soldAfterReject.soldOut}`,
        )

        const ok1 = await postScheduler(serverSecret)
        const ok2 = await postScheduler(serverSecret)
        record('endpoint secret corretto', `${ok1.status} body=${ok1.body}`)
        record('endpoint seconda chiamata autorizzata', `${ok2.status} body=${ok2.body}`)
        if (ok1.status !== 200 || ok1.body !== SCHEDULER_OK) {
          throw new Error('200 atteso')
        }
      }

      const anonLog = await fetch(`${appPublicUrl()}/api/activity-log?limit=1`, {
        credentials: 'omit',
      })
      record('activity-log GET anonimo', `${anonLog.status} (atteso 403)`)

      if (skipLogin) {
        console.warn(
          '\n*** VERIFY_MENU_6_4_SKIP_LOGIN=1: login/logout REST SALTATI (non valido per commit) ***\n',
        )
        record('login/logout REST', 'NON PROVATO (SKIP_LOGIN)')
      } else {
        await runRestLoginLogoutProbe(payload, (id) => {
          createdUserId = id
        })
      }
    }

    if (importContentReference != null) {
      const endRows = await fingerprintImportContentCollections(payload)
      const endCombined = combinedImportContentFingerprintHash(endRows)
      record('import contenuto fine verify (pre-ripristino)', endCombined)
      let devCombined = endCombined
      if (endCombined !== importContentReference) {
        const restore = await runImportContentRoundtrip(payload, memory)
        record('import contenuto ripristino prima wipe', restore.beforeCombined)
        record('import contenuto ripristino dopo reimport', restore.afterCombined)
        record('import bulk scritture file (ripristino finale)', `${restore.writeCount} (atteso 1)`)
        if (restore.writeCount !== 1) {
          throw new Error(`Ripristino import: scritture attese 1, ricevute ${restore.writeCount}`)
        }
        devCombined = restore.afterCombined
      }
      if (devCombined !== importContentReference) {
        throw new Error(
          `Impronta contenuto dev (${devCombined}) ≠ riferimento (${importContentReference})`,
        )
      }
      record('import contenuto vma_vd_dev vs riferimento', 'OK')
    }

    console.log('verify-menu-6_4: controlli superati.')
  } finally {
    setAvailabilityStorageForTests(memory)
    await deleteProbeSystemActions(payload)

    for (const ref of [...created].reverse()) {
      try {
        await payload.delete({
          collection: ref.collection,
          id: ref.id,
          depth: 0,
          overrideAccess: true,
        })
      } catch {
        /* best effort */
      }
    }
    if (createdUserId != null) {
      try {
        await deleteAuthLogsForUser(payload, createdUserId)
        await payload.delete({
          collection: 'users',
          id: createdUserId,
          depth: 0,
          overrideAccess: true,
        })
      } catch {
        /* best effort */
      }
    }
    await deleteProbeSystemActions(payload)

    try {
      await payload.updateGlobal({
        slug: SYSTEM_SETTINGS_SLUG,
        depth: 0,
        overrideAccess: true,
        context: importBulkContext,
        data: {
          services: settingsBefore.services,
        },
      })
      await payload.updateGlobal({
        slug: MENU_GENERAL_SLUG,
        depth: 0,
        overrideAccess: true,
        locale: 'it',
        context: importBulkContext,
        data: {
          globalMessage: (globalBefore as { globalMessage?: string | null }).globalMessage,
        },
      })
      await syncMenuAvailabilityFile(payload)
    } catch {
      /* best effort */
    }

    await deleteProbeSystemActions(payload, { includeResetLogs: true })

    const countsAfter = await snapshotCounts(payload)
    for (const key of Object.keys(countsBefore)) {
      const before = countsBefore[key]
      const after = countsAfter[key]
      record(`conteggio ${key}`, `prima=${before} dopo=${after}`)
      if (before !== after) {
        throw new Error(`Conteggio ${key} cambiato: ${before} → ${after}`)
      }
    }

    const activityLogAfter = await payload.find({
      collection: ACTIVITY_LOG_SLUG,
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    record(
      'activity-log totalDocs invariato',
      `prima=${activityLogBefore.totalDocs} dopo=${activityLogAfter.totalDocs}`,
    )
    if (activityLogBefore.totalDocs !== activityLogAfter.totalDocs) {
      throw new Error('activity-log totalDocs cambiato')
    }

    setAvailabilityStorageForTests(null)
    delete process.env.MENU_AVAILABILITY_GCS_BUCKET
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  if (error instanceof Error && error.stack) {
    console.error(error.stack)
  }
  console.error(`verify-menu-6_4 fallito: ${message}`)
  process.exit(1)
}
