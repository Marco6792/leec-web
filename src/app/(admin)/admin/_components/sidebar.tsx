"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Settings as SettingsIcon,
  FolderOpen,
  Newspaper,
  Calendar,
  Users,
  GraduationCap,
  Handshake,
  Award,
  MessageSquare,
  FileText,
  SlidersHorizontal,
  Home,
  FlaskConical,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    label: "Publications",
    href: "/admin/publications",
    icon: <BookOpen className="size-5" />,
  },
  {
    label: "Equipment",
    href: "/admin/equipment",
    icon: <SettingsIcon className="size-5" />,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: <FolderOpen className="size-5" />,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: <Newspaper className="size-5" />,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: <Calendar className="size-5" />,
  },
  {
    label: "Lab Members",
    href: "/admin/lab-members",
    icon: <Users className="size-5" />,
  },
  {
    label: "Training",
    href: "/admin/training",
    icon: <GraduationCap className="size-5" />,
  },
  {
    label: "Collaboration",
    href: "/admin/collaboration",
    icon: <Handshake className="size-5" />,
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: <Award className="size-5" />,
  },
  {
    label: "Hero Quotes",
    href: "/admin/hero-quotes",
    icon: <MessageSquare className="size-5" />,
  },
  {
    label: "Research Areas",
    href: "/admin/research-areas",
    icon: <FlaskConical className="size-5" />,
  },
  {
    label: "Pages",
    href: "/admin/pages",
    icon: <FileText className="size-5" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <SlidersHorizontal className="size-5" />,
  },
];

function AdminSidebarContent() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <img src="/logo-leec.jpeg" alt="LEEC Logo" className="h-8 w-auto object-contain" />
          {state === "expanded" && (
            <span className="text-sm font-semibold">LEEC Admin</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={state === "collapsed" ? item.label : undefined}
                  render={
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={state === "collapsed" ? "Back to Website" : undefined}
              render={
                <Link href="/">
                  <Home className="size-5" />
                  <span>Back to Website</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <AdminSidebarContent />
    </Sidebar>
  );
}
