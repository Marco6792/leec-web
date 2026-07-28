import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const labId = searchParams.get("lab_id");

    let query = db.select().from(events).$dynamic();
    query = query.where(eq(events.published, true));
    if (labId) query = query.where(eq(events.labId, labId));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.published, true));
    const data = await query.orderBy(desc(events.startDate)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    if (!body.title || !body.startDate) return badRequest("title and startDate are required");
    const [item] = await db.insert(events).values(body).returning();
    return created(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
