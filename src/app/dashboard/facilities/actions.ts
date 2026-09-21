"use server"

import { revalidatePath } from "next/cache"
import { createFacility, deleteFacility, updateFacility, type FacilityInput } from "@/lib/data-store"
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
): Promise<{ data?: FacilityInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  const slug = slugify(title)
  const short_description = String(formData.get("short_description") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const icon = String(formData.get("icon") ?? "FaBuilding").trim() || "FaBuilding"
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  if (!title) return { error: "Title wajib diisi." }
  if (!slug) return { error: "Slug tidak valid." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/facilities")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()
  if (!image) return { error: "Gambar fasilitas wajib diunggah." }

  return { data: { slug, title, short_description, description, image, icon, is_active } }
}

export async function createFacilityAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData)
  if (error || !data) return { success: false, error }
  try {
    await createFacility(data)
    revalidatePath("/dashboard/facilities")
    revalidatePath("/facility")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan fasilitas."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function updateFacilityAction(id: number, oldSlug: string, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updateFacility(id, oldSlug, data)
    revalidatePath("/dashboard/facilities")
    revalidatePath("/facility")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui fasilitas."
    if (msg.includes("duplicate") || msg.includes("unique")) return { success: false, error: "Slug sudah dipakai." }
    return { success: false, error: msg }
  }
}

export async function deleteFacilityAction(id: number, slug: string): Promise<ActionResult> {
  try {
    await deleteFacility(id, slug)
    revalidatePath("/dashboard/facilities")
    revalidatePath("/facility")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus fasilitas." }
  }
}
