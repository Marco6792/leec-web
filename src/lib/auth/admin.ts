import { db } from "@/db";
import { labMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getUser } from "../supabase/server";

/**
 * Roles that grant full admin access to the LEEC Admin panel.
 *
 *   director  — Lab director (top-level)
 *   pi        — Principal investigator
 *   technician — Lab manager / equipment custodian
 */
const ADMIN_ROLES = ["director", "pi", "technician"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Get the user's admin-level role in the lab.
 * Returns null if the user is not authenticated or has no admin-level membership.
 */
export async function getUserRole(): Promise<AdminRole | null> {
  const user = await getUser();
  if (!user) return null;

  const [membership] = await db
    .select({ role: labMembers.role })
    .from(labMembers)
    .where(
      and(
        eq(labMembers.userId, user.id),
        eq(labMembers.status, "active"),
      ),
    )
    .limit(1);

  if (!membership) return null;
  return isAdminRole(membership.role) ? membership.role : null;
}

/**
 * Guard — redirects to /login if the user lacks admin-level access.
 * Returns the user's admin role and the authenticated user object.
 */
export async function requireAdmin(): Promise<{
  role: AdminRole;
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
}> {
  const user = await getUser();
  if (!user) redirect("/login");

  const role = await getUserRole();
  if (!role) redirect("/login");

  return { role, user };
}
