"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

interface TrainingRow {
  id: string;
  title: string;
  level: string | null;
  status: string | null;
  maxParticipants: number | null;
  startDate: string | null;
  endDate: string | null;
  published: boolean | null;
  createdAt: Date;
  enrolledCount?: number;
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
  pending_approval:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const levelColors: Record<string, string> = {
  beginner:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const columns: Column<TrainingRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "level",
    label: "Level",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${levelColors[item.level ?? ""] ?? ""}`}
      >
        {item.level ?? "—"}
      </Badge>
    ),
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
        {item.status === "pending_approval"
          ? "Pending"
          : item.status?.replace("_", " ") ?? "unknown"}
      </Badge>
    ),
  },
  {
    key: "maxParticipants",
    label: "Capacity",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.enrolledCount != null
          ? `${item.enrolledCount}/${item.maxParticipants ?? "∞"}`
          : item.maxParticipants?.toString() ?? "∞"}
      </span>
    ),
  },
  {
    key: "startDate",
    label: "Start Date",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.startDate
          ? new Date(item.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "published",
    label: "Published",
    render: (item) =>
      item.published ? (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          Yes
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">No</span>
      ),
  },
];

export function TrainingView({ data }: { data: TrainingRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search training sessions..."
      emptyMessage="No training sessions yet. Create your first session to get started."
      baseUrl="/admin/training"
      idField="id"
    />
  );
}
