export const DEV_PORT = 3000
export const PROD_PORT = 3100

export function devBaseUrl() {
  return `http://localhost:${DEV_PORT}`
}

export function prodBaseUrl() {
  return `http://localhost:${PROD_PORT}`
}
