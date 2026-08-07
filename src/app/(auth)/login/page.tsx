import { AuthForm } from "@/components/auth/auth-form";
import { login, signInWithGoogle, signInWithMicrosoft } from "@/lib/auth/actions";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in — LEEC",
  description: "Sign in to the LEEC platform",
};

/**
 * Only allow same-origin relative paths (e.g. `/admin`) as post-login
 * redirect targets. Blocks `//evil.com`, `javascript:` and friends.
 */
function safeRedirect(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith("/")) return undefined;
  if (value.startsWith("//")) return undefined;
  if (/[\\\n\r]/.test(value)) return undefined;
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);
  const user = await getUser();
  if (user) redirect(redirectTo ?? "/");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          action={login}
          redirectTo={redirectTo}
          oauthActions={{
            google: signInWithGoogle,
            microsoft: signInWithMicrosoft,
          }}
        />
      </div>
    </div>
  );
}
