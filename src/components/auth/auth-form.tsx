"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cameroonUniversities, getFacultiesForUniversity } from "@/lib/data/cameroon-universities";
import { GraduationCap, Building2, Heart, User, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type ResearcherType = "academic" | "corporate" | "medical" | "not-researcher" | null;

interface AuthFormProps {
  mode: "login" | "signup";
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; message?: string } | undefined>;
  oauthActions?: {
    google?: () => Promise<{ error?: string } | undefined>;
    microsoft?: () => Promise<{ error?: string } | undefined>;
  };
}

const researcherTypes = [
  {
    id: "academic" as const,
    label: "Academic or student",
    description: "University students and faculty, institute members, and independent researchers",
    icon: GraduationCap,
  },
  {
    id: "corporate" as const,
    label: "Corporate, government, or NGO",
    description: "Technology or product developers, R&D specialists, and government or NGO employees in scientific roles",
    icon: Building2,
  },
  {
    id: "medical" as const,
    label: "Medical",
    description: "Health care professionals, including clinical researchers",
    icon: Heart,
  },
  {
    id: "not-researcher" as const,
    label: "Not a researcher",
    description: "Journalists, citizen scientists, or anyone interested in reading and discovering research",
    icon: User,
  },
];

export function AuthForm({ mode, action, oauthActions }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<"type" | "form">("type");
  const [researcherType, setResearcherType] = useState<ResearcherType>(null);
  const [selectedUni, setSelectedUni] = useState("");
  const [faculties, setFaculties] = useState<{ name: string; departments: string[] }[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const isLogin = mode === "login";

  function handleTypeSelect(type: ResearcherType) {
    setResearcherType(type);
    setStep("form");
  }

  function handleUniChange(value: string) {
    setSelectedUni(value);
    setSelectedFaculty("");
    setFaculties(getFacultiesForUniversity(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("researcher_type", researcherType || "");
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.message) {
      setSuccess(result.message);
      setLoading(false);
    }
  }

  function handleBack() {
    setStep("type");
    setResearcherType(null);
  }

  if (isLogin) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access the LEEC platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Please wait\u2026" : "Sign in"}
            </Button>
          </form>

          {renderOAuthButtons()}
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (step === "type") {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join LEEC</CardTitle>
          <CardDescription>
            Join 20+ researchers at the Laboratory of Electrical Engineering and Computing
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            What type of researcher are you?
          </p>
          <RadioGroup
            value={researcherType ?? ""}
            onValueChange={(value) => handleTypeSelect(value as ResearcherType)}
          >
            {researcherTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.id}
                  className={cn(
                    "relative flex cursor-pointer rounded-lg border border-input bg-transparent p-4 transition-all",
                    "hover:border-ring hover:bg-accent/50",
                    "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5",
                    "has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-primary"
                  )}
                >
                  <RadioGroupItem
                    value={type.id}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="ml-3 flex flex-1 gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </RadioGroup>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to researcher type selection"
          >
            <ChevronLeft className="size-4" />
          </button>
          <CardTitle className="text-2xl">Create an account</CardTitle>
        </div>
        <CardDescription>
          {researcherType && getTypeLabel(researcherType)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="researcher_type" value={researcherType ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Dr. Your Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          {(researcherType === "academic" || researcherType === "medical") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <input type="hidden" name="institution" value={selectedUni} />
                <Select
                  value={selectedUni}
                  onValueChange={(v) => handleUniChange(v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameroonUniversities.map((uni) => (
                      <SelectItem key={uni.acronym} value={uni.name}>
                        {uni.name} ({uni.acronym})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUni && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department / Faculty</Label>
                  <input type="hidden" name="department" value={selectedFaculty} />
                  <Select
                    value={selectedFaculty}
                    onValueChange={(v) => setSelectedFaculty(v ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.name} value={faculty.name}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {researcherType === "corporate" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  type="text"
                  required
                  placeholder="Company, NGO, or government agency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. R&D Engineer, Product Manager"
                />
              </div>
            </>
          )}

          {researcherType === "medical" && (
            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Input
                id="speciality"
                name="speciality"
                type="text"
                placeholder="e.g. Cardiology, Public Health, Nursing"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Please wait\u2026" : "Create account"}
          </Button>
        </form>

        {renderOAuthButtons()}
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="ml-1 font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );

  function renderOAuthButtons() {
    if (!oauthActions?.google && !oauthActions?.microsoft) return null;

    return (
      <>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {oauthActions?.google && (
            <form
              action={async () => {
                setError(null);
                const result = await oauthActions.google!();
                if (result?.error) setError(result.error);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <GoogleIcon />
                Google
              </Button>
            </form>
          )}

          {oauthActions?.microsoft && (
            <form
              action={async () => {
                setError(null);
                const result = await oauthActions.microsoft!();
                if (result?.error) setError(result.error);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                size="lg"
              >
                <MicrosoftIcon />
                Microsoft
              </Button>
            </form>
          )}
        </div>
      </>
    );
  }
}

function getTypeLabel(type: ResearcherType): string {
  switch (type) {
    case "academic": return "Academic or student";
    case "corporate": return "Corporate, government, or NGO";
    case "medical": return "Medical professional";
    default: return "Join the LEEC community";
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
      <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
      <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
    </svg>
  );
}
