import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const type = searchParams.get("type");
    const year = searchParams.get("year");

    let query = db.select().from(publications).$dynamic();
    if (type) query = query.where(eq(publications.type, type as any));
    if (year) query = query.where(eq(publications.year, parseInt(year)));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(publications);

    const data = await query
      .orderBy(desc(publications.year))
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
    const [record] = await db.insert(publications).values(body).returning();
    return created(record);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
