import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EnergyHarvestingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link href="/research">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> All Research
        </Button>
      </Link>
      <Badge variant="outline" className="mb-6">
        Research
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Electrical Energy Harvesting
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Autonomous low-power electricity generation from water distribution
        systems, organic wastes, and ambient radio, TV and telephone signals.
      </p>

      <Separator className="mb-12" />

      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our energy harvesting research pursues two autonomous solutions to
            improve access to electricity for lighting, security and
            communications while reducing reliance on polluting sources:
            ambient radio frequency (RF) harvesting and Microbial Fuel Cells
            (MFC). Energy is also recovered at locations of excess pressure in
            water distribution networks using micro hydropower technology.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Research Focus</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Energy Harvesting from Water Distribution Systems — 18 potential
              sites identified in Buea with approximately 976.21 MWh dissipated
              per year; micro turbine prototypes reaching 192 mW at 2.6 kg/s
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Microbial Fuel Cells — electricity from human, animal and kitchen
              waste; cow dung produced 353 mW/m² vs 118.3 mW/m² for human
              faeces; six stacked cells power a LED
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              RF Energy Harvesting — rectenna on PLA polymer harvesting ambient
              radio, TV and telephone signals with emergency backup capability
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Battery Management Systems — low-cost energy management for solar
              photovoltaic generation
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          <p className="text-muted-foreground leading-relaxed">
            Charging telephones, street lighting, wastewater treatment, hydrogen
            and bio-fertilizer production, and powering low-power sensors and
            devices in remote areas.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            src: "/research/water-turbine.jpg",
            alt: "Water turbine prototype",
            caption: "Turbine prototype for water distribution networks",
          },
          {
            src: "/research/water-cfd-simulation.jpg",
            alt: "CFD simulation of the turbine",
            caption: "3D modeling and CFD simulation",
          },
          {
            src: "/research/rf-harvester.jpg",
            alt: "RF energy harvesting rectenna",
            caption: "Ambient RF energy harvesting rectenna",
          },
          {
            src: "/research/mfc-stack.jpg",
            alt: "Microbial fuel cell stack",
            caption: "Microbial fuel cell stack powering an LED",
          },
          {
            src: "/research/mfc-reactor.jpg",
            alt: "Microbial fuel cell reactor",
            caption: "MFC reactor: electrodes and current collector",
          },
          {
            src: "/research/mfc-applications.jpg",
            alt: "Microbial fuel cell applications",
            caption: "MFC advantages and applications",
          },
        ].map((img) => (
          <figure
            key={img.src}
            className="rounded-lg border overflow-hidden bg-muted/30"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full aspect-[4/3] object-cover"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
