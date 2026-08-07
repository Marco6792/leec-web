import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { PublicationsView } from "./publications-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const publicationTypes = [
  "journal", "conference", "book", "chapter", "report",
  "dataset", "thesis", "patent", "software", "preprint",
];

export default async function AdminPublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; year?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const typeFilter = params.type;
  const yearFilter = params.year;

  let query = db
    .select({
      id: publications.id,
      title: publications.title,
      type: publications.type,
      year: publications.year,
      doi: publications.doi,
      journal: publications.journal,
      citationCount: publications.citationCount,
      openAccess: publications.openAccess,
      createdAt: publications.createdAt,
    })
    .from(publications)
    .$dynamic();

  if (typeFilter) {
    query = query.where(eq(publications.type, typeFilter as any));
  }
  if (yearFilter) {
    query = query.where(eq(publications.year, parseInt(yearFilter)));
  }

  const data = await query
    .orderBy(desc(publications.year), desc(publications.createdAt));

  const years = await db
    .select({ year: publications.year })
    .from(publications)
    .groupBy(publications.year)
    .orderBy(desc(publications.year));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Publications" }]} />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Publications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} publication{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/admin/publications/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Publication
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="type"
          placeholder="All types"
          currentValue={typeFilter}
          options={publicationTypes.map((t) => ({
            value: t,
            label: t.charAt(0).toUpperCase() + t.slice(1),
          }))}
        />
        <FilterSelect
          paramKey="year"
          placeholder="All years"
          currentValue={yearFilter}
          options={years.map((y) => ({
            value: String(y.year),
            label: String(y.year),
          }))}
        />
      </div>

      <PublicationsView data={data} />
    </div>
  );
}
