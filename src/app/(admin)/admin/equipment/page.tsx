import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { EquipmentView } from "./equipment-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const categories = [
  "instrument", "sensor", "computer", "network", "mechanical", "chemical", "safety", "office",
];

const statuses = ["operational", "maintenance", "repair", "calibration", "retired"];

export default async function AdminEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const categoryFilter = params.category;
  const statusFilter = params.status;

  let query = db
    .select({
      id: equipment.id,
      name: equipment.name,
      slug: equipment.slug,
      category: equipment.category,
      status: equipment.status,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      location: equipment.location,
      isPublic: equipment.isPublic,
      createdAt: equipment.createdAt,
    })
    .from(equipment)
    .$dynamic();

  if (categoryFilter) query = query.where(eq(equipment.category, categoryFilter as any));
  if (statusFilter) query = query.where(eq(equipment.status, statusFilter as any));

  const data = await query.orderBy(desc(equipment.createdAt));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Equipment" }]} />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} item{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/admin/equipment/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Equipment
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="category"
          placeholder="All categories"
          currentValue={categoryFilter}
          options={categories.map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
          }))}
        />
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          currentValue={statusFilter}
          options={statuses.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
        />
      </div>

      <EquipmentView data={data} />
    </div>
  );
}
