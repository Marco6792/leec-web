import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions, trainingEnrollments } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { TrainingView } from "./training-view";
import { FilterSelect } from "../_components/filter-select";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";

const levels = ["beginner", "intermediate", "advanced"];
const statuses = ["draft", "pending_approval", "open", "in_progress", "completed", "cancelled"];

export default async function AdminTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const levelFilter = params.level;
  const statusFilter = params.status;

  let query = db
    .select({
      id: trainingSessions.id,
      title: trainingSessions.title,
      level: trainingSessions.level,
      status: trainingSessions.status,
      maxParticipants: trainingSessions.maxParticipants,
      startDate: trainingSessions.startDate,
      endDate: trainingSessions.endDate,
      published: trainingSessions.published,
      createdAt: trainingSessions.createdAt,
    })
    .from(trainingSessions)
    .$dynamic();

  if (levelFilter) query = query.where(eq(trainingSessions.level, levelFilter as any));
  if (statusFilter) query = query.where(eq(trainingSessions.status, statusFilter as any));

  const data = await query.orderBy(desc(trainingSessions.createdAt));

  // Get enrollment counts for each session
  const dataWithCounts = await Promise.all(
    data.map(async (session) => {
      const [result] = await db
        .select({ count: count() })
        .from(trainingEnrollments)
        .where(eq(trainingEnrollments.sessionId, session.id));
      return {
        ...session,
        enrolledCount: result?.count ?? 0,
      };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} session{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/training/validation"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Validation Queue
          </a>
          <a
            href="/admin/training/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Session
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="level"
          placeholder="All levels"
          currentValue={levelFilter}
          options={levels.map((l) => ({
            value: l,
            label: l.charAt(0).toUpperCase() + l.slice(1),
          }))}
        />
        <FilterSelect
          paramKey="status"
          placeholder="All statuses"
          currentValue={statusFilter}
          options={statuses.map((s) => ({
            value: s,
            label: s
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          }))}
        />
      </div>

      <TrainingView data={dataWithCounts} />
    </div>
  );
}
