import type { Metadata } from "next";
import { AdminSidebar } from "./_components/sidebar";
import { AdminHeader } from "./_components/header";
import { Toaster } from "@/components/ui/toast";
import { AdminAutoToast } from "./_components/admin-auto-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";


export const metadata: Metadata = {
  title: {
    template: "%s — LEEC Admin",
    default: "Dashboard — LEEC Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content area - using SidebarInset for proper layout */}
        <SidebarInset className="flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
            <SidebarTrigger className="-ml-2" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>

        <AdminAutoToast />
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
