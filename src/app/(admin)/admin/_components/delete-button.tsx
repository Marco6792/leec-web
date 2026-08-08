"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface DeleteButtonProps {
  /** Bound server action, e.g. `deleteNews.bind(null, id)`. */
  action: (formData: FormData) => void;
  label?: string;
  confirmLabel?: string;
}

/** Submit button that reflects `useFormStatus` pending state. */
function ConfirmSubmit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      size="xs"
      disabled={pending}
      className="text-xs"
    >
      {pending && <Spinner />}
      {pending ? "Deleting…" : children}
    </Button>
  );
}

/**
 * Inline delete control with a two-step confirm, safe to use inside admin
 * table rows. Uses the shadcn Button component and shows a spinner while the
 * bound server action is submitting.
 */
export function DeleteButton({
  action,
  label = "Delete",
  confirmLabel = "Confirm",
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => setConfirming(true)}
        className="text-xs text-destructive hover:text-destructive"
      >
        {label}
      </Button>
    );
  }

  return (
    <form action={action} className="inline-flex items-center gap-1.5">
      <ConfirmSubmit>{confirmLabel}</ConfirmSubmit>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setConfirming(false)}
        className="text-xs"
      >
        Cancel
      </Button>
    </form>
  );
}

