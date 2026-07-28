"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign in with email and password.
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
  redirect("/");
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { error: error?.message ?? "Failed to initiate Microsoft sign in" };
  }

  redirect(data.url);
}
