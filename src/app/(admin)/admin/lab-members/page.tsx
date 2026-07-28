import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { labMembers, profiles, researchCenters } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { LabMembersView } from "./lab-members-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const roles = [
  "director", "pi", "researcher", "phd_student", "master_student",
  "technician", "visitor", "external", "client",
];

const roleLabels: Record<string, string> = {
  phd_student: "PhD Student",
  master_student: "Master Student",
};

const statuses = ["active", "inactive", "alumni"];

export default async function AdminLabMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const roleFilter = params.role;
  const statusFilter = params.status;

  let query = db
    .select({
      userId: labMembers.userId,
      labId: labMembers.labId,
      name: profiles.fullName,
      title: profiles.title,
      role: labMembers.role,
      status: labMembers.status,
      labName: researchCenters.name,
      joinedAt: labMembers.joinedAt,
      leftAt: labMembers.leftAt,
    })
    .from(labMembers)
    .leftJoin(profiles, eq(labMembers.userId, profiles.id))
    .leftJoin(researchCenters, eq(labMembers.labId, researchCenters.id))
    .$dynamic();

  if (roleFilter) query = query.where(eq(labMembers.role, roleFilter as any));
  if (statusFilter) query = query.where(eq(labMembers.status, statusFilter as any));

  const data = await query.orderBy(desc(labMembers.joinedAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lab Members</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data.length} member{data.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="role"
          placeholder="All roles"
          currentValue={roleFilter}
          options={roles.map((r) => ({
            value: r,
            label: roleLabels[r] ?? (r.charAt(0).toUpperCase() + r.slice(1).replace("_", " ")),
          }))}
        />
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          currentValue={statusFilter}
          options={statuses.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
        />
      </div>

      <LabMembersView data={data} />
    </div>
  );
}
