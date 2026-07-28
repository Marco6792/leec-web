"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { completeOnboarding } from "@/lib/auth/onboarding";

interface OnboardingFormProps {
  defaultName: string;
}

export function OnboardingForm({ defaultName }: OnboardingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await completeOnboarding(formData);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                defaultValue={defaultName}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title / Position
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. PhD Student, Professor"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium mb-1">
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                placeholder="e.g. University of Buea"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="e.g. Electrical Engineering"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+237 XXX XXX XXX"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="biography" className="block text-sm font-medium mb-1">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="researchInterests" className="block text-sm font-medium mb-1">
                Research Interests
              </label>
              <input
                id="researchInterests"
                name="researchInterests"
                type="text"
                placeholder="Comma-separated: Machine Learning, Power Systems, IoT"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="orcid" className="block text-sm font-medium mb-1">
                ORCID
              </label>
              <input
                id="orcid"
                name="orcid"
                type="text"
                placeholder="0000-0000-0000-0000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="googleScholar" className="block text-sm font-medium mb-1">
                Google Scholar
              </label>
              <input
                id="googleScholar"
                name="googleScholar"
                type="url"
                placeholder="https://scholar.google.com/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="researchGate" className="block text-sm font-medium mb-1">
                ResearchGate
              </label>
              <input
                id="researchGate"
                name="researchGate"
                type="url"
                placeholder="https://researchgate.net/profile/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium mb-1">
                LinkedIn
              </label>
              <input
                id="linkedIn"
                name="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Saving..." : "Complete profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
