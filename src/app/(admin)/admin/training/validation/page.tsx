import { desc, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions, trainingEnrollments } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { validateTrainingSession, deleteTrainingSession } from "../actions";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
  pending_approval:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default async function ValidationQueuePage() {
  await requireAdmin();

  const pendingSessions = await db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.status, "pending_approval"))
    .orderBy(desc(trainingSessions.createdAt));

  const draftSessions = await db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.status, "draft"))
    .orderBy(desc(trainingSessions.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training Validation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve training sessions created by supervisors.
          </p>
        </div>
        <a
          href="/admin/training"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to training
        </a>
      </div>

      {/* Pending Approval */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold">
            {pendingSessions.length}
          </span>
          Pending Approval
        </h2>

        {pendingSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No sessions pending approval. All caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase tracking-wider ${statusColors[session.status ?? ""] ?? ""}`}
                      >
                        {session.status?.replace("_", " ") ?? "unknown"}
                      </Badge>
                      {session.level && (
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {session.level}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{session.title}</h3>
                    {session.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {session.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {session.startDate && (
                        <span>
                          {new Date(session.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {session.endDate &&
                            ` – ${new Date(session.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}`}
                        </span>
                      )}
                      {session.maxParticipants && (
                        <span>
                          Max: {session.maxParticipants} participants
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <form action={validateTrainingSession.bind(null, session.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
                      >
                        Approve &amp; Publish
                      </button>
                    </form>
                    <a
                      href={`/admin/training/${session.id}/edit`}
                      className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      Edit
                    </a>
                    <form action={deleteTrainingSession.bind(null, session.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 transition-colors"
                        onClick={(e: React.MouseEvent) => {
                          if (!confirm("Delete this session?")) e.preventDefault();
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drafts */}
      {draftSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
              {draftSessions.length}
            </span>
            Drafts
          </h2>

          <div className="space-y-3">
            {draftSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase tracking-wider ${statusColors[session.status ?? ""] ?? ""}`}
                      >
                        Draft
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {session.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/admin/training/${session.id}/edit`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
