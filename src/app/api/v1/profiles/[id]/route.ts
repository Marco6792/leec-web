import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { ok, notFound, serverError } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));

    if (!profile) return notFound("Profile not found");
    return ok(profile);
  } catch (error) {
    return serverError(error);
  }
}
