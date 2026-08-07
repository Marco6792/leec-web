"use client";

import { useState } from "react";

interface DeleteButtonProps {
  /** Bound server action, e.g. `deleteNews.bind(null, id)`. */
  action: (formData: FormData) => void;
  label?: string;
}

/**
 * Small inline delete control with a two-step confirm, safe to use inside
 * admin table rows. Submits the bound server action when confirmed.
 */
export function DeleteButton({ action, label = "Delete" }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs text-rose-700 transition-colors hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
      >
        {label}
      </button>
    );
  }

  return (
    <form action={action} className="inline-flex items-center gap-1.5">
      <button
        type="submit"
        className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-rose-700"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
      >
        Cancel
      </button>
    </form>
  );
}
