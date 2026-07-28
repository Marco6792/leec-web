import { desc, eq, sql, ilike } from "drizzle-orm";
import { db } from "@/db";
import { profiles, labMembers } from "@/db/schema";
import { ok, paginated, notFound, serverError, getPagination, requireUser, unauthorized } from "@/lib/api-helpers";

async function requireAdmin() {
  const { user } = await requireUser();
  const [member] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, user.id));
  if (!member || !["director", "pi"].includes(member.role)) throw unauthorized("Admin access required");
  return { user };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const q = searchParams.get("q");

    let query = db.select().from(profiles).$dynamic();
    if (q) query = query.where(ilike(profiles.fullName, `%${q}%`));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    const data = await query.orderBy(desc(profiles.createdAt)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return ok({ error: "id is required" }, 400);

    const [updated] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();

    if (!updated) return notFound("User not found");
    return ok(updated);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return ok({ error: "id query param required" }, 400);

    const [deleted] = await db.delete(profiles).where(eq(profiles.id, id)).returning();
    if (!deleted) return notFound("User not found");
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
