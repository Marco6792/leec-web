import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — LEEC",
    default: "Authentication — LEEC",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Simple header with logo link */}
      <div className="absolute top-4 left-4">
        <a
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to LEEC
        </a>
      </div>
      {children}
    </div>
  );
}
