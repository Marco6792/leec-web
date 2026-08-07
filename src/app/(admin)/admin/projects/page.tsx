import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { ProjectsView } from "./projects-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const statuses = ["active", "completed", "on_hold", "cancelled", "proposed"];

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const statusFilter = params.status;

  let query = db
    .select({
      id: projects.id,
      title: projects.title,
      slug: projects.slug,
      status: projects.status,
      piId: projects.piId,
      startDate: projects.startDate,
      endDate: projects.endDate,
      fundingSource: projects.fundingSource,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .$dynamic();

  if (statusFilter) query = query.where(eq(projects.status, statusFilter as any));

  const data = await query.orderBy(desc(projects.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} project{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          currentValue={statusFilter}
          options={statuses.map((s) => ({
            value: s,
            label: s === "on_hold" ? "On Hold" : s.charAt(0).toUpperCase() + s.slice(1),
          }))}
        />
      </div>

      <ProjectsView data={data} />
    </div>
  );
}
