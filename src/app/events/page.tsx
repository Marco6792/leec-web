import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, FileText } from "lucide-react";

export const revalidate = 60;

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
      imageUrl: events.imageUrl,
      pdfUrl: events.pdfUrl,
      registrationUrl: events.registrationUrl,
    })
    .from(events)
    .where(eq(events.published, true))
    .orderBy(desc(events.startDate));

  const upcoming = eventList.filter(
    (e) => !e.endDate || new Date(e.endDate) >= new Date(),
  );
  const past = eventList.filter(
    (e) => e.endDate && new Date(e.endDate) < new Date(),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Events</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Events &amp; Activities
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Seminars, workshops, defenses, and other lab activities.
      </p>

      <Separator className="mb-12" />

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 inline-block" />
            Upcoming Events
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Past Events</h2>
            <div className="space-y-4">
              {past.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function EventCard({
  event: item,
}: {
  event: {
    id: string;
    title: string;
    description: string | null;
    eventType: string | null;
    startDate: Date;
    endDate: Date | null;
    location: string | null;
    isOnline: boolean | null;
    meetingUrl: string | null;
    imageUrl: string | null;
    pdfUrl: string | null;
    registrationUrl: string | null;
  };
}) {
  return (
    <Link
      href={`/events/${item.id}`}
      className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
    >
      <div className="md:flex">
        {item.imageUrl && (
          <div className="md:w-1/4 aspect-video md:aspect-auto overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className={`p-5 ${item.imageUrl ? "md:w-3/4" : "md:w-full"}`}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-medium text-foreground">
              {new Date(item.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {item.endDate && item.endDate.toISOString() !== item.startDate.toISOString() && (
              <>
                <span className="text-border">–</span>
                <span>
                  {new Date(item.endDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {eventTypeLabels[item.eventType ?? ""] ?? item.eventType ?? "Other"}
            </Badge>
            {(item.location || item.isOnline) && (
              <span className="text-[11px] text-muted-foreground">
                {item.isOnline ? "Online" : item.location}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
              View details <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            {item.pdfUrl && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <FileText className="size-3.5 text-primary" /> PDF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
