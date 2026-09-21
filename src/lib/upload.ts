import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function saveUploadedFile(
  file: File | null | undefined,
  folder = "uploads",
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), "public", folder)
  await mkdir(uploadDir, { recursive: true })

  const ext = file.name.split(".").pop() || "png"
  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
  const fileName = `${Date.now()}-${cleanName}.${ext}`
  const filePath = join(uploadDir, fileName)

  await writeFile(filePath, buffer)
  return `/${folder}/${fileName}`
}
