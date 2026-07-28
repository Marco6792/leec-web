import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const status = searchParams.get("status");
    const labId = searchParams.get("lab_id");

    let query = db.select().from(projects).$dynamic();
    if (status) query = query.where(eq(projects.status, status as any));
    if (labId) query = query.where(eq(projects.labId, labId));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const data = await query.orderBy(desc(projects.createdAt)).limit(limit).offset(offset);
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
    const [item] = await db.insert(projects).values(body).returning();
    return created(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
