import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FooterRouteGuard } from "@/components/layout/footer-route-guard";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "@/components/ui/toast";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { SearchModal } from "@/components/search/search-modal";

const fontSans = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LEEC — Laboratory of Electrical Engineering and Computing",
  description:
    "Advancing African engineering through cutting-edge research, world-class facilities, and international collaboration.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let contactAddress: string | undefined;
  let contactEmail: string | undefined;
  let contactPhone: string | undefined;

  try {
    const [setting] = await db.select().from(settings).limit(1);
    contactAddress = setting?.contactAddress ?? undefined;
    contactEmail = setting?.contactEmail ?? undefined;
    contactPhone = setting?.contactPhone ?? undefined;
  } catch {
    contactAddress = undefined;
    contactEmail = undefined;
    contactPhone = undefined;
  }

  return (
    <html
      lang="en"
      className={`${fontSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <FooterRouteGuard>
            <Footer
              contactAddress={contactAddress}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
            />
          </FooterRouteGuard>
          <SearchModal />
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
