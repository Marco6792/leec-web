import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Handshake } from "lucide-react";

const pathways = [
  {
    title: "Study",
    description: "Join our Master's or PhD programs in electrical engineering and computing.",
    icon: BookOpen,
    href: "/academics",
    color: "bg-[#2563eb]",
  },
  {
    title: "Research",
    description: "Explore open positions and collaborate on cutting-edge projects.",
    icon: FlaskConical,
    href: "/research",
    color: "bg-[#7c3aed]",
  },
  {
    title: "Partner",
    description: "Industry collaboration, contract research, and technology transfer.",
    icon: Handshake,
    href: "/contact",
    color: "bg-[#0891b2]",
  },
];

export function JoinCTA() {
  return (
    <section className="py-20 bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
            Be Part of Something Extraordinary
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Join a world-class research laboratory at the forefront of African engineering innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <Link key={pathway.title} href={pathway.href}>
                <div className="group p-6 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-200 text-center cursor-pointer">
                  <div className={`w-12 h-12 rounded-full ${pathway.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary-foreground mb-2">{pathway.title}</h3>
                  <p className="text-sm text-primary-foreground/70 mb-4">{pathway.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium text-primary-foreground/80 group-hover:text-primary-foreground transition-colors">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
