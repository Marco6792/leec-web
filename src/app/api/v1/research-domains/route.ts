import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { researchDomains } from "@/db/schema";
import { paginated, serverError, getPagination } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const labId = searchParams.get("lab_id");

    let query = db.select().from(researchDomains).$dynamic();
    if (labId) query = query.where(eq(researchDomains.labId, labId));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(researchDomains);
    const data = await query.orderBy(asc(researchDomains.sortOrder)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}
