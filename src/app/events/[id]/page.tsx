import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PdfViewer } from "@/components/pdf-viewer";
import { DocumentPreview } from "@/components/document-preview";
import { SiteImage } from "@/components/site-image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Globe,
  ExternalLink,
  CalendarPlus,
} from "lucide-react";

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

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item] = await db
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
      imageUrl: events.imageUrl,
      pdfUrl: events.pdfUrl,
      gallery: events.gallery,
      documents: events.documents,
      organizerId: events.organizerId,
      organizerName: profiles.fullName,
    })
    .from(events)
    .leftJoin(profiles, eq(events.organizerId, profiles.id))
    .where(eq(events.id, id))
    .limit(1);

  if (!item || !item.id || !item.title) notFound();

  const singleDay =
    !item.endDate ||
    item.endDate.toISOString() === item.startDate.toISOString();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {item.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border aspect-video">
              <SiteImage
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {eventTypeLabels[item.eventType ?? ""] ?? item.eventType ?? "Other"}
              </Badge>
              {(item.location || item.isOnline) && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {item.isOnline ? "Online" : item.location}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug mb-6">
              {item.title}
            </h1>

            <Separator className="mb-8" />

            {item.description && (
              <div
                className="prose-content text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}

            {/* Gallery */}
            {(item.gallery?.length ?? 0) > 1 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(item.gallery ?? []).map((url, i) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-video overflow-hidden rounded-xl border"
                    >
                      <SiteImage
                        src={url}
                        alt={`${item.title} — image ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Attached PDF document */}
            {item.pdfUrl && (
              <div className="mt-10">
                <PdfViewer url={item.pdfUrl} title={item.title} />
              </div>
            )}

            {/* Additional documents — inline PDF previews + file cards */}
            {(item.documents?.length ?? 0) > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Documents
                </h3>
                <div className="space-y-4">
                  {(item.documents ?? [])
                    .filter((doc) => doc !== item.pdfUrl)
                    .map((doc) => (
                      <DocumentPreview key={doc} url={doc} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border p-6 space-y-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Event Details
            </h3>

            <div className="flex items-start gap-3">
              <Clock className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Starts
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {formatDateTime(item.startDate)}
                </p>
              </div>
            </div>

            {!singleDay && item.endDate && (
              <div className="flex items-start gap-3">
                <Calendar className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Ends
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {formatDate(item.endDate)}
                  </p>
                </div>
              </div>
            )}

            {item.location && !item.isOnline && (
              <div className="flex items-start gap-3">
                <MapPin className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm font-medium mt-0.5">{item.location}</p>
                </div>
              </div>
            )}

            {item.isOnline && (
              <div className="flex items-start gap-3">
                <Globe className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Mode
                  </p>
                  <p className="text-sm font-medium mt-0.5">Online event</p>
                </div>
              </div>
            )}

            {item.organizerName && (
              <div className="flex items-start gap-3">
                <Users className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Organizer
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {item.organizerName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {item.registrationUrl && (
              <a
                href={item.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full gap-2">
                  <CalendarPlus className="size-4" /> Register
                </Button>
              </a>
            )}
            {item.meetingUrl && (
              <a
                href={item.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="size-4" /> Join Meeting
                </Button>
              </a>
            )}
            <Link href="/events" className="block">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="size-4" /> All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
