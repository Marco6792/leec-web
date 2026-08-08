import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Cpu, Zap, Waves, Leaf } from "lucide-react";

const researchAreas = [
  {
    title: "Power Electronics & Energy Management",
    description:
      "Battery management systems for solar photovoltaic generation, power grid preventive maintenance, and low-cost power conversion.",
    icon: Cpu,
    href: "/research/power-electronics",
    color: "bg-[#2563eb]",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    hoverBorderColor: "group-hover:border-blue-300",
  },
  {
    title: "Electromagnetic NDT",
    description:
      "Non-destructive testing and material characterization using magnetic needle probes, Barkhausen noise, and eddy current methods.",
    icon: Waves,
    href: "/research/electromagnetic-ndt",
    color: "bg-[#7c3aed]",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-100",
    hoverBorderColor: "group-hover:border-purple-300",
  },
  {
    title: "Electrical Energy Harvesting",
    description:
      "Energy harvesting from organic wastes, water distribution systems, and ambient radio, TV and telephone signals.",
    icon: Zap,
    href: "/research/energy-harvesting",
    color: "bg-[#059669]",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-100",
    hoverBorderColor: "group-hover:border-emerald-300",
  },
  {
    title: "Sensors, IoT & Smart Agriculture",
    description:
      "Sensor nodes for soil classification, pesticide monitoring, leak detection in water networks, and smart attendance systems.",
    icon: Leaf,
    href: "/research/sensors-iot",
    color: "bg-[#0891b2]",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-100",
    hoverBorderColor: "group-hover:border-cyan-300",
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
            Four core research domains driving innovation in electrical
            engineering and computing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {researchAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Link key={area.href} href={area.href} className="group">
                <Card className={`h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-2 ${area.borderColor} ${area.hoverBorderColor}`}>
                  <CardContent className="p-7">
                    <div className={`w-14 h-14 rounded-2xl ${area.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className={`font-semibold text-xl mb-3 ${area.textColor} transition-colors`}>
                      {area.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {area.description}
                    </p>
                    <div className={`flex items-center gap-1.5 text-sm font-semibold ${area.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
