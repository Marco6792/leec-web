import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Pin,
  User,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [item] = await db
    .select({
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      imageUrl: news.imageUrl,
      publishedAt: news.publishedAt,
      pinned: news.pinned,
      tags: news.tags,
      authorId: news.authorId,
      authorName: profiles.fullName,
    })
    .from(news)
    .leftJoin(profiles, eq(news.authorId, profiles.id))
    .where(eq(news.slug, slug))
    .limit(1);

  if (!item || !item.id || !item.title) notFound();

  const paragraphs = (item.content ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to news
      </Link>

      {item.imageUrl && (
        <div className="rounded-2xl overflow-hidden border aspect-video mb-8">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
        {item.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {new Date(item.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        {item.pinned && (
          <Badge className="gap-1 text-xs">
            <Pin className="size-3" /> Pinned
          </Badge>
        )}
        {item.authorName && (
          <span className="flex items-center gap-1.5">
            <User className="size-4" /> {item.authorName}
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug mb-6">
        {item.title}
      </h1>

      {item.excerpt && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {item.excerpt}
        </p>
      )}

      <Separator className="mb-8" />

      {paragraphs.length > 0 ? (
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => {
            const isHeading = index === 0 && /^[A-Z0-9]/.test(paragraph) && paragraph.length < 120;
            return (
              <p
                key={index}
                className={
                  isHeading
                    ? "text-foreground font-semibold leading-relaxed"
                    : "text-muted-foreground leading-relaxed"
                }
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground leading-relaxed">{item.excerpt}</p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <Tag className="size-4 inline mr-1.5" /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <Separator className="mt-12 mb-8" />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link href="/news">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" /> All News
          </Button>
        </Link>
      </div>
    </div>
  );
}
