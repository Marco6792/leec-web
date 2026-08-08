"use server";

import { getUserRole } from "./admin";

/**
 * Server action used by client components (e.g. the navbar) to determine
 * whether the currently authenticated user holds an admin-level role.
 * Returns true only for authenticated active lab members whose role is
 * director, pi, or technician.
 */
export async function isAdminUser(): Promise<boolean> {
  const role = await getUserRole();
  return role !== null;
}
