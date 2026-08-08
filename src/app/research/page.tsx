import Link from "next/link";
import { asc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Cpu, Waves, Zap, Leaf } from "lucide-react";
import Image from "next/image";
import { db } from "@/db";
import { researchDomains } from "@/db/schema";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Waves,
  Zap,
  Leaf,
};

export const revalidate = 60;

export default async function ResearchPage() {
  const areas = await db
    .select()
    .from(researchDomains)
    .orderBy(asc(researchDomains.sortOrder));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 text-xs font-semibold uppercase tracking-wider">
              Research
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Research Areas
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Research in Engineering Sciences for the Local Community, with focus on
              electrical energy, smart agriculture, and telecommunications.
            </p>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Research Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {areas.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No research areas available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {areas.map((area) => {
              const Icon = iconMap[area.icon ?? ""] ?? Cpu;
              return (
                <Link key={area.id} href={`/research/${area.slug}`} className="group block">
                  <Card className="h-full overflow-hidden border-foreground/10 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:border-foreground/20 hover:shadow-primary/5 transition-all duration-500 ease-out group-hover:-translate-y-1">
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted/30">
                      {area.featuredImageUrl ? (
                        <Image
                          src={area.featuredImageUrl}
                          alt={area.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                          <Icon className="h-16 w-16 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2">
                          {(area.tags ?? []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 sm:p-8">
                      <h2 className="font-semibold text-xl sm:text-2xl mb-3 group-hover:text-primary transition-colors duration-300 leading-snug">
                        {area.name}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                        {area.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <span>Explore research</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
