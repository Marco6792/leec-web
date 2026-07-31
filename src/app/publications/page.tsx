import { desc, eq, count, sql } from "drizzle-orm";
import { db } from "@/db";
import { publications, publicationAuthors, profiles, publicationLikes, publicationRatings } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Mic,
  GraduationCap,
  Newspaper,
  Rocket,
  ExternalLink,
  Eye,
  Star,
  ThumbsUp,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Publications — LEEC",
  description: "Research outputs from our laboratory",
};

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

export default async function PublicationsPage() {
  const allPubs = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.year), desc(publications.createdAt));

  const pubsWithAuthors = await Promise.all(
    allPubs.map(async (pub) => {
      const authors = await db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Publications</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Publications
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Research outputs from our laboratory.
      </p>

      <Separator className="mb-12" />

      {pubsWithAuthors.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No publications found.
        </p>
      ) : (
        <div className="space-y-5">
          {pubsWithAuthors.map((pub) => {
            const TypeIcon = typeConfig[pub.type]?.icon || FileText;
            const venue = pub.journal || pub.conference || ((pub.publisher ?? []).length > 0 ? pub.publisher[0] : "");
            return (
              <Link
                key={pub.id}
                href={`/publications/${pub.id}`}
                className="group block p-7 rounded-2xl border bg-card hover:shadow-lg hover:border-foreground/20 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Badge
                    variant="secondary"
                    className={`${typeConfig[pub.type]?.color || ""} gap-1.5 w-fit shrink-0 text-xs font-medium`}
                  >
                    <TypeIcon className="h-3 w-3" />
                    {pub.type}
                  </Badge>
                  {pub.pdfUrl && (
                    <span className="flex items-center gap-1 text-xs text-primary font-medium shrink-0">
                      <Download className="h-3 w-3" />
                      PDF
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>

                    {/* Author avatars inline */}
                    {pub.authors.length > 0 && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex -space-x-2">
                          {pub.authors.slice(0, 5).map((author) => {
                            const initials = author.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <div
                                key={author.id}
                                className="size-8 rounded-full overflow-hidden border-2 border-background bg-muted shrink-0"
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
                            .map((a) => a.fullName)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Abstract preview */}
                    {pub.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {pub.abstract}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground italic mb-3">
                      {venue}
                      <span className="not-italic"> &middot; </span>
                      <span className="not-italic font-medium">{pub.year}</span>
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {pub.viewCount ?? 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {pub.likeCount} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {pub.totalRatings > 0 ? `${pub.avgRating.toFixed(1)} (${pub.totalRatings})` : "No ratings"}
                      </span>
                      {pub.citationCount != null && pub.citationCount > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {pub.citationCount} citations
                        </span>
                      )}
                      {pub.doi && (
                        <span className="flex items-center gap-1 ml-auto text-muted-foreground/60 group-hover:text-primary transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                          DOI
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
  );
}