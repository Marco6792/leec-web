/**
 * Seed script: create the default rotating hero quotes shown on the
 * public homepage. Admins can edit, add, or delete them at any time.
 *
 * Run:  cd leec-web && bun run scripts/seed-hero-quotes.ts
 */

import { db } from "../src/db";
import { heroQuotes } from "../src/db/schema";

const quotes = [
  {
    text: "Research in Engineering Sciences for the Local Community. Advancing African engineering through cutting-edge research, world-class facilities, and international collaboration.",
    sortOrder: 0,
  },
  {
    text: "A partnership between the University of Buea and INSA Lyon — bringing together Cameroonian and French researchers to solve real challenges.",
    sortOrder: 1,
  },
  {
    text: "Pioneering research in electrical energy, power electronics, smart agriculture, and telecommunications for Central Africa and beyond.",
    sortOrder: 2,
  },
  {
    text: "From electromagnetic NDT to RF energy harvesting — building the engineering infrastructure Africa's next generation of researchers deserves.",
    sortOrder: 3,
  },
  {
    text: "Where science meets community: 70+ publications, 11 defended theses, and a growing network of academic and industrial partners.",
    sortOrder: 4,
  },
];

async function seed() {
  console.log("Seeding hero quotes...");

  const existing = await db.select({ id: heroQuotes.id }).from(heroQuotes).limit(1);

  if (existing.length > 0) {
    console.log("  ↻ Skipping — quotes already exist.");
  } else {
    await db.insert(heroQuotes).values(
      quotes.map((q) => ({ ...q, published: true })),
    );
    console.log(`  ✓ Created ${quotes.length} hero quotes.`);
  }

  console.log("\nDone! Hero quotes have been seeded.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
