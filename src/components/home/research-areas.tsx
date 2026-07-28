import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Radio, Cpu, Waves } from "lucide-react";

const researchAreas = [
  {
    title: "Electromagnetic NDT",
    description: "Non-destructive testing using magnetic needle probe, Barkhausen noise, and eddy current methods for material characterization.",
    icon: Waves,
    href: "/research/electromagnetic-ndt",
  },
  {
    title: "Power Electronics",
    description: "Design and control of power converters, electrical machines, and energy management systems for efficient power conversion.",
    icon: Zap,
    href: "/research/power-electronics",
  },
  {
    title: "Energy Harvesting",
    description: "RF energy harvesting rectennas and microbial fuel cells for autonomous low-power electricity generation.",
    icon: Radio,
    href: "/research/energy-harvesting",
  },
  {
    title: "Sensors & IoT",
    description: "Smart sensor development and IoT systems for monitoring, control, and data acquisition in engineering applications.",
    icon: Cpu,
    href: "/research/sensors-iot",
  },
];

export function ResearchAreas() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Research Areas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four core research domains driving innovation in electrical engineering and computing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {researchAreas.map((area) => (
            <Link key={area.href} href={area.href}>
              <Card className="h-full hover:shadow-md hover:border-foreground/20 transition-all duration-200 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                    <area.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-foreground/80 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
