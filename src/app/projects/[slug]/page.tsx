import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PdfViewer } from "@/components/pdf-viewer";
import { SiteImage } from "@/components/site-image";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  User,
  CheckCircle2,
} from "lucide-react";

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [item] = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      piId: projects.piId,
      piName: profiles.fullName,
      startDate: projects.startDate,
      endDate: projects.endDate,
      fundingSource: projects.fundingSource,
      fundingAmount: projects.fundingAmount,
      currency: projects.currency,
      imageUrl: projects.imageUrl,
      pdfUrl: projects.pdfUrl,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.piId, profiles.id))
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!item || !item.id || item.status !== "active") notFound();

  const status = statusStyles[item.status ?? ""] ?? statusStyles.active;
  const funding = formatCurrency(item.fundingAmount, item.currency);

  const paragraphs = (item.description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden border">
          {item.imageUrl ? (
            <SiteImage
              src={item.imageUrl}
              alt={item.title}
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full max-h-[480px] object-cover"
            />
          ) : (
            <div className="w-full max-h-[480px] h-[360px] bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
              <span className="text-7xl font-bold text-primary/40">
                {item.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Header info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {status.label}
            </span>
            {item.piName && (
              <Badge variant="outline" className="gap-1.5 text-xs">
                <User className="size-3.5" /> {item.piName}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {item.title}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {paragraphs[0] ?? item.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 rounded-xl border p-6">
            {item.startDate && (
              <div className="flex items-start gap-3">
                <Calendar className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Start date
                  </p>
                  <p className="text-sm font-medium mt-0.5">{item.startDate}</p>
                </div>
              </div>
            )}
            {item.endDate && (
              <div className="flex items-start gap-3">
                <Calendar className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    End date
                  </p>
                  <p className="text-sm font-medium mt-0.5">{item.endDate}</p>
                </div>
              </div>
            )}
            {funding && (
              <div className="flex items-start gap-3">
                <CircleDollarSign className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Funding
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {funding}
                    {item.fundingSource ? (
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                        {item.fundingSource}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            )}
            {item.piName && (
              <div className="flex items-start gap-3">
                <User className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Principal investigator
                  </p>
                  <p className="text-sm font-medium mt-0.5">{item.piName}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link href="/contact" className="inline-block">
              <Button className="gap-2">
                <CheckCircle2 className="size-4" /> Collaborate with us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Full description */}
      {paragraphs.length > 1 && (
        <>
          <Separator className="my-14" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              About the project
            </h2>
            <div className="space-y-6">
              {paragraphs.slice(1).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Project document */}
      {item.pdfUrl && (
        <>
          <Separator className="my-14" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Project document
            </h2>
            <PdfViewer url={item.pdfUrl} title={item.title} />
          </div>
        </>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border bg-muted/40 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-1">
            Interested in this project?
          </h3>
          <p className="text-muted-foreground max-w-xl">
            Contact the LEEC research team to learn more or discuss potential
            collaboration.
          </p>
        </div>
        <Link href="/contact" className="shrink-0">
          <Button className="w-full sm:w-auto">Contact us</Button>
        </Link>
      </div>
    </div>
  );
}
