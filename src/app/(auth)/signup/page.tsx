import { AuthForm } from "@/components/auth/auth-form";
import { signup, signInWithGoogle, signInWithMicrosoft } from "@/lib/auth/actions";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create an account — LEEC",
  description: "Join the Laboratory of Electrical Engineering and Computing",
};

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <AuthForm
          mode="signup"
          action={signup}
          oauthActions={{
            google: signInWithGoogle,
            microsoft: signInWithMicrosoft,
          }}
        />
      </div>
    </div>
  );
}
