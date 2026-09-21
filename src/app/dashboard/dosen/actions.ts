"use server"

import { revalidatePath } from "next/cache"
import {
  createDosen,
  deleteDosen,
  updateDosen,
  type DosenInput,
} from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = {
  success: boolean
  error?: string
}

async function validateAndParseDosen(formData: FormData, existingImage?: string): Promise<{ data?: DosenInput; error?: string }> {
  const name = String(formData.get("name") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  const campus = String(formData.get("campus") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!name) return { error: "Nama dosen wajib diisi." }
  if (!title) return { error: "Jabatan / Gelar wajib diisi." }

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/dosen")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()

  if (!image) return { error: "Foto dosen wajib diunggah." }

  return { data: { name, title, campus, description, image } }
}

export async function createDosenAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseDosen(formData)
  if (error || !data) return { success: false, error }

  try {
    await createDosen(data)
    revalidatePath("/dashboard/dosen")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menambahkan dosen." }
  }
}

export async function updateDosenAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParseDosen(formData, existingImage)
  if (error || !data) return { success: false, error }

  try {
    await updateDosen(id, data)
    revalidatePath("/dashboard/dosen")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui data dosen." }
  }
}

export async function deleteDosenAction(id: number): Promise<ActionResult> {
  try {
    await deleteDosen(id)
    revalidatePath("/dashboard/dosen")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus dosen." }
  }
}
