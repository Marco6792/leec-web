import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publicationComments, profiles } from "@/db/schema";
import { ok, created, serverError, requireUser } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comments = await db
      .select({
        id: publicationComments.id,
        content: publicationComments.content,
        createdAt: publicationComments.createdAt,
        userId: profiles.id,
        userFullName: profiles.fullName,
        userAvatarUrl: profiles.avatarUrl,
      })
      .from(publicationComments)
      .innerJoin(profiles, eq(publicationComments.userId, profiles.id))
      .where(eq(publicationComments.publicationId, id))
      .orderBy(desc(publicationComments.createdAt));

    return ok(
      comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
        user: { id: c.userId, fullName: c.userFullName, avatarUrl: c.userAvatarUrl },
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

    const [comment] = await db
      .insert(publicationComments)
      .values({
        publicationId: id,
        userId: user.id,
        content: body.content,
      })
      .returning();

    const [profile] = await db
      .select({ fullName: profiles.fullName, avatarUrl: profiles.avatarUrl })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    return created({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt?.toISOString() ?? new Date().toISOString(),
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