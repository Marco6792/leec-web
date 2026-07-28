"use client";

import { useState } from "react";
import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────

interface RequestRow {
  id: string;
  organizationName: string | null;
  requestType: string | null;
  status: string | null;
  createdAt: Date;
}

interface ProjectRow {
  id: string;
  title: string;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: Date;
}

// ─── Config ───────────────────────────────────────────────────────────────

const requestStatusColors: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  withdrawn:
    "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
};

const projectStatusColors: Record<string, string> = {
  negotiation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
  terminated: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const requestColumns: Column<RequestRow>[] = [
  {
    key: "organizationName",
    label: "Organization",
    sortable: true,
    render: (item) => (
      <span className="font-medium">{item.organizationName ?? "Unknown"}</span>
    ),
  },
  {
    key: "requestType",
    label: "Type",
    sortable: true,
    render: (item) => (
      <span className="text-xs capitalize text-muted-foreground">
        {item.requestType?.replace(/_/g, " ") ?? "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${requestStatusColors[item.status ?? ""] ?? ""}`}
      >
        {item.status ?? "unknown"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Submitted",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];

const projectColumns: Column<ProjectRow>[] = [
  {
    key: "title",
    label: "Project",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${projectStatusColors[item.status ?? ""] ?? ""}`}
      >
        {item.status ?? "unknown"}
      </Badge>
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
];

// ─── Component ────────────────────────────────────────────────────────────

interface CollaborationViewProps {
  requests: RequestRow[];
  projects: ProjectRow[];
}

export function CollaborationView({ requests, projects }: CollaborationViewProps) {
  const [tab, setTab] = useState<"requests" | "projects">("requests");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("requests")}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
            tab === "requests"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Incoming Requests ({requests.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("projects")}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
            tab === "projects"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Active Projects ({projects.length})
        </button>
      </div>

      {/* Tab content */}
      {tab === "requests" ? (
        <AdminTable
          data={requests}
          columns={requestColumns}
          keyField="id"
          searchPlaceholder="Search requests..."
          emptyMessage="No collaboration requests received."
          baseUrl="/admin/collaboration"
          idField="id"
          pageSize={10}
        />
      ) : (
        <AdminTable
          data={projects}
          columns={projectColumns}
          keyField="id"
          searchPlaceholder="Search projects..."
          emptyMessage="No active collaboration projects."
          baseUrl="/admin/collaboration"
          idField="id"
          pageSize={10}
        />
      )}
    </div>
  );
}
