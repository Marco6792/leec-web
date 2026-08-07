"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign in with email and password.
 *
 * Honors the `redirect` hidden field (set by the login page from the
 * middleware's `?redirect=` param) so users are sent back to the page
 * they originally requested (e.g. `/admin`) instead of always home.
 */
export async function login(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  const redirectTo = formData.get("redirect");
  const target =
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//") &&
    !/[\\\n\r]/.test(redirectTo)
      ? redirectTo
      : "/";
  redirect(target);
}

/**
 * Sign up with email and password.
 * Sends a confirmation email by default.
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const researcherType = formData.get("researcher_type") as string;
  const institution = formData.get("institution") as string;
  const department = formData.get("department") as string;
  const organization = formData.get("organization") as string;
  const title = formData.get("title") as string;
  const speciality = formData.get("speciality") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        researcher_type: researcherType,
        institution,
        department,
        organization,
        title,
        speciality,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Check your email to confirm your account.",
  };
}

/**
 * Sign out the current user.
 */
export async function signout() {
  const supabase = await createClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) console.error("Signout error:", error.message);
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  // Get site URL from environment or fallback to request headers
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : host
      ? `${protocol}://${host}`
      : "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message ?? "Failed to initiate Google sign in" };
  }

  redirect(data.url);
}

/**
 * Sign in with Microsoft OAuth.
 */
export async function signInWithMicrosoft() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  // Get site URL from environment or fallback to request headers
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : host
      ? `${protocol}://${host}`
      : "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message ?? "Failed to initiate Microsoft sign in" };
  }

  redirect(data.url);
}
