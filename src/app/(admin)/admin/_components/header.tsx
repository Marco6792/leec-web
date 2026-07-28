export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      {/* Page title would go here — set dynamically per page */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button
          type="button"
          className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-border" />

        {/* User avatar placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            AD
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-medium">Admin</p>
            <p className="text-muted-foreground">admin@leec.org</p>
          </div>
        </div>
      </div>
    </header>
  );
}
