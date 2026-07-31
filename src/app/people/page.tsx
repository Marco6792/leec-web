import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const team = [
  {
    name: "Prof. Pierre Tsafack",
    role: "Director",
    description: "Full Professor of Electronic Engineering, founder and director of the LEEC Research Laboratory.",
  },
  {
    name: "Mongshi Anita",
    role: "Researcher",
    description: "Electromagnetic NDT, material characterization and magnetic measurement techniques.",
  },
  {
    name: "Tene Yves Deffo",
    role: "Researcher",
    description: "Electromagnetic non-destructive testing and corrosion detection in steels.",
  },
  {
    name: "Nguedjang Sorelle",
    role: "Researcher",
    description: "Magnetic NDT methods and structural health monitoring.",
  },
  {
    name: "Toutsop Borel",
    role: "Researcher",
    description: "Electromagnetic instrumentation and magnetic sensor design.",
  },
  {
    name: "F. Ajamah",
    role: "Researcher",
    description: "Energy harvesting from water distribution systems and micro hydropower.",
  },
  {
    name: "N. Kamdjou",
    role: "Researcher",
    description: "Microbial fuel cells and energy harvesting from organic wastes.",
  },
  {
    name: "Mangeh E.",
    role: "Researcher",
    description: "Smart agriculture: sensor nodes for soil classification and pesticide monitoring.",
  },
  {
    name: "Nkemeni V.",
    role: "Researcher",
    description: "Sensor systems and IoT applications for agriculture and telecommunication.",
  },
];

export default function PeoplePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">People</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Our Team
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Researchers and engineers driving innovation at LEEC.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <Card key={member.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-foreground">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
