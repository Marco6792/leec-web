import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";
import { FileText } from "lucide-react";

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

export default async function EquipmentPage() {
  const equipmentList = await db
    .select({
      id: equipment.id,
      slug: equipment.slug,
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      specifications: equipment.specifications,
      imageUrl: equipment.imageUrl,
      pdfUrl: equipment.pdfUrl,
    })
    .from(equipment)
    .where(eq(equipment.isPublic, true))
    .orderBy(asc(equipment.name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Equipment</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Equipment & Facilities
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Instrumentation for energy harvesting, electromagnetic non-destructive
        testing, smart agriculture and power electronics research.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipmentList.map((item) => (
          <Link
            key={item.id}
            href={`/equipment/${item.slug}`}
            className="group rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200 block"
          >
            <div className="relative aspect-video overflow-hidden">
              <SiteImage
                src={item.imageUrl ?? "/photos/lab-interior.jpg"}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {categoryLabels[item.category ?? ""] ?? item.category ?? "Other"}
                </Badge>
                {item.manufacturer && (
                  <span className="text-[11px] text-muted-foreground">
                    {item.manufacturer}
                    {item.model ? ` · ${item.model}` : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                {item.pdfUrl && (
                  <span
                    title="Datasheet available"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground shrink-0"
                  >
                    <FileText className="size-3.5 text-primary" /> Datasheet
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.description}</p>
              {item.specifications && (
                <p className="text-xs text-muted-foreground/70 mt-3 border-t pt-3">
                  {item.specifications}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
