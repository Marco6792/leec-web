import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ok, notFound, serverError, requireUser } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [item] = await db.select().from(projects).where(eq(projects.id, id));
    if (!item) return notFound("Project not found");
    return ok(item);
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
      .update(projects)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    if (!updated) return notFound("Project not found");
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
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
    if (!deleted) return notFound("Project not found");
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
