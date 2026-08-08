"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site footer (and any children) on admin routes so the
 * admin panel's own layout controls the chrome. All other routes render
 * the children normally.
 */
export function FooterRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return <>{children}</>;
}
