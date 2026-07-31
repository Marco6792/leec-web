import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { EventsView } from "./events-view";
import { FilterSelect } from "../_components/filter-select";

export const dynamic = "force-dynamic";

const eventTypes = [
  "seminar", "workshop", "conference", "defense", "meeting", "social", "other",
];

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventType?: string; published?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const typeFilter = params.eventType;
  const publishedFilter = params.published;

  let query = db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      eventType: events.eventType,
      startDate: events.startDate,
      endDate: events.endDate,
      location: events.location,
      isOnline: events.isOnline,
      published: events.published,
      createdAt: events.createdAt,
    })
    .from(events)
    .$dynamic();

  if (typeFilter) query = query.where(eq(events.eventType, typeFilter as any));
  if (publishedFilter === "true") query = query.where(eq(events.published, true));
  else if (publishedFilter === "false") query = query.where(eq(events.published, false));

  const data = await query.orderBy(desc(events.startDate));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} event{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Event
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          paramKey="eventType"
          placeholder="All types"
          currentValue={typeFilter}
          options={eventTypes.map((t) => ({
            value: t,
            label: t.charAt(0).toUpperCase() + t.slice(1),
          }))}
        />
        <FilterSelect
          paramKey="published"
          placeholder="All statuses"
          currentValue={publishedFilter}
          options={[
            { value: "true", label: "Published" },
            { value: "false", label: "Drafts" },
          ]}
        />
      </div>

      <EventsView data={data} />
    </div>
  );
}
