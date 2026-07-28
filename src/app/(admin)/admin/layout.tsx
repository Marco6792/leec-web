import type { Metadata } from "next";
import { AdminSidebar } from "./_components/sidebar";
import { AdminHeader } from "./_components/header";
import { getUserRole } from "@/lib/auth/admin";

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
  // Fetch the user's role at the layout level so sidebar and pages can use it
  const userRole = await getUserRole();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile by default */}
      <AdminSidebar userRole={userRole} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
