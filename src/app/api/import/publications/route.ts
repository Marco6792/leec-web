import { db } from "@/db";
import { publications, publicationAuthors, profiles } from "@/db/schema";
import { ok, badRequest, serverError, requireUser } from "@/lib/api-helpers";

/**
 * Import publications from a CSV or JSON payload.
 * CSV format: title, type, year, doi, journal, abstract
 * JSON format: array of publication objects (authors handled separately)
 */
export async function POST(request: Request) {
  try {
    await requireUser();
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("json")) {
      const body = await request.json();
      const items: any[] = Array.isArray(body) ? body : body.publications ?? [];

      if (!items.length) return badRequest("No publications to import");

      let imported = 0;
      let skipped = 0;

      for (const pub of items) {
        if (!pub.title || !pub.year) {
          skipped++;
          continue;
        }

        const [record] = await db
          .insert(publications)
          .values({
            title: pub.title,
            type: pub.type ?? "journal",
            year: pub.year,
            doi: pub.doi ?? null,
            journal: pub.journal ?? null,
            abstract: pub.abstract ?? null,
            keywords: pub.keywords ?? [],
          })
          .returning();

        imported++;
      }

      return ok({ imported, skipped, total: items.length });
    }

    if (contentType.includes("csv") || contentType.includes("text")) {
      const text = await request.text();
      const lines = text.split("\n").filter(Boolean);

      if (lines.length < 2) return badRequest("CSV must have a header row and at least one data row");

      const headers = lines[0].split(",").map((h: string) => h.trim().replace(/"/g, ""));
      let imported = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v: string) => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = Object.fromEntries(
          headers.map((h: string, j: number) => [h, values[j]]),
        );

        if (!row.title || !row.year) continue;

        await db.insert(publications).values({
          title: row.title,
          type: (row.type ?? "journal") as any,
          year: parseInt(row.year),
          doi: row.doi ?? null,
          journal: row.journal ?? null,
          abstract: row.abstract ?? null,
        });

        imported++;
      }

      return ok({ imported, skipped: lines.length - 1 - imported, total: lines.length - 1 });
    }

    return badRequest("Unsupported content type. Use application/json or text/csv.");
  } catch (error) {
    if (error instanceof Response) return error;
    return serverError(error);
  }
}
