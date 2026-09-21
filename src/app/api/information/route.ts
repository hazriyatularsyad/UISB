import { NextResponse } from "next/server"
import { listInformation } from "@/lib/data-store"

export async function GET() {
  try {
    const information = await listInformation()
    return NextResponse.json(information)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengambil informasi."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}