/**
 * Best-effort client-side deletion of an uploaded file from UploadThing.
 * Only UploadThing URLs (utfs.io) are deleted — external URLs (e.g. pasted
 * links) are left untouched. Failures are swallowed so the form state still
 * clears even if the network request fails.
 */
export async function deleteUpload(url: string): Promise<void> {
  if (!url || !url.includes("utfs.io")) return;

  try {
    await fetch("/api/uploadthing/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // best-effort: ignore network errors
  }
}
