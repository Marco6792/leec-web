import { desc, eq, count } from "drizzle-orm";
import { db } from "@/db";
import {
  collaborationRequests,
  collaborationProjects,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { CollaborationView } from "./collaboration-view";
import { approveRequest, rejectRequest } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCollaborationPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  // Fetch collaboration requests
  const requests = await db
    .select({
      id: collaborationRequests.id,
      organizationName: collaborationRequests.organizationName,
      requestType: collaborationRequests.requestType,
      status: collaborationRequests.status,
      createdAt: collaborationRequests.createdAt,
    })
    .from(collaborationRequests)
    .orderBy(desc(collaborationRequests.createdAt));

  // Fetch collaboration projects
  const projects = await db
    .select({
      id: collaborationProjects.id,
      title: collaborationProjects.title,
      status: collaborationProjects.status,
      startDate: collaborationProjects.startDate,
      endDate: collaborationProjects.endDate,
      createdAt: collaborationProjects.createdAt,
    })
    .from(collaborationProjects)
    .orderBy(desc(collaborationProjects.createdAt));

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Collaboration" }]} />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collaboration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {requests.length} request{requests.length !== 1 ? "s" : ""} &middot;{" "}
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Success/error banners */}
      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Action completed successfully.
        </div>
      )}
      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {sp.error}
        </div>
      )}

      {/* Pending requests alert */}
      {pendingRequests.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            <strong>{pendingRequests.length}</strong> collaboration request
            {pendingRequests.length !== 1 ? "s" : ""} awaiting your review.
          </span>
        </div>
      )}

      {/* Pending cards (for quick actions) */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Pending Review
          </h2>
          {pendingRequests.slice(0, 5).map((req) => (
            <div
              key={req.id}
              className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">
                    {req.organizationName ?? "Unknown Organization"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {req.requestType?.replace(/_/g, " ") ?? "Request"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={approveRequest.bind(null, req.id)}>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectRequest.bind(null, req.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-rose-200 px-3.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      Decline
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full table view */}
      <CollaborationView requests={requests} projects={projects} />
    </div>
  );
}
