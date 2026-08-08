import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function check() {
  const result = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'research_domains' ORDER BY ordinal_position`);
  console.log("Columns:", result);
  
  const count = await db.execute(sql`SELECT count(*) as count FROM research_domains`);
  console.log("Count:", count);
}

check().catch(e => console.error(e));
