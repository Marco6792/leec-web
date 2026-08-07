"use client";

import { useState } from "react";
import { ExternalLink, FileText, X } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { deleteUpload } from "@/lib/upload-delete";
import { UploadProgress } from "@/components/admin/upload-progress";
import { cn, formatBytes } from "@/lib/utils";

interface MediaUploadProps {
  /** UploadThing endpoint — "gallery" for images, "documents" for files. */
  endpoint: "gallery" | "documents";
  /** Name of the hidden input that carries the JSON array to the server action. */
  inputName?: string;
  /** Existing files — used when editing a record. */
  value?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
}

/**
 * Multi-file UploadThing dropzone (renders the native `UploadDropzone`).
 * Supports uploading several images / documents at once, shows thumbnails
 * (images) or file chips (documents), and removes each file both from the form
 * and from UploadThing via /api/uploadthing/delete.
 */
export function MediaUpload({
  endpoint,
  inputName = endpoint,
  value = [],
  onChange,
  className,
}: MediaUploadProps) {
  const [urls, setUrls] = useState<string[]>(value);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const pendingSize = pendingFiles.reduce((sum, f) => sum + f.size, 0);

  function commit(next: string[]) {
    setUrls(next);
    setError(null);
    onChange?.(next);
  }

  async function remove(url: string) {
    commit(urls.filter((u) => u !== url));
    await deleteUpload(url);
  }

  const isImage = endpoint === "gallery";

  return (
    <div className={cn("space-y-3", className)}>
      <input type="hidden" name={inputName} value={JSON.stringify(urls)} />

      {urls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {urls.map((url) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg border border-border bg-muted/30"
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt="Uploaded image"
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div className="flex h-28 flex-col items-center justify-center gap-1 p-2 text-center">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-2 w-full break-all text-[11px] text-muted-foreground">
                    {decodeURIComponent(url.split("/").pop() ?? url).split("?")[0]}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    Open
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remove upload"
                className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1 text-muted-foreground shadow transition-all hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <UploadDropzone<OurFileRouter, typeof endpoint>
        endpoint={endpoint}
        config={{ mode: "manual" }}
        uploadProgressGranularity="fine"
        onChange={(files) => setPendingFiles(files)}
        onUploadBegin={() => setProgress(0)}
        onUploadProgress={(p) => setProgress(p)}
        onClientUploadComplete={(res) => {
          const next = (res ?? [])
            .map((f) => f.url)
            .filter((u): u is string => Boolean(u));
          if (next.length) commit([...urls, ...next]);
          setPendingFiles([]);
          setProgress(null);
        }}
        onUploadError={(err) => {
          setError(err.message);
          setProgress(null);
        }}
        appearance={{
          container: (args) =>
            cn(
              "cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors",
              "hover:border-ring hover:bg-muted/50",
              args.isDragActive && "border-primary bg-primary/5",
              args.isUploading && "border-primary/50 opacity-80",
            ),
          label: (args) =>
            cn(
              "text-sm font-medium text-muted-foreground",
              args.isDragActive && "text-primary",
              args.isUploading && "text-primary",
            ),
          allowedContent: "text-xs text-muted-foreground/80",
          button: (args) =>
            cn(
              "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors",
              "hover:bg-primary/90 disabled:opacity-60",
            ),
        }}
      />

      {pendingFiles.length > 0 && (
        <p className="text-xs font-medium text-muted-foreground">
          {pendingFiles.length} file{pendingFiles.length === 1 ? "" : "s"} selected ·{" "}
          {formatBytes(pendingSize)}
        </p>
      )}

      {progress !== null && (
        <UploadProgress progress={progress} totalBytes={pendingSize} />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
