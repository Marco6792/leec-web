"use server";

import { db } from "@/db";
import { profiles, labMembers, researchCenters } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────────────────

const ROLE_VALUES = [
  "director",
  "pi",
  "researcher",
  "phd_student",
  "master_student",
  "technician",
  "visitor",
  "external",
  "client",
] as const;

const STATUS_VALUES = ["active", "inactive", "alumni"] as const;

const memberSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  title: z.string().optional(),
  role: z.enum(ROLE_VALUES),
  status: z.enum(STATUS_VALUES).optional(),
  labId: z.string().min(1, "A lab / research center is required."),
  avatarUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
  biography: z.string().optional(),
  researchInterests: z.string().optional(),
  orcid: z.string().optional(),
  googleScholar: z.string().optional(),
  researchGate: z.string().optional(),
  linkedIn: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// ─── Helpers ───────────────────────────────────────────────────────────────

const LEEC_LAB_ID = "5826efb9-5ad6-4acb-8420-e32e6b47998c";

async function getDefaultLabId(): Promise<string> {
  const [lab] = await db
    .select({ id: researchCenters.id })
    .from(researchCenters)
    .where(eq(researchCenters.slug, "leec"))
    .limit(1);
  return lab?.id ?? LEEC_LAB_ID;
}

function splitList(value: string | undefined): string[] {
  return value
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
}

// ─── Role-assignment guards ────────────────────────────────────────────────
// Membership management is restricted per the RLS convention
// ("Lab directors can manage membership"). Technicians may create and edit
// members, but only directors/PIs may change roles, and only the director
// may assign the director role.

function assertCanAssignRole(callerRole: string, targetRole: string, errorUrl: string): void {
  if (targetRole === "director" && callerRole !== "director") {
    redirect(`${errorUrl}?error=${encodeURIComponent("Only the lab director can assign the director role.")}`);
  }
  if (targetRole === "pi" && callerRole !== "director" && callerRole !== "pi") {
    redirect(`${errorUrl}?error=${encodeURIComponent("Only directors and PIs can assign the PI role.")}`);
  }
}

function assertCanChangeRole(callerRole: string, errorUrl: string): void {
  if (callerRole !== "director" && callerRole !== "pi") {
    redirect(`${errorUrl}?error=${encodeURIComponent("Only directors and PIs can change member roles.")}`);
  }
}

// ─── Create ────────────────────────────────────────────────────────────────

export async function createLabMember(formData: FormData) {
  const { role: callerRole } = await requireAdmin();

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(memberSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.isPublic = formData.get("isPublic") === "on";
  raw.status = (formData.get("status") as string) || "active";

  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const password = (formData.get("password") as string) || "";

  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/lab-members/new?error=${encodeURIComponent(firstError)}`);
  }

  if (!email) redirect("/admin/lab-members/new?error=Email+is+required.");
  if (password.length < 8) {
    redirect("/admin/lab-members/new?error=Password+must+be+at+least+8+characters.");
  }

  assertCanAssignRole(callerRole, parsed.data.role, "/admin/lab-members/new");

  // 1. Create the auth user (the signup trigger creates the profile row).
  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect(
      "/admin/lab-members/new?error=Admin+client+not+configured.+Set+SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      title: parsed.data.title,
      institution: parsed.data.institution,
    },
  });

  if (authError) {
    const message =
      authError.code === "email_exists"
        ? "A user with this email already exists."
        : authError.message;
    redirect(`/admin/lab-members/new?error=${encodeURIComponent(message)}`);
  }

  const userId = authData.user?.id;
  if (!userId) {
    redirect("/admin/lab-members/new?error=Failed+to+create+user.");
  }

  const labId = parsed.data.labId === "default" ? await getDefaultLabId() : parsed.data.labId;

  // 2. Fill in the profile. The signup trigger normally creates it — upsert
  //    covers the case where the trigger is not installed yet.
  await db
    .insert(profiles)
    .values({
      id: userId,
      fullName: parsed.data.fullName,
      title: parsed.data.title || null,
      avatarUrl: parsed.data.avatarUrl || null,
      coverUrl: parsed.data.coverUrl || null,
      institution: parsed.data.institution || null,
      department: parsed.data.department || null,
      biography: parsed.data.biography || null,
      researchInterests: splitList(parsed.data.researchInterests),
      orcid: parsed.data.orcid || null,
      googleScholar: parsed.data.googleScholar || null,
      researchGate: parsed.data.researchGate || null,
      linkedIn: parsed.data.linkedIn || null,
      website: parsed.data.website || null,
      phone: parsed.data.phone || null,
      isPublic: parsed.data.isPublic ?? true,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        fullName: parsed.data.fullName,
        title: parsed.data.title || null,
        avatarUrl: parsed.data.avatarUrl || null,
        coverUrl: parsed.data.coverUrl || null,
        institution: parsed.data.institution || null,
        department: parsed.data.department || null,
        biography: parsed.data.biography || null,
        researchInterests: splitList(parsed.data.researchInterests),
        orcid: parsed.data.orcid || null,
        googleScholar: parsed.data.googleScholar || null,
        researchGate: parsed.data.researchGate || null,
        linkedIn: parsed.data.linkedIn || null,
        website: parsed.data.website || null,
        phone: parsed.data.phone || null,
        isPublic: parsed.data.isPublic ?? true,
        updatedAt: new Date(),
      },
    });

  // 3. Create the lab membership.
  await db.insert(labMembers).values({
    labId,
    userId,
    role: parsed.data.role,
    status: parsed.data.status ?? "active",
    joinedAt: new Date(),
  });

  revalidatePath("/admin/lab-members");
  revalidatePath("/people");
  redirect("/admin/lab-members?saved=true");
}

// ─── Update (profile + role + status + lab) ────────────────────────────────

export async function updateLabMember(userId: string, formData: FormData) {
  const { role: callerRole } = await requireAdmin();

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(memberSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.isPublic = formData.get("isPublic") === "on";
  raw.status = (formData.get("status") as string) || "active";

  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/lab-members/${userId}/edit?error=${encodeURIComponent(firstError)}`);
  }

  // Role changes are restricted to directors/PIs.
  const [existingMembership] = await db
    .select({ labId: labMembers.labId, role: labMembers.role })
    .from(labMembers)
    .where(eq(labMembers.userId, userId))
    .limit(1);

  if (existingMembership) {
    if (existingMembership.role !== parsed.data.role) {
      assertCanChangeRole(callerRole, `/admin/lab-members/${userId}/edit`);
      assertCanAssignRole(callerRole, parsed.data.role, `/admin/lab-members/${userId}/edit`);
    }
  } else {
    // Re-adding a removed member is a new assignment.
    assertCanAssignRole(callerRole, parsed.data.role, `/admin/lab-members/${userId}/edit`);
  }

  const labId = parsed.data.labId === "default" ? await getDefaultLabId() : parsed.data.labId;

  await db
    .update(profiles)
    .set({
      fullName: parsed.data.fullName,
      title: parsed.data.title || null,
      avatarUrl: parsed.data.avatarUrl || null,
      coverUrl: parsed.data.coverUrl || null,
      institution: parsed.data.institution || null,
      department: parsed.data.department || null,
      biography: parsed.data.biography || null,
      researchInterests: splitList(parsed.data.researchInterests),
      orcid: parsed.data.orcid || null,
      googleScholar: parsed.data.googleScholar || null,
      researchGate: parsed.data.researchGate || null,
      linkedIn: parsed.data.linkedIn || null,
      website: parsed.data.website || null,
      phone: parsed.data.phone || null,
      isPublic: parsed.data.isPublic ?? true,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  // Membership: update if the (lab, user) row already exists, otherwise insert.
  const existing = existingMembership;

  if (existing) {
    if (existing.labId !== labId) {
      // Composite PK (lab_id, user_id) — moving labs = delete + insert.
      await db
        .delete(labMembers)
        .where(and(eq(labMembers.userId, userId), eq(labMembers.labId, existing.labId)));
      await db.insert(labMembers).values({
        labId,
        userId,
        role: parsed.data.role,
        status: parsed.data.status ?? "active",
        joinedAt: new Date(),
      });
    } else {
      await db
        .update(labMembers)
        .set({
          role: parsed.data.role,
          status: parsed.data.status ?? "active",
          leftAt: parsed.data.status === "active" ? null : undefined,
        })
        .where(and(eq(labMembers.userId, userId), eq(labMembers.labId, existing.labId)));
    }
  } else {
    await db.insert(labMembers).values({
      labId,
      userId,
      role: parsed.data.role,
      status: parsed.data.status ?? "active",
      joinedAt: new Date(),
    });
  }

  revalidatePath("/admin/lab-members");
  revalidatePath("/people");
  redirect(`/admin/lab-members/${userId}/edit?saved=true`);
}

// ─── Quick role update (from the list table) ───────────────────────────────

export async function updateLabMemberRole(userId: string, formData: FormData) {
  const { role: callerRole } = await requireAdmin();

  const role = formData.get("role") as string;
  if (!ROLE_VALUES.includes(role as (typeof ROLE_VALUES)[number])) {
    redirect("/admin/lab-members?error=Invalid+role.");
  }

  assertCanChangeRole(callerRole, "/admin/lab-members");
  assertCanAssignRole(callerRole, role, "/admin/lab-members");

  await db
    .update(labMembers)
    .set({ role: role as (typeof ROLE_VALUES)[number] })
    .where(eq(labMembers.userId, userId));

  revalidatePath("/admin/lab-members");
  revalidatePath("/people");
  redirect("/admin/lab-members");
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteLabMember(userId: string) {
  const { user, role } = await requireAdmin();

  if (role !== "director" && role !== "pi") {
    redirect("/admin/lab-members?error=Only+directors+and+PIs+can+remove+members.");
  }

  if (userId === user.id) {
    redirect("/admin/lab-members?error=You+cannot+remove+your+own+account.");
  }

  // Remove the membership (cascades nothing on auth users, keeps profile).
  await db.delete(labMembers).where(eq(labMembers.userId, userId));

  revalidatePath("/admin/lab-members");
  revalidatePath("/people");
  redirect("/admin/lab-members");
}
