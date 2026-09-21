"use server"

import { revalidatePath } from "next/cache"
import { createInformation, deleteInformation, updateInformation, type InformationInput } from "@/lib/data-store"
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
): Promise<{ data?: InformationInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  const slug = slugify(title)
  const description = String(formData.get("description") ?? "").trim()
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  if (!title) return { error: "Title wajib diisi." }
  if (!slug) return { error: "Slug tidak valid." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/information")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()
  if (!image) return { error: "Gambar informasi wajib diunggah." }

  return { data: { slug, title, image, description, is_active } }
}

export async function createInformationAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData)
  if (error || !data) return { success: false, error }
  try {
    await createInformation(data)
    revalidatePath("/information")
    revalidatePath("/dashboard/information")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan informasi."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function updateInformationAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updateInformation(id, data)
    revalidatePath("/information")
    revalidatePath("/dashboard/information")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui informasi."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function deleteInformationAction(id: number): Promise<ActionResult> {
  try {
    await deleteInformation(id)
    revalidatePath("/information")
    revalidatePath("/dashboard/information")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus informasi." }
  }
}