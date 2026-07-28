import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { partners } from "@/db/schema";
import { paginated, serverError, getPagination } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const type = searchParams.get("type");
    const labId = searchParams.get("lab_id");

    let query = db.select().from(partners).$dynamic();
    if (type) query = query.where(eq(partners.partnerType, type as any));
    if (labId) query = query.where(eq(partners.labId, labId));

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(partners);
    const data = await query.orderBy(desc(partners.createdAt)).limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}
