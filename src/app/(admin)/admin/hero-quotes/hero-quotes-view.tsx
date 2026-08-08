"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

export interface HeroQuoteRow {
  id: string;
  text: string;
  published: boolean;
  sortOrder: number;
  updatedAt: Date;
}

const columns: Column<HeroQuoteRow>[] = [
  {
    key: "text",
    label: "Quote",
    sortable: true,
    className: "max-w-xl",
    render: (item) => (
      <div>
        <span className="font-medium line-clamp-2">{item.text}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          Order {item.sortOrder}
        </span>
      </div>
    ),
  },
  {
    key: "published",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${
          item.published
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400"
        }`}
      >
        {item.published ? "Live" : "Hidden"}
      </Badge>
    ),
  },
  {
    key: "updatedAt",
    label: "Last Updated",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.updatedAt.toLocaleDateString()}
      </span>
    ),
  },
];

export function HeroQuotesView({ data }: { data: HeroQuoteRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search quotes…"
      emptyMessage="No hero quotes yet. Add one to rotate the homepage subtitle."
      baseUrl="/admin/hero-quotes"
      idField="id"
    />
  );
}
