import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, profiles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { NewsView } from "./news-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; pinned?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const publishedFilter = params.published;
  const pinnedFilter = params.pinned;

  let query = db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      published: news.published,
      pinned: news.pinned,
      publishedAt: news.publishedAt,
      tags: news.tags,
      authorName: profiles.fullName,
      createdAt: news.createdAt,
    })
    .from(news)
    .leftJoin(profiles, eq(news.authorId, profiles.id))
    .$dynamic();

  if (publishedFilter === "true") query = query.where(eq(news.published, true));
  else if (publishedFilter === "false") query = query.where(eq(news.published, false));

  if (pinnedFilter === "true") query = query.where(eq(news.pinned, true));
  else if (pinnedFilter === "false") query = query.where(eq(news.pinned, false));

  const data = await query.orderBy(desc(news.pinned), desc(news.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News &amp; Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} article{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add News
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="published"
          placeholder="All statuses"
          currentValue={publishedFilter}
          options={[
            { value: "true", label: "Published" },
            { value: "false", label: "Drafts" },
          ]}
        />
        <FilterSelect
          paramKey="pinned"
          placeholder="All articles"
          currentValue={pinnedFilter}
          options={[
            { value: "true", label: "Pinned only" },
            { value: "false", label: "Unpinned only" },
          ]}
        />
      </div>

      <NewsView data={data} />
    </div>
  );
}
