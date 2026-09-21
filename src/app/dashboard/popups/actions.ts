"use server"

import { revalidatePath } from "next/cache"
import { createPopup, deletePopup, updatePopup, type PopupInput } from "@/lib/data-store"
import { saveUploadedFile } from "@/lib/upload"

export type ActionResult = { success: boolean; error?: string }

async function validateAndParse(formData: FormData, existingImage?: string): Promise<{ data?: PopupInput; error?: string }> {
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const button_label = String(formData.get("button_label") ?? "").trim()
  const button_href = String(formData.get("button_href") ?? "").trim()
  const attendeesRaw = String(formData.get("attendees") ?? "").trim()
  const attendees = attendeesRaw ? Math.max(1, Math.min(9999, Number(attendeesRaw) || 42)) : 42
  const event_date_raw = String(formData.get("event_date") ?? "").trim()
  let event_date: string | null = null
  if (event_date_raw) {
    const d = new Date(event_date_raw)
    if (!isNaN(d.getTime())) event_date = d.toISOString()
  }
  const is_active = formData.get("is_active") === "on" || String(formData.get("is_active")) === "true"

  const imageFile = formData.get("imageFile") as File | null
  const uploadedPath = await saveUploadedFile(imageFile, "uploads/popups")
  const image = uploadedPath || existingImage || String(formData.get("image") ?? "").trim()

  if (!image) return { error: "Gambar popup wajib diunggah (portrait)." }

  return { data: { image, description, button_label, button_href, title, event_date, attendees, is_active } }
}

export async function createPopupAction(formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParse(formData)
  if (error || !data) return { success: false, error }
  try {
    await createPopup(data)
    revalidatePath("/dashboard/popups")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menyimpan popup." }
  }
}

export async function updatePopupAction(id: number, existingImage: string, formData: FormData): Promise<ActionResult> {
  const { data, error } = await validateAndParse(formData, existingImage)
  if (error || !data) return { success: false, error }
  try {
    await updatePopup(id, data)
    revalidatePath("/dashboard/popups")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal memperbarui popup." }
  }
}

export async function deletePopupAction(id: number): Promise<ActionResult> {
  try {
    await deletePopup(id)
    revalidatePath("/dashboard/popups")
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Gagal menghapus popup." }
  }
}
