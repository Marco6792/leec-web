"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updatedAt: Date;
}

const columns: Column<PageRow>[] = [
  {
    key: "title",
    label: "Page",
    sortable: true,
    className: "max-w-md",
    render: (item) => (
      <div>
        <span className="font-medium">{item.title}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          /{item.slug}
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
        {item.published ? "Published" : "Hidden"}
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

export function PagesView({ data }: { data: PageRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search pages…"
      emptyMessage="No pages yet."
      baseUrl="/admin/pages"
      idField="id"
    />
  );
}
