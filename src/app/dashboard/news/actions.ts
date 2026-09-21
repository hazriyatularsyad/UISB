"use server"

import { revalidatePath } from "next/cache"
import {
  createNews,
  deleteNews,
  updateNews,
  type NewsInput,
} from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = {
  success: boolean
  error?: string
}

async function validateAndParseNews(formData: FormData, existingImage?: string): Promise<{ data?: NewsInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  const date = String(formData.get("date") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const link = String(formData.get("link") ?? "#").trim() || "#"

  if (!title) return { error: "Judul berita wajib diisi." }
  if (!date) return { error: "Tanggal berita wajib diisi." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/news")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()

  if (!image) return { error: "Gambar berita wajib diunggah." }
  if (!description) return { error: "Deskripsi berita wajib diisi." }

  return { data: { title, date, description, image, link } }
}

export async function createNewsAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseNews(formData)
  if (error || !data) return { success: false, error }
  
  try {
    await createNews(data)
    revalidatePath("/dashboard/news")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menyimpan berita." }
  }
}

export async function updateNewsAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseNews(formData, existingImage)
  if (error || !data) return { success: false, error }
  
  try {
    await updateNews(id, data)
    revalidatePath("/dashboard/news")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui berita." }
  }
}

export async function deleteNewsAction(id: number): Promise<ActionResult> {
  try {
    await deleteNews(id)
    revalidatePath("/dashboard/news")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus berita." }
  }
}
