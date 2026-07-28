import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { publicationRatings } from "@/db/schema";
import { ok, serverError, requireUser } from "@/lib/api-helpers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const body = await request.json();

    const existing = await db
      .select()
      .from(publicationRatings)
      .where(
        and(
          eq(publicationRatings.publicationId, id),
          eq(publicationRatings.userId, user.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(publicationRatings)
        .set({ rating: body.rating, updatedAt: new Date() })
        .where(
          and(
            eq(publicationRatings.publicationId, id),
            eq(publicationRatings.userId, user.id)
          )
        );
    } else {
      await db.insert(publicationRatings).values({
        publicationId: id,
        userId: user.id,
        rating: body.rating,
      });
    }

    const allRatings = await db
      .select()
      .from(publicationRatings)
      .where(eq(publicationRatings.publicationId, id));

    const avg = allRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / allRatings.length;

    return ok({ avgRating: avg, totalRatings: allRatings.length });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}