import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, labMembers, researchCenters } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { MemberForm, type MemberInitial } from "../../_components/member-form";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";
import { updateLabMember, deleteLabMember } from "../../actions";
import { DeleteButton } from "../../../_components/delete-button";
import { ViewPublicPage } from "../../../_components/view-public-page";

export const dynamic = "force-dynamic";

export default async function EditLabMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();

  const { userId } = await params;
  const sp = await searchParams;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile) redirect("/admin/lab-members?error=Member+not+found");

  const [membership] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, userId))
    .limit(1);

  // Best-effort: fetch the auth email for display (requires service role).
  let email: string | null = null;
  const adminClient = createAdminClient();
  if (adminClient) {
    const { data } = await adminClient.auth.admin.getUserById(userId);
    email = data.user?.email ?? null;
  }

  const labs = await db
    .select({ id: researchCenters.id, name: researchCenters.name })
    .from(researchCenters)
    .orderBy(researchCenters.name);

  const initial: MemberInitial = {
    userId: profile.id,
    fullName: profile.fullName,
    email,
    title: profile.title,
    role: membership?.role ?? "researcher",
    status: membership?.status ?? "active",
    labId: membership?.labId ?? null,
    avatarUrl: profile.avatarUrl,
    coverUrl: profile.coverUrl,
    institution: profile.institution,
    department: profile.department,
    biography: profile.biography,
    researchInterests: profile.researchInterests,
    orcid: profile.orcid,
    googleScholar: profile.googleScholar,
    researchGate: profile.researchGate,
    linkedIn: profile.linkedIn,
    website: profile.website,
    phone: profile.phone,
    isPublic: profile.isPublic,
  };

  const boundAction = updateLabMember.bind(null, userId);
  const boundDelete = deleteLabMember.bind(null, userId);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Lab Members", href: "/admin/lab-members" }, { label: "Edit Member" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Lab Member</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {profile.fullName}
          </p>
        </div>
        <ViewPublicPage href={`/profile/${userId}`} />
      </div>

      <MemberForm action={boundAction} labs={labs} initial={initial} error={sp.error} saved={sp.saved} />

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6 pb-8">
        <p className="text-xs text-muted-foreground mr-auto">
          Removing a member deletes their lab membership. They will disappear from the people page.
        </p>
        <DeleteButton action={boundDelete} label="Remove Member" />
      </div>
    </div>
  );
}
