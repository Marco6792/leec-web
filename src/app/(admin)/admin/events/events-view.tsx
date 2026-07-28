"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  eventType: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean | null;
  published: boolean | null;
  createdAt: Date;
}

const eventTypeLabels: Record<string, string> = {
  seminar: "Seminar",
  workshop: "Workshop",
  conference: "Conference",
  defense: "Defense",
  meeting: "Meeting",
  social: "Social",
  other: "Other",
};

const columns: Column<EventRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    className: "max-w-md",
    render: (item) => (
      <div>
        <span className="line-clamp-1 font-medium">{item.title}</span>
        {item.description && (
          <span className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
            {item.description}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "eventType",
    label: "Type",
    sortable: true,
    render: (item) => (
      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
        {eventTypeLabels[item.eventType ?? ""] ?? item.eventType ?? "—"}
      </Badge>
    ),
  },
  {
    key: "startDate",
    label: "Start Date",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.startDate.toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "endDate",
    label: "End Date",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.endDate ? item.endDate.toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    key: "location",
    label: "Location",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.location ?? (item.isOnline ? "Online" : "—")}
      </span>
    ),
  },
  {
    key: "published",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${item.published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400"}`}
      >
        {item.published ? "Published" : "Draft"}
      </Badge>
    ),
  },
];

export function EventsView({ data }: { data: EventRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search events…"
      emptyMessage="No events yet. Create your first event."
      baseUrl="/admin/events"
      idField="id"
    />
  );
}
