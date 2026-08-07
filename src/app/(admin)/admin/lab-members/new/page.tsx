import { db } from "@/db";
import { researchCenters } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { MemberForm } from "../_components/member-form";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";
import { createLabMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewLabMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  const labs = await db
    .select({ id: researchCenters.id, name: researchCenters.name })
    .from(researchCenters)
    .orderBy(researchCenters.name);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Lab Members", href: "/admin/lab-members" }, { label: "Add Member" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Lab Member</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new member with an account. They will appear on the public people page.
          </p>
        </div>
      </div>

      <MemberForm action={createLabMember} labs={labs} error={params.error} />
    </div>
  );
}
