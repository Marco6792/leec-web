import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

interface FooterProps {
  contactAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export function Footer({
  contactAddress,
  contactEmail,
  contactPhone,
}: FooterProps) {
  return (
    <footer className="relative bg-foreground text-primary-foreground overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column - spans 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-2 shadow-lg">
                <img
                  src="/logo-leec.jpeg"
                  alt="LEEC Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-tight">LEEC</h3>
                <p className="text-xs text-primary-foreground/60">
                  Laboratory of Electrical Engineering and Computing
                </p>
              </div>
            </div>

            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-md">
              Advancing African engineering through cutting-edge research,
              world-class facilities, and international collaboration.
              A partnership between the University of Buea and INSA Lyon.
            </p>

            {/* Newsletter signup */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Stay updated</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links - spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About LEEC" },
                { href: "/research", label: "Research Areas" },
                { href: "/projects", label: "Projects" },
                { href: "/people", label: "Our People" },
                { href: "/publications", label: "Publications" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/equipment", label: "Equipment" },
                { href: "/training", label: "Training" },
                { href: "/news", label: "News & Events" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90 mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactAddress && (
                <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span style={{ whiteSpace: "pre-line" }}>{contactAddress}</span>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>{contactPhone}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-foreground/50">
              &copy; {new Date().getFullYear()} LEEC — Laboratory of Electrical Engineering and Computing.
              {" "}All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-primary-foreground/50">
              <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Use
              </Link>
              <Link href="/contact" className="hover:text-primary-foreground transition-colors">
                Contact
              </Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
