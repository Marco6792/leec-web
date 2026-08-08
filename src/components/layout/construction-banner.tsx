"use client";

import { useState } from "react";
import { Construction, X } from "lucide-react";

export function ConstructionBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-amber-500 text-amber-950">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center gap-2">
        <span>Under Construction</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="cursor-pointer rounded-md p-2 border-2 border-black"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
