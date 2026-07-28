import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ElectromagneticNDTPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link href="/research">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> All Research
        </Button>
      </Link>
      <Badge variant="outline" className="mb-6">Research</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Electromagnetic NDT
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Non-destructive testing using magnetic needle probe, Barkhausen noise, and eddy current methods for material characterization.
      </p>

      <Separator className="mb-12" />

      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our electromagnetic NDT research focuses on developing novel techniques for characterizing magnetic materials without damaging them. This includes the Printed Magnetic Needle Probe (PMNP) for internal characterization of laminated magnetic cores.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Key Methods</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Magnetic Needle Probe — internal field measurement in laminated cores
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Barkhausen Noise Analysis — microstructural characterization
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Eddy Current Testing — conductivity and defect detection
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Applications</h2>
          <p className="text-muted-foreground leading-relaxed">
            Industrial quality control, structural health monitoring, material science research, and manufacturing process optimization.
          </p>
        </div>
      </div>
    </div>
  );
}
