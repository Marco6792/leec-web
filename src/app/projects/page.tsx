import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { projects, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";
import { ArrowRight, FileText, CircleDollarSign } from "lucide-react";
import { stripHtml } from "@/lib/strip-html";

export const revalidate = 60;

const statusStyles: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  },
  on_hold: {
    label: "On Hold",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
};

function formatCurrency(value: string | null, currency: string | null) {
  if (!value) return null;
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${value} ${currency ?? ""}`.trim();
  return `${amount.toLocaleString()} ${currency ?? ""}`.trim();
}

export default async function ProjectsPage() {
  const projectList = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      fundingSource: projects.fundingSource,
      fundingAmount: projects.fundingAmount,
      currency: projects.currency,
      startDate: projects.startDate,
      endDate: projects.endDate,
      imageUrl: projects.imageUrl,
      pdfUrl: projects.pdfUrl,
      piId: projects.piId,
      piName: profiles.fullName,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.piId, profiles.id))
    .where(eq(projects.status, "active"))
    .orderBy(desc(projects.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Projects</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Research Projects
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Ongoing research initiatives at LEEC, from energy harvesting to smart
        agriculture and electromagnetic non-destructive testing.
      </p>

      <Separator className="mb-12" />

      {projectList.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No active projects right now. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectList.map((item) => {
            const status = statusStyles[item.status ?? ""] ?? statusStyles.active;
            const funding = formatCurrency(item.fundingAmount, item.currency);
            return (
              <Link
                key={item.id}
                href={`/projects/${item.slug}`}
                className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
              >
                <div className="relative aspect-video overflow-hidden">
                  {item.imageUrl ? (
                    <SiteImage
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/40">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm bg-background/80 ${status.className}`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {status.label}
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
                <div className="p-7">
                  <h3 className="font-semibold text-xl mb-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {stripHtml(item.description)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-4">
                    {item.piName && <span>PI: {item.piName}</span>}
                    {funding && (
                      <span className="inline-flex items-center gap-1">
                        <CircleDollarSign className="size-3.5" />
                        {funding}
                        {item.fundingSource ? ` · ${item.fundingSource}` : ""}
                      </span>
                    )}
                    {item.startDate && <span>Since {item.startDate}</span>}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-4">
                    View project <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
