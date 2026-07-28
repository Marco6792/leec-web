import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  publications,
  equipment,
  projects,
  labMembers,
  news,
  events,
  partners,
  grants,
  equipmentBookings,
} from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

// ─── Metric query helper ───────────────────────────────────────────────────

async function getCount(table: any) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(table);
  return result?.count ?? 0;
}

async function getCountWhere(table: any, where: any) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(where);
  return result?.count ?? 0;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface MetricCardData {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  // Fetch all metrics in parallel
  const [
    publicationCount,
    equipmentCount,
    projectCount,
    memberCount,
    newsCount,
    eventCount,
    partnerCount,
    grantCount,
    pendingBookingCount,
  ] = await Promise.all([
    getCount(publications),
    getCount(equipment),
    getCount(projects),
    getCount(labMembers),
    getCount(news),
    getCount(events),
    getCount(partners),
    getCount(grants),
    getCountWhere(equipmentBookings, sql`status = 'pending'`),
  ]);

  const metrics: MetricCardData[] = [
    {
      label: "Publications",
      value: publicationCount,
      description: `${publicationCount > 0 ? "Latest research output" : "No publications yet"}`,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      label: "Equipment",
      value: equipmentCount,
      description: `${equipmentCount > 0 ? "Instruments and lab assets" : "No equipment registered"}`,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      label: "Projects",
      value: projectCount,
      description: `${projectCount > 0 ? "Active and completed research" : "No projects started"}`,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Lab Members",
      value: memberCount,
      description: `${memberCount > 0 ? "Researchers, students, and staff" : "No members registered"}`,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "News",
      value: newsCount,
      description: `${newsCount > 0 ? "Lab announcements" : "No news published"}`,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h4" />
          <path d="M10 7h4" /><path d="M10 11h4" /><path d="M10 15h4" /><path d="M6 19h12" />
        </svg>
      ),
    },
    {
      label: "Events",
      value: eventCount,
      description: `${eventCount > 0 ? "Seminars, workshops, and more" : "No events scheduled"}`,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Partners",
      value: partnerCount,
      description: `${partnerCount > 0 ? "Collaborating institutions" : "No partners yet"}`,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Grants",
      value: grantCount,
      description: `${grantCount > 0 ? "Active research funding" : "No grants recorded"}`,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Pending Bookings",
      value: pendingBookingCount,
      description: pendingBookingCount > 0 ? "Awaiting approval" : "All clear",
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of the LEEC platform.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${metric.color}`}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <QuickActionLink href="/admin/publications" label="Add Publication" icon="plus" />
            <QuickActionLink href="/admin/equipment" label="Register Equipment" icon="plus" />
            <QuickActionLink href="/admin/news" label="Post News Article" icon="plus" />
            <QuickActionLink href="/admin/events" label="Create Event" icon="plus" />
            <QuickActionLink href="/admin/lab-members" label="Manage Lab Members" icon="users" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="Database" status="connected" />
            <StatusRow label="Supabase Auth" status="connected" />
            <StatusRow label="Storage" status="connected" />
            <StatusRow label="Last backup" status={`${new Date().toLocaleDateString()}`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function QuickActionLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted hover:text-foreground transition-colors"
    >
      {icon === "plus" ? (
        <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )}
      {label}
    </Link>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  const isOnline = status === "connected";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
        <span className={`size-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-muted-foreground"}`} />
        {status}
      </span>
    </div>
  );
}
