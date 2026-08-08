import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { news } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";
import { ArrowRight, FileText } from "lucide-react";

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      imageUrl: news.imageUrl,
      pdfUrl: news.pdfUrl,
      publishedAt: news.publishedAt,
      pinned: news.pinned,
      tags: news.tags,
    })
    .from(news)
    .where(eq(news.published, true))
    .orderBy(desc(news.pinned), desc(news.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">News</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Latest News
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Recent developments and coverage from our laboratory.
      </p>

      <Separator className="mb-12" />

      {articles.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No news articles published yet.
        </p>
      ) : (
        <div className="space-y-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
            >
              <div className="md:flex">
                {item.imageUrl && (
                  <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                    <SiteImage
                      src={item.imageUrl}
                      alt={item.title}
                      width={960}
                      height={540}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className={`p-7 ${item.imageUrl ? "md:w-3/5" : "md:w-full"}`}>
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
                   <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.excerpt}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                      Read article <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    {item.pdfUrl && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        <FileText className="size-3.5 text-primary" /> PDF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
