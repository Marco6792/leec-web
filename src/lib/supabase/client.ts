import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Create a Supabase client for Client Components.
 * Returns null if Supabase env vars are not configured (for development).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
  );
}
