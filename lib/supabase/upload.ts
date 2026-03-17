import { getSupabaseClient } from "./client";

const BUCKET = "uploads";

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
  const supabase = getSupabaseClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
  const path = `${folder}/${id}.${safeExt}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
