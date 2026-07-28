import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const labId = searchParams.get("lab_id");

    let query = db.select().from(news).$dynamic();
    query = query.where(eq(news.published, true));
    if (labId) query = query.where(eq(news.labId, labId));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(news).where(eq(news.published, true));
    const data = await query.orderBy(desc(news.publishedAt)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    if (!body.title || !body.slug) return badRequest("title and slug are required");
    const [item] = await db.insert(news).values(body).returning();
    return created(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
