import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { complianceRecords } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, unauthorized, badRequest } from "@/lib/api-helpers";

async function requireAdmin() {
  const { user } = await requireUser();
  const { labMembers } = await import("@/db/schema");
  const [member] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, user.id));
  if (!member || !["director"].includes(member.role)) throw unauthorized("Director access required");
  return { user };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const labId = searchParams.get("lab_id");
    const type = searchParams.get("type");

    let query = db.select().from(complianceRecords).$dynamic();
    if (labId) query = query.where(eq(complianceRecords.labId, labId));
    if (type) query = query.where(eq(complianceRecords.type, type as any));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(complianceRecords);
    const data = await query.orderBy(desc(complianceRecords.createdAt)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.lab_id || !body.type || !body.standard) {
      return badRequest("lab_id, type, and standard are required");
    }
    const [item] = await db.insert(complianceRecords).values(body).returning();
    return created(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
