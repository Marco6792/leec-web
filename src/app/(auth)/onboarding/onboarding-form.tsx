"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                defaultValue={defaultName}
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title / Position
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. PhD Student, Professor"
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium mb-1">
                Institution
              </label>
              <Input
                id="institution"
                name="institution"
                type="text"
                placeholder="e.g. University of Buea"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Department
              </label>
              <Input
                id="department"
                name="department"
                type="text"
                placeholder="e.g. Electrical Engineering"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+237 XXX XXX XXX"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="biography" className="block text-sm font-medium mb-1">
                Biography
              </label>
              <Textarea
                id="biography"
                name="biography"
                rows={3}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="researchInterests" className="block text-sm font-medium mb-1">
                Research Interests
              </label>
              <Input
                id="researchInterests"
                name="researchInterests"
                type="text"
                placeholder="Comma-separated: Machine Learning, Power Systems, IoT"
              />
            </div>

            <div>
              <label htmlFor="orcid" className="block text-sm font-medium mb-1">
                ORCID
              </label>
              <Input
                id="orcid"
                name="orcid"
                type="text"
                placeholder="0000-0000-0000-0000"
              />
            </div>

            <div>
              <label htmlFor="googleScholar" className="block text-sm font-medium mb-1">
                Google Scholar
              </label>
              <Input
                id="googleScholar"
                name="googleScholar"
                type="url"
                placeholder="https://scholar.google.com/..."
              />
            </div>

            <div>
              <label htmlFor="researchGate" className="block text-sm font-medium mb-1">
                ResearchGate
              </label>
              <Input
                id="researchGate"
                name="researchGate"
                type="url"
                placeholder="https://researchgate.net/profile/..."
              />
            </div>

            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium mb-1">
                LinkedIn
              </label>
              <Input
                id="linkedIn"
                name="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://..."
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
