"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  /** Overrides the form status if you need to control loading externally. */
  loading?: boolean;
  /** Label shown while the form is submitting. */
  pendingText?: React.ReactNode;
  spinnerClassName?: string;
}

/**
 * Shadcn Button wired to `useFormStatus` so it automatically shows a spinner
 * and disables itself while its enclosing server-action form is submitting.
 * Drop this into any `<form action={...}>` — client or server page.
 */
export function SubmitButton({
  children,
  loading,
  pendingText,
  disabled,
  className,
  spinnerClassName,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isBusy = loading ?? pending;

  return (
    <Button
      type="submit"
      disabled={disabled || isBusy}
      className={cn(className)}
      {...props}
    >
      {isBusy && <Spinner className={cn("size-4", spinnerClassName)} />}
      {isBusy && pendingText != null ? pendingText : children}
    </Button>
  );
}
