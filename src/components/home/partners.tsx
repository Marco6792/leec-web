const keyPartners = [
  {
    name: "University of Buea",
    logo: "/logos/university-of-buea-seeklogo.png",
  },
  { name: "INSA Lyon", logo: "/logos/partners/logo-insa.png" },
  { name: "Campus France", logo: "/logos/key-partners/campus-france.jpeg" },
  { name: "French Embassy", logo: "/logos/key-partners/CM_ambaFrance.svg" },
];

const partnerInstitutions = [
  { name: "CITI-Lab", logo: "/logos/partners/CITI-Lab-Logo.png" },
  {
    name: "UCAC-ICAM",
    logo: "/logos/partners/LOGO-UCAC-ICAM-transparent-2048x500.png",
  },
  { name: "UCAC-ICY", logo: "/logos/partners/logo-UCAC-ICY.png" },
  {
    name: "Université Lyon 1",
    logo: "/logos/partners/logo-uni-Lyon-1-Claude-Bernard.png",
  },
];

export function Partners() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A cooperation between the University of Buea and INSA Lyon,
            supported by the French Embassy.
          </p>
        </div>

        {/* Key Partners */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-12">
          {keyPartners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center  transition-all cursor-pointer"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 sm:h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Partner Institutions */}
        <div className="border-t pt-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Partner Institutions & Laboratories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {partnerInstitutions.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 sm:h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
