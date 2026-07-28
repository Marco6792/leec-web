"use client";

export function ConfirmDeleteButton({ action }: { action: (formData: FormData) => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this session? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 transition-colors"
      >
        Delete
      </button>
    </form>
  );
}
