/**
 * Seed script: create the editable site pages (About, Contact, Privacy,
 * Terms of Service, Services) for LEEC.
 *
 * Run:  cd leec-web && bun run scripts/seed-pages.ts
 */

import { db } from "../src/db";
import { sitePages } from "../src/db/schema";
import { eq } from "drizzle-orm";

const pages = [
  {
    slug: "about",
    title: "About LEEC",
    subtitle:
      "The Laboratory of Electrical Engineering and Computing (LEEC) is a research facility at the University of Buea, born from a partnership between Cameroon and France. Specializing in electrical energy, smart agriculture, and telecommunications.",
    content: `## Our Mission
Research in Engineering Sciences for the Local Community. LEEC advances electrical engineering and computing research in Africa through international collaboration, cutting-edge facilities, and training the next generation of engineers and researchers.

LEEC serves as a hub for innovation, bringing together Cameroonian and French researchers to tackle challenges in electrical energy, smart agriculture, and telecommunications.

## History
Officially inaugurated on May 29, 2026, the LEEC lab represents the culmination of years of cooperation between the University of Buea and INSA Lyon, supported by the French Embassy and Campus France.

The laboratory was established to address the growing need for advanced electrical engineering research infrastructure in Cameroon and Central Africa.

## Governance
LEEC operates under the academic leadership of the University of Buea Faculty of Engineering and Technology, with scientific advisory support from INSA Lyon.

### Laboratory Director
Professor Pierre Tsafack — Full Professor of Electronic Engineering and Director of LEEC Research Laboratory. Specializes in electrical energy, power electronics, and control systems, with research focus on energy harvesting, smart agriculture, and telecommunications.

### Research Team
- 1 Professor
- 1 Associate Professor
- 5 Lecturers
- 4 Assistant Lecturers
- 3 Post-doctoral researchers
- 2 PhD students

### Visiting Researchers
2 Associate Professors and 3 Full Professors contribute to the laboratory's scientific activities.

### Key Partners
INSA de Lyon · UCAC Douala · University of Buea (guardianship)

## Key Figures
- 70+ papers published in international journals
- 11 PhD theses conducted and defended in engineering sciences (2021–2026)
- 90+ Master of Engineering dissertations supervised`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    subtitle:
      "Interested in collaboration, research opportunities, or visiting our laboratory? Reach out to us.",
    content: `## Location
Faculty of Engineering and Technology
University of Buea
P.O. Box 63, Buea, Cameroon

## Email
leec01.ub@gmail.com

## Phone
+237 XXX XXX XXX

## Collaboration & Visits
We welcome collaboration proposals, visiting researchers, and student exchange requests from institutions around the world. Please reach out by email with a short description of your project and we will respond within two working days.`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle:
      "How LEEC collects, uses, and protects your personal information.",
    content: `## Overview
The Laboratory of Electrical Engineering and Computing (LEEC) at the University of Buea is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have.

## Information We Collect
- Account information: name, email address, and professional details you provide when registering.
- Usage data: pages visited and how you interact with the site, used to improve our services.
- Messages: content you submit through contact or collaboration forms.

## How We Use Your Information
- To operate and maintain the website and your account.
- To respond to enquiries and collaboration requests.
- To publish and manage research content, news, and events.
- To improve our site and services based on aggregate usage.

## Data Sharing
We do not sell your personal information. Information is shared only with service providers that help us operate the site (hosting, authentication, analytics) and only to the extent necessary, or where required by law.

## Data Retention
Account information is kept for as long as your account is active. You may request deletion of your account and data at any time by contacting us.

## Cookies
We use essential cookies to keep you signed in and to remember your preferences. You can disable cookies in your browser, but some features may not work.

## Your Rights
You may request access to, correction of, or deletion of your personal data by emailing us at leec01.ub@gmail.com.

## Changes to This Policy
We may update this policy from time to time. Significant changes will be announced on this page.

## Contact
For any privacy questions, contact LEEC at leec01.ub@gmail.com.`,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    subtitle:
      "The terms governing your use of the LEEC website and services.",
    content: `## Acceptance of Terms
By accessing or using the LEEC website, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.

## Use of the Website
- You must be at least 16 years old to create an account.
- You agree to provide accurate information when registering.
- You are responsible for maintaining the confidentiality of your account credentials.
- You agree not to misuse the site, including attempting to disrupt services or access restricted areas.

## Content
All research content, publications, and materials published on this site are the property of LEEC and its authors unless otherwise stated. You may reference and share content with attribution for non-commercial purposes.

## User Accounts
We may suspend or terminate accounts that violate these terms, including accounts used for spam, harassment, or unauthorized access.

## Intellectual Property
The LEEC name, logo, and research materials are protected. You may not use them without prior written permission.

## Disclaimer
The site and its content are provided "as is" without warranties of any kind. LEEC is not liable for any damages arising from use of the site.

## Governing Law
These terms are governed by the laws of the Republic of Cameroon. Disputes are subject to the jurisdiction of the courts of Buea.

## Changes to These Terms
We may revise these terms at any time. Continued use of the site after changes constitutes acceptance.

## Contact
Questions about these terms can be sent to leec01.ub@gmail.com.`,
  },
  {
    slug: "services",
    title: "Services",
    subtitle:
      "Research services, testing, and training offered by LEEC to academia and industry.",
    content: `## Research & Development
LEEC conducts applied research in electrical energy, power electronics, electromagnetic non-destructive testing (NDT), energy harvesting, smart agriculture, and telecommunications. We welcome joint projects with academic and industrial partners.

## Testing & Characterization
- Electromagnetic non-destructive testing and evaluation (eddy current, magnetic flux leakage)
- Characterization of power electronic components and converters
- Measurement of electrical and magnetic properties of materials

## Training & Capacity Building
- Graduate research supervision (M.Sc. and Ph.D.)
- Hands-on workshops on NDT techniques and power electronics
- Training for technicians and engineers in industry

## Consulting
Our researchers provide expert consulting on power systems, energy efficiency, instrumentation, and IoT solutions for agriculture and industry.

## Equipment Access
Qualified researchers and partner institutions may request access to LEEC laboratory equipment for measurement campaigns. Contact us to discuss terms.

## Collaboration
We offer partnership opportunities for universities, research institutes, and companies through joint projects, student exchanges, and co-supervised theses.

To request any of these services, contact us through the contact page.`,
  },
];

async function seed() {
  console.log("Seeding site pages...");

  for (const page of pages) {
    const [existing] = await db
      .select()
      .from(sitePages)
      .where(eq(sitePages.slug, page.slug))
      .limit(1);

    if (existing) {
      console.log(`  ↻ Skipping existing page: "${page.title}"`);
    } else {
      await db.insert(sitePages).values({
        ...page,
        published: true,
      });
      console.log(`  ✓ Created page: "${page.title}"`);
    }
  }

  console.log("\nDone! Site pages have been seeded.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
