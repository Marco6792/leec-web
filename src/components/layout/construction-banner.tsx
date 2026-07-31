"use client";

import { useState } from "react";
import { Construction, X } from "lucide-react";

export function ConstructionBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-amber-500 text-amber-950 dark:bg-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
        <Construction className="size-4 shrink-0" />
        <span className="truncate">
          This website is under construction — content is being added regularly.
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="shrink-0 rounded-md p-1 hover:bg-amber-600/30 dark:hover:bg-amber-500/30 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
