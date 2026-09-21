"use server"

import { revalidatePath } from "next/cache"
import { createProgram, deleteProgram, updateProgram, type ProgramInput } from "@/lib/data-store"
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
): Promise<{ data?: ProgramInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  let slug = String(formData.get("slug") ?? "").trim()
  const label = String(formData.get("label") ?? "").trim() || title
  const description = String(formData.get("description") ?? "").trim()
  const short_description = String(formData.get("short_description") ?? "").trim()
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  if (!title) return { error: "Title wajib diisi." }
  if (!slug) slug = slugify(title)
  if (!slug) return { error: "Slug tidak valid." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/programs")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()
  if (!image) return { error: "Gambar program wajib diunggah." }

  return { data: { slug, title, label, image, description, short_description, is_active } }
}

export async function createProgramAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData)
  if (error || !data) return { success: false, error }
  try {
    await createProgram(data)
    revalidatePath("/dashboard/programs")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan program."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function updateProgramAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updateProgram(id, data)
    revalidatePath("/dashboard/programs")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui program."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function deleteProgramAction(id: number): Promise<ActionResult> {
  try {
    await deleteProgram(id)
    revalidatePath("/dashboard/programs")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus program." }
  }
}
