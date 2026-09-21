// import { loadEnvConfig } from "@next/env"

// const projectDir = process.cwd()
// loadEnvConfig(projectDir)

// import { getPool } from "../lib/db.js"

// async function main() {
//   const pool = getPool()
//   if (!pool) throw new Error("DATABASE_URL is not configured.")

//   const columns = [
//     { name: "campus", sql: "ALTER TABLE dosen ADD COLUMN IF NOT EXISTS campus TEXT NOT NULL DEFAULT ''" },
//     { name: "description", sql: "ALTER TABLE dosen ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''" },
//   ]

//   for (const col of columns) {
//     try {
//       await pool.query(col.sql)
//       console.log(`Column "${col.name}" added/verified.`)
//     } catch (err) {
//       console.error(`Failed to add column "${col.name}":`, err)
//     }
//   }

//   await pool.end()
//   console.log("Migration complete.")
// }

// main().catch((err) => {
//   console.error(err)
//   process.exit(1)
// })
