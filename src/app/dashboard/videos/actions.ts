"use server"

import { revalidatePath } from "next/cache"
import { createVideo, deleteVideo, updateVideo, type VideoInput } from "@/lib/data-store"

export type ActionResult = { success: boolean; error?: string }

function extractYoutubeId(input: string): string {
  const t = input.trim()
  if (!t.includes("/") && !t.includes("?") && t.length <= 20) return t
  try {
    const u = new URL(t)
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0]
    if (u.searchParams.get("v")) return u.searchParams.get("v")!
    const m = u.pathname.match(/\/embed\/([^/?]+)/)
    if (m) return m[1]
  } catch {}
  return t
}

async function validateParse(input: { title?: string; thumbnail?: string; youtubeLink?: string }): Promise<{ data?: VideoInput; error?: string }> {
  const title = String(input.title ?? "").trim()
  const youtubeLink = String(input.youtubeLink ?? "").trim()
  let thumbnail = String(input.thumbnail ?? "").trim()
  if (!title) return { error: "Judul video wajib diisi." }
  if (!youtubeLink) return { error: "Link YouTube wajib diisi." }
  const youtube_id = extractYoutubeId(youtubeLink)
  if (!youtube_id || youtube_id.length < 5) return { error: "Link YouTube tidak valid. Masukkan link atau ID YouTube." }
  if (!thumbnail) thumbnail = `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`
  return { data: { youtube_id, title, thumbnail } }
}

export async function createVideoAction(formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "")
  const youtubeLink = String(formData.get("youtubeLink") ?? "")
  const thumbnail = String(formData.get("thumbnail") ?? "")
  const { data, error } = await validateParse({ title, thumbnail, youtubeLink })
  if (error || !data) return { success: false, error }
  try {
    await createVideo(data)
    revalidatePath("/dashboard/videos")
    return { success: true }
  } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Gagal menambah video." } }
}

export async function updateVideoAction(id: number, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "")
  const youtubeLink = String(formData.get("youtubeLink") ?? "")
  const thumbnail = String(formData.get("thumbnail") ?? "")
  const { data, error } = await validateParse({ title, thumbnail, youtubeLink })
  if (error || !data) return { success: false, error }
  try {
    await updateVideo(id, data)
    revalidatePath("/dashboard/videos")
    return { success: true }
  } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Gagal memperbarui video." } }
}

export async function deleteVideoAction(id: number): Promise<ActionResult> {
  try {
    await deleteVideo(id)
    revalidatePath("/dashboard/videos")
    return { success: true }
  } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Gagal menghapus video." } }
}
