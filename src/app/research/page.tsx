import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Cpu, Zap, Waves, Leaf } from "lucide-react";

const areas = [
  {
    title: "Power Electronics & Energy Management",
    description:
      "Battery management systems for solar photovoltaic generation, power grid preventive maintenance, and low-cost power conversion.",
    icon: Cpu,
    href: "/research/power-electronics",
  },
  {
    title: "Electromagnetic NDT",
    description:
      "Non-destructive testing and material characterization using magnetic needle probes, Barkhausen noise, and eddy current methods.",
    icon: Waves,
    href: "/research/electromagnetic-ndt",
  },
  {
    title: "Electrical Energy Harvesting",
    description:
      "Energy harvesting from organic wastes, water distribution systems, and ambient radio, TV and telephone signals.",
    icon: Zap,
    href: "/research/energy-harvesting",
  },
  {
    title: "Sensors, IoT & Smart Agriculture",
    description:
      "Sensor nodes for soil classification, pesticide monitoring, leak detection in water networks, and smart attendance systems.",
    icon: Leaf,
    href: "/research/sensors-iot",
  },
];

export default function ResearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">
        Research
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Research Areas
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Research in Engineering Sciences for the Local Community, with focus on
        electrical energy, smart agriculture, and telecommunications.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {areas.map((area) => (
          <Link key={area.href} href={area.href}>
            <Card className="h-full hover:shadow-md hover:border-foreground/20 transition-all duration-200 group cursor-pointer">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                  <area.icon className="h-5 w-5 text-foreground" />
                </div>
                <h2 className="font-semibold text-xl mb-2 group-hover:text-foreground/80 transition-colors">
                  {area.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
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
  );
}
