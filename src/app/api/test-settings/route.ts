import { db } from "@/db";
import { settings } from "@/db/schema";

export async function GET() {
  try {
    const [setting] = await db.select().from(settings).limit(1);
    return Response.json({ setting, error: null });
  } catch (e) {
    return Response.json({ setting: null, error: String(e) }, { status: 500 });
  }
}
