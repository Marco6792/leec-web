import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">
        About
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Mission & History
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        The Laboratory of Electrical Engineering and Computing (LEEC) is a
        research facility at the University of Buea, born from a partnership
        between Cameroon and France. Specializing in electrical energy, smart
        agriculture, and telecommunications.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Research in Engineering Sciences for the Local Community. LEEC
            advances electrical engineering and computing research in Africa
            through international collaboration, cutting-edge facilities, and
            training the next generation of engineers and researchers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            LEEC serves as a hub for innovation, bringing together Cameroonian
            and French researchers to tackle challenges in electrical energy,
            smart agriculture, and telecommunications.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">History</h2>
          <p className="text-muted-foreground leading-relaxed">
            Officially inaugurated on May 29, 2026, the LEEC lab represents the
            culmination of years of cooperation between the University of Buea
            and INSA Lyon, supported by the French Embassy and Campus France.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The laboratory was established to address the growing need for
            advanced electrical engineering research infrastructure in Cameroon
            and Central Africa.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Inauguration — May 29, 2026</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              src: "/photos/inauguration/ribbon-cutting.jpg",
              alt: "Ribbon cutting ceremony",
              caption:
                "Ribbon cutting by the Consul General of France in Douala and the Vice-Chancellor of the University of Buea",
            },
            {
              src: "/photos/inauguration/s-parameter-bench.jpg",
              alt: "Professor Tsafack presenting the S-parameters bench",
              caption:
                "Professor Pierre Tsafack presenting the S-parameters bench",
            },
            {
              src: "/photos/inauguration/communication-officer.jpg",
              alt: "Communication officer and Consul General",
              caption:
                "With the communication officer of the French Consulate in Douala",
            },
            {
              src: "/photos/inauguration/insa-brosselard.jpg",
              alt: "Professor Brosselard with LEEC members",
              caption:
                "Professor Brosselard (INSA Lyon / Ampère) with LEEC members",
            },
            {
              src: "/photos/inauguration/insa-exchange.jpg",
              alt: "Exchanges with INSA researchers",
              caption:
                "Exchanges with INSA Lyon visiting researchers",
            },
            {
              src: "/photos/inauguration/lab-room.jpg",
              alt: "View of the LEEC laboratory room",
              caption: "Global view of the LEEC laboratory",
            },
          ].map((photo) => (
            <figure
              key={photo.src}
              className="rounded-lg border overflow-hidden bg-muted/30"
            >
              <div className="relative aspect-[4/3]">
                <SiteImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        <div className="p-6 rounded-xl border">
          <h3 className="font-semibold text-lg mb-2">70+</h3>
          <p className="text-sm text-muted-foreground">
            Papers published in international journals
          </p>
        </div>
        <div className="p-6 rounded-xl border">
          <h3 className="font-semibold text-lg mb-2">11</h3>
          <p className="text-sm text-muted-foreground">
            PhD theses conducted and defended in engineering sciences (2021–2026)
          </p>
        </div>
        <div className="p-6 rounded-xl border">
          <h3 className="font-semibold text-lg mb-2">90+</h3>
          <p className="text-sm text-muted-foreground">
            Master of Engineering dissertations supervised
          </p>
        </div>
      </div>

      <div id="governance" className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Governance</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
          LEEC operates under the academic leadership of the University of Buea
          Faculty of Engineering and Technology, with scientific advisory
          support from INSA Lyon.
        </p>

        <div className="bg-muted/50 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4">Laboratory Director</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary">PT</span>
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                Professor Pierre Tsafack
              </h4>
              <p className="text-muted-foreground mb-2">
                Full Professor, Electronic Engineering
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Director of LEEC Research Laboratory. Specializes in electrical
                energy, power electronics, and control systems with research
                focus on energy harvesting, smart agriculture, and
                telecommunications.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-4">Research Team</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1 Professor</li>
              <li>1 Associate Professor</li>
              <li>5 Lecturers</li>
              <li>4 Assistant Lecturers</li>
              <li>3 Post-doctoral researchers</li>
              <li>2 PhD students</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-4">Visiting Researchers</h3>
            <p className="text-sm text-muted-foreground mb-4">
              2 Associate Professors and 3 Full Professors contribute to the
              laboratory&apos;s scientific activities.
            </p>
            <h3 className="font-semibold text-lg mb-2">Key Partners</h3>
            <p className="text-sm text-muted-foreground">
              INSA de Lyon · UCAC Douala · University of Buea (guardianship)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
