import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  name,
  required,
  error,
  helpText,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

// ─── Preset input styles matching admin design ────────────────────────────

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50";

export const selectClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50";

export const textareaClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-y min-h-[100px]";

// ─── Layout helpers ───────────────────────────────────────────────────────

export function FieldGrid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3",
        cols === 4 && "sm:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}
