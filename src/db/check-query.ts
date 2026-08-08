import "dotenv/config";
import { db } from "./index";
import { researchDomains } from "./schema";
import { asc } from "drizzle-orm";

async function check() {
  try {
    const result = await db.select().from(researchDomains).orderBy(asc(researchDomains.sortOrder));
    console.log("Query succeeded:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("Query failed:", e);
  }
}

check();
