import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { ok, badRequest, serverError } from "@/lib/api-helpers";

/**
 * Webhook endpoint for syncing publications from ORCID or CrossRef.
 * Triggered by external services when a new publication is registered.
 *
 * Expected payload:
 * {
 *   source: "orcid" | "crossref" | "hal",
 *   api_key: string,
 *   publications: [
 *     {
 *       doi: string,
 *       title: string,
 *       journal: string,
 *       year: number,
 *       type: string,
 *       abstract: string,
 *     }
 *   ]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source, api_key, publications: incoming } = body;

    if (!source || !api_key || !incoming) {
      return badRequest("Required fields: source, api_key, publications");
    }

    if (api_key !== process.env.WEBHOOK_API_KEY) {
      return badRequest("Invalid API key");
    }

    let imported = 0;
    let skipped = 0;

    for (const pub of incoming) {
      if (!pub.doi) {
        skipped++;
        continue;
      }

      // Check if already exists by DOI
      const [existing] = await db
        .select({ id: publications.id })
        .from(publications)
        .where(eq(publications.doi, pub.doi));

      if (existing) {
        skipped++;
        continue;
      }

      await db.insert(publications).values({
        doi: pub.doi,
        title: pub.title,
        journal: pub.journal ?? null,
        year: pub.year ?? new Date().getFullYear(),
        type: (pub.type ?? "journal") as any,
        abstract: pub.abstract ?? null,
      });

      imported++;
    }

    return ok({
      source,
      imported,
      skipped,
      total: incoming.length,
    });
  } catch (error) {
    return serverError(error);
  }
}
