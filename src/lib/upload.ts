import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { getSupabaseAdmin } from "./supabase"

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET ?? "uisb-uploads"

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
}

function generateFileName(file: File): string {
  const ext = file.name.split(".").pop() || "png"
  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
  return `${Date.now()}-${cleanName}.${ext}`
}

function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    )
  }
}

async function saveToLocal(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), "public", folder)
  await mkdir(uploadDir, { recursive: true })

  const fileName = generateFileName(file)
  const filePath = join(uploadDir, fileName)

  await writeFile(filePath, buffer)
  return `/${folder}/${fileName}`
}

async function saveToSupabase(file: File, folder: string): Promise<string> {
  const supabase = getSupabaseAdmin()
  const fileName = generateFileName(file)
  const path = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return publicUrlData.publicUrl
}

export async function saveUploadedFile(
  file: File | null | undefined,
  folder = "uploads",
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null
  }

  validateFile(file)

  if (isProduction()) {
    return await saveToSupabase(file, folder)
  }

  return await saveToLocal(file, folder)
}

export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url) return

  if (isProduction()) {
    const supabase = getSupabaseAdmin()
    const bucketUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl("").data.publicUrl
    if (url.startsWith(bucketUrl)) {
      const path = url.replace(bucketUrl, "")
      await supabase.storage.from(BUCKET_NAME).remove([path])
    }
    return
  }

  // Local: best effort delete
  try {
    const { unlink } = await import("node:fs/promises")
    const localPath = url.startsWith("/") ? url.slice(1) : url
    await unlink(join(process.cwd(), "public", localPath))
  } catch {
    // ignore local delete errors
  }
}
