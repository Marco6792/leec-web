import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { paginated, serverError, getPagination } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const q = searchParams.get("q");

    let query = db
      .select()
      .from(profiles)
      .where(eq(profiles.isPublic, true))
      .$dynamic();

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(profiles)
      .where(eq(profiles.isPublic, true));

    const data = await query
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);

    return paginated(data, count, page, limit);
  } catch (error) {
    return serverError(error);
  }
}
