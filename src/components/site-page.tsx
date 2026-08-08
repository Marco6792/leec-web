import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React from "react";

/**
 * Inline formatter: renders `**bold**`, `*italic*`, `` `code` ``, and
 * `[label](url)` inside a block of text as React nodes.
 *
 * The regex alternation is ordered so that bold (`**`) is matched before
 * italic (`*`), and backticks / links are handled independently.
 */
const INLINE_PATTERN =
  /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  const pushText = (value: string) => {
    if (value) nodes.push(<React.Fragment key={key++}>{value}</React.Fragment>);
  };

  const re = new RegExp(INLINE_PATTERN);
  while ((match = re.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));

    const [full, , bold, italic, code, linkLabel, linkHref] = match;
    if (bold) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {renderInline(bold)}
        </strong>,
      );
    } else if (italic) {
      nodes.push(
        <em key={key++} className="italic">
          {renderInline(italic)}
        </em>,
      );
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em]"
        >
          {code}
        </code>,
      );
    } else if (linkLabel !== undefined && linkHref !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={linkHref}
          target={linkHref.startsWith("http") ? "_blank" : undefined}
          rel={linkHref.startsWith("http") ? "noreferrer" : undefined}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {linkLabel}
        </a>,
      );
    }

    lastIndex = re.lastIndex;
  }

  pushText(text.slice(lastIndex));
  return nodes;
}

/**
 * Lightweight prose renderer for the `content` field of site pages.
 *
 * Supports two formats:
 *   1. Rich HTML (from TipTap editor) — rendered directly with prose-content styling
 *   2. Legacy markdown-like syntax — parsed into styled blocks
 *
 * Legacy block syntax:
 *   - `## Heading` / `### Sub-heading`  → section headings
 *   - `- item`                          → bullet list
 *   - `1. item`                         → numbered list
 *   - blank lines                       → paragraph breaks
 *
 * Legacy inline syntax:
 *   - `**bold**`, `*italic*`, `` `code` ``, `[label](url)`
 */
export function ProseContent({ content }: { content: string }) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="prose-content text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const blocks: React.ReactNode[] = [];
  let keyCounter = 0;
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const nextKey = () => keyCounter++;

  const flushList = () => {
    if (!listBuffer) return;
    const { type, items } = listBuffer;
    const key = nextKey();
    blocks.push(
      type === "ul" ? (
        <ul key={key} className="list-disc space-y-1.5 pl-5">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      ) : (
        <ol key={key} className="list-decimal space-y-1.5 pl-5">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      ),
    );
    listBuffer = null;
  };

  const rawBlocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  rawBlocks.forEach((block) => {
    const lines = block.split("\n");

    // Bullet list
    if (lines.every((l) => /^-\s+/.test(l))) {
      flushList();
      listBuffer = { type: "ul", items: lines.map((l) => l.replace(/^-\s+/, "")) };
      return;
    }

    // Numbered list
    if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      flushList();
      listBuffer = { type: "ol", items: lines.map((l) => l.replace(/^\d+[.)]\s+/, "")) };
      return;
    }

    flushList();

    // Heading
    const h2 = block.match(/^##\s+(.+)$/);
    const h3 = block.match(/^###\s+(.+)$/);
    if (h2) {
      blocks.push(
        <h2
          key={nextKey()}
          className="text-2xl font-bold tracking-tight pt-2 first:pt-0"
        >
          {renderInline(h2[1])}
        </h2>,
      );
      return;
    }
    if (h3) {
      blocks.push(
        <h3 key={nextKey()} className="text-lg font-semibold">
          {renderInline(h3[1])}
        </h3>,
      );
      return;
    }

    // Paragraph — join hard line breaks within the same block
    blocks.push(
      <p
        key={nextKey()}
        className="text-muted-foreground leading-relaxed whitespace-pre-line"
      >
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </p>,
    );
  });

  flushList();

  return <div className="space-y-6 max-w-3xl">{blocks}</div>;
}

/**
 * Detect whether page content is editor-generated HTML (from the TipTap
 * admin editor) versus the legacy markdown subset. Simple heuristic that
 * checks for common block-level HTML tags.
 */
function isHtmlContent(content: string): boolean {
  return /<(\/)?(h1|h2|h3|h4|h5|p|ul|ol|li|blockquote|pre|hr|table|strong|em|b|i)/i.test(
    content,
  );
}

/**
 * Fetch a published site page by slug and render it with the standard
 * public-page layout. Returns `notFound()` if the page is missing or
 * unpublished.
 */
export async function SitePage({ slug, badge }: { slug: string; badge: string }) {
  const [page] = await db
    .select()
    .from(sitePages)
    .where(eq(sitePages.slug, slug))
    .limit(1);

  if (!page || !page.published) notFound();

  const html = isHtmlContent(page.content);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">
        {badge}
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        {page.title}
      </h1>
      {page.subtitle && (
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
          {page.subtitle}
        </p>
      )}

      <Separator className="mb-12" />

      {html ? (
        <div
          className="prose-content max-w-3xl"
          // Content is authored & sanitised by trusted admins via the editor.
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <ProseContent content={page.content} />
      )}

      <div className="mt-12 text-xs text-muted-foreground">
        Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
