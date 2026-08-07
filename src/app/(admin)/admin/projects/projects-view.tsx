"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "../_components/delete-button";
import { deleteProject } from "./actions";

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  piId: string | null;
  startDate: string | null;
  endDate: string | null;
  fundingSource: string | null;
  createdAt: Date;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  proposed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const columns: Column<ProjectRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    className: "max-w-md",
    render: (item) => <span className="line-clamp-2">{item.title}</span>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${statusColors[item.status ?? ""] ?? ""}`}
      >
        {(item.status ?? "unknown").replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "fundingSource",
    label: "Funding",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.fundingSource ?? "—"}
      </span>
    ),
  },
  {
    key: "startDate",
    label: "Start",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.startDate ?? "—"}
      </span>
    ),
  },
  {
    key: "endDate",
    label: "End",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.endDate ?? "—"}
      </span>
    ),
  },
];

export function ProjectsView({ data }: { data: ProjectRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search projects…"
      emptyMessage="No projects found. Create your first project to get started."
      baseUrl="/admin/projects"
      idField="id"
      actionsHeader=""
      rowActions={(item) => <DeleteButton action={deleteProject.bind(null, item.id)} />}
    />
  );
}
