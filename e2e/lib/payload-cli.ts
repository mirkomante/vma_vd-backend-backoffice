import { runProcess } from './exec'
import { REPO_ROOT } from './paths'

export function parsePayloadStdout(stdout: string): Record<string, unknown> {
  const line = stdout.trim().split('\n').find((l) => l.startsWith('{'))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line) as Record<string, unknown>
}

export async function payloadRun(args: string[], env: Record<string, string | undefined> = {}): Promise<string> {
  const r = await runProcess('pnpm', ['payload', 'run', ...args], {
    cwd: REPO_ROOT,
    timeoutMs: 120_000,
    env: { ...process.env, PAYLOAD_DISABLE_PUSH: '1', ...env },
  })
  if (r.code !== 0) {
    throw new Error(`payload run fallito: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  return r.stdout
}
