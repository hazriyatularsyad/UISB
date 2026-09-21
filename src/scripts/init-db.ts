import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { loadEnvConfig } from "@next/env"
import { getPool } from "../lib/db.js"

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const pool = getPool()
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.")
  }
  const sql = await readFile(join(__dirname, "../lib/schema.sql"), "utf8")
  await pool.query(sql)
  console.log("schema applied successfully")
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
