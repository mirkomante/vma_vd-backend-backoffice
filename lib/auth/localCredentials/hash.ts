import crypto from 'crypto'

/** Stessi parametri di Payload (`generatePasswordSaltHash` / `authenticateLocalStrategy`). */
const PBKDF2_ITERATIONS = 25_000
const PBKDF2_KEYLEN = 512
const PBKDF2_DIGEST = 'sha256'
const SALT_BYTES = 32

function randomSaltBytes(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_BYTES, (err, saltBuffer) =>
      err ? reject(err) : resolve(saltBuffer),
    )
  })
}

function pbkdf2(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST, (err, hashRaw) =>
      err ? reject(err) : resolve(hashRaw),
    )
  })
}

export async function hashLocalPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const saltBuffer = await randomSaltBytes()
  const salt = saltBuffer.toString('hex')
  const hashRaw = await pbkdf2(password, salt)
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
    const hashBuffer = await pbkdf2(password, salt)
    const storedHashBuffer = Buffer.from(hash, 'hex')
    if (hashBuffer.length !== storedHashBuffer.length) {
      return false
    }
    return crypto.timingSafeEqual(hashBuffer, storedHashBuffer)
  } catch {
    return false
  }
}
