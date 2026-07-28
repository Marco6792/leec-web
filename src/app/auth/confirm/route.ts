import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email confirmation and OTP verification route.
 * Handles:
 * - Email verification links (signup confirmation)
 * - Magic link login
 * - Password reset links
 *
 * Called by Supabase Auth when a user clicks a link in their email.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });

      if (!error) {
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  // Redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=verification_failed", request.url),
  );
}
