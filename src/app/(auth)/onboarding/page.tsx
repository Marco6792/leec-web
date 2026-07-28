import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "./onboarding-form";

export const metadata = {
  title: "Complete your profile — LEEC",
  description: "Set up your LEEC profile",
};

export default async function OnboardingPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (profile?.institution) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to LEEC
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>
        <OnboardingForm defaultName={user.user_metadata?.full_name as string} />
      </div>
    </div>
  );
}
