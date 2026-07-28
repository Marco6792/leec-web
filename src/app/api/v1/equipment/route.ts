import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const category = searchParams.get("category");
    const labId = searchParams.get("lab_id");

    let query = db.select().from(equipment).$dynamic();
    query = query.where(eq(equipment.isPublic, true));

    if (category) query = query.where(eq(equipment.category, category as any));
    if (labId) query = query.where(eq(equipment.labId, labId));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(equipment)
      .where(eq(equipment.isPublic, true));

    const data = await query
      .orderBy(desc(equipment.createdAt))
      .limit(limit)
      .offset(offset);

    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    if (!body.name || !body.slug) return badRequest("name and slug are required");
    const record = await db.insert(equipment).values(body).returning();
    return created(record[0]);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
