"use client";

import { useRef } from "react";
import { cn, formatBytes } from "@/lib/utils";

/**
 * Formats a duration (ms) as a compact "Xs", "Xm Ys" or "Xh Ym" label.
 * Returns "…" while there is not enough data to estimate.
 */
function formatEta(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 1000) return "…";
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes}m`;
}

interface UploadProgressProps {
  /** Upload progress 0–100. */
  progress: number;
  /** Total bytes being uploaded — used to derive speed and ETA. */
  totalBytes: number;
  className?: string;
}

/**
 * Live upload progress row: progress bar + percentage + real-time speed
 * (MB/s) + estimated time remaining. Speed/ETA are derived from the progress
 * percentage, total file size and elapsed time, so no extra API is needed.
 * Mounts when an upload begins and unmounts when it finishes.
 */
export function UploadProgress({ progress, totalBytes, className }: UploadProgressProps) {
  const startRef = useRef<number>(Date.now());

  const elapsedMs = Date.now() - startRef.current;
  const bytesDone = totalBytes > 0 ? (progress / 100) * totalBytes : 0;
  const speedBps = elapsedMs > 0 ? (bytesDone / elapsedMs) * 1000 : 0;
  const etaMs = speedBps > 0 ? ((totalBytes - bytesDone) / speedBps) * 1000 : null;
  // Ignore speed/ETA for the first moments — elapsed time is tiny on the
  // first progress event, which would otherwise show an absurd spike.
  const settling = elapsedMs < 300;
  const speedLabel = settling ? "…" : `${formatBytes(speedBps)}/s`;
  const etaLabel = settling ? "…" : formatEta(etaMs);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
        Uploading… {Math.round(progress)}% · {speedLabel} · {etaLabel} left
      </span>
    </div>
  );
}
