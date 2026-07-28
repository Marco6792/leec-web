/**
 * Seed script: create sample news articles and events for LEEC.
 *
 * Run:  cd leec-web && bun run scripts/seed-news-events.ts
 */

import { db } from "../src/db";
import { profiles, researchCenters, news, events } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding news & events...");

  // Find LEEC research center
  const [leec] = await db
    .select()
    .from(researchCenters)
    .where(eq(researchCenters.slug, "leec"))
    .limit(1);

  if (!leec) {
    console.error("LEEC research center not found. Run seed-admin.ts first.");
    process.exit(1);
  }

  // Find a profile to use as author/organizer
  const [author] = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
    })
    .from(profiles)
    .limit(1);

  if (!author) {
    console.error("No profiles found. Create a user first.");
    process.exit(1);
  }

  console.log(`Using author: ${author.fullName} (${author.id})`);
  console.log(`Lab ID: ${leec.id}`);

  // ─── News ────────────────────────────────────────────────────────────────

  const newsArticles = [
    {
      labId: leec.id,
      slug: "cameroon-france-partnership-delivers-world-class-lab",
      title: "Cameroon-France partnership delivers world-class research lab to UB",
      excerpt:
        "The University of Buea officially unveiled the Laboratory of Electrical Engineering and Computing on May 29, inaugurated by the French Consul General.",
      content:
        "The University of Buea (UB) officially unveiled the Laboratory of Electrical Engineering and Computing (LEEC) on May 29, 2026, in a ceremony presided over by the French Consul General. The laboratory represents a landmark partnership between Cameroon and France, bringing together expertise from INSA Lyon and the University of Buea.\n\nEquipped with state-of-the-art instrumentation for power electronics, electromagnetic non-destructive testing, energy harvesting, and IoT systems, LEEC is poised to become a regional hub for electrical engineering research and innovation.\n\nThe inauguration was attended by dignitaries from both countries, including representatives from the French Embassy, INSA Lyon, and the Cameroonian Ministry of Higher Education.",
      authorId: author.id,
      imageUrl: "/photos/inauguration.jpg",
      published: true,
      publishedAt: new Date("2026-06-03"),
      pinned: true,
      tags: ["Partnership", "Inauguration", "France"],
    },
    {
      labId: leec.id,
      slug: "leec-lab-inaugurated-with-french-delegation",
      title: "LEEC Lab inaugurated with French delegation visit",
      excerpt:
        "Dignitaries from INSA Lyon and the French Embassy toured the new facilities, witnessing demonstrations of cutting-edge research equipment.",
      content:
        "A high-level French delegation visited the newly inaugurated Laboratory of Electrical Engineering and Computing (LEEC) at the University of Buea. The delegation, which included representatives from INSA Lyon and the French Embassy, toured the laboratory facilities and witnessed live demonstrations of the research equipment.\n\nThe demonstrations showcased the laboratory's capabilities in power electronics, electromagnetic testing, and IoT systems. The delegation expressed enthusiasm about the potential for collaborative research projects between Cameroonian and French researchers.\n\nThis visit marks the beginning of what is expected to be a long and fruitful partnership between the two institutions.",
      authorId: author.id,
      imageUrl: "/photos/lab-entrance.jpg",
      published: true,
      publishedAt: new Date("2026-05-29"),
      pinned: true,
      tags: ["Inauguration", "France", "Delegation"],
    },
    {
      labId: leec.id,
      slug: "first-research-projects-launched-at-leec",
      title: "First research projects launched at LEEC",
      excerpt:
        "The laboratory has commenced operations with four initial research projects spanning electromagnetic NDT, energy harvesting, power electronics, and IoT sensors.",
      content:
        "LEEC has officially launched its first four research projects, marking the beginning of active research operations at the laboratory. The projects cover key areas of electrical engineering:\n\n1. Advanced Electromagnetic Non-Destructive Testing (NDT) for industrial applications\n2. Energy Harvesting Systems for low-power electronic devices\n3. High-Efficiency Power Electronics for renewable energy systems\n4. IoT Sensor Networks for environmental monitoring\n\nEach project is led by a principal investigator from the University of Buea, with mentorship and collaboration from researchers at INSA Lyon. Graduate students have already begun their work on these projects, which are expected to produce significant results within the first year.",
      authorId: author.id,
      imageUrl: "/photos/team-photo.jpg",
      published: true,
      publishedAt: new Date("2026-05-30"),
      pinned: false,
      tags: ["Research", "Projects", "Launch"],
    },
    {
      labId: leec.id,
      slug: "call-for-masters-phd-applications",
      title: "Call for Applications: M.Sc. and Ph.D. positions at LEEC",
      excerpt:
        "LEEC is now accepting applications for graduate research positions in power electronics, energy systems, and IoT. Scholarships available.",
      content:
        "The Laboratory of Electrical Engineering and Computing (LEEC) at the University of Buea is pleased to announce openings for M.Sc. and Ph.D. research positions starting in the 2026-2027 academic year.\n\nAvailable research areas include:\n- Power Electronics and Energy Conversion\n- Electromagnetic Non-Destructive Testing\n- Energy Harvesting Systems\n- IoT and Embedded Systems\n\nSelected candidates will receive full scholarships including tuition, stipend, and research funding. International applicants are encouraged to apply.\n\nDeadline for applications: August 30, 2026.",
      authorId: author.id,
      published: true,
      publishedAt: new Date("2026-06-15"),
      pinned: false,
      tags: ["Students", "Opportunities", "Graduate"],
    },
    {
      labId: leec.id,
      slug: "leec-grant-award-afdb",
      title: "LEEC awarded $500K research grant from AfDB",
      excerpt:
        "The African Development Bank has awarded a major research grant to LEEC for a project on sustainable energy solutions for rural communities.",
      content:
        "The African Development Bank (AfDB) has awarded a $500,000 research grant to the Laboratory of Electrical Engineering and Computing (LEEC) for a project titled 'Sustainable Energy Solutions for Rural Communities in Central Africa'.\n\nThe three-year project will focus on developing affordable, off-grid energy systems for rural communities in Cameroon and neighboring countries. The research will combine LEEC's expertise in power electronics and energy harvesting with field deployment strategies.\n\nThis grant represents a significant milestone for LEEC and underscores the laboratory's potential to address real-world challenges through cutting-edge research.",
      authorId: author.id,
      published: true,
      publishedAt: new Date("2026-07-01"),
      pinned: false,
      tags: ["Grant", "Funding", "AfDB", "Energy"],
    },
  ];

  for (const article of newsArticles) {
    const [existing] = await db
      .select()
      .from(news)
      .where(eq(news.slug, article.slug))
      .limit(1);

    if (existing) {
      console.log(`  ↻ Skipping existing news: "${article.title}"`);
    } else {
      await db.insert(news).values(article);
      console.log(`  ✓ Created news: "${article.title}"`);
    }
  }

  // ─── Events ──────────────────────────────────────────────────────────────

  const eventItems = [
    {
      labId: leec.id,
      title: "LEEC Inauguration Ceremony",
      description:
        "Official inauguration of the Laboratory of Electrical Engineering and Computing at the University of Buea, with representatives from the French Embassy and INSA Lyon.",
      eventType: "conference",
      startDate: new Date("2026-05-29"),
      endDate: new Date("2026-05-29"),
      location: "University of Buea, Cameroon",
      published: true,
      organizerId: author.id,
    },
    {
      labId: leec.id,
      title: "Seminar: Advances in Power Electronics for Renewable Energy",
      description:
        "Prof. Jean-Marie Dupont from INSA Lyon presents recent advances in wide-bandgap power semiconductor devices and their applications in renewable energy systems.",
      eventType: "seminar",
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-15"),
      location: "LEEC Conference Room",
      isOnline: true,
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      published: true,
      organizerId: author.id,
    },
    {
      labId: leec.id,
      title: "Workshop: Introduction to Electromagnetic NDT Techniques",
      description:
        "A hands-on workshop covering the fundamentals of electromagnetic non-destructive testing, including eddy current and magnetic flux leakage methods.",
      eventType: "workshop",
      startDate: new Date("2026-10-10"),
      endDate: new Date("2026-10-12"),
      location: "LEEC Laboratory, Engineering Building",
      published: true,
      organizerId: author.id,
    },
    {
      labId: leec.id,
      title: "Ph.D. Defense: Energy Harvesting Systems for IoT Applications",
      description:
        "Candidate Alice Nkeng presents her doctoral research on novel energy harvesting techniques for powering wireless IoT sensor networks.",
      eventType: "defense",
      startDate: new Date("2026-11-20"),
      location: "LEEC Conference Room",
      published: true,
      organizerId: author.id,
    },
    {
      labId: leec.id,
      title: "LEEC Annual Research Symposium 2026",
      description:
        "The annual symposium showcasing research成果 from all LEEC research groups, featuring invited talks, poster sessions, and networking opportunities.",
      eventType: "conference",
      startDate: new Date("2026-12-05"),
      endDate: new Date("2026-12-06"),
      location: "University of Buea Main Auditorium",
      published: true,
      organizerId: author.id,
    },
    {
      labId: leec.id,
      title: "Industry-Academia Meet: Power Sector Collaboration",
      description:
        "A networking event bringing together industry partners and researchers to discuss collaboration opportunities in the power and energy sector.",
      eventType: "meeting",
      startDate: new Date("2026-07-25"),
      location: "LEEC Conference Room",
      published: true,
      organizerId: author.id,
    },
  ];

  for (const eventItem of eventItems) {
    const [existing] = await db
      .select()
      .from(events)
      .where(eq(events.title, eventItem.title))
      .limit(1);

    if (existing) {
      console.log(`  ↻ Skipping existing event: "${eventItem.title}"`);
    } else {
      await db.insert(events).values(eventItem);
      console.log(`  ✓ Created event: "${eventItem.title}"`);
    }
  }

  console.log("\nDone! News and events have been seeded.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
