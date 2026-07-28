import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">About</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Mission & History
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        The Laboratory of Electrical Engineering and Computing (LEEC) is a research facility at the University of Buea, born from a partnership between Cameroon and France.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To advance electrical engineering and computing research in Africa through international collaboration, cutting-edge facilities, and training the next generation of engineers and researchers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            LEEC serves as a hub for innovation, bringing together Cameroonian and French researchers to tackle challenges in electromagnetic testing, power electronics, energy harvesting, and smart sensor systems.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">History</h2>
          <p className="text-muted-foreground leading-relaxed">
            Officially inaugurated on May 29, 2026, the LEEC lab represents the culmination of years of cooperation between the University of Buea and INSA Lyon, supported by the French Embassy and Campus France.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The laboratory was established to address the growing need for advanced electrical engineering research infrastructure in Cameroon and Central Africa.
          </p>
        </div>
      </div>

      <div id="governance" className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Governance</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          LEEC operates under the academic leadership of the University of Buea Faculty of Engineering and Technology, with scientific advisory support from INSA Lyon.
        </p>
      </div>
    </div>
  );
}
