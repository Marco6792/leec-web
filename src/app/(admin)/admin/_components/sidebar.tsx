"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/auth/admin";

// ─── Nav item config with role-based access ───────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Minimum role required to see this item. If omitted, defaults to "technician". */
  minRole?: AdminRole;
}

function navIcon(d: string) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: navIcon("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"),
  },
  {
    label: "Publications",
    href: "/admin/publications",
    minRole: "director",
    icon: navIcon("M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"),
  },
  {
    label: "Equipment",
    href: "/admin/equipment",
    minRole: "technician",
    icon: navIcon("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"),
  },
  {
    label: "Projects",
    href: "/admin/projects",
    minRole: "pi",
    icon: navIcon("M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"),
  },
  {
    label: "News",
    href: "/admin/news",
    minRole: "technician",
    icon: navIcon("M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h4 M10 7h4 M10 11h4 M10 15h4 M6 19h12"),
  },
  {
    label: "Events",
    href: "/admin/events",
    minRole: "technician",
    icon: navIcon("M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2 M8 2v4 M16 2v4 M3 10h18"),
  },
  {
    label: "Lab Members",
    href: "/admin/lab-members",
    minRole: "technician",
    icon: navIcon("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"),
  },
  {
    label: "Training",
    href: "/admin/training",
    minRole: "technician",
    icon: navIcon("M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 0 0 .2.3 1.5 1.5 0 0 1 0 3.4A1.5 1.5 0 0 1 9.8 4.3.3.3 0 0 0 10 4H9a2 2 0 0 0-2 2v5a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H9a.3.3 0 0 0 .2.3 1.5 1.5 0 0 1 0 3.4A1.5 1.5 0 0 1 7.8 4.3.3.3 0 0 0 8 4H7a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 0 0 .2.3 1.5 1.5 0 0 1 0 3.4A1.5 1.5 0 0 1 11.8 4.3.3.3 0 0 0 12 4h-1a2 2 0 0 0-2 2v5a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4"),
  },
  {
    label: "Collaboration",
    href: "/admin/collaboration",
    minRole: "pi",
    icon: navIcon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M12 12l3 3-3 3"),
  },
  {
    label: "Partners",
    href: "/admin/partners",
    minRole: "pi",
    icon: navIcon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"),
  },
  {
    label: "Settings",
    href: "/admin/settings",
    minRole: "technician",
    icon: navIcon("M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6"),
  },
];

// ─── Role hierarchy for access checks ─────────────────────────────────────

const roleHierarchy: Record<AdminRole, number> = {
  technician: 0,
  pi: 1,
  director: 2,
};

function hasAccess(role: AdminRole | null, item: NavItem): boolean {
  if (!role) return false;
  const required = item.minRole ?? "technician";
  return roleHierarchy[role] >= roleHierarchy[required];
}

// ─── Component ─────────────────────────────────────────────────────────────

export function AdminSidebar({ userRole }: { userRole: AdminRole | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const visibleItems = navItems.filter((item) => hasAccess(userRole, item));

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300",
          "w-64 md:w-64 lg:w-64",
          "fixed inset-y-0 left-0 z-50 md:static md:z-auto",
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <img src="/logo-leec.jpeg" alt="LEEC Logo" className="h-8 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed bottom-4 left-4 z-50 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </>
  );
}
