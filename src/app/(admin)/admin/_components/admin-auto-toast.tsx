"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";

const TRACKED_PARAMS = ["saved", "deleted", "approved", "rejected", "error"] as const;

/**
 * Global admin toast driver. Server actions communicate success / failure by
 * redirecting with a query param (`?saved=true`, `?deleted=true`,
 * `?approved=true`, `?rejected=true`, `?error=...`). This component watches the
 * URL on mount, fires the right toast, then strips the param from the URL so
 * the toast is not repeated on refresh / navigation back.
 */
export function AdminAutoToast() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const saved = params.get("saved");
    const deleted = params.get("deleted");
    const approved = params.get("approved");
    const rejected = params.get("rejected");
    const error = params.get("error");

    if (saved === "true") {
      toast.add({ title: "Saved", description: "Changes saved successfully.", type: "success" });
    } else if (deleted === "true") {
      toast.add({ title: "Deleted", description: "The record was removed.", type: "success" });
    } else if (approved === "true") {
      toast.add({ title: "Approved", description: "Request approved successfully.", type: "success" });
    } else if (rejected === "true") {
      toast.add({ title: "Rejected", description: "Request was declined.", type: "info" });
    } else if (error) {
      toast.add({
        title: "Something went wrong",
        description: error.replace(/\+/g, " "),
        type: "error",
      });
    }

    const hasTracked = TRACKED_PARAMS.some((p) => params.has(p));
    if (hasTracked) {
      handled.current = true;
      // Clean the URL without triggering a reload so the toast only appears once.
      for (const p of TRACKED_PARAMS) params.delete(p);
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        url.pathname + (qs ? `?${qs}` : ""),
      );
    }
  }, []);

  return null;
}
