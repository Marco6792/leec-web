import { getUser, createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata = {
  title: "Profile — LEEC",
  description: "LEEC researcher profile",
};

export default async function ProfileByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const currentUserId = user?.id ?? null;

  const supabase = await createClient();
  if (!supabase) return <ProfileView profileId={id} currentUserId={currentUserId} />;

  try {
    const { data: rows } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id) as unknown as { data: any[] | null };

    const profile = rows?.[0] ?? null;

    if (profile) {
      const email = currentUserId === id ? user?.email ?? "" : "";
      return (
        <ProfileView
          profileId={id}
          currentUserId={currentUserId}
          initialProfile={{ ...profile, email, research_interests: profile.research_interests ?? [] }}
        />
      );
    }
  } catch (e) {
    console.error("Profile fetch error:", e);
  }

  return <ProfileView profileId={id} currentUserId={currentUserId} />;
}
