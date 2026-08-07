"use client";

import { AdminTable, type Column } from "../_components/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "../_components/delete-button";
import { updateLabMemberRole, deleteLabMember } from "./actions";

interface LabMemberRow {
  userId: string;
  labId: string;
  name: string | null;
  title: string | null;
  avatarUrl: string | null;
  role: string;
  status: string | null;
  labName: string | null;
  joinedAt: Date | null;
  leftAt: Date | null;
}

const roles = [
  "director", "pi", "researcher", "phd_student", "master_student",
  "technician", "visitor", "external", "client",
];

const roleLabels: Record<string, string> = {
  phd_student: "PhD Student",
  master_student: "Master Student",
};

const roleColors: Record<string, string> = {
  director: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pi: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  researcher: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  phd_student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  master_student: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  technician: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  visitor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  external: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  client: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  alumni: "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
};

const columns: Column<LabMemberRow>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (member) => (
      <div className="flex items-center gap-3">
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatarUrl}
            alt={member.name ?? "Member"}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {(member.name ?? "U").charAt(0)}
          </div>
        )}
        <div>
          <span className="font-medium">{member.name ?? "Unknown"}</span>
          {member.title && (
            <span className="block text-xs text-muted-foreground">{member.title}</span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (member) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${roleColors[member.role] ?? ""}`}
      >
        {member.role.replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (member) => (
      <Badge
        variant="outline"
        className={`text-[10px] uppercase tracking-wider ${statusColors[member.status ?? ""] ?? ""}`}
      >
        {member.status ?? "unknown"}
      </Badge>
    ),
  },
  {
    key: "labName",
    label: "Lab / Center",
    render: (member) => (
      <span className="text-xs text-muted-foreground">
        {member.labName ?? "—"}
      </span>
    ),
  },
  {
    key: "joinedAt",
    label: "Joined",
    sortable: true,
    render: (member) => (
      <span className="text-xs text-muted-foreground">
        {member.joinedAt ? member.joinedAt.toLocaleDateString() : "—"}
      </span>
    ),
  },
];

function MemberRoleSelect({ userId, role }: { userId: string; role: string }) {
  const action = updateLabMemberRole.bind(null, userId);
  return (
    <form action={action}>
      <select
        name="role"
        defaultValue={role}
        onChange={(e) => e.target.form?.requestSubmit()}
        title="Change role"
        className="cursor-pointer rounded-lg border border-border bg-background px-2 py-1 text-xs text-muted-foreground outline-none transition-colors hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/50"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {roleLabels[r] ?? r.charAt(0).toUpperCase() + r.slice(1).replace("_", " ")}
          </option>
        ))}
      </select>
    </form>
  );
}

export function LabMembersView({
  data,
  canManageMembers = true,
}: {
  data: LabMemberRow[];
  /** Directors and PIs can change roles / remove members. */
  canManageMembers?: boolean;
}) {
  return (
    <AdminTable
      data={data}
      columns={columns}
      keyField="userId"
      searchPlaceholder="Search members…"
      emptyMessage="No lab members found. Add members to get started."
      baseUrl="/admin/lab-members"
      idField="userId"
      actionsHeader=""
      rowActions={
        canManageMembers
          ? (member) => (
              <>
                <MemberRoleSelect userId={member.userId} role={member.role} />
                <DeleteButton action={deleteLabMember.bind(null, member.userId)} />
              </>
            )
          : undefined
      }
    />
  );
}
