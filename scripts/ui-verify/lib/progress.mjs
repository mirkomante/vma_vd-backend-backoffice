import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

let runStartMs = 0
let logPath = ''
/** @type {ReturnType<typeof setInterval> | null} */
let heartbeatTimer = null

let currentSchermata = '—'
let currentFase = 'avvio'
let currentDetail = '—'
let progressIndex = 0
let progressTotal = null

function elapsedSec() {
  return Math.round((Date.now() - runStartMs) / 1000)
}

function timeLabel() {
  return new Date().toLocaleTimeString('it-IT', { hour12: false })
}

function formatLine() {
  const nPart = progressTotal != null ? `${progressIndex}/${progressTotal}` : '—'
  return `${timeLabel()} | ${currentSchermata} | ${currentFase} | ${currentDetail} | ${nPart} | ${elapsedSec()}s`
}

function emitLine() {
  const line = formatLine()
  if (logPath) appendFileSync(logPath, `${line}\n`, 'utf8')
  process.stdout.write(`${line}\n`)
}

/**
 * @param {string} root repo root
 */
export function initVerifyProgress(root) {
  runStartMs = Date.now()
  mkdirSync(join(root, '.next'), { recursive: true })
  logPath = join(root, '.next/ui-verify-progress.log')
  writeFileSync(logPath, '', 'utf8')
  heartbeatTimer = setInterval(() => emitLine(), 30_000)
  emitLine()
}

export function stopVerifyProgress() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

export function progressLogFile() {
  return logPath
}

/**
 * @param {{ schermata?: string, fase?: string, stato?: string, n?: number, total?: number }} patch
 */
export function writeProgress(patch = {}) {
  if (patch.schermata != null) currentSchermata = patch.schermata
  if (patch.fase != null) currentFase = patch.fase
  if (patch.stato != null) currentDetail = patch.stato
  if (patch.n != null) progressIndex = patch.n
  if (patch.total != null) progressTotal = patch.total
  emitLine()
}

/** Compatibilità con progressStep legacy (schermata, stato, profilo, tema). */
export function logProgressParts(parts) {
  const [schermata, stato, profilo, tema] = parts
  const detail =
    profilo && tema ? `${stato} · ${profilo}/${tema}` : [stato, profilo, tema].filter(Boolean).join(' · ') || '—'
  writeProgress({ schermata: schermata ?? currentSchermata, fase: 'controllo', stato: detail })
}
