import Link from "next/link";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight, Compass, Mail } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Back to Home", icon: Home, description: "Return to the homepage" },
  { href: "/research", label: "Research Areas", icon: Compass, description: "Explore our research domains" },
  { href: "/contact", label: "Contact Us", icon: Mail, description: "Get in touch with the team" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <Empty className="border-0 bg-transparent">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-20 rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle className="text-4xl sm:text-5xl font-bold tracking-tight mt-6">
              404
            </EmptyTitle>
            <EmptyDescription className="text-base sm:text-lg mt-4 max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent className="mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/">
                <Button size="lg" className="gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </EmptyContent>

          <EmptyContent className="mt-12">
            <div className="w-full max-w-sm mx-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">
                Or explore
              </p>
              <div className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:shadow-md hover:border-foreground/20 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium group-hover:text-foreground transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.description}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
