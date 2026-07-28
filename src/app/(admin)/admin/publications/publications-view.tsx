"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

interface PublicationRow {
  id: string;
  title: string;
  type: string;
  year: number;
  doi: string | null;
  journal: string | null;
  citationCount: number | null;
  openAccess: boolean | null;
  createdAt: Date;
}

const typeColors: Record<string, string> = {
  journal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  conference: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  book: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  thesis: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  dataset: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  patent: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  software: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  preprint: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  report: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  chapter: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const columns: Column<PublicationRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    className: "max-w-md",
    render: (pub) => (
      <span className="line-clamp-2">{pub.title}</span>
    ),
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (pub) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${typeColors[pub.type] ?? ""}`}
      >
        {pub.type}
      </Badge>
    ),
  },
  {
    key: "year",
    label: "Year",
    sortable: true,
  },
  {
    key: "journal",
    label: "Journal",
    className: "max-w-xs text-muted-foreground",
    render: (pub) => (
      <span className="line-clamp-1 text-xs">{pub.journal ?? "—"}</span>
    ),
  },
  {
    key: "doi",
    label: "DOI",
    render: (pub) =>
      pub.doi ? (
        <span className="text-xs text-muted-foreground font-mono">
          {pub.doi.length > 30 ? `${pub.doi.slice(0, 30)}…` : pub.doi}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    key: "citationCount",
    label: "Citations",
    sortable: true,
  },
  {
    key: "openAccess",
    label: "Access",
    render: (pub) =>
      pub.openAccess ? (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">Open</span>
      ) : (
        <span className="text-xs text-muted-foreground">Closed</span>
      ),
  },
];

export function PublicationsView({ data }: { data: PublicationRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search publications…"
      emptyMessage="No publications found. Add your first publication to get started."
      baseUrl="/admin/publications"
      idField="id"
    />
  );
}
