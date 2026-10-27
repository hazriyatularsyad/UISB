import { loadEnvConfig } from "@next/env"
import { Pool } from "pg"
import { isAbsolute, relative, resolve, sep } from "node:path"
import { writeFile, mkdir } from "node:fs/promises"

loadEnvConfig(process.cwd())

const outputArg = process.argv[2]
if (!outputArg || !isAbsolute(outputArg)) {
  console.error("Usage: npm run db:export -- /absolute/path/outside-project/uisb-export.json")
  process.exit(1)
}

const outputPath = resolve(outputArg)
const projectPath = resolve(process.cwd())
const rel = relative(projectPath, outputPath)
if (rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel))) {
  console.error("Refusing to write the export inside the project directory. Choose a path outside the repository.")
  process.exit(1)
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is not set. Configure it locally; never paste credentials into chat or commit them.")
  process.exit(1)
}

const tables = [
  "news",
  "dosen",
  "testimonials",
  "videos",
  "popups",
  "programs",
  "facilities",
  "information",
  "achievements",
  "hero_slides",
] as const

const pool = new Pool({
  connectionString,
  max: 1,
  application_name: "uisb-content-export-readonly",
  connectionTimeoutMillis: 10000,
  statement_timeout: 60000,
})

try {
  // Verify connection before writing any file.
  await pool.query("BEGIN READ ONLY")
  const exportData: Record<string, unknown[]> = {}
  for (const table of tables) {
    // Table identifiers come only from the fixed allowlist above.
    const result = await pool.query(`SELECT * FROM "${table}" ORDER BY id ASC`)
    exportData[table] = result.rows
    console.log(`${table}: ${result.rowCount ?? result.rows.length} row(s)`)
  }
  await pool.query("COMMIT")

  await mkdir(resolve(outputPath, ".."), { recursive: true })
  await writeFile(outputPath, JSON.stringify(exportData, null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" })
  console.log(`Export written to ${outputPath}`)
  console.log("Keep this file private and do not commit it to Git.")
} catch (error) {
  try { await pool.query("ROLLBACK") } catch {}
  console.error("Export failed. No credentials are printed.")
  console.error(error instanceof Error ? error.message : "Unknown error")
  process.exitCode = 1
} finally {
  await pool.end()
}
