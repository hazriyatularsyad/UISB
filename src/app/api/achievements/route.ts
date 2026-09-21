import { NextResponse } from "next/server"
import { listAchievements } from "@/lib/data-store"

export async function GET() {
  try {
    const achievements = await listAchievements()
    return NextResponse.json(achievements)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengambil achievements."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}