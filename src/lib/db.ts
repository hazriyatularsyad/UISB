import { Pool, type PoolConfig } from "pg"

const globalForPool = globalThis as unknown as {
  pool: Pool | null | undefined
}

export function getPool(): Pool | null {
  if (globalForPool.pool !== undefined) {
    return globalForPool.pool
  }

  const url = process.env.DATABASE_URL
  let config: PoolConfig | null = null

  if (url && url.trim().length > 0) {
    try {
      const parsed = new URL(url)
      config = {
        connectionString: url,
        user: parsed.username || undefined,
        password: parsed.password || undefined,
        host: parsed.hostname || undefined,
        port: Number(parsed.port || 5432),
        database: parsed.pathname.replace(/^\//, "") || undefined,
        max: 10,
        idleTimeoutMillis: 30_000,
      }
    } catch {
      config = { connectionString: url }
    }
  } else if (process.env.PGUSER && process.env.PGHOST && process.env.PGDATABASE) {
    config = {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      database: process.env.PGDATABASE,
      max: 10,
      idleTimeoutMillis: 30_000,
    }
  }

  if (!config) {
    globalForPool.pool = null
    return null
  }

  const pool = new Pool(config)
  if (process.env.NODE_ENV !== "production") {
    globalForPool.pool = pool
  }
  return pool
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  try {
    const p = getPool()
    if (!p) return []
    const res = await p.query(text, params as never)
    return res.rows as T[]
  } catch (error) {
    console.warn("DB query skipped/failed:", error)
    return []
  }
}
