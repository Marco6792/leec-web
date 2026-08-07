"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { deleteUpload } from "@/lib/upload-delete";
import { UploadProgress } from "@/components/admin/upload-progress";
import { cn, formatBytes } from "@/lib/utils";

interface UploadImageProps {
  endpoint: keyof OurFileRouter;
  /** Name of the hidden input that carries the uploaded URL to the server action. */
  inputName?: string;
  /** Existing image URL — used when editing a record. */
  value?: string;
  onChange?: (url: string) => void;
  className?: string;
}

/**
 * Wraps UploadThing's UploadDropzone so it can be dropped into any admin form.
 * Uses UploadThing's native manual-mode flow: pick a file, see its size,
 * then click the native "Upload" button. Writes the final URL into a hidden
 * input (default `imageUrl`) that the existing server actions already read.
 */
export function UploadImage({
  endpoint,
  inputName = "imageUrl",
  value = "",
  onChange,
  className,
}: UploadImageProps) {
  const [url, setUrl] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const pendingSize = pendingFiles.reduce((sum, f) => sum + f.size, 0);

  function commit(nextUrl: string) {
    setUrl(nextUrl);
    setError(null);
    onChange?.(nextUrl);
  }

  function clear() {
    const removed = url;
    setUrl("");
    setError(null);
    onChange?.("");
    if (removed) void deleteUpload(removed);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input type="hidden" name={inputName} value={url} />

      {url ? (
        <div className="flex items-start gap-3">
          <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Uploaded image preview" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-700 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              Remove image
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block text-xs text-primary hover:underline"
            >
              View full size ↗
            </a>
          </div>
        </div>
      ) : (
        <UploadDropzone<OurFileRouter, typeof endpoint>
          endpoint={endpoint}
          config={{ mode: "manual" }}
          uploadProgressGranularity="fine"
          onChange={(files) => setPendingFiles(files)}
          onUploadBegin={() => setProgress(0)}
          onUploadProgress={(p) => setProgress(p)}
          onClientUploadComplete={(res) => {
            const file = res?.[0];
            if (file?.url) commit(file.url);
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
      )}

      {pendingFiles.length > 0 && !url && (
        <p className="text-xs font-medium text-muted-foreground">
          {pendingFiles.length} file{pendingFiles.length === 1 ? "" : "s"} selected ·{" "}
          {formatBytes(pendingSize)}
        </p>
      )}

      {progress !== null && !url && (
        <UploadProgress progress={progress} totalBytes={pendingSize} />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
