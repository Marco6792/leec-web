import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { researchDomains } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { ResearchAreasView } from "./research-areas-view";

export const dynamic = "force-dynamic";

export default async function AdminResearchAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; deleted?: string }>;
}) {
  await requireAdmin();

  const sp = await searchParams;

  const data = await db
    .select({
      id: researchDomains.id,
      name: researchDomains.name,
      slug: researchDomains.slug,
      description: researchDomains.description,
      icon: researchDomains.icon,
      featuredImageUrl: researchDomains.featuredImageUrl,
      tags: researchDomains.tags,
      sortOrder: researchDomains.sortOrder,
      createdAt: researchDomains.createdAt,
      updatedAt: researchDomains.updatedAt,
    })
    .from(researchDomains)
    .orderBy(asc(researchDomains.sortOrder));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Research Areas" }]} />

      {sp.added === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          Research area added.
        </div>
      )}
      {sp.deleted === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          Research area deleted.
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Research Areas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the research areas shown on the public research page.
          </p>
        </div>
        <Link
          href="/admin/research-areas/new"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + Add Area
        </Link>
      </div>

      <ResearchAreasView data={data} />
    </div>
  );
}
