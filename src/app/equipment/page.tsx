import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const equipment = [
  {
    name: "Leica Research Microscope",
    description: "High-precision optical microscope for microstructural analysis and material characterization. Enables detailed examination of magnetic materials and surface morphology.",
    image: "/photos/microscope-research.jpg",
  },
  {
    name: "Vectorial Network Analyzer",
    description: "S-parameter measurement instrument for high-frequency electronics testing. Used for RF component characterization and electromagnetic material analysis.",
    image: "/photos/lab-interior.jpg",
  },
  {
    name: "Electromagnetic Testing Station",
    description: "Complete setup for magnetic needle probe measurements, Barkhausen noise analysis, and eddy current testing on laminated magnetic cores.",
    image: "/photos/research-collab.jpg",
  },
  {
    name: "Signal Analysis Equipment",
    description: "Oscilloscopes, spectrum analyzers, and signal generators for electronic measurement and prototyping.",
    image: "/photos/lab-meeting.jpg",
  },
  {
    name: "Prototyping Workshop",
    description: "Electronics workbench with soldering stations, PCB fabrication tools, and component inventory for rapid prototyping.",
    image: "/photos/microscope-entrance.jpg",
  },
];

export default function EquipmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Equipment</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Equipment & Facilities
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        State-of-the-art instrumentation for cutting-edge research in electrical engineering.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipment.map((item) => (
          <div
            key={item.name}
            className="group rounded-xl border overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
