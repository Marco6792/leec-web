import { desc, eq, count, sql } from "drizzle-orm";
import { db } from "@/db";
import { publications, publicationAuthors, profiles, publicationLikes, publicationRatings } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, BookOpen, FileText, Mic, GraduationCap, Newspaper, Rocket, Eye, Star, ThumbsUp, Download } from "lucide-react";

const typeConfig: Record<string, { icon: typeof BookOpen; color: string }> = {
  conference: { icon: Mic, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  journal: { icon: BookOpen, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  preprint: { icon: FileText, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  thesis: { icon: GraduationCap, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  report: { icon: Newspaper, color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300" },
  book: { icon: BookOpen, color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
  chapter: { icon: FileText, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  patent: { icon: Rocket, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" },
  software: { icon: Rocket, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  dataset: { icon: FileText, color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
};

export async function PublicationsPreview() {
  const recentPubs = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.year), desc(publications.createdAt))
    .limit(3);

  const pubs = await Promise.all(
    recentPubs.map(async (pub) => {
      const authors = await db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
          authorOrder: publicationAuthors.authorOrder,
        })
        .from(publicationAuthors)
        .innerJoin(profiles, eq(publicationAuthors.profileId, profiles.id))
        .where(eq(publicationAuthors.publicationId, pub.id))
        .orderBy(publicationAuthors.authorOrder);

      const [likeCount] = await db
        .select({ value: count() })
        .from(publicationLikes)
        .where(eq(publicationLikes.publicationId, pub.id));

      const [ratingResult] = await db
        .select({
          avg: sql<number>`coalesce(avg(${publicationRatings.rating}), 0)`,
          total: count(),
        })
        .from(publicationRatings)
        .where(eq(publicationRatings.publicationId, pub.id));

      return {
        ...pub,
        authors,
        likeCount: likeCount?.value ?? 0,
        avgRating: Number(ratingResult?.avg ?? 0),
        totalRatings: ratingResult?.total ?? 0,
      };
    })
  );

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Latest Publications
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Recent research outputs from our laboratory pushing the boundaries of electrical engineering.
            </p>
          </div>
          <Link href="/publications">
            <Button variant="outline" size="sm" className="gap-2 shrink-0 group/btn">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>

        {pubs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No publications yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pubs.map((pub) => {
              const TypeIcon = typeConfig[pub.type]?.icon || FileText;
              const venue = pub.journal || pub.conference || pub.publisher || "";
              return (
                <Link
                  key={pub.id}
                  href={`/publications/${pub.id}`}
                  className="group relative flex flex-col rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-7 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`${typeConfig[pub.type]?.color || ""} gap-1.5 px-3 py-1 text-xs font-medium`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {pub.type}
                      </Badge>
                      {pub.pdfUrl && (
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Download className="h-3 w-3" />
                          PDF
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-3">
                      {pub.title}
                    </h3>

                    {/* Author avatars */}
                    {pub.authors.length > 0 && (
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex -space-x-2">
                          {pub.authors.slice(0, 4).map((author) => {
                            const initials = author.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <div
                                key={author.id}
                                className="size-9 rounded-full overflow-hidden border-2 border-background bg-muted shrink-0"
                                title={author.fullName}
                              >
                                {author.avatarUrl ? (
                                  <img
                                    src={author.avatarUrl}
                                    alt={author.fullName}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="size-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                    {initials}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {pub.authors
                            .slice(0, 2)
                            .map((a) => a.fullName)
                            .join(", ")}
                          {pub.authors.length > 2 && ` +${pub.authors.length - 2}`}
                        </span>
                      </div>
                    )}

                    {/* Abstract preview */}
                    {pub.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {pub.abstract}
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-border/50">
                      <p className="text-sm text-muted-foreground italic mb-3">
                        {venue}
                        <span className="not-italic"> &middot; </span>
                        <span className="not-italic font-medium">{pub.year}</span>
                      </p>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {pub.viewCount ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {pub.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          {pub.totalRatings > 0 ? pub.avgRating.toFixed(1) : "—"}
                        </span>
                        {pub.citationCount != null && pub.citationCount > 0 && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {pub.citationCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}