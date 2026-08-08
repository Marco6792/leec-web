import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      {/* Page title would go here — set dynamically per page */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>

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

