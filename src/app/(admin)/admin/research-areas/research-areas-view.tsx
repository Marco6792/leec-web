"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "../_components/delete-button";
import { deleteResearchArea } from "./actions";

export interface ResearchAreaRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  featuredImageUrl: string | null;
  tags: string[] | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const columns: Column<ResearchAreaRow>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    className: "max-w-md",
    render: (item) => <span className="line-clamp-2 font-medium">{item.name}</span>,
  },
  {
    key: "slug",
    label: "Slug",
    sortable: true,
    render: (item) => (
      <code className="text-xs text-muted-foreground">{item.slug}</code>
    ),
  },
  {
    key: "icon",
    label: "Icon",
    render: (item) => (
      <span className="text-xs text-muted-foreground">{item.icon ?? "—"}</span>
    ),
  },
  {
    key: "tags",
    label: "Tags",
    render: (item) => {
      const tags = item.tags ?? [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>
          )}
        </div>
      );
    },
  },
  {
    key: "sortOrder",
    label: "Order",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">{item.sortOrder}</span>
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

export function ResearchAreasView({ data }: { data: ResearchAreaRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search research areas…"
      emptyMessage="No research areas yet. Add your first area to get started."
      baseUrl="/admin/research-areas"
      idField="id"
      actionsHeader=""
      rowActions={(item) => <DeleteButton action={deleteResearchArea.bind(null, item.id)} />}
    />
  );
}
