import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { trainingSessions, trainingEnrollments } from "@/db/schema";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import {
  Calendar,
  Clock,
  Users,
  Wrench,
  GraduationCap,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export const revalidate = 60;

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Pending Approval", color: "bg-muted text-muted-foreground" },
  pending_approval: { label: "Pending Approval", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  open: { label: "Open for Enrollment", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  completed: { label: "Completed", color: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300" },
  cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
};

const levelConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  intermediate: { label: "Intermediate", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  advanced: { label: "Advanced", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
};

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [session] = await db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.slug, slug))
    .limit(1);

  if (!session) notFound();

  const [enrollmentCount] = await db
    .select({ count: count() })
    .from(trainingEnrollments)
    .where(eq(trainingEnrollments.sessionId, session.id));

  const enrolledCount = enrollmentCount?.count ?? 0;

  const spotsLeft = session.maxParticipants
    ? session.maxParticipants - enrolledCount
    : null;
  const isOpen = session.status === "open";
  const stsCfg = statusConfig[session.status ?? ""];
  const lvlCfg = levelConfig[session.level ?? ""];

  // Parse curriculum
  const curriculum = Array.isArray(session.curriculum)
    ? (session.curriculum as { week: number; topic: string; materials?: string[] }[])
    : [];

  // Parse schedule
  const scheduleData = Array.isArray(session.schedule)
    ? (session.schedule as { day?: string; time?: string; room?: string; description?: string }[])
    : [];

  const user = await getUser();

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/training"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Training
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {lvlCfg && (
                  <Badge className={`${lvlCfg.color} border-0`}>
                    {lvlCfg.label}
                  </Badge>
                )}
                {stsCfg && (
                  <Badge className={`${stsCfg.color} border-0`}>
                    {stsCfg.label}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {session.title}
              </h1>
              {session.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {session.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Curriculum
                </h2>
                <div className="space-y-3">
                  {curriculum.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border bg-card p-4"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {item.week || i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.topic}</p>
                        {item.materials && item.materials.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.materials.map((m, j) => (
                              <span
                                key={j}
                                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills / Tags */}
            {session.tags && session.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills You&apos;ll Gain</h2>
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment card */}
            <div className="rounded-xl border bg-card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Session Details</h3>

              <div className="space-y-4 text-sm">
                {/* Date range */}
                {session.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Dates</p>
                      <p className="text-muted-foreground">
                        {new Date(session.startDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                        {session.endDate &&
                          ` – ${new Date(session.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Schedule */}
                {scheduleData.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Schedule</p>
                      {scheduleData.map((s, i) => (
                        <p key={i} className="text-muted-foreground">
                          {s.description || `${s.day || ""} ${s.time || ""}`.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-muted-foreground">
                      {enrolledCount}{" "}
                      {session.maxParticipants
                        ? `/ ${session.maxParticipants} enrolled`
                        : "enrolled"}
                      {spotsLeft !== null && spotsLeft > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {" "}({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                        </span>
                      )}
                      {spotsLeft !== null && spotsLeft <= 0 && (
                        <span className="text-muted-foreground"> — Full</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Level</p>
                    <p className="text-muted-foreground capitalize">
                      {session.level ?? "All levels"}
                    </p>
                  </div>
                </div>

                {/* Equipment */}
                {session.linkedEquipmentIds &&
                  session.linkedEquipmentIds.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Wrench className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Equipment</p>
                        <p className="text-muted-foreground text-xs">
                          {session.linkedEquipmentIds.length} linked
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              <Separator className="my-5" />

              {/* Enroll CTA */}
              {isOpen ? (
                spotsLeft !== null && spotsLeft <= 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Session is full
                    </span>
                  </div>
                ) : user ? (
                  <form
                    action={async () => {
                      "use server";
                      const currentUser = await getUser();
                      if (!currentUser) return;

                      const [countResult] = await db
                        .select({ count: count() })
                        .from(trainingEnrollments)
                        .where(eq(trainingEnrollments.sessionId, session.id));

                      const currentEnrolled = countResult?.count ?? 0;
                      if (
                        session.maxParticipants &&
                        currentEnrolled >= session.maxParticipants
                      ) {
                        return; // Session full
                      }

                      await db.insert(trainingEnrollments).values({
                        sessionId: session.id,
                        userId: currentUser.id,
                      });

                      revalidatePath("/training/" + session.slug);
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Enroll Now
                    </button>
                  </form>
                ) : (
                  <Link href="/login?redirect=/training">
                    <button
                      type="button"
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Sign In to Enroll
                    </button>
                  </Link>
                )
              ) : session.status === "in_progress" ? (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
                  <CheckCircle className="h-4 w-4" />
                  <span>Session in progress</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Enrollment closed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
