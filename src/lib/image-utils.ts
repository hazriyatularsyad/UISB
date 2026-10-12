const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "uisb-bucket";

/**
 * Given a value that may be a relative path, an absolute Supabase URL,
 * or null/empty, return a string safe to pass to <Image src>.
 * Always returns a string: if input is falsy, returns a transparent 1x1 GIF.
 */
export function getSupabaseImageUrl(path: string | null | undefined): string {
  if (!path) {
    // Transparent 1x1 GIF
    return "data:image/gif;base64,R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Local static assets in /public are served as-is (e.g. /images/...)
  if (path.startsWith("/images/") || path.startsWith("/favicon") || path.startsWith("/icons/")) return path;
  // Assume it's a path relative to the bucket (with or without leading slash)
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${clean}`;
}