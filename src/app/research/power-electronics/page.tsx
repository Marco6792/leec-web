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
        Power Electronics & Energy Management
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Low-cost power electronics and control for solar photovoltaic energy
        generation, battery management, and power grid preventive maintenance.
      </p>

      <Separator className="mb-12" />

      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our power electronics research addresses the role of power
            electronics and control in low-cost energy production. This includes
            battery management systems for solar photovoltaic generation,
            energy management strategies, and preventive maintenance of power
            grids — from PCB implementation to full test benches.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Research Focus</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Battery Management Systems — low-cost solutions for solar
              photovoltaic energy storage
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Power Grid & Preventive Maintenance — condition monitoring and
              reliability of power systems
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Energy Management — PCB implementation and test-bench validation
              of conversion and control systems
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
