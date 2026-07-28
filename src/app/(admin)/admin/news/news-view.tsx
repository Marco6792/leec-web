"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published: boolean | null;
  pinned: boolean | null;
  publishedAt: Date | null;
  tags: string[] | null;
  authorName: string | null;
  createdAt: Date;
}

const columns: Column<NewsRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    className: "max-w-md",
    render: (item) => (
      <div>
        <span className="line-clamp-1 font-medium">{item.title}</span>
        {item.excerpt && (
          <span className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
            {item.excerpt}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "authorName",
    label: "Author",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.authorName ?? "—"}
      </span>
    ),
  },
  {
    key: "published",
    label: "Status",
    sortable: true,
    render: (item) =>
      item.pinned ? (
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          >
            Pinned
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] uppercase tracking-wider ${item.published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400"}`}
          >
            {item.published ? "Published" : "Draft"}
          </Badge>
        </div>
      ) : (
        <Badge
          variant="outline"
          className={`text-[10px] uppercase tracking-wider ${item.published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400"}`}
        >
          {item.published ? "Published" : "Draft"}
        </Badge>
      ),
  },
  {
    key: "publishedAt",
    label: "Published",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.publishedAt ? item.publishedAt.toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    key: "tags",
    label: "Tags",
    render: (item) =>
      item.tags && item.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
];

export function NewsView({ data }: { data: NewsRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search news…"
      emptyMessage="No news articles yet. Write your first post."
      baseUrl="/admin/news"
      idField="id"
    />
  );
}
