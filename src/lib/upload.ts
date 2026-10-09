import { getSupabaseAdmin } from "./supabase"

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET ?? "uisb-bucket"

function isProduction(): boolean {
  // Always use Supabase Storage for uploads
  return true
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

  return await saveToSupabase(file, folder)
}

export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url) return

  const supabase = getSupabaseAdmin()
  const bucketUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl("").data.publicUrl
  if (url.startsWith(bucketUrl)) {
    const path = url.replace(bucketUrl, "")
    await supabase.storage.from(BUCKET_NAME).remove([path])
  }
}
