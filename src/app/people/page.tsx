import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const team = [
  {
    name: "Dr. Anita Mvo",
    role: "Head of Laboratory",
    description: "Research in electromagnetic non-destructive testing and magnetic materials characterization.",
  },
  {
    name: "Dr. Tsafack Pilo",
    role: "Researcher",
    description: "Power electronics, energy management systems, and renewable energy integration.",
  },
  {
    name: "Prof. Sorelle Nguefack",
    role: "Principal Investigator",
    description: "Electrical engineering and computing, biomedical signal processing.",
  },
  {
    name: "Dr. Tchidjieu Yves",
    role: "Researcher",
    description: "Sensors, IoT systems, and embedded computing for industrial applications.",
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
