import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news, publications, equipment } from "@/db/schema";
import { ok, serverError, requireUser, unauthorized, badRequest } from "@/lib/api-helpers";

async function requireAdmin() {
  const { user } = await requireUser();
  const { labMembers } = await import("@/db/schema");
  const [member] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, user.id));
  if (!member || !["director", "pi"].includes(member.role)) throw unauthorized("Admin access required");
  return { user };
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { entity, id, ...changes } = body;

    if (!entity || !id) return badRequest("entity and id are required");

    switch (entity) {
      case "news": {
        const [updated] = await db.update(news).set(changes).where(eq(news.id, id)).returning();
        return ok(updated);
      }
      case "publication": {
        const [updated] = await db.update(publications).set(changes).where(eq(publications.id, id)).returning();
        return ok(updated);
      }
      case "equipment": {
        const [updated] = await db.update(equipment).set(changes).where(eq(equipment.id, id)).returning();
        return ok(updated);
      }
      default:
        return badRequest(`Unknown entity: ${entity}`);
    }
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
