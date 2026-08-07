import Link from "next/link";

/**
 * Opens the public website page for the record being edited, in a new tab —
 * lets admins preview how uploaded cover images and PDFs will look.
 */
export function ViewPublicPage({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
    >
      View public page
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </Link>
  );
}
