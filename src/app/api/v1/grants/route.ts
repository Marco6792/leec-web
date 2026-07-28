import { desc, eq, sql, and } from "drizzle-orm";
import { db } from "@/db";
import { grants } from "@/db/schema";
import { paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const agency = searchParams.get("agency");
    const status = searchParams.get("status");

    let query = db.select().from(grants).$dynamic();
    if (agency) query = query.where(eq(grants.agency, agency));
    if (status) query = query.where(eq(grants.status, status as any));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(grants);
    const data = await query.orderBy(desc(grants.createdAt)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    if (!body.agency || !body.amount) return badRequest("agency and amount are required");
    const [item] = await db.insert(grants).values(body).returning();
    return created(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
