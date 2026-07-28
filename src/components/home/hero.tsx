import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/photos/team-photo.jpg"
          alt="LEEC Research Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/90 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            University of Buea &amp; INSA Lyon Partnership
          </div> */}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Laboratory of
            <br />
            Electrical Engineering
            <br />
            and Computing
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed mb-10">
            Advancing African engineering through cutting-edge research,
            world-class facilities, and international collaboration.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/research">
              <Button
                // size=""
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
