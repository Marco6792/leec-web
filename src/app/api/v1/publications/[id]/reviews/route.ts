import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publicationReviews, profiles } from "@/db/schema";
import { ok, created, serverError, requireUser } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reviews = await db
      .select({
        id: publicationReviews.id,
        title: publicationReviews.title,
        content: publicationReviews.content,
        rating: publicationReviews.rating,
        pros: publicationReviews.pros,
        cons: publicationReviews.cons,
        createdAt: publicationReviews.createdAt,
        userId: profiles.id,
        userFullName: profiles.fullName,
        userAvatarUrl: profiles.avatarUrl,
      })
      .from(publicationReviews)
      .innerJoin(profiles, eq(publicationReviews.userId, profiles.id))
      .where(eq(publicationReviews.publicationId, id))
      .orderBy(desc(publicationReviews.createdAt));

    return ok(
      reviews.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        rating: r.rating ?? 0,
        pros: r.pros,
        cons: r.cons,
        createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
        user: { id: r.userId, fullName: r.userFullName, avatarUrl: r.userAvatarUrl },
      }))
    );
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const body = await request.json();

    const [review] = await db
      .insert(publicationReviews)
      .values({
        publicationId: id,
        userId: user.id,
        title: body.title || null,
        content: body.content,
        rating: body.rating,
        pros: body.pros || null,
        cons: body.cons || null,
      })
      .returning();

    const [profile] = await db
      .select({ fullName: profiles.fullName, avatarUrl: profiles.avatarUrl })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    return created({
      id: review.id,
      title: review.title,
      content: review.content,
      rating: review.rating ?? 0,
      pros: review.pros,
      cons: review.cons,
      createdAt: review.createdAt?.toISOString() ?? new Date().toISOString(),
      user: {
        id: user.id,
        fullName: profile?.fullName ?? "Unknown",
        avatarUrl: profile?.avatarUrl ?? null,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}