"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "../_components/delete-button";
import { deleteEquipment } from "./actions";

interface EquipmentRow {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  status: string | null;
  manufacturer: string | null;
  model: string | null;
  location: string | null;
  isPublic: boolean | null;
  createdAt: Date;
}

const statusColors: Record<string, string> = {
  operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  repair: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  calibration: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  retired: "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
};

const columns: Column<EquipmentRow>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "category",
    label: "Category",
    sortable: true,
    render: (item) => (
      <span className="text-xs capitalize text-muted-foreground">
        {item.category ?? "—"}
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
        className={`text-[10px] uppercase tracking-wider ${statusColors[item.status ?? ""] ?? ""}`}
      >
        {item.status ?? "unknown"}
      </Badge>
    ),
  },
  {
    key: "manufacturer",
    label: "Manufacturer",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.manufacturer ?? "—"}
      </span>
    ),
  },
  {
    key: "model",
    label: "Model",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.model ?? "—"}
      </span>
    ),
  },
  {
    key: "location",
    label: "Location",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.location ?? "—"}
      </span>
    ),
  },
  {
    key: "isPublic",
    label: "Visibility",
    render: (item) =>
      item.isPublic ? (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">Public</span>
      ) : (
        <span className="text-xs text-muted-foreground">Private</span>
      ),
  },
];

export function EquipmentView({ data }: { data: EquipmentRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="id"
      searchPlaceholder="Search equipment…"
      emptyMessage="No equipment registered. Add your first item to get started."
      baseUrl="/admin/equipment"
      idField="id"
      actionsHeader=""
      rowActions={(item) => <DeleteButton action={deleteEquipment.bind(null, item.id)} />}
    />
  );
}
