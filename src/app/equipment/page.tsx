import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

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
            <div className="aspect-video overflow-hidden">
              <img
                src={item.imageUrl ?? "/photos/lab-interior.jpg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
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
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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
