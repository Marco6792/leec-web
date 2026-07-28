import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PowerElectronicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link href="/research">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> All Research
        </Button>
      </Link>
      <Badge variant="outline" className="mb-6">Research</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Power Electronics
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Design and control of power converters, electrical machines, and energy management systems.
      </p>

      <Separator className="mb-12" />

      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our power electronics research covers the design, modeling, and control of power conversion systems for renewable energy integration, electric vehicles, and industrial applications.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Research Focus</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Power Converters — DC-DC, DC-AC, and AC-AC topologies
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Electrical Machines — motor drives and generator control
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Energy Management — smart grid and microgrid systems
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
