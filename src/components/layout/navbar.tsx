"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/lib/auth/actions";
import { isAdminUser } from "@/lib/auth/is-admin";
import { useAuthStore } from "@/lib/stores/auth";
import { useSearchStore } from "@/lib/stores/search";
import { Menu, X, Search, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    href: "/research",
    label: "Research",
    children: [
      { href: "/research", label: "All Research Areas" },
      { href: "/research/electromagnetic-ndt", label: "Electromagnetic NDT" },
      { href: "/research/energy-harvesting", label: "RF Energy Harvesting" },
      { href: "/research/power-electronics", label: "Power Electronics" },
      { href: "/research/sensors-iot", label: "Sensors & IoT" },
    ],
  },
  { href: "/people", label: "People" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/equipment", label: "Equipment" },
  { href: "/training", label: "Training" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, avatarUrl, fullName, setUser, clear } = useAuthStore();
  const userRef = useRef(user);
  userRef.current = user;
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleSearch = useSearchStore((s) => s.toggle);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleSearch]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    /** Populate the store with the given user + their profile row. */
    function applyUser(authUser: {
      id: string;
      email?: string | undefined;
      user_metadata?: Record<string, unknown> | undefined;
    }) {
      const meta = authUser.user_metadata ?? {};
      const storeUser = { id: authUser.id, email: authUser.email };
      setUser(
        storeUser,
        (meta.avatar_url as string | undefined) ?? null,
        (meta.full_name as string | undefined) ??
          (meta.name as string | undefined) ??
          "",
      );

      // Determine admin-level access so the navbar can gate the Admin button.
      void isAdminUser().then(setIsAdmin);

      supabase!
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", authUser.id)
        .single<{ avatar_url: string | null; full_name: string }>()
        .then(({ data, error }) => {
          if (data && !error) {
            setUser(storeUser, data.avatar_url, data.full_name);
          }
        });
    }

    async function syncSession() {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      if (!session?.user) {
        // No session on this route — if we previously had one, it's a logout.
        if (userRef.current) clear();
        setIsAdmin(false);
        return;
      }
      applyUser(session.user);
    }

    // Re-sync on every navigation so auth performed on another page (e.g. a
    // server-action login that set the session cookies and redirected) is
    // reflected in the navbar without a manual refresh.
    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        clear();
        setIsAdmin(false);
        return;
      }
      applyUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [pathname, setUser, clear]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname.startsWith("/admin")) return null;

  const profileHref = user ? `/profile/${user.id}` : "/profile";

  return (
    <header className="fixed top-[0.5rem] left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border border-border md:max-w-7xl mx-auto md:rounded-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center group shrink-0">
            <div className="w-[13rem] pt-0 pb-0">
              <img
                src="/logo-leec.jpeg"
                alt="LEEC Logo"
                className="h-full sm:h-12 w-full object-contain"
              />
            </div>
          </Link>

          <NavigationMenu className="hidden lg:flex mx-4">
            <NavigationMenuList>
              {navItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-9 px-3 text-sm",
                        isActive(item.href)
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-56 p-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink
                              href={child.href}
                              className={cn(
                                isActive(child.href)
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                              )}
                            >
                              {child.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-9 px-3 text-sm",
                        isActive(item.href)
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {user && isAdmin && (
              <Link
                href="/admin"
                aria-label="Admin dashboard"
                className="inline-flex"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer gap-1.5"
                >
                  <LayoutDashboard className="size-4" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={toggleSearch}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {user ? (
              <div className="hidden sm:flex relative group">
                <Link href={profileHref}>
                  <Avatar className="size-9 cursor-pointer">
                    <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
                    <AvatarFallback className="text-sm font-semibold">
                      {fullName
                        ? fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-sm font-medium truncate">
                      {fullName || user.email}
                    </div>
                    <div className="border-t" />
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <div className="border-t" />
                    <form action={signout}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/signup" className="inline-flex">
                  <Button
                    variant="default"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Join Us
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.href} className="space-y-1 pt-2">
                  <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-2 rounded-md text-sm pl-8",
                        isActive(child.href)
                          ? "bg-accent font-medium"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="border-t pt-4 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium truncate">
                    {fullName || user.email}
                  </div>
                  <Link href={profileHref} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-3 cursor-pointer justify-start"
                    >
                      <Avatar size="sm">
                        <AvatarImage
                          src={avatarUrl ?? undefined}
                          alt={fullName}
                        />
                        <AvatarFallback>
                          {fullName
                            ? fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      Profile
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                      >
                        Admin
                      </Button>
                    </Link>
                  )}
                  <form action={signout}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="w-full cursor-pointer"
                    >
                      Sign Out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full cursor-pointer"
                    >
                      Join Us
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
