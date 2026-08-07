import { desc, eq, inArray, and, count } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions, trainingEnrollments, equipment } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import TrainingFilters from "./training-filters";
import type { TrainingSessionRow } from "./training-filters";

export const revalidate = 60;

// ─── Server Component ─────────────────────────────────────────────────────

export default async function TrainingPage() {
  // 1. Fetch published training sessions
  const rows = await db
    .select()
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.published, true),
        // Exclude cancelled sessions from public view
        // Only show statuses that are meaningful for public
      )
    )
    .orderBy(desc(trainingSessions.createdAt));

  // 2. Fetch linked equipment names
  const allEquipmentIds = rows.flatMap(
    (s) => (s.linkedEquipmentIds ?? []) as string[]
  );
  const uniqueEquipmentIds = [...new Set(allEquipmentIds)];

  const equipmentList =
    uniqueEquipmentIds.length > 0
      ? await db
          .select({ id: equipment.id, name: equipment.name })
          .from(equipment)
          .where(inArray(equipment.id, uniqueEquipmentIds))
      : [];
  const equipmentMap = new Map(equipmentList.map((e) => [e.id, e.name]));

  // 3. Fetch enrollment counts
  const sessionIds = rows.map((s) => s.id);
  const enrollmentCounts =
    sessionIds.length > 0
      ? await db
          .select({
            sessionId: trainingEnrollments.sessionId,
            count: count(),
          })
          .from(trainingEnrollments)
          .where(inArray(trainingEnrollments.sessionId, sessionIds))
          .groupBy(trainingEnrollments.sessionId)
      : [];
  const enrollmentMap = new Map(
    enrollmentCounts.map((e) => [e.sessionId, e.count])
  );

  // 4. Build enriched session list for the client component
  const sessions: TrainingSessionRow[] = rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    level: s.level as string | null,
    status: s.status as string | null,
    maxParticipants: s.maxParticipants,
    startDate: s.startDate,
    endDate: s.endDate,
    imageUrl: s.imageUrl,
    tags: s.tags,
    curriculum: s.curriculum,
    schedule: s.schedule,
    equipmentNames: (s.linkedEquipmentIds ?? [])
      .map((id) => equipmentMap.get(id as string))
      .filter((name): name is string => !!name),
    enrolledCount: enrollmentMap.get(s.id) ?? 0,
  }));

  // 5. Unique equipment names for the equipment filter
  const allEquipmentNames = [
    ...new Set(sessions.flatMap((s) => s.equipmentNames)),
  ].sort();

  // Quick stats
  const totalSessions = sessions.length;
  const totalEquipment = allEquipmentNames.length;
  const totalEnrolled = sessions.reduce(
    (sum, s) => sum + s.enrolledCount,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-muted/30 to-background py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Badge variant="outline" className="mb-6">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            Training
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            Hands-on{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Training
            </span>{" "}
            for Researchers
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Practical, equipment-focused training sessions led by LEEC
            supervisors. Master research instruments, learn advanced techniques,
            and earn certifications.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{totalSessions}</span>
              <span className="text-sm text-muted-foreground">
                Sessions available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{totalEquipment}</span>
              <span className="text-sm text-muted-foreground">
                Equipment types
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{totalEnrolled}</span>
              <span className="text-sm text-muted-foreground">
                Enrolled researchers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & cards handled by client component */}
      <TrainingFilters
        sessions={sessions}
        allEquipmentNames={allEquipmentNames}
      />
    </div>
  );
}
