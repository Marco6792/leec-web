"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface UploadImageProps {
  endpoint: keyof OurFileRouter;
  /** Name of the hidden input that carries the uploaded URL to the server action. */
  inputName?: string;
  /** Existing image URL — used when editing a record. */
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  className?: string;
}

/**
 * Wraps UploadThing's UploadButton so it can be dropped into any admin form.
 * Writes the final URL into a hidden input (default `imageUrl`) that the
 * existing server actions already read.
 */
export function UploadImage({
  endpoint,
  inputName = "imageUrl",
  value = "",
  onChange,
  label = "Upload image",
  className,
}: UploadImageProps) {
  const [url, setUrl] = useState(value);
  const [error, setError] = useState<string | null>(null);

  function commit(nextUrl: string) {
    setUrl(nextUrl);
    setError(null);
    onChange?.(nextUrl);
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
        <UploadButton<OurFileRouter, typeof endpoint>
          endpoint={endpoint}
          className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
          onClientUploadComplete={(res) => {
            const file = res?.[0];
            if (file?.url) commit(file.url);
          }}
          onUploadError={(err) => setError(err.message)}
          content={{ button: label }}
        />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {!url && !error && (
        <p className="text-xs text-muted-foreground">JPG, PNG or WEBP — 4MB max</p>
      )}
    </div>
  );
}
