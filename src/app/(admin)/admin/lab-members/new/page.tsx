import Link from "next/link";
import { db } from "@/db";
import { researchCenters } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { MemberForm } from "../_components/member-form";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Lab Member</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new member with an account. They will appear on the public people page.
          </p>
        </div>
        <Link
          href="/admin/lab-members"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to lab members
        </Link>
      </div>

      <MemberForm action={createLabMember} labs={labs} error={params.error} />
    </div>
  );
}
