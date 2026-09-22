import { getSupabaseClient } from "./client";

const BUCKET = "uploads";

/** Max image upload size: 3 MB */
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export function formatMaxImageSize() {
  return "3 MB";
}

export function assertImageWithinLimit(file: File) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `Image is too large (${formatFileSize(file.size)}). Please choose a file under ${formatMaxImageSize()}.`
    );
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * Requires a bucket named "uploads" with public read access in your Supabase project.
 * Create it in Dashboard → Storage → New bucket, then set the bucket to public.
 */
export async function uploadItemImage(
  file: File,
  folder: string,
  id: string
): Promise<string> {
  assertImageWithinLimit(file);

  const supabase = getSupabaseClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
  const path = `${folder}/${id}.${safeExt}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true
  });

  if (error) throw error;

  const {
    data: { publicUrl }
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
