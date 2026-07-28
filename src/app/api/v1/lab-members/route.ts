import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { labMembers, profiles } from "@/db/schema";
import { paginated, serverError, getPagination, requireUser } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    await requireUser();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const labId = searchParams.get("lab_id");
    const role = searchParams.get("role");

    if (!labId) {
      return paginated([], 0, page, limit);
    }

    let query = db
      .select({
        labId: labMembers.labId,
        userId: labMembers.userId,
        role: labMembers.role,
        status: labMembers.status,
        joinedAt: labMembers.joinedAt,
        leftAt: labMembers.leftAt,
        fullName: profiles.fullName,
        orcid: profiles.orcid,
        title: profiles.title,
      })
      .from(labMembers)
      .leftJoin(profiles, eq(labMembers.userId, profiles.id))
      .where(eq(labMembers.labId, labId))
      .$dynamic();

    if (role) query = query.where(eq(labMembers.role, role as any));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(labMembers)
      .where(eq(labMembers.labId, labId));

    const data = await query.limit(limit).offset(offset);
    return paginated(data, count, page, limit);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
