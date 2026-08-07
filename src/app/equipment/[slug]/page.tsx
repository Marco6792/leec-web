import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PdfViewer } from "@/components/pdf-viewer";
import {
  ArrowLeft,
  Boxes,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  MapPin,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  instrument: "Instrument",
  sensor: "Sensor",
  computer: "Computer",
  network: "Network",
  mechanical: "Mechanical",
  chemical: "Chemical",
  safety: "Safety",
  office: "Office",
  other: "Other",
};

const statusStyles: Record<string, { label: string; className: string }> = {
  operational: {
    label: "Operational",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  maintenance: {
    label: "Under Maintenance",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  repair: {
    label: "In Repair",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  },
  calibration: {
    label: "In Calibration",
    className:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900",
  },
  retired: {
    label: "Retired",
    className:
      "bg-muted text-muted-foreground border-border",
  },
};

function formatCurrency(value: string | null, currency: string | null) {
  if (!value) return null;
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${value} ${currency ?? ""}`.trim();
  return `${amount.toLocaleString()} ${currency ?? ""}`.trim();
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-5 mt-0.5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [item] = await db
    .select()
    .from(equipment)
    .where(eq(equipment.slug, slug))
    .limit(1);

  if (!item || !item.isPublic) notFound();

  const status = statusStyles[item.status ?? "operational"] ?? statusStyles.operational;

  const usageSections = (item.usage ?? "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link
        href="/equipment"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to all equipment
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden border">
          <img
            src={item.imageUrl ?? "/photos/lab-interior.jpg"}
            alt={item.name}
            className="w-full h-full max-h-[480px] object-cover"
          />
        </div>

        {/* Header info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-[11px] uppercase tracking-wider">
              {categoryLabels[item.category ?? ""] ?? item.category ?? "Other"}
            </Badge>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {status.label}
            </span>
            {item.availableForTesting && (
              <Badge className="bg-primary text-primary-foreground border-primary text-[11px] uppercase tracking-wider">
                Open for Testing / Collaboration
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {item.name}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {item.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 rounded-xl border p-6">
            <Fact icon={Factory} label="Manufacturer" value={item.manufacturer} />
            <Fact icon={QrCode} label="Model" value={item.model} />
            <Fact icon={Boxes} label="Serial Number" value={item.serialNumber} />
            <Fact icon={MapPin} label="Location" value={item.location} />
            <Fact
              icon={CalendarClock}
              label="Acquired"
              value={item.acquiredDate}
            />
            <Fact
              icon={CircleDollarSign}
              label="Value"
              value={formatCurrency(item.value, item.currency)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/contact" className="sm:flex-1">
              <Button className="w-full gap-2">
                <ShieldCheck className="size-4" />
                Request Access
              </Button>
            </Link>
            <Link href="/contact" className="sm:flex-1">
              <Button variant="outline" className="w-full gap-2">
                <CalendarClock className="size-4" />
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {item.specifications && (
        <>
          <Separator className="my-14" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Technical Specifications
            </h2>
            <ul className="space-y-3">
              {item.specifications.split("\n").map((line) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const isBullet = /^[•\-*]/.test(trimmed);
                return (
                  <li
                    key={line}
                    className={`flex gap-3 text-muted-foreground leading-relaxed ${
                      isBullet ? "items-start" : "font-medium text-foreground"
                    }`}
                  >
                    {isBullet ? (
                      <>
                        <CheckCircle2 className="size-4 mt-1 shrink-0 text-primary" />
                        <span>{trimmed.replace(/^[•\-*]\s*/, "")}</span>
                      </>
                    ) : (
                      <span>{trimmed}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      {/* Datasheet PDF */}
      {item.pdfUrl && (
        <>
          <Separator className="my-14" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Datasheet &amp; Documents
            </h2>
            <PdfViewer url={item.pdfUrl} title={`${item.name} — Datasheet`} />
          </div>
        </>
      )}

      {/* Usage */}
      {usageSections.length > 0 && (
        <>
          <Separator className="my-14" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Usage & Applications
            </h2>
            <div className="space-y-6">
              {usageSections.map((section, index) => {
                const [heading, ...body] = section.split("\n");
                const bodyLines = body
                  .map((l) => l.trim())
                  .filter(Boolean);
                const isBulleted = bodyLines.some((l) => /^[•\-*]/.test(l));
                return (
                  <div key={index}>
                    {heading && heading !== "Primary use:" && (
                      <h3 className="font-semibold text-base mb-2">{heading}</h3>
                    )}
                    {isBulleted ? (
                      <ul className="space-y-2">
                        {bodyLines.map((line, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-muted-foreground leading-relaxed"
                          >
                            <CheckCircle2 className="size-4 mt-1 shrink-0 text-primary" />
                            <span>{line.replace(/^[•\-*]\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {bodyLines.join(" ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border bg-muted/40 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-1">
            Interested in using this equipment?
          </h3>
          <p className="text-muted-foreground max-w-xl">
            Contact the Laboratory of Electrotechnical Engineering to request
            access or schedule a measurement session with our research team.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link href="/contact">
            <Button className="w-full sm:w-auto gap-2">
              <ShieldCheck className="size-4" /> Request Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
