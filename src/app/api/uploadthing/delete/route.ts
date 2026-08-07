import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { db } from "@/db";
import { labMembers } from "@/db/schema";
import { requireUser, unauthorized } from "@/lib/api-helpers";

async function requireAdmin() {
  const { user } = await requireUser();
  const [member] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, user.id));
  if (!member || !["director", "pi"].includes(member.role)) {
    throw unauthorized("Admin access required");
  }
}

/**
 * Deletes an uploaded file from UploadThing when it is removed from a form.
 * Accepts the public file URL (e.g. https://utfs.io/f/<fileKey>) and extracts
 * the file key so it can be removed from the storage provider too.
 * Only admins (director / PI) may delete files.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = (await request.json()) as { url?: unknown };

    if (typeof body?.url !== "string" || !body.url) {
      return NextResponse.json(
        { ok: false, error: "Missing url." },
        { status: 400 },
      );
    }

    const key = body.url.split("/f/")[1]?.split("?")[0];
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "Not an UploadThing URL." },
        { status: 400 },
      );
    }

    const utapi = new UTApi();
    await utapi.deleteFiles(key);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("UploadThing delete failed:", err);
    return NextResponse.json(
      { ok: false, error: "Delete failed." },
      { status: 500 },
    );
  }
}
