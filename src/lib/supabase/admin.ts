import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Create a Supabase admin client with the service role key.
 * Bypasses RLS for admin operations.
 * Returns null if env vars are not configured.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
