import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications, publicationAuthors, profiles, publicationLikes, publicationComments, publicationReviews, publicationRatings } from "@/db/schema";
import { PublicationView } from "@/components/publications/publication-view";
import type { PublicationData } from "@/components/publications/publication-view";
import { getUser, createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Publication — LEEC",
  description: "LEEC publication details",
};

export default async function PublicationByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let pub: any = null;
  let authorRows: any[] = [];
  let likes = 0;
  let comments: any[] = [];
  let reviews: any[] = [];
  let avgRating = 0;
  let totalRatings = 0;
  let isLiked = false;
  let currentUserId: string | null = null;
  let error = false;

  try {
    const user = await getUser();
    currentUserId = user?.id ?? null;

    const rows = await db
      .select()
      .from(publications)
      .where(eq(publications.id, id))
      .limit(1);
    pub = rows[0] ?? null;

    if (pub) {
      authorRows = await db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
          title: profiles.title,
          corresponding: publicationAuthors.corresponding,
          authorOrder: publicationAuthors.authorOrder,
          affiliation: publicationAuthors.affiliation,
        })
        .from(publicationAuthors)
        .innerJoin(profiles, eq(publicationAuthors.profileId, profiles.id))
        .where(eq(publicationAuthors.publicationId, id))
        .orderBy(publicationAuthors.authorOrder);

      const [likeCount] = await db
        .select({ count: publicationLikes.userId })
        .from(publicationLikes)
        .where(eq(publicationLikes.publicationId, id));
      likes = (await db.select().from(publicationLikes).where(eq(publicationLikes.publicationId, id))).length;

      if (currentUserId) {
        const [userLike] = await db
          .select()
          .from(publicationLikes)
          .where(eq(publicationLikes.publicationId, id))
          .limit(1);
        isLiked = false;
        const allLikes = await db.select().from(publicationLikes).where(eq(publicationLikes.publicationId, id));
        isLiked = allLikes.some((l) => l.userId === currentUserId);
      }

      const commentRows = await db
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
        .orderBy(publicationComments.createdAt);
      comments = commentRows.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
        user: { id: c.userId, fullName: c.userFullName, avatarUrl: c.userAvatarUrl },
      }));

      const reviewRows = await db
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
        .orderBy(publicationReviews.createdAt);
      reviews = reviewRows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        rating: r.rating ?? 0,
        pros: r.pros,
        cons: r.cons,
        createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
        user: { id: r.userId, fullName: r.userFullName, avatarUrl: r.userAvatarUrl },
      }));

      const ratingRows = await db
        .select()
        .from(publicationRatings)
        .where(eq(publicationRatings.publicationId, id));
      totalRatings = ratingRows.length;
      if (totalRatings > 0) {
        avgRating = ratingRows.reduce((sum, r) => sum + (r.rating ?? 0), 0) / totalRatings;
      }
    }
  } catch (e) {
    console.error("Publication fetch error:", e);
    error = true;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-3xl font-bold mb-2">Error Loading Publication</h1>
        <p className="text-muted-foreground">Something went wrong while fetching this publication.</p>
      </div>
    );
  }

  if (!pub) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-3xl font-bold mb-2">Publication Not Found</h1>
        <p className="text-muted-foreground">This publication does not exist or has been removed.</p>
      </div>
    );
  }

  const publication: PublicationData = {
    ...pub,
    keywords: pub.keywords ?? [],
    researchDomains: pub.researchDomains ?? [],
    authors: authorRows.map((a: any) => ({
      ...a,
      corresponding: a.corresponding ?? false,
      authorOrder: a.authorOrder ?? 0,
    })),
  };

  return (
    <PublicationView
      publication={publication}
      initialLikes={likes}
      initialComments={comments}
      initialReviews={reviews}
      initialAvgRating={avgRating}
      initialTotalRatings={totalRatings}
      isLiked={isLiked}
      currentUserId={currentUserId}
    />
  );
}