"use server"

import { revalidatePath } from "next/cache"
import { createHeroSlide, deleteHeroSlide, updateHeroSlide, type HeroSlideInput } from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = { success: boolean; error?: string }

async function validate(
  formData: FormData,
  existingImage?: string,
): Promise<{ data?: HeroSlideInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim() || "Hero Slide"
  const device_type = String(formData.get("device_type") ?? "desktop").trim()
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  if (!["desktop", "mobile", "all"].includes(device_type)) {
    return { error: "Pilih tipe device yang valid (Desktop, Mobile, atau Semua)." }
  }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/hero")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()
  if (!image) return { error: "Gambar hero slide wajib diunggah." }

  return {
    data: {
      title,
      image,
      device_type: device_type as "desktop" | "mobile" | "all",
      is_active,
    },
  }
}

export async function createHeroSlideAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validate(formData)
  if (error || !data) return { success: false, error }
  try {
    await createHeroSlide(data)
    revalidatePath("/")
    revalidatePath("/dashboard/hero")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan slide hero."
    return { success: false, error: msg }
  }
}

export async function updateHeroSlideAction(
  id: number,
  existingImage: string,
  formData: FormData,
): Promise<ActionResult> {
  const { data, error } = await validate(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updateHeroSlide(id, data)
    revalidatePath("/")
    revalidatePath("/dashboard/hero")
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui slide hero."
    return { success: false, error: msg }
  }
}

export async function deleteHeroSlideAction(id: number): Promise<ActionResult> {
  try {
    await deleteHeroSlide(id)
    revalidatePath("/")
    revalidatePath("/dashboard/hero")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus slide hero." }
  }
}
