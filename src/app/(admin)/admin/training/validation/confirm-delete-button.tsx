"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function ConfirmSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      disabled={pending}
      className="text-xs text-destructive hover:text-destructive"
    >
      {pending && <Spinner />}
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}

export function ConfirmDeleteButton({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this session? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <ConfirmSubmit />
    </form>
  );
}

