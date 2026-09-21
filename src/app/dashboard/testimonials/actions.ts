"use server"

import { revalidatePath } from "next/cache"
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  type TestimonialInput,
} from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = {
  success: boolean
  error?: string
}

async function validateAndParseTestimonial(formData: FormData, existingImage?: string): Promise<{ data?: TestimonialInput; error?: string }> {
  const name = String(formData.get("name") ?? "").trim()
  const designation = String(formData.get("designation") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!name) return { error: "Nama wajib diisi." }
  if (!designation) return { error: "Jabatan / Posisi wajib diisi." }

  const imageFile = formData.get("profileImageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/testimonials")
  const profile_image = uploadedPath || existingImage || String(formData.get("profile_image") ?? "").trim()

  if (!profile_image) return { error: "Foto profil wajib diunggah." }
  if (!description) return { error: "Isi testimoni / deskripsi wajib diisi." }

  return { data: { name, designation, description, profile_image } }
}

export async function createTestimonialAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseTestimonial(formData)
  if (error || !data) return { success: false, error }

  try {
    await createTestimonial(data)
    revalidatePath("/dashboard/testimonials")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menambahkan testimoni." }
  }
}

export async function updateTestimonialAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseTestimonial(formData, existingImage)
  if (error || !data) return { success: false, error }

  try {
    await updateTestimonial(id, data)
    revalidatePath("/dashboard/testimonials")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui testimoni." }
  }
}

export async function deleteTestimonialAction(id: number): Promise<ActionResult> {
  try {
    await deleteTestimonial(id)
    revalidatePath("/dashboard/testimonials")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus testimoni." }
  }
}
