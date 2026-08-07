"use client";

import { useRef, useState } from "react";
import { uploadPdf } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface PdfUploadProps {
  /** Name of the hidden input that carries the uploaded URL to the server action. */
  inputName?: string;
  /** Existing PDF URL — used when editing a record. */
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  className?: string;
}

/**
 * Uploads a PDF to Supabase Storage (documents bucket) from the browser,
 * shows an inline preview, and writes the public URL into a hidden input
 * (default `pdfUrl`) that the existing server actions already read.
 */
export function PdfUpload({
  inputName = "pdfUrl",
  value = "",
  onChange,
  label = "Upload PDF",
  className,
}: PdfUploadProps) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const result = await uploadPdf(file);
    setUploading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setUrl(result.url);
    onChange?.(result.url);

    // Reset the input so the same file can be re-selected.
    if (inputRef.current) inputRef.current.value = "";
  }

  function clear() {
    setUrl("");
    setError(null);
    onChange?.("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input type="hidden" name={inputName} value={url} />

      {url ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <iframe
              src={url}
              title="PDF preview"
              className="h-72 w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Open PDF ↗
            </a>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-700 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              Remove PDF
            </button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFile}
            className="hidden"
          />
          <span>{uploading ? "Uploading…" : label}</span>
          <span className="text-xs">PDF files only</span>
        </label>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
