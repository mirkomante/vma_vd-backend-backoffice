#!/usr/bin/env node
/**
 * Client sincrono per il daemon menu-payload (una richiesta per processo, Payload resta caldo).
 */
import net from 'node:net'

const port = Number(process.env.UI_VERIFY_MENU_PAYLOAD_PORT ?? '31997')
const dash = process.argv.indexOf('--')
const cliArgs = dash >= 0 ? process.argv.slice(dash + 1) : process.argv.slice(2)
const action = cliArgs[0]
const extraArgs = cliArgs.slice(1)

if (!action) {
  console.error('menu-payload-client: azione mancante')
  process.exit(1)
}

const payload = JSON.stringify({ id: 1, action, args: extraArgs })
const socket = net.connect({ host: '127.0.0.1', port }, () => {
  socket.write(`${payload}\n`)
})

let buf = ''
socket.setEncoding('utf8')
socket.on('data', (chunk) => {
  buf += chunk
  const idx = buf.indexOf('\n')
  if (idx < 0) return
  const line = buf.slice(0, idx)
  socket.end()
  try {
    const msg = JSON.parse(line)
    if (!msg.ok) {
      console.error(msg.error ?? 'menu-payload-client failed')
      process.exit(1)
    }
    console.log(JSON.stringify(msg.result))
    process.exit(0)
  } catch (e) {
    console.error(String(e))
    process.exit(1)
  }
})
socket.on('error', (e) => {
  console.error(e.message)
  process.exit(1)
})
setTimeout(() => {
  console.error('menu-payload-client: timeout')
  process.exit(1)
}, 120_000)
