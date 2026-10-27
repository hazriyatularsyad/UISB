import { loadEnvConfig } from "@next/env"
import { Pool } from "pg"
import { isAbsolute, relative, resolve, sep } from "node:path"
import { writeFile, mkdir } from "node:fs/promises"

async function main(): Promise<void> {
  loadEnvConfig(process.cwd())

  const outputArg = process.argv[2]
  if (!outputArg || !isAbsolute(outputArg)) {
    throw new Error("Usage: npm run db:export -- /absolute/path/outside-project/uisb-export.json")
  }

  const outputPath = resolve(outputArg)
  const projectPath = resolve(process.cwd())
  const rel = relative(projectPath, outputPath)
  const outputIsInsideProject = rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))
  if (outputIsInsideProject) {
    throw new Error("Refusing to write the export inside the project directory. Choose a path outside the repository.")
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Configure it locally; never paste credentials into chat or commit them.")
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
    const client = await pool.connect()
    const exportData: Record<string, unknown[]> = {}
    try {
      await client.query("BEGIN READ ONLY")
      for (const table of tables) {
        // Table identifiers come only from the fixed allowlist above.
        const result = await client.query(`SELECT * FROM "${table}" ORDER BY id ASC`)
        exportData[table] = result.rows
        console.log(`${table}: ${result.rowCount ?? result.rows.length} row(s)`)
      }
      await client.query("COMMIT")
    } catch (error) {
      try { await client.query("ROLLBACK") } catch {}
      throw error
    } finally {
      client.release()
    }

    await mkdir(resolve(outputPath, ".."), { recursive: true })
    await writeFile(outputPath, JSON.stringify(exportData, null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" })
    console.log(`Export written to ${outputPath}`)
    console.log("Keep this file private and do not commit it to Git.")
  } finally {
    await pool.end()
  }
}

main().catch((error: unknown) => {
  console.error("Export failed. No credentials are printed.")
  console.error(error instanceof Error ? error.message : "Unknown error")
  process.exitCode = 1
})
