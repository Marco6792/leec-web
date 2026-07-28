import { desc, eq, sql, and, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { equipmentBookings } from "@/db/schema";
import { ok, paginated, created, serverError, getPagination, requireUser, badRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const equipmentId = searchParams.get("equipment_id");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    let query = db.select().from(equipmentBookings).$dynamic();
    query = query.where(eq(equipmentBookings.userId, user.id));
    if (equipmentId) query = query.where(eq(equipmentBookings.equipmentId, equipmentId));
    if (fromDate) query = query.where(gte(equipmentBookings.startTime, new Date(fromDate)));
    if (toDate) query = query.where(lte(equipmentBookings.endTime, new Date(toDate)));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(equipmentBookings)
      .where(eq(equipmentBookings.userId, user.id));

    const data = await query
      .orderBy(desc(equipmentBookings.startTime))
      .limit(limit)
      .offset(offset);

    return paginated(data, count, page, limit);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireUser();
    const body = await request.json();
    if (!body.equipment_id || !body.start_time || !body.end_time) {
      return badRequest("equipment_id, start_time, and end_time are required");
    }

    const [booking] = await db
      .insert(equipmentBookings)
      .values({ ...body, userId: user.id })
      .returning();

    return created(booking);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
