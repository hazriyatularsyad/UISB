"use server"

import { revalidatePath } from "next/cache"
import { getSessionUser } from "@/lib/auth"
import { createUser, deleteUser, getUserUsername } from "@/lib/users"

export type ActionResult = {
  success: boolean
  error?: string
}

export async function createUserAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSessionUser()
  if (!session) {
    return { success: false, error: "Sesi tidak valid. Silakan login ulang." }
  }

  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
    return {
      success: false,
      error: "Username minimal 3 karakter, hanya huruf, angka, atau underscore.",
    }
  }
  if (password.length < 8) {
    return { success: false, error: "Password minimal 8 karakter." }
  }

  try {
    await createUser(username, password)
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("users_username_key") || msg.includes("duplicate key")) {
      return { success: false, error: `Username "${username}" sudah dipakai.` }
    }
    return { success: false, error: "Gagal membuat akun." }
  }
}

export async function deleteUserAction(id: number): Promise<ActionResult> {
  const session = await getSessionUser()
  if (!session) {
    return { success: false, error: "Sesi tidak valid. Silakan login ulang." }
  }

  try {
    const target = await getUserUsername(id)
    if (!target) {
      return { success: false, error: "Akun tidak ditemukan." }
    }
    if (target === session) {
      return { success: false, error: "Tidak bisa menghapus akun yang sedang login." }
    }
    await deleteUser(id)
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch {
    return { success: false, error: "Gagal menghapus akun." }
  }
}
