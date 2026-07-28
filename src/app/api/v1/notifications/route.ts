import { desc, eq, sql, isNull } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { ok, paginated, serverError, getPagination, requireUser } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPagination(searchParams);
    const unreadOnly = searchParams.get("unread") === "true";

    let query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .$dynamic();

    if (unreadOnly) query = query.where(isNull(notifications.readAt));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(eq(notifications.userId, user.id));

    const data = await query
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return paginated(data, count, page, limit);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await requireUser();
    const body = await request.json();

    if (body.markAllRead) {
      await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(eq(notifications.userId, user.id));
      return ok({ updated: true });
    }

    if (body.id) {
      await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(eq(notifications.id, body.id));
      return ok({ updated: true });
    }

    return ok({ updated: false });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
