"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

interface PartnerRow {
  id: string;
  name: string;
  slug: string;
  partnerType: string;
  tier: string | null;
  country: string | null;
  contactName: string | null;
  contactEmail: string | null;
  website: string | null;
  partnershipStart: string | null;
  createdAt: Date;
}

const typeColors: Record<string, string> = {
  university: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  research_institute: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  industry: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  government: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ngo: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  funding_agency: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  startup: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const tierColors: Record<string, string> = {
  strategic: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  collaborative: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  affiliate: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
};

const columns: Column<PartnerRow>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
          {item.name.charAt(0)}
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          {item.website && (
            <span className="block text-xs text-muted-foreground truncate max-w-[200px]">
              {item.website.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "partnerType",
    label: "Type",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${typeColors[item.partnerType] ?? ""}`}
      >
        {item.partnerType.replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "tier",
    label: "Tier",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${tierColors[item.tier ?? ""] ?? ""}`}
      >
        {item.tier ?? "—"}
      </Badge>
    ),
  },
  {
    key: "country",
    label: "Country",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.country ?? "—"}
      </span>
    ),
  },
  {
    key: "contactName",
    label: "Contact",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.contactName ?? "—"}
      </span>
    ),
  },
  {
    key: "partnershipStart",
    label: "Since",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.partnershipStart ?? "—"}
      </span>
    ),
  },
];

export function PartnersView({ data }: { data: PartnerRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search partners…"
      emptyMessage="No partners yet. Add your first partner institution."
      baseUrl="/admin/partners"
      idField="id"
    />
  );
}
