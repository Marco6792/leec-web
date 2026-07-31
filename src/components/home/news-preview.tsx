import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function NewsPreview() {
  const articles = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      imageUrl: news.imageUrl,
      publishedAt: news.publishedAt,
      pinned: news.pinned,
    })
    .from(news)
    .where(eq(news.published, true))
    .orderBy(desc(news.pinned), desc(news.publishedAt))
    .limit(3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Latest News
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Recent developments and coverage from our laboratory.
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              All News <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No news articles published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
              >
                {item.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    {item.publishedAt && (
                      <span>{new Date(item.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    )}
                    {item.pinned && (
                      <>
                        <span className="text-border">|</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Pinned</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3">
                    Read article <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
