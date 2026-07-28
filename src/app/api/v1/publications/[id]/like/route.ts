import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { publicationLikes } from "@/db/schema";
import { ok, noContent, serverError, requireUser } from "@/lib/api-helpers";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;

    const existing = await db
      .select()
      .from(publicationLikes)
      .where(
        and(
          eq(publicationLikes.publicationId, id),
          eq(publicationLikes.userId, user.id)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(publicationLikes).values({
        publicationId: id,
        userId: user.id,
      });
    }

    return ok({ liked: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;

    await db
      .delete(publicationLikes)
      .where(
        and(
          eq(publicationLikes.publicationId, id),
          eq(publicationLikes.userId, user.id)
        )
      );

    return noContent();
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}