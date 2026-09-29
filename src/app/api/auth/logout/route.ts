import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE, revokeToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await revokeToken(token)
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ success: true, redirect: "/login" })
}