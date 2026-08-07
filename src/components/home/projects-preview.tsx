import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, profiles } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDollarSign, FileText, User } from "lucide-react";

function formatAmount(value: string | null, currency: string | null) {
  if (!value) return null;
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${value} ${currency ?? ""}`.trim();
  return `${amount.toLocaleString()} ${currency ?? ""}`.trim();
}

export async function ProjectsPreview() {
  const projectList = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      description: projects.description,
      fundingAmount: projects.fundingAmount,
      currency: projects.currency,
      imageUrl: projects.imageUrl,
      pdfUrl: projects.pdfUrl,
      piName: profiles.fullName,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.piId, profiles.id))
    .where(eq(projects.status, "active"))
    .orderBy(desc(projects.createdAt))
    .limit(3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Research Projects
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Ongoing research initiatives from energy harvesting to smart
              agriculture and electromagnetic non-destructive testing.
            </p>
          </div>
          <Link href="/projects">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              All Projects <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {projectList.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No active projects right now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((item) => (
              <Link
                key={item.id}
                href={`/projects/${item.slug}`}
                className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
              >
                <div className="relative aspect-video overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/40">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-[11px] font-medium text-emerald-700 backdrop-blur-sm dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-current" />
                    Active
                  </span>
                  {item.pdfUrl && (
                    <span
                      title="Project document available"
                      className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md border border-border bg-background/80 backdrop-blur-sm px-2 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      <FileText className="size-3.5 text-primary" /> PDF
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
                    {item.piName && (
                      <span className="inline-flex items-center gap-1">
                        <User className="size-3.5" /> {item.piName}
                      </span>
                    )}
                    {formatAmount(item.fundingAmount, item.currency) && (
                      <span className="inline-flex items-center gap-1">
                        <CircleDollarSign className="size-3.5" />
                        {formatAmount(item.fundingAmount, item.currency)}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3">
                    View project <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
