export const AUTH_COOKIE = 'snow_demo_session'

/** Fixed demo credentials (override with env on Railway if needed). */
export const DEMO_USER = process.env.DEMO_USER ?? 'demo'
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'clave01'

/** Opaque session token stored in the httpOnly cookie. */
export const SESSION_TOKEN = process.env.AUTH_SECRET ?? 'snow-demo-gate-v1'

export function credentialsMatch(username: string, password: string): boolean {
  return username === DEMO_USER && password === DEMO_PASSWORD
}

export function isValidSession(token: string | undefined): boolean {
  return Boolean(token) && token === SESSION_TOKEN
}
