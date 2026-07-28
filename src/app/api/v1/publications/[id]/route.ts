import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { ok, notFound, badRequest, serverError, requireUser } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [pub] = await db.select().from(publications).where(eq(publications.id, id));
    if (!pub) return notFound("Publication not found");
    return ok(pub);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db
      .update(publications)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(publications.id, id))
      .returning();
    if (!updated) return notFound("Publication not found");
    return ok(updated);
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    const { id } = await params;
    const [deleted] = await db
      .delete(publications)
      .where(eq(publications.id, id))
      .returning();
    if (!deleted) return notFound("Publication not found");
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
