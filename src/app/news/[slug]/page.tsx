import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PdfViewer } from "@/components/pdf-viewer";
import { SiteImage } from "@/components/site-image";
import {
  ArrowLeft,
  Calendar,
  Pin,
  User,
  Tag,
  FileText,
} from "lucide-react";

export const revalidate = 60;

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
      pdfUrl: news.pdfUrl,
      gallery: news.gallery,
      documents: news.documents,
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
        <div className="relative rounded-2xl overflow-hidden border aspect-video mb-8">
          <SiteImage
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
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

      {/* Gallery */}
      {(item.gallery?.length ?? 0) > 1 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(item.gallery ?? []).map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-video overflow-hidden rounded-xl border"
              >
                <SiteImage
                  src={url}
                  alt={`${item.title} — image ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Attached PDF document */}
      {item.pdfUrl && (
        <div className="mt-12">
          <PdfViewer url={item.pdfUrl} title={item.title} />
        </div>
      )}

      {/* Additional documents */}
      {(item.documents?.length ?? 0) > 1 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Documents
          </h3>
          <ul className="space-y-2">
            {(item.documents ?? [])
              .filter((doc) => doc !== item.pdfUrl)
              .map((doc) => (
                <li key={doc}>
                  <a
                    href={doc}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    {decodeURIComponent(doc.split("/").pop() ?? doc).split("?")[0]}
                  </a>
                </li>
              ))}
          </ul>
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
