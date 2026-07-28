"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, string | null> = {};
  const fields = ["full_name", "title", "institution", "department", "biography", "phone"];
  for (const f of fields) {
    const v = formData.get(f);
    if (v !== null) updates[f] = v as string;
  }

  if (Object.keys(updates).length === 0) return { error: "No fields to update" };

  const { error } = await supabase.from("profiles").update(updates as never).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function updateInterests(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const interestsRaw = formData.get("research_interests") as string;
  const researchInterests = interestsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("profiles")
    .update({ research_interests: researchInterests } as never)
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function updateLinks(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, string | null> = {};
  const fields = ["orcid", "google_scholar", "research_gate", "linked_in", "website"];
  for (const f of fields) {
    const v = formData.get(f);
    if (v !== null) updates[f] = v as string;
  }

  if (Object.keys(updates).length === 0) return { error: "No fields to update" };

  const { error } = await supabase.from("profiles").update(updates as never).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function addEducation(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const degree = formData.get("degree") as string;
  const institution = formData.get("institution") as string;
  const field = formData.get("field") as string;
  const startYear = parseInt(formData.get("start_year") as string) || null;
  const endYear = parseInt(formData.get("end_year") as string) || null;

  const { error } = await supabase.from("education").insert({
    profile_id: user.id,
    degree,
    institution,
    field: field || null,
    start_year: startYear,
    end_year: endYear,
  } as never);

  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function removeEducation(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function ensureProfile() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single() as never as { data: { id: string } | null };
  if (existing) return { created: false };

  await supabase.from("profiles" as never).insert({ id: user.id, full_name: "" } as never);
  return { created: true };
}

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const avatarUrl = formData.get("avatar_url") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl || null } as never)
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
}

export async function deleteAccount() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  const adminClient = createAdminClient();
  if (adminClient) {
    await adminClient.auth.admin.deleteUser(user.id);
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
