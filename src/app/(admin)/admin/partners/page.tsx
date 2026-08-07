import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { partners } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { PartnersView } from "./partners-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const partnerTypes = [
  "university", "research_institute", "industry", "government",
  "ngo", "funding_agency", "startup",
];

const tierValues = ["strategic", "collaborative", "affiliate"];

const typeLabels: Record<string, string> = {
  research_institute: "Research Institute",
  funding_agency: "Funding Agency",
};

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; tier?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const typeFilter = params.type;
  const tierFilter = params.tier;

  let query = db
    .select({
      id: partners.id,
      name: partners.name,
      slug: partners.slug,
      partnerType: partners.partnerType,
      tier: partners.tier,
      country: partners.country,
      contactName: partners.contactName,
      contactEmail: partners.contactEmail,
      website: partners.website,
      partnershipStart: partners.partnershipStart,
      createdAt: partners.createdAt,
    })
    .from(partners)
    .$dynamic();

  if (typeFilter) query = query.where(eq(partners.partnerType, typeFilter as any));
  if (tierFilter) query = query.where(eq(partners.tier, tierFilter as any));

  const data = await query.orderBy(desc(partners.createdAt));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Partners" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data.length} partner{data.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="type"
          placeholder="All types"
          currentValue={typeFilter}
          options={partnerTypes.map((t) => ({
            value: t,
            label: typeLabels[t] ?? (t.charAt(0).toUpperCase() + t.slice(1)),
          }))}
        />
        <FilterSelect
          paramKey="tier"
          placeholder="All tiers"
          currentValue={tierFilter}
          options={tierValues.map((t) => ({
            value: t,
            label: t.charAt(0).toUpperCase() + t.slice(1),
          }))}
        />
      </div>

      <PartnersView data={data} />
    </div>
  );
}
