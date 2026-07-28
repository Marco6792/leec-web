import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/profile");

  redirect(`/profile/${user.id}`);
}
