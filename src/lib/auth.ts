import { createHmac, timingSafeEqual, createHash } from "node:crypto"
import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { verifyDbUser } from "@/lib/users"

export const SESSION_COOKIE = "uisb_session"
const SESSION_TTL = 60 * 60 * 12 // 12 jam

function secret(): string {
  const s = process.env.AUTH_SECRET
  if (!s || s.trim().length < 16) {
    throw new Error("AUTH_SECRET minimum 16 karakter harus di-set di .env.local")
  }
  return s
}

function hmac(input: string): string {
  return createHmac("sha256", secret()).update(input).digest("hex")
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export function signSession(username: string, expires: number): string {
  const payload = `${username}.${expires}`
  return `${payload}.${hmac(payload)}`
}

export async function verifySession(token: string): Promise<boolean> {
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [username, expiry, sig] = parts
  const payload = `${username}.${expiry}`
  const expected = hmac(payload)
  if (!safeEqual(sig, expected)) return false
  if (Number(expiry) <= Date.now()) return false
  // check revocation
  const hash = createHash("sha256").update(token).digest("hex")
  const rows = await query(
    "SELECT 1 FROM revoked_tokens WHERE token_hash = $1 AND expires_at > NOW()",
    [hash]
  )
  return rows.length === 0
}

export async function getSessionUser(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3 || !(await verifySession(token))) return null
  return parts[0]
}

export function createSessionCookie(username: string) {
  const expires = Date.now() + SESSION_TTL * 1000
  return signSession(username, expires)
}

export async function revokeToken(token: string): Promise<void> {
  const parts = token.split(".")
  if (parts.length !== 3) return
  const expiry = Number(parts[1])
  const hash = createHash("sha256").update(token).digest("hex")
  await query(
    "INSERT INTO revoked_tokens (token_hash, expires_at) VALUES ($1, to_timestamp($2::bigint/1000)) ON CONFLICT DO NOTHING",
    [hash, expiry]
  )
}

export async function validateCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME ?? ""
  const adminPass = process.env.ADMIN_PASSWORD ?? ""
  if (adminUser && adminPass) {
    if (safeEqual(username, adminUser) && safeEqual(password, adminPass)) {
      return true
    }
  }
  if (!username || !password) return false
  return await verifyDbUser(username, password)
}