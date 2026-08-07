import { createClient } from "@/lib/supabase/client";

/** Public storage bucket used for PDF documents uploaded from admin forms. */
export const DOCUMENTS_BUCKET = "documents";

/**
 * Build a public URL for an object in the documents bucket.
 */
export function getPdfPublicUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !path) return "";
  return `${supabaseUrl}/storage/v1/object/public/${DOCUMENTS_BUCKET}/${path}`;
}

/**
 * Upload a PDF to Supabase Storage (documents bucket) from the browser.
 * Returns the public URL on success, or an error message on failure.
 */
export async function uploadPdf(
  file: File,
  folder = "documents",
): Promise<{ url: string; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { url: "", error: "Supabase is not configured (missing env vars)." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { url: "", error: "Only PDF files are supported." };
  }

  const cleanName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 60);
  const path = `${folder}/${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) return { url: "", error: error.message };
  return { url: getPdfPublicUrl(path) };
}
