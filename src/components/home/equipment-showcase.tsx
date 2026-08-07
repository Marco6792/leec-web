import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function EquipmentShowcase() {
  const equipmentList = await db
    .select({
      slug: equipment.slug,
      name: equipment.name,
      description: equipment.description,
      imageUrl: equipment.imageUrl,
    })
    .from(equipment)
    .where(eq(equipment.isPublic, true))
    .orderBy(asc(equipment.name))
    .limit(3);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Equipment & Facilities
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Instrumentation for energy harvesting, electromagnetic NDT, smart
              agriculture and power electronics research.
            </p>
          </div>
          <Link href="/equipment">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              View All Equipment <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipmentList.map((item) => (
            <Link
              key={item.slug}
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
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
