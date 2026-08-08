import Link from "next/link";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { researchDomains } from "@/db/schema";

export const revalidate = 60;

export default async function ResearchAreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [area] = await db
    .select()
    .from(researchDomains)
    .where(eq(researchDomains.slug, slug))
    .limit(1);

  if (!area) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <Link href="/research">
            <Button variant="ghost" size="sm" className="gap-2 mb-8 -ml-2">
              <ArrowLeft className="h-4 w-4" /> All Research
            </Button>
          </Link>
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 text-xs font-semibold uppercase tracking-wider">
              Research
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
              {area.name}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {area.description}
            </p>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {area.description}
            </p>
          </div>
          {(area.tags ?? []).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {(area.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {area.featuredImageUrl && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <figure className="rounded-xl border overflow-hidden bg-muted/30">
              <div className="relative aspect-[4/3]">
                <img
                  src={area.featuredImageUrl}
                  alt={area.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {area.name}
              </figcaption>
            </figure>
          </div>
        )}
      </div>
    </div>
  );
}
