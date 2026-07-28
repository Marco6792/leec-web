import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Handshake } from "lucide-react";

const pathways = [
  {
    title: "Study",
    description: "Join our Master's or PhD programs in electrical engineering and computing.",
    icon: BookOpen,
    href: "/academics",
  },
  {
    title: "Research",
    description: "Explore open positions and collaborate on cutting-edge projects.",
    icon: FlaskConical,
    href: "/research",
  },
  {
    title: "Partner",
    description: "Industry collaboration, contract research, and technology transfer.",
    icon: Handshake,
    href: "/contact",
  },
];

export function JoinCTA() {
  return (
    <section className="py-20 bg-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-background mb-4">
            Be Part of Something Extraordinary
          </h2>
          <p className="text-background/60 max-w-2xl mx-auto">
            Join a world-class research laboratory at the forefront of African engineering innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pathways.map((pathway) => (
            <Link key={pathway.title} href={pathway.href}>
              <div className="group p-6 rounded-xl border border-background/20 bg-background/5 hover:bg-background/10 transition-all duration-200 text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-background/20 transition-colors">
                  <pathway.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="font-semibold text-lg text-background mb-2">{pathway.title}</h3>
                <p className="text-sm text-background/60 mb-4">{pathway.description}</p>
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-background/70 group-hover:text-background transition-colors">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
