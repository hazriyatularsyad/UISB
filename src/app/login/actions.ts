"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, revokeToken } from "@/lib/auth"

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await revokeToken(token)
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}