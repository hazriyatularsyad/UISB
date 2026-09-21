"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSessionCookie, SESSION_COOKIE, validateCredentials } from "@/lib/auth"

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." }
  }

  if (!validateCredentials(username, password)) {
    return { error: "Username atau password salah." }
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

  const from = String(formData.get("from") ?? "/dashboard")
  redirect(from.startsWith("/dashboard") ? from : "/dashboard")
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}