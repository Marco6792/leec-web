import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

/**
 * Singleton Drizzle client.
 * In development, Next.js hot-reloads can create many connections,
 * so we cache the client on the global object.
 */
const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined };

const client = globalForDb.client ?? postgres(connectionString);
if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });

export type Db = typeof db;
