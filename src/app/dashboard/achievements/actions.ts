"use server"

import { revalidatePath } from "next/cache"
import { createAchievement, deleteAchievement, updateAchievement, type AchievementInput } from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = { success: boolean; error?: string }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function validate(
  formData: FormData,
  existingImage?: string,
): Promise<{ data?: AchievementInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  const slug = slugify(title)
  const description = String(formData.get("description") ?? "").trim()
  const link_url = String(formData.get("link_url") ?? "").trim()
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  if (!title) return { error: "Title wajib diisi." }
  if (!slug) return { error: "Slug tidak valid." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/achievements")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()
  if (!image) return { error: "Gambar achievement wajib diunggah." }

  return { data: { slug, title, description, image, link_url, is_active } }
}

export async function createAchievementAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData)
  if (error || !data) return { success: false, error }
  try {
    await createAchievement(data)
    revalidatePath("/")
    revalidatePath("/dashboard/achievements")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan achievement."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function updateAchievementAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updateAchievement(id, data)
    revalidatePath("/")
    revalidatePath("/dashboard/achievements")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui achievement."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function deleteAchievementAction(id: number): Promise<ActionResult> {
  try {
    await deleteAchievement(id)
    revalidatePath("/")
    revalidatePath("/dashboard/achievements")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus achievement." }
  }
}