import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  collaborationProjects,
  collaborationMilestones,
  collaborationIpDisclosures,
  partners,
  profiles,
} from "@/db/schema";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  Building2,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Lightbulb,
  Shield,
  DollarSign,
  Globe,
  Award,
  TrendingUp,
  ExternalLink,
  MapPin,
} from "lucide-react";

export const revalidate = 60;

// ─── Status Config ────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  negotiation: {
    label: "Negotiation",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    icon: Clock,
  },
  active: {
    label: "Active",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    icon: TrendingUp,
  },
  completed: {
    label: "Completed",
    color:
      "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300",
    icon: CheckCircle,
  },
  terminated: {
    label: "Terminated",
    color:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    icon: AlertCircle,
  },
};

const milestoneStatusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    color: "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    icon: TrendingUp,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    icon: CheckCircle,
  },
  delayed: {
    label: "Delayed",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: AlertCircle,
  },
};

const ipStatusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-500" },
  filed: { label: "Filed", color: "bg-blue-100 text-blue-700" },
  granted: { label: "Granted", color: "bg-emerald-100 text-emerald-700" },
  licensed: { label: "Licensed", color: "bg-violet-100 text-violet-700" },
  expired: { label: "Expired", color: "bg-rose-100 text-rose-700" },
};

const ipTypeLabels: Record<string, string> = {
  patent: "Patent",
  copyright: "Copyright",
  know_how: "Know-How",
  trademark: "Trademark",
  design: "Design",
};

const agreementTypeLabels: Record<string, string> = {
  mou: "Memorandum of Understanding (MOU)",
  contract_research: "Contract Research Agreement",
  consulting: "Consulting Agreement",
  sponsored_research: "Sponsored Research Agreement",
  nda: "Non-Disclosure Agreement (NDA)",
  material_transfer: "Material Transfer Agreement",
};

// ─── Component ────────────────────────────────────────────────────────────

export default async function CollaborationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch project with partner and PI info
  const [project] = await db
    .select({
      id: collaborationProjects.id,
      title: collaborationProjects.title,
      slug: collaborationProjects.slug,
      description: collaborationProjects.description,
      scope: collaborationProjects.scope,
      status: collaborationProjects.status,
      agreementType: collaborationProjects.agreementType,
      agreementDocumentUrl: collaborationProjects.agreementDocumentUrl,
      startDate: collaborationProjects.startDate,
      endDate: collaborationProjects.endDate,
      fundingAmount: collaborationProjects.fundingAmount,
      currency: collaborationProjects.currency,
      isPublic: collaborationProjects.isPublic,
      partnerName: partners.name,
      partnerSlug: partners.slug,
      partnerLogoUrl: partners.logoUrl,
      partnerType: partners.partnerType,
      partnerCountry: partners.country,
      piFullName: profiles.fullName,
    })
    .from(collaborationProjects)
    .leftJoin(
      partners,
      eq(collaborationProjects.partnerId, partners.id),
    )
    .leftJoin(
      profiles,
      eq(collaborationProjects.piId, profiles.id),
    )
    .where(eq(collaborationProjects.slug, slug))
    .limit(1);

  if (!project || !project.isPublic) notFound();

  // Fetch milestones
  const milestones = await db
    .select()
    .from(collaborationMilestones)
    .where(eq(collaborationMilestones.projectId, project.id))
    .orderBy(collaborationMilestones.sortOrder);

  // Fetch IP disclosures
  const ipDisclosures = await db
    .select()
    .from(collaborationIpDisclosures)
    .where(eq(collaborationIpDisclosures.projectId, project.id))
    .orderBy(collaborationIpDisclosures.createdAt);

  const stsCfg = statusConfig[project.status ?? ""];
  const StatusIcon = stsCfg?.icon ?? Clock;

  // ─── Progress timeline steps ────────────────────────────────────────

  const progressSteps = [
    {
      key: "negotiation",
      label: "Negotiation",
      done:
        project.status === "active" ||
        project.status === "completed" ||
        project.status === "terminated",
      current: project.status === "negotiation",
    },
    {
      key: "active",
      label: "Active Research",
      done: project.status === "completed" || project.status === "terminated",
      current: project.status === "active",
    },
    {
      key: "completed",
      label: "Completion",
      done: project.status === "completed",
      current: project.status === "completed",
      terminated: project.status === "terminated",
    },
  ];

  // Parse milestones JSON for display alongside normalized milestones
  const structuredMilestones = milestones.filter((m) => m.isPublic);

  return (
    <div className="min-h-screen">
      {/* ─── Back Link ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/collaborate"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collaboration
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ─── Main Content ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {stsCfg && (
                  <Badge
                    className={`${stsCfg.color} border-0 flex items-center gap-1`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {stsCfg.label}
                  </Badge>
                )}
                {project.agreementType && (
                  <Badge variant="outline" className="text-xs">
                    {agreementTypeLabels[project.agreementType] ??
                      (project.agreementType as string).replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {project.partnerName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {project.partnerName}
                    {project.partnerCountry && (
                      <span className="text-xs">
                        ({project.partnerCountry})
                      </span>
                    )}
                  </span>
                )}
                {project.piFullName && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    PI: {project.piFullName}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {project.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  About This Project
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            )}

            {/* Scope */}
            {project.scope && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  Scope of Work
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.scope}
                </p>
              </div>
            )}

            {/* Progress Timeline */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Project Progress
              </h2>
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-8">
                  {progressSteps.map((step) => (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Circle indicator */}
                      <div
                        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          step.terminated
                            ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30"
                            : step.done
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                              : step.current
                                ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                                : "border-muted-foreground/20 bg-muted"
                        }`}
                      >
                        {step.terminated ? (
                          <AlertCircle className="h-5 w-5 text-rose-500" />
                        ) : step.done ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : step.current ? (
                          <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1.5">
                        <p
                          className={`text-sm font-medium ${
                            step.terminated
                              ? "text-rose-600 dark:text-rose-400"
                              : step.done || step.current
                                ? "text-foreground"
                                : "text-muted-foreground/50"
                          }`}
                        >
                          {step.terminated
                            ? "Project Terminated"
                            : step.label}
                        </p>
                        {step.current && !step.done && !step.terminated && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Currently in this phase
                          </p>
                        )}
                        {step.done && !step.terminated && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones */}
            {structuredMilestones.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    Milestones
                  </h2>
                  <div className="space-y-4">
                    {structuredMilestones.map((milestone, i) => {
                      const msCfg =
                        milestoneStatusConfig[milestone.status ?? ""];
                      const MsIcon = msCfg?.icon ?? Clock;

                      return (
                        <div
                          key={milestone.id}
                          className="relative flex items-start gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
                        >
                          {/* Step number */}
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {i + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h3 className="font-medium text-sm">
                                {milestone.title}
                              </h3>
                              {msCfg && (
                                <Badge
                                  variant="outline"
                                  className={`shrink-0 text-[10px] uppercase tracking-wider ${msCfg.color}`}
                                >
                                  <MsIcon className="h-3 w-3 mr-1" />
                                  {msCfg.label}
                                </Badge>
                              )}
                            </div>
                            {milestone.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                {milestone.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              {milestone.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due:{" "}
                                  {new Date(
                                    milestone.dueDate,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                              {milestone.completedDate && (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle className="h-3 w-3" />
                                  Completed:{" "}
                                  {new Date(
                                    milestone.completedDate,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            {/* Deliverables */}
                            {Array.isArray(milestone.deliverables) &&
                              (milestone.deliverables as string[]).length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {(
                                    milestone.deliverables as string[]
                                  ).map((d, j) => (
                                    <span
                                      key={j}
                                      className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* IP Disclosures */}
            {ipDisclosures.length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-muted-foreground" />
                    Intellectual Property
                  </h2>
                  <div className="space-y-4">
                    {ipDisclosures.map((ip) => {
                      const ipCfg = ipStatusConfig[ip.filingStatus ?? ""];

                      return (
                        <div
                          key={ip.id}
                          className="rounded-lg border bg-card p-5 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                                <Lightbulb className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">
                                  {ip.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {ipTypeLabels[ip.type ?? ""] ?? (ip.type as string)?.replace(/_/g, " ") ?? "—"}
                                </p>
                              </div>
                            </div>
                            {ipCfg && (
                              <Badge
                                variant="outline"
                                className={`shrink-0 text-[10px] uppercase tracking-wider ${ipCfg.color}`}
                              >
                                {ipCfg.label}
                              </Badge>
                            )}
                          </div>

                          {ip.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                              {ip.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {ip.patentNumber && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Patent: {ip.patentNumber}
                              </span>
                            )}
                            {ip.filingDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Filed:{" "}
                                {new Date(ip.filingDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                            {ip.grantDate && (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-3 w-3" />
                                Granted:{" "}
                                {new Date(ip.grantDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                            {ip.licensee && (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Licensee: {ip.licensee}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ─── Sidebar ───────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="rounded-xl border bg-card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Project Details</h3>

              <div className="space-y-4 text-sm">
                {/* Partner */}
                {project.partnerName && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Partner</p>
                      <p className="text-muted-foreground">
                        {project.partnerName}
                      </p>
                      {project.partnerCountry && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {project.partnerCountry}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Principal Investigator */}
                {project.piFullName && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Principal Investigator</p>
                      <p className="text-muted-foreground">
                        {project.piFullName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date range */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Project Period</p>
                    <p className="text-muted-foreground">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "TBD"}
                      {project.endDate &&
                        ` – ${new Date(project.endDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )}`}
                      {!project.endDate && " – Present"}
                    </p>
                  </div>
                </div>

                {/* Agreement Type */}
                {project.agreementType && (
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Agreement</p>
                      <p className="text-muted-foreground text-xs">
                        {agreementTypeLabels[project.agreementType as string] ??
                          (project.agreementType as string).replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Funding */}
                {project.fundingAmount && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Funding</p>
                      <p className="text-muted-foreground">
                        {project.currency}{" "}
                        {Number(project.fundingAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Milestones & IP counts */}
                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">
                      {structuredMilestones.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Milestones
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">
                      {ipDisclosures.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IP Disclosures
                    </p>
                  </div>
                </div>

                {/* Milestone completion rate */}
                {structuredMilestones.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Completion</span>
                      <span>
                        {Math.round(
                          (structuredMilestones.filter(
                            (m) => m.status === "completed",
                          ).length /
                            structuredMilestones.length) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${
                            structuredMilestones.length > 0
                              ? Math.round(
                                  (structuredMilestones.filter(
                                    (m) => m.status === "completed",
                                  ).length /
                                    structuredMilestones.length) *
                                    100,
                                )
                              : 0
                        }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Partner Logo */}
            {project.partnerLogoUrl && (
              <div className="rounded-xl border bg-card p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Partner Logo
                </p>
                <SiteImage
                  src={project.partnerLogoUrl}
                  alt={`${project.partnerName ?? "Partner"} logo`}
                  width={160}
                  height={64}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
