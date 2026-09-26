import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { getPool } from "./db"

export type UserRow = {
  id: number
  username: string
  created_at: Date | string
}

function pool() {
  const p = getPool()
  if (!p) throw new Error("DATABASE_URL is not configured.")
  return p
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false
  const [, salt, hash] = parts
  const expected = Buffer.from(hash, "hex")
  const candidate = scryptSync(password, salt, 64)
  if (candidate.length !== expected.length) return false
  return timingSafeEqual(candidate, expected)
}

export async function adminListUsers(): Promise<UserRow[]> {
  const res = await pool().query(
    "SELECT id, username, created_at FROM users ORDER BY id ASC",
  )
  return res.rows as UserRow[]
}

export async function verifyDbUser(
  username: string,
  password: string,
): Promise<boolean> {
  const res = await pool().query(
    "SELECT password_hash FROM users WHERE username = $1",
    [username],
  )
  const row = res.rows[0] as { password_hash: string } | undefined
  if (!row) return false
  return verifyPassword(password, row.password_hash)
}

export async function createUser(
  username: string,
  password: string,
): Promise<UserRow> {
  const password_hash = hashPassword(password)
  const res = await pool().query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
    [username, password_hash],
  )
  return res.rows[0] as UserRow
}

export async function getUserUsername(id: number): Promise<string | null> {
  const res = await pool().query(
    "SELECT username FROM users WHERE id = $1",
    [id],
  )
  const row = res.rows[0] as { username: string } | undefined
  return row?.username ?? null
}

export async function deleteUser(id: number): Promise<void> {
  await pool().query("DELETE FROM users WHERE id = $1", [id])
}
