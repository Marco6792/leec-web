/**
 * Seed script: Inserts the core static site pages (Terms of Service,
 * Privacy Policy, and Contact) into the `site_pages` table.
 *
 * These pages are rendered on the public site at /terms, /privacy, and
 * /contact. The content supports a light markdown subset:
 *   - `## Heading` / `### Sub-heading`
 *   - `- item`  /  `1. item`
 *   - `**bold**`, `*italic*`, `` `code` ``, `[label](url)`
 *
 * Usage:
 *   bun run src/db/seed-pages.ts
 *
 * Idempotent — skips slugs that already exist in the DB.
 */

import { db } from "./index";
import { sitePages } from "./schema";
import { eq, sql } from "drizzle-orm";

interface PageSeed {
  slug: string;
  title: string;
  subtitle: string;
  content: string;
}

const pages: PageSeed[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    subtitle:
      "The terms and conditions that govern your use of the Laboratory of Electrical Engineering and Computing (LEEC) website and its services.",
    content: `## Acceptance of Terms

By accessing or using the LEEC website, you agree to be bound by these **Terms of Service** and all applicable laws and regulations. If you do not agree with any of these terms, you are *prohibited* from using or accessing this site.

## Use of the Site

The content provided on this website is for **general information purposes** only. It is subject to change without notice.

- You may view, download, and print materials for *personal, non-commercial* use only.
- You may **not** redistribute, sell, or otherwise exploit any material without prior written consent.
- You are responsible for ensuring that any information provided is **accurate and lawful**.

## Intellectual Property

Unless otherwise stated, the Laboratory of Electrical Engineering and Computing (LEEC) owns the **intellectual property rights** for all material on this website. All rights are reserved.

1. You may access content strictly for *research and academic* purposes.
2. Reproduction of original research must credit the LEEC and its authors.
3. Trademarks, logos, and branding may not be used without expressed permission.

## External Links

Our site may contain links to external websites. These links are provided **for your convenience** and do not signify our endorsement of the content found there. We have *no responsibility* for the content of any linked site.

## Limitation of Liability

LEEC shall not be held liable for any loss or damage arising from the use of, or inability to use, the information on this website, including but not limited to direct, indirect, *incidental*, or consequential damages.

## Changes to These Terms

We reserve the right to amend these **Terms of Service** at any time. Continued use of the website after changes are posted constitutes acceptance of the revised terms. For questions, please [contact us](/contact).`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle:
      "How the Laboratory of Electrical Engineering and Computing (LEEC) collects, uses, and protects your personal information.",
    content: `## Information We Collect

We collect information in a **transparent** and lawful manner. The data we gather falls into two broad categories:

- **Personal data** you provide directly — such as your name, email address, and affiliation when you register or *contact us*.
- **Usage data** collected automatically — such as pages visited, device type, and *browsing behaviour*.

## How We Use Your Information

Your information helps us deliver a better experience and is used for the following **purposes**:

1. To *respond to enquiries* and provide support.
2. To manage your account and *registration*.
3. To send occasional updates, provided you have **opted in**.
4. To analyse site usage and improve our services.

\`Your data will never be sold to third parties.\`

## Cookies

Our website may use **cookies** to enhance your browsing experience. Cookies are small files stored on your device that allow us to *recognise* you on return visits. You can disable cookies through your browser settings, though some features may then be unavailable.

## Data Security

We implement appropriate **technical and organisational measures** to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, *no method of transmission over the internet* is 100% secure.

## Your Rights

In accordance with applicable data-protection law, you have the right to:

- **Access** the personal data we hold about you.
- **Request** correction of inaccurate information.
- **Object** to certain processing activities.
- **Request** the deletion of your data.

To exercise any of these rights, please [contact our Data Protection Officer](/contact).

## Changes to This Policy

We may update this **Privacy Policy** from time to time. We will notify you of any significant changes by posting the new policy on this page with a revised date. We encourage you to review this page *periodically*.`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    subtitle:
      "We'd love to hear from you. Reach out to the Laboratory of Electrical Engineering and Computing (LEEC) for enquiries, collaboration, or support.",
    content: `## Get in Touch

Whether you have a question about our research, wish to **collaborate**, or need support, our team is here to help. Please use the details below or send us a message.

## Visit Us

**Laboratory of Electrical Engineering and Computing (LEEC)**
University of Buea
P.O. Box 63, Buea
South-West Region, Cameroon

## Email & Phone

- **General enquiries:** [info@leec.org](mailto:info@leec.org)
- **Research collaboration:** [research@leec.org](mailto:research@leec.org)
- **Technical support:** [support@leec.org](mailto:support@leec.org)
- **Phone:** +237 6 12 34 56 78

## Office Hours

Our office is open during the following hours (West Africa Time):

1. **Monday – Friday:** 8:00 AM – 5:00 PM
2. **Weekends & holidays:** *Closed*

## Collaboration Opportunities

We are always open to *interdisciplinary* and *international* collaborations. If you are interested in working with us, please send a brief introduction including:

- Your **affiliation** and area of expertise.
- A *short summary* of the proposed project.
- The **timeframe** and any funding considerations.

We aim to respond to all enquiries within **2–3 business days**.`,
  },
];

async function main() {
  console.log("Seeding site pages...\n");

  let inserted = 0;
  let skipped = 0;

  for (const page of pages) {
    const existing = await db
      .select({ id: sitePages.id })
      .from(sitePages)
      .where(eq(sitePages.slug, page.slug))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  - ${page.slug}: already exists (skipping)`);
      skipped++;
      continue;
    }

    await db.insert(sitePages).values({
      slug: page.slug,
      title: page.title,
      subtitle: page.subtitle,
      content: page.content,
      published: true,
    });
    console.log(`  - ${page.slug}: inserted`);
    inserted++;
  }

  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
