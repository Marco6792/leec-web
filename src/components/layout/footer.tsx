import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-leec.jpeg" alt="LEEC Logo" className="h-10 w-auto object-contain" />
              <div>
                <h3 className="font-bold text-lg">LEEC</h3>
                <p className="text-sm text-muted-foreground">
                  Laboratory of Electrical Engineering and Computing
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
              Advancing African engineering through cutting-edge research, world-class facilities, 
              and international collaboration. A partnership between the University of Buea and INSA Lyon.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About LEEC" },
                { href: "/research", label: "Research Areas" },
                { href: "/people", label: "Our People" },
                { href: "/publications", label: "Publications" },
                { href: "/equipment", label: "Equipment" },
                { href: "/news", label: "News & Events" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Faculty of Engineering and Technology
                  <br />
                  University of Buea
                  <br />
                  P.O. Box 63, Buea, Cameroon
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:leec01.ub@gmail.com" className="hover:text-foreground transition-colors">
                  leec01.ub@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+237 XXX XXX XXX</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LEEC — Laboratory of Electrical Engineering and Computing. 
            All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
