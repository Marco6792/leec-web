import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { publications, publicationAuthors, profiles } from "@/db/schema";
import { serverError, getPagination } from "@/lib/api-helpers";

export type ExportFormat = "json" | "csv" | "bibtex";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "json") as ExportFormat;
    const { limit, offset } = getPagination(searchParams);

    // Fetch publications with authors via join
    const data = await db
      .select({
        id: publications.id,
        type: publications.type,
        title: publications.title,
        abstract: publications.abstract,
        year: publications.year,
        doi: publications.doi,
        journal: publications.journal,
        conference: publications.conference,
        volume: publications.volume,
        pages: publications.pages,
        keywords: publications.keywords,
        openAccess: publications.openAccess,
        authorNames: sql<string>`COALESCE(
          json_agg(json_build_object(
            'name', ${profiles.fullName},
            'order', ${publicationAuthors.authorOrder}
          ) ORDER BY ${publicationAuthors.authorOrder}) FILTER (WHERE ${profiles.id} IS NOT NULL),
          '[]'::json
        )`,
      })
      .from(publications)
      .leftJoin(
        publicationAuthors,
        eq(publicationAuthors.publicationId, publications.id),
      )
      .leftJoin(profiles, eq(publicationAuthors.profileId, profiles.id))
      .groupBy(publications.id)
      .orderBy(desc(publications.year))
      .limit(limit)
      .offset(offset);

    if (format === "csv") {
      const headers = [
        "title", "type", "year", "doi", "journal",
        "authors", "abstract", "keywords",
      ];
      const rows = data.map((pub) =>
        [
          `"${(pub.title ?? "").replace(/"/g, '""')}"`,
          pub.type,
          pub.year,
          pub.doi ?? "",
          `"${(pub.journal ?? "").replace(/"/g, '""')}"`,
          `"${(JSON.stringify(pub.authorNames) ?? "").replace(/"/g, '""')}"`,
          `"${(pub.abstract ?? "").replace(/"/g, '""').slice(0, 500)}"`,
          `"${(pub.keywords ?? []).join("; ")}"`,
        ].join(","),
      );

      return new Response([headers.join(","), ...rows].join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="publications-export.csv"`,
        },
      });
    }

    if (format === "bibtex") {
      const entries = data.map((pub) => {
        const authors = (pub.authorNames as unknown as any[] ?? [])
          .map((a: unknown) => (a as { name: string }).name)
          .join(" and ");
        const key = `${pub.year}${authors.split(" ")[0] ?? "anon"}`;
        const lines = [`@${pub.type === "journal" ? "article" : "misc"}{${key},`];
        if (pub.title) lines.push(`  title = {${pub.title}},`);
        if (authors) lines.push(`  author = {${authors}},`);
        if (pub.journal) lines.push(`  journal = {${pub.journal}},`);
        if (pub.year) lines.push(`  year = {${pub.year}},`);
        if (pub.doi) lines.push(`  doi = {${pub.doi}},`);
        if (pub.volume) lines.push(`  volume = {${pub.volume}},`);
        if (pub.pages) lines.push(`  pages = {${pub.pages}},`);
        lines.push("}");
        return lines.join("\n");
      });

      return new Response(entries.join("\n\n"), {
        headers: {
          "Content-Type": "application/x-bibtex",
          "Content-Disposition": `attachment; filename="publications-export.bib"`,
        },
      });
    }

    // Default: JSON
    return Response.json({ data, count: data.length });
  } catch (error) {
    return serverError(error);
  }
}
