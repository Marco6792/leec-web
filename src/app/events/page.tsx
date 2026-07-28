import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const eventTypeLabels: Record<string, string> = {
  seminar: "Seminar",
  workshop: "Workshop",
  conference: "Conference",
  defense: "Defense",
  meeting: "Meeting",
  social: "Social",
  other: "Other",
};

export default async function EventsPage() {
  const eventList = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      eventType: events.eventType,
      startDate: events.startDate,
      endDate: events.endDate,
      location: events.location,
      isOnline: events.isOnline,
      meetingUrl: events.meetingUrl,
      registrationUrl: events.registrationUrl,
    })
    .from(events)
    .where(eq(events.published, true))
    .orderBy(desc(events.startDate));

  const upcoming = eventList.filter((e) => new Date(e.startDate) >= new Date());
  const past = eventList.filter((e) => new Date(e.startDate) < new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Events</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Events
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Seminars, workshops, defenses, and other events at our laboratory.
      </p>

      <Separator className="mb-12" />

      {eventList.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No events published yet.
        </p>
      ) : (
        <div className="space-y-12">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcoming.map((item) => (
                  <EventCard key={item.id} event={item} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-muted-foreground">
                Past Events
              </h2>
              <div className="space-y-4">
                {past.map((item) => (
                  <EventCard key={item.id} event={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

interface EventCardData {
  id: string;
  title: string;
  description: string | null;
  eventType: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean | null;
  meetingUrl: string | null;
  registrationUrl: string | null;
}

function EventCard({ event }: { event: EventCardData }) {
  const dateStr = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDateStr = event.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Date badge */}
          <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg bg-primary/10 text-primary">
            <span className="text-lg font-bold leading-none">
              {new Date(event.startDate).getDate()}
            </span>
            <span className="text-[10px] uppercase tracking-wider mt-0.5">
              {new Date(event.startDate).toLocaleDateString("en-US", { month: "short" })}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {eventTypeLabels[event.eventType ?? ""] ?? event.eventType ?? "Other"}
              </Badge>
              <span className="text-xs text-muted-foreground sm:hidden">{dateStr}</span>
            </div>

            <h3 className="font-semibold text-lg mt-1 mb-1 leading-snug">
              {event.title}
            </h3>

            {event.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="hidden sm:inline-flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {dateStr}{endDateStr ? ` — ${endDateStr}` : ""}
              </span>
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.location}
                </span>
              )}
              {event.isOnline && (
                <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Online
                </span>
              )}
            </div>

            {(event.meetingUrl || event.registrationUrl) && (
              <div className="flex gap-2 mt-3">
                {event.meetingUrl && (
                  <a
                    href={event.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Join Meeting
                  </a>
                )}
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Register
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
