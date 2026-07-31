import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SensorsIoTPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Link href="/research">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> All Research
        </Button>
      </Link>
      <Badge variant="outline" className="mb-6">
        Research
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Smart Agriculture & Telecommunications
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Sensor networks for soil classification, leak detection, and pesticide
        monitoring in agricultural systems.
      </p>

      <Separator className="mb-12" />

      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            With roughly 1.02 billion people suffering from malnutrition
            worldwide and 3.9 million Cameroonians facing acute food insecurity,
            our Smart Agriculture and Telecommunications research develops
            intelligent sensing systems for soil analysis, crop safety and water
            management, alongside mobile-based control and security solutions.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Research Focus</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Sensor Node for Soil Classification — optical LED/photodiode
              sensor dimensioning (infrared, red, blue) for soil nutrient
              monitoring
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Water Distribution Monitoring — sensor networks for equity
              distribution and leak detection in water distribution networks
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Pesticide Level Detection — sensors for monitoring harmful
              substances in crops
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
              Telecommunications for Control & Security — smart attendance
              monitoring in schools and enterprises using mobile technology
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Outcomes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sensor nodes efficiently monitor soil nutrients (Nitrogen,
            Phosphorus, Potassium) and pesticides. Future studies will deploy
            the nodes across large farmlands for final calibration and
            validation.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            src: "/research/soil-sensor-setup.jpg",
            alt: "Sensor node laboratory setup",
            caption: "Sensor node laboratory experimental setup",
          },
          {
            src: "/research/pesticide-setup.jpg",
            alt: "Pesticide level monitoring setup",
            caption: "Pesticide level monitoring experimental setup",
          },
          {
            src: "/research/smart-agriculture-results.jpg",
            alt: "Smart agriculture characterization results",
            caption: "Optical sensor characterization results",
          },
        ].map((img) => (
          <figure
            key={img.src}
            className="rounded-lg border overflow-hidden bg-muted/30"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full aspect-[4/3] object-cover"
            />
            <figcaption className="px-3 py-2 text-xs text-muted-foreground">
              {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
