import { AuthForm } from "@/components/auth/auth-form";
import { login, signInWithGoogle, signInWithMicrosoft } from "@/lib/auth/actions";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in — LEEC",
  description: "Sign in to the LEEC platform",
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          action={login}
          oauthActions={{
            google: signInWithGoogle,
            microsoft: signInWithMicrosoft,
          }}
        />
      </div>
    </div>
  );
}
