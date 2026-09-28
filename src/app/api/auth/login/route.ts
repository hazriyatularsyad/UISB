import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionCookie, SESSION_COOKIE, validateCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const from = String(formData.get("from") ?? "/dashboard")

  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 })
  }

  if (!(await validateCredentials(username, password))) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 })
  }

  const token = createSessionCookie(username)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })

  const redirectUrl = from.startsWith("/dashboard") ? from : "/dashboard"
  return NextResponse.json({ success: true, redirect: redirectUrl })
}