import crypto from 'crypto'

/** Legacy (seed/hook) — allineato a Payload pre-v1. */
const LEGACY_PBKDF2_ITERATIONS = 25_000
const LEGACY_PBKDF2_KEYLEN = 512
/** Payload 3.90.2 `generatePasswordSaltHash` su update con `enableFields`. */
const CURRENT_HASH_PREFIX = 'pbkdf2-sha256-v1:'
const CURRENT_PBKDF2_ITERATIONS = 600_000
const CURRENT_PBKDF2_KEYLEN = 32
const PBKDF2_DIGEST = 'sha256'
const SALT_BYTES = 32

function getStoredHashParameters(storedHash: string): {
  hashHex: string
  iterations: number
  keyLength: number
} {
  if (storedHash.startsWith(CURRENT_HASH_PREFIX)) {
    return {
      hashHex: storedHash.slice(CURRENT_HASH_PREFIX.length),
      iterations: CURRENT_PBKDF2_ITERATIONS,
      keyLength: CURRENT_PBKDF2_KEYLEN,
    }
  }
  return {
    hashHex: storedHash,
    iterations: LEGACY_PBKDF2_ITERATIONS,
    keyLength: LEGACY_PBKDF2_KEYLEN,
  }
}

function randomSaltBytes(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_BYTES, (err, saltBuffer) =>
      err ? reject(err) : resolve(saltBuffer),
    )
  })
}

function pbkdf2(
  password: string,
  salt: string,
  iterations: number,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLength, PBKDF2_DIGEST, (err, hashRaw) =>
      err ? reject(err) : resolve(hashRaw),
    )
  })
}

export async function hashLocalPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const saltBuffer = await randomSaltBytes()
  const salt = saltBuffer.toString('hex')
  const hashRaw = await pbkdf2(password, salt, LEGACY_PBKDF2_ITERATIONS, LEGACY_PBKDF2_KEYLEN)
  return { hash: hashRaw.toString('hex'), salt }
}

export async function verifyLocalPassword(
  password: string,
  doc: { hash?: string | null; salt?: string | null },
): Promise<boolean> {
  const { hash, salt } = doc
  if (typeof salt !== 'string' || typeof hash !== 'string') {
    return false
  }

  try {
    const { hashHex, iterations, keyLength } = getStoredHashParameters(hash)
    const hashBuffer = await pbkdf2(password, salt, iterations, keyLength)
    const storedHashBuffer = Buffer.from(hashHex, 'hex')
    if (hashBuffer.length !== storedHashBuffer.length) {
      return false
    }
    return crypto.timingSafeEqual(hashBuffer, storedHashBuffer)
  } catch {
    return false
  }
}
