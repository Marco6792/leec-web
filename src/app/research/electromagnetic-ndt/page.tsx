import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";
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
            Every engineering system experiences performance depreciation in its
            service time until failure of essential parts, driven by the
            evolution of material microstructural parameters such as grain size,
            orientation, and stress and strain fields. Our electromagnetic NDT
            research develops instrumentation and computing techniques for
            evaluating material integrity without damage — including the Printed
            Magnetic Needle Probe (PMNP) for internal characterization of
            laminated magnetic cores.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Key Methods</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Magnetic Needle Probe (MNP) — internal field measurement in
              laminated cores, miniaturized to &lt; 200 µm for embedded magnetic
              measurement
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Magnetic Barkhausen Noise (MBN) — microstructural characterization
              and early-stage corrosion detection
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Magnetic Incremental Permeability (MIP) — latest innovation for
              case-depth and stress characterization in Iron-Cobalt and
              Iron-Nickel materials
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
            Non-invasive structural health monitoring and homogenization
            analysis, early-stage thermal oxidation (corrosion) detection in
            low-carbon steels, case-hardening depth evaluation, and residual
            stress measurement — validated against Onelab® FEM simulations with
            Pearson correlation coefficients up to r = 0.99.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            src: "/research/ndt-experimental-setup.jpg",
            alt: "NDT experimental setup",
            caption: "Electromagnetic NDT experimental setup",
          },
          {
            src: "/research/ndt-pmnp-sensor.jpg",
            alt: "Printed magnetic needle probe",
            caption: "Printed Magnetic Needle Probe (PMNP) sensor design",
          },
        ].map((img) => (
          <figure
            key={img.src}
            className="rounded-lg border overflow-hidden bg-muted/30"
          >
            <div className="relative aspect-[4/3]">
              <SiteImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
