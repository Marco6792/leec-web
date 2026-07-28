import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { labMembers } from "@/db/schema";

// ─── Response helpers ─────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error("API Error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}

// ─── Auth helpers ──────────────────────────────────────────────────────────

/**
 * Require an authenticated user.
 * Throws 401 if not authenticated or if Supabase is not configured.
 */
export async function requireUser() {
  const supabase = await createClient();
  if (!supabase) throw unauthorized("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw unauthorized();
  return { supabase, user };
}

/**
 * Optional user — returns null if not authenticated or if Supabase is not configured.
 */
export async function optionalUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Require a specific lab role.
 * Throws 403 if the user doesn't have the required role.
 */
export async function requireRole(role: string) {
  const { user } = await requireUser();
  const [member] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, user.id));
  if (!member || member.role !== role) throw forbidden();
  return { user };
}

// ─── Pagination ────────────────────────────────────────────────────────────

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
