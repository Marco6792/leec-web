import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

const eventTypeLabels: Record<string, string> = {
  seminar: "Seminar",
  workshop: "Workshop",
  conference: "Conference",
  defense: "Defense",
  meeting: "Meeting",
  social: "Social",
  other: "Other",
};

export async function EventsPreview() {
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
      imageUrl: events.imageUrl,
    })
    .from(events)
    .where(eq(events.published, true))
    .orderBy(desc(events.startDate))
    .limit(3);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Events &amp; Activities
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Seminars, workshops, defenses, and other laboratory activities.
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              All Events <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {eventList.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No events scheduled yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventList.map((item) => (
              <Link
                key={item.id}
                href={`/events/${item.id}`}
                className="group rounded-xl border overflow-hidden bg-card hover:shadow-md transition-all duration-200 block"
              >
                {item.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-border">·</span>
                    <span className="uppercase tracking-wider text-[10px]">
                      {eventTypeLabels[item.eventType ?? ""] ?? item.eventType ?? "Other"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {(item.location || item.isOnline) && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                      <MapPin className="size-3.5" />
                      {item.isOnline ? "Online" : item.location}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3">
                    View details <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
