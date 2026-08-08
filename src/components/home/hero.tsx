import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/home/hero-background";
import { HeroSubtitle } from "@/components/home/hero-subtitle";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { heroQuotes } from "@/db/schema";

export async function Hero() {
  const quotes = await db
    .select({ text: heroQuotes.text })
    .from(heroQuotes)
    .where(eq(heroQuotes.published, true))
    .orderBy(asc(heroQuotes.sortOrder));

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-black">
      {/* Background image — slow Ken Burns zoom + horizontal pan */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Laboratory of
            <br />
            Electrical Engineering
            <br />
            and Computing
          </h1>

          {/* Rotating subtitles — admin-managed quotes */}
          <div className="mb-10">
            <HeroSubtitle quotes={quotes.map((q) => q.text)} />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/research">
              <Button
                variant={"default"}
                className="gap-2  text-white pt-7 pb-7 pl-7 pr-7 rounded-full cursor-pointer hover:pr-10 transition-all"
              >
                Explore Research
                <ArrowRight className="h-4 w-4 -rotate-30" />
              </Button>
            </Link>
            <Link href="/people">
              <Button
                variant="secondary"
                size="lg"
                className="border-white/30 text-white rounded-full cursor-pointer pt-7 pb-7 pl-7 pr-7 hover:pr-10 transition-all"
              >
                Meet Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
