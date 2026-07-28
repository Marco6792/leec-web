import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Auth callback handler.
 * Invoked after:
 * - Email confirmation link click
 * - OAuth provider redirect (Google, Microsoft)
 * - Magic link click
 *
 * Exchanges the auth code for a session and redirects to the dashboard.
 * New users are redirected to onboarding to complete their profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [profile] = await db
            .select({ institution: profiles.institution })
            .from(profiles)
            .where(eq(profiles.id, user.id))
            .limit(1);

          if (!profile?.institution) {
            return NextResponse.redirect(`${origin}/onboarding`);
          }
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
