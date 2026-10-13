/**
 * Riproduzione salvataggio `menu-general` come Admin REST (POST ?locale=it).
 * Richiede server già avviato con:
 *   MENU_AVAILABILITY_IN_MEMORY=1
 *   MENU_AVAILABILITY_WRITE_TRACE_FILE=/tmp/vma-verify-menu-6_4-availability-writes.log
 *   MENU_AVAILABILITY_MIRROR_FILE=/tmp/vma-verify-menu-6_4-availability.json
 *
 *   pnpm repro:menu-availability-global-rest -- --base-url http://localhost:3000 --role admin
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { MENU_GENERAL_SLUG } from '@/lib/menu/constants'

import {
  availabilityMirrorContainsGlobalMessageIt,
  countAvailabilityWriteTraceLines,
  readAvailabilityMirrorJson,
  restPostMenuGeneral,
  signRestJwtAdmin,
  verifyMenu64AvailabilityMirrorPath,
  verifyMenu64AvailabilityTracePath,
} from './verify-menu-6_4-lib'

function parseArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  if (idx === -1 || idx === process.argv.length - 1) {
    return undefined
  }
  return process.argv[idx + 1]
}

async function main(): Promise<void> {
  const baseUrl = (parseArg('--base-url') ?? process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  )
  const role = parseArg('--role') ?? 'admin'
  const runId = Date.now().toString(36)
  const msgIt = `Repro REST global ${runId}`

  const payload = await getPayload({ config })
  const email = `repro-64-${role}-${runId}@example.test`
  const user = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email,
      adminRole: role === 'admin' ? 'admin' : 'none',
      appRole: role === 'manager' ? 'manager' : 'none',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })

  const token = await signRestJwtAdmin(payload, user as never)
  const tracePath = verifyMenu64AvailabilityTracePath()
  const mirrorPath = verifyMenu64AvailabilityMirrorPath()
  const traceBefore = countAvailabilityWriteTraceLines(tracePath)

  const res = await restPostMenuGeneral(baseUrl, token, { globalMessage: msgIt }, 'it')
  const traceAfter = countAvailabilityWriteTraceLines(tracePath)
  const writes = traceAfter - traceBefore
  const inMirror = availabilityMirrorContainsGlobalMessageIt(readAvailabilityMirrorJson(mirrorPath), msgIt)

  const globalGet = await fetch(`${baseUrl}/api/globals/${MENU_GENERAL_SLUG}?locale=it`, {
    headers: { Accept: 'application/json', Cookie: `payload-token=${token}` },
  })
  const globalJson = (await globalGet.json()) as { globalMessage?: string }
  const inDb = globalJson.globalMessage?.includes(msgIt) ?? false

  console.log(
    JSON.stringify(
      {
        baseUrl,
        role,
        httpStatus: res.status,
        tracePath,
        mirrorPath,
        writes,
        inMirror,
        inDb,
      },
      null,
      2,
    ),
  )

  await payload.delete({ collection: 'users', id: user.id, overrideAccess: true, depth: 0 })

  if (res.status !== 200 || !inDb || writes < 1 || !inMirror) {
    process.exitCode = 1
  }
}

try {
  await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`repro-menu-availability-global-rest fallito: ${message}`)
  process.exit(1)
}
