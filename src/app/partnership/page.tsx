import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PartnershipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Partnership</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Partnerships & Collaboration
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        A cooperation between the University of Buea, INSA Lyon and UCAC Douala,
        supported by the French Embassy in Cameroon.
      </p>

      <Separator className="mb-12" />

      <div className="space-y-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">About the Partnership</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The LEEC laboratory is the result of a deep academic partnership
            between Cameroon and France. INSA Lyon, one of France&apos;s top
            engineering schools, provides scientific expertise and research
            collaboration, while the University of Buea hosts the facility and
            leads local research efforts. UCAC Douala further strengthens the
            laboratory&apos;s network within Cameroon.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The partnership includes student and researcher exchanges, joint
            publications, shared equipment access, and collaborative research
            projects funded through programs like IRD and Campus France.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">Joint Research</h3>
            <p className="text-sm text-muted-foreground">Collaborative projects between Cameroonian and French researchers in NDT, energy, and IoT.</p>
          </div>
          <div className="p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">Student Exchange</h3>
            <p className="text-sm text-muted-foreground">Mobility programs for Master&apos;s and PhD students between Buea and Lyon.</p>
          </div>
          <div className="p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">Capacity Building</h3>
            <p className="text-sm text-muted-foreground">Training, workshops, and infrastructure development for sustainable research.</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Partner Institutions & Laboratories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "INSA de Lyon", role: "Scientific partner, since 2013" },
              { name: "UCAC Douala", role: "Cameroonian partner" },
              { name: "LGEF", role: "INSA Lyon partner laboratory" },
            ].map((partner) => (
              <div key={partner.name} className="p-6 rounded-xl border bg-muted/50">
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{partner.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
