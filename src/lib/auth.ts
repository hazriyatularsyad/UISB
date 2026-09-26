import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
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

export function verifySession(token: string): boolean {
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [username, expiry, sig] = parts
  const payload = `${username}.${expiry}`
  const expected = hmac(payload)
  if (!safeEqual(sig, expected)) return false
  return Number(expiry) > Date.now()
}

export async function getSessionUser(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3 || !verifySession(token)) return null
  return parts[0]
}

export function createSessionCookie(username: string) {
  const expires = Date.now() + SESSION_TTL * 1000
  return signSession(username, expires)
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